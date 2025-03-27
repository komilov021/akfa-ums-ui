<template>
  <div class="flex justify-between items-center mb-4">
    <div class="flex items-center space-x-4">
      <el-button type="primary" @click="router.back()" link>
        <ArrowLeft class="h-4 w-4" /> Back
      </el-button>
      <h1 class="font-medium text-base">
        {{ currentFunction?.title }}
      </h1>
    </div>
    <div class="flex items-center space-x-4">
      <el-input
        type="text"
        autocomplete="off"
        v-model="filter.student_uid"
        @keypress.enter="fetchGrades"
        size="large"
        class="w-48"
        placeholder="Search by ID"
      />
      <el-button type="primary" size="large" @click="removeFunctionGrades"
        >REMOVE ALL</el-button
      >
      <el-button type="primary" size="large" @click="openFormDialog"
        >Create</el-button
      >
      <el-dropdown
        trigger="click"
        @command="handleUploadClick"
        class="flex justify-center white-card"
      >
        <el-button color="#3b82f6" :icon="UploadFilled" size="large" />
        <template #dropdown>
          <el-dropdown-menu class="!p-1 space-y-1">
            <el-dropdown-item
              command="download"
              class="simple-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded"
            >
              Download Import Template
            </el-dropdown-item>
            <el-dropdown-item
              command="import"
              class="danger-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded"
            >
              Import
            </el-dropdown-item>
            <el-dropdown-item
              command="export"
              class="danger-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded"
            >
              Export
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <div class="table-wrapper" v-loading="loading">
    <el-table
      :data="grades.data"
      stripe
      style="width: 100%"
      row-class-name="noHover"
    >
      <el-table-column
        prop="student_email"
        min-width="120"
        label="Email"
        align="left"
      />
      <el-table-column
        prop="student_name"
        min-width="120"
        label="Name"
        align="center"
      />
      <el-table-column
        prop="score"
        max-width="120"
        label="Grade"
        align="center"
      />
      <el-table-column width="120" align="center" label="Verified">
        <template #default="{ row }">
          {{ row.is_verified ? "Yes" : "No" }}
        </template>
      </el-table-column>
      <el-table-column width="80" align="center" prop="action" fixed="right">
        <template #default="scope">
          <el-dropdown
            trigger="click"
            @command="(command:any) => handleActionClick(command, scope.row)"
            class="flex justify-center white-card"
          >
            <el-button text>
              <MoreFilled class="h-4 w-4 rotate-90 dot-icon cursor-pointer" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu class="!p-1 space-y-1">
                <el-dropdown-item
                  command="edit"
                  class="simple-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded"
                >
                  <EditPen class="h-4 w-4 icon" />
                  <span>Update</span>
                </el-dropdown-item>
                <el-dropdown-item
                  command="delete"
                  class="danger-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded"
                >
                  <Delete class="h-4 w-4" />
                  <span>Delete</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div class="py-4">
      <el-pagination
        background
        @current-change="onPaginationChange"
        layout="prev, pager, next"
        :page-size="filter.limit"
        :total="+grades.total"
      />
    </div>
    <teleport to="#modal" v-if="showModal">
      <ImportGradeForm
        v-if="formType === 'import'"
        :course_id="(route.params.course_id as string)"
        :function_id="(route.params.function_id as string)"
        @fetch-list="fetchGrades()"
      />
      <CourseGradeForm
        v-else
        :type="formType"
        :grade="grade"
        @on-submit="submitForm($event)"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { useFunctionStore, useCourseGradesStore, useFileStore } from "@/stores";
import { onMounted, computed, ref, reactive } from "vue";
import {
  ArrowLeft,
  Delete,
  EditPen,
  MoreFilled,
  UploadFilled,
} from "@element-plus/icons-vue";
import { useModal } from "@/composables";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import CourseGradeForm from "./components/CourseGradeForm.vue";
import type { IFunction } from "@/models/backend";
import { useRoute, useRouter } from "vue-router";
import ImportGradeForm from "./components/ImportGradeForm.vue";

