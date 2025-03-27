<template>
  <div>
    <div class="flex justify-between items-center mt-6 md:mt-0 mb-4">
      <div>
        <h1 class="font-semibold text-xl">Scholarships</h1>
        <p class="text-tertiary-600">All attached scholarships</p>
      </div>
      <div class="flex gap-4">
        <el-button type="primary" @click="openFormDialog">+ Add</el-button>
      </div>
    </div>
    <el-table
      :data="store.listByStudent"
      style="width: 100%"
      class="whiteStripe"
      v-loading="loading"
    >
      <el-table-column label="Name" min-width="200" align="left" prop="title" />
      <el-table-column
        label="Description"
        min-width="200"
        align="left"
        prop="description"
      />
      <el-table-column label="Percentage %" min-width="200" align="center">
        <template #default="{ row }">
          <span>{{ row.percentage }} %</span>
        </template>
      </el-table-column>
      <el-table-column label="For semester" min-width="200" align="center">
        <template #default="{ row }">
          <span>{{
            row.semester ? getSemesterList(row.semester)?.semester : "Undefined"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column width="90" align="center">
        <template #default="scope">
          <div>
            <el-button
              @click="confirmDelete(scope.row.id)"
              class="action-button"
            >
              <SvgIcon name="local-trash" size="23" />
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="showModal">
    <ScholarshipForm
      :type="modalType"
      :semester="semesterStore.getSemestrs"
      :criteria="store.getScholarships"
      v-if="showModal"
      @on-submit="submitForm($event)"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { useScholarshipStore, useGroupStore } from "@/stores";
import type { IScholarshipAttach } from "@/models/backend";
import { Delete, EditPen } from "@element-plus/icons-vue";
import { onMounted, computed, ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import ScholarshipForm from "./ScholarshipForm.vue";

const i18n = useI18n();
const route = useRoute();
const store = useScholarshipStore();
const semesterStore = useGroupStore();
const loading = ref(false);
const showModal = ref(false);
const student_id = ref(route.params.id);
const modalType = ref<"create" | "edit">("create");
const filter = {
  page: 1,
  limit: 50,
};

const fetchList = () => {
  semesterStore.fetchSemestrs();
  store.fetchScholarshipList(filter);
  store.fetchScholarshipStudentList(student_id.value as string);
};
fetchList();

onMounted(() => {
  fetchList();
});

const openFormDialog = () => {
  modalType.value = "create";
  showModal.value = true;
};

const getSemesterList = (semester_id: string) => {
  let semester = semesterStore.semesters.find((semester) => {
    return semester.id === semester_id || semester.semester === semester_id;
  });
  return semester;
};

const submitForm = async (data: IScholarshipAttach) => {
  try {
    loading.value = true;
    await store.attachStudentScholarship({
      ...data,
      student_id: route.params.id as string,
    });
    ElMessage({
      message: i18n.t("shared.created"),
      type: "success",
    });
    console.log("data", { ...data, student_id: route.params.id });

    showModal.value = false;
    fetchList();
    loading.value = false;
  } catch (error) {
    ElMessage({
      message: i18n.t("shared.warning"),
      type: "error",
    });
    loading.value = false;
  }
};

const confirmDelete = (id: any) => {
  ElMessageBox.confirm(
    "This action cannot be undone. Continue?",
    i18n.t("shared.warning"),
    {
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      type: "warning",
      center: true,
    }
  ).then(async () => {
    try {
      loading.value = true;
      await store.detachStudent(id);
      ElMessage({
        message: i18n.t("shared.deleted"),
        type: "success",
      });
      fetchList();
      loading.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};
</script>

<style scoped></style>
