<template>
  <div class="flex justify-between items-center mb-4">
    <div class="flex items-center space-x-4">
      <el-button type="primary" @click="router.back()" link
        ><ArrowLeft class="h-4 w-4" /> Back</el-button
      >
      <h1 class="font-medium text-base">
        {{ currentCourse?.semester?.year }} {{ currentCourse?.semester?.name }}
        {{ currentCourse?.subject?.title }}
      </h1>
    </div>
    <el-button type="primary" size="large" @click="openFormDialog"
      >Create</el-button
    >
  </div>
  <div class="table-wrapper" v-loading="loading">
    <el-table
      :data="functions"
      stripe
      style="width: 100%"
      row-class-name="noHover"
    >
      <el-table-column
        prop="title"
        min-width="120"
        label="Title"
        align="left"
      />
      <el-table-column
        prop="weight"
        min-width="120"
        label="Weight"
        align="center"
      />
      <el-table-column
        prop="is_published"
        min-width="120"
        label="Published"
        align="center"
      >
        <template #default="{ row }">
          {{ row.is_published ? "Yes" : "No" }}
        </template>
      </el-table-column>
      <el-table-column width="80" align="center" prop="action" fixed="right">
        <template #default="scope">
          <el-dropdown
            trigger="click"
            @command="(command: any) => handleActionClick(command, scope.row)"
            class="flex justify-center white-card"
          >
            <el-button text>
              <MoreFilled class="h-4 w-4 rotate-90 dot-icon cursor-pointer" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu class="!p-1 space-y-1">
                <el-dropdown-item
                  command="publish"
                  class="simple-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded"
                >
                  <Opportunity class="h-4 w-4 icon" />
                  <span>Publish</span>
                </el-dropdown-item>
                <el-dropdown-item
                  command="grades"
                  class="danger-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded"
                >
                  <Finished class="h-4 w-4" />
                  <span>Grades</span>
                </el-dropdown-item>
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
    <teleport to="#modal" v-if="showModal">
      <FunctionForm
        :type="formType"
        :function="_function"
        @on-submit="submitForm($event)"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { useFunctionStore, useCoursesStore } from "@/stores";
import { onMounted, computed, ref } from "vue";
import {
  ArrowLeft,
  Delete,
  EditPen,
  Finished,
  Opportunity,
} from "@element-plus/icons-vue";
import { useModal } from "@/composables";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import FunctionForm from "./components/FunctionForm.vue";
import type { IFunction } from "@/models/backend";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const modal = useModal();
const formType = ref<"create" | "edit">("create");
const i18n = useI18n();
const functionStore = useFunctionStore();
const coursesStore = useCoursesStore();

const showModal = computed(() => modal.show.value);
const loading = ref(false);

const currentCourse = computed(() => coursesStore.currentCourse);
const functions = computed(() => functionStore.functions);
const _function = ref();

onMounted(() => {
  coursesStore.getCourseById(route.params.id as string);
  fetchFunctions();
});

const fetchFunctions = () => {
  functionStore.fetchFunctions(route.params.id as string);
};

const openFormDialog = () => {
  formType.value = "create";
  modal.setTitle("Add Function");
  modal.setWidth("50%");
  modal.showModal();
};

const openEditFormDialog = (row: any) => {
  _function.value = row;
  formType.value = "edit";
  modal.setTitle("Update Function");
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
        await functionStore.removeFunction(id);
        await fetchFunctions();
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
const publish = (id: string) => {
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
        await functionStore.publishFunction(id);
        await fetchFunctions();
        loading.value = false;
        ElMessage({
          type: "success",
          message: "Published",
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
  if (command === "publish") {
    publish(row.id);
  }
  if (command === "grades") {
    router.push({
      name: "function-grades",
      params: {
        course_id: route.params.id,
        function_id: row.id,
      },
    });
  }
};

const submitForm = async (data: any) => {
  try {
    loading.value = true;

    data["course_id"] = route.params.id as string;

    if (formType.value === "edit" && _function.value) {
      data["id"] = _function.value.id;
      await functionStore.editFunction(data);
      ElMessage({
        message: i18n.t("shared.updated"),
        type: "success",
      });
    } else {
      await functionStore.createFunction(data);
      ElMessage({
        message: i18n.t("shared.created"),
        type: "success",
      });
    }
    fetchFunctions();
    loading.value = false;
    modal.hideModal();
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
</script>

<style scoped></style>