const route = useRoute();
const router = useRouter();
const modal = useModal();
const formType = ref<"create" | "edit" | "import">("create");
const i18n = useI18n();
const fileStore = useFileStore();
const functionStore = useFunctionStore();
const coursesGradeStore = useCourseGradesStore();

const showModal = computed(() => modal.show.value);
const loading = ref(false);

const currentFunction = computed(() => functionStore.currentFunction);
const grades = computed(() => coursesGradeStore.grades);
const grade = ref();

const filter = reactive({
  page: 1,
  limit: 20,
  course_id: "",
  function_id: "",
  student_uid: null,
});

onMounted(() => {
  filter.course_id = route.params.course_id as string;
  filter.function_id = route.params.function_id as string;
  functionStore.getFunctionById(filter.function_id);
  fetchGrades();
});

const fetchGrades = () => {
  if (!filter.student_uid) filter.student_uid = null;
  coursesGradeStore.fetchGrades(filter);
};

const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchGrades();
};

const openFormDialog = () => {
  formType.value = "create";
  modal.setTitle("Add Grade");
  modal.setWidth("50%");
  modal.showModal();
};

const openEditFormDialog = (row: any) => {
  grade.value = row;
  formType.value = "edit";
  modal.setTitle("Update Grade");
  modal.setWidth("50%");
  modal.showModal();
};

const confirmDelete = (id: string) => {
  ElMessageBox.confirm(
    "This action cannot be undone. Continue?",
    i18n.t("shared.warning"),
    {
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      type: "warning",
      center: true,
    }
  )
    .then(async () => {
      try {
        loading.value = true;
        await coursesGradeStore.removeGrade(id);
        await fetchGrades();
        loading.value = false;
        ElMessage({
          type: "success",
          message: i18n.t("shared.deleteCompleted"),
        });
      } catch (error: any) {
        loading.value = false;
        console.log("error", error);
      }
    })
    .catch(() => {});
};
const removeFunctionGrades = () => {
  ElMessageBox.confirm(
    "This action cannot be undone. Continue?",
    i18n.t("shared.warning"),
    {
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      type: "warning",
      center: true,
    }
  )
    .then(async () => {
      try {
        loading.value = true;
        await coursesGradeStore.removeFunctionGrade({
          course_id: filter.course_id,
          function_id: filter.function_id,
        });
        await fetchGrades();
        loading.value = false;
        ElMessage({
          type: "success",
          message: i18n.t("shared.deleteCompleted"),
        });
      } catch (error: any) {
        loading.value = false;
        console.log("error", error);
      }
    })
    .catch(() => {});
};
const handleActionClick = async (command: string, row: IFunction) => {
  if (command === "edit") {
    await openEditFormDialog(row);
  }
  if (command === "delete") {
    confirmDelete(row.id);
  }
};
const handleUploadClick = async (command: string) => {
  if (command === "download") {
    const data = await fileStore.downloadById("6432b34be02f552ce1e0aab6");
    window.open(URL.createObjectURL(data));
  }
  if (command === "import") {
    formType.value = "import";
    modal.setTitle("Import");
    modal.setWidth("60%");
    modal.showModal();
  }
};

const submitForm = async (data: any) => {
  try {
    loading.value = true;

    data["course_id"] = route.params.course_id as string;
    data["function_id"] = route.params.function_id as string;

    if (formType.value === "edit" && grade.value) {
      data["id"] = grade.value.id;
      await coursesGradeStore.editGrade(data);
      ElMessage({
        message: i18n.t("shared.updated"),
        type: "success",
      });
    } else {
      await coursesGradeStore.createGrade(data);
      ElMessage({
        message: i18n.t("shared.created"),
        type: "success",
      });
    }
    fetchGrades();
    loading.value = false;
    // modal.hideModal();
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
</script>

<style scoped></style>
