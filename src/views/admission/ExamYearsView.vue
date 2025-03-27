<template>
  <div class="flex justify-end mb-4">
    <el-button type="primary" size="large" @click="openDepartmentFormDialog"
      >Add Exam Year</el-button
    >
  </div>
  <div class="table-wrapper" v-loading="loading">
    <el-table
      :data="examYears"
      stripe
      style="width: 100%"
      row-class-name="cursor-pointer"
      v-on:row-click="getOne"
    >
      <el-table-column prop="id" label="Exam year" width="200" align="left" />
      <el-table-column
        prop="per_semester"
        label="Status"
        min-width="160"
        align="center"
      >
        <template #default="{ row }">
          <el-tag :type="row.is_active ? 'success' : 'danger'">{{
            row.is_active ? "Active" : "Inactive"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Operations" align="center">
        <template #default="scope">
          <div class="flex justify-center space-x-3">
            <!-- <View
              class="h-4 w-4 text-blue-500"
              @click="router.push(`/admission/exam-years/${scope.row.id}`)"
            /> -->
            <Delete
              v-if="!scope.row.is_active"
              class="h-4 w-4 text-primary"
              @click="confirmDelete(scope.row.id)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <teleport to="#modal" v-if="showModal">
      <ExamYearForm
        :type="formType"
        :year="examYear"
        @on-submit="submitForm($event)"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { useExamDatesStore } from "@/stores";
import { onMounted, computed, ref } from "vue";
import { Delete, View } from "@element-plus/icons-vue";
import { useModal } from "@/composables";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import ExamYearForm from "./components/ExamYearForm.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const modal = useModal();
const formType = ref<"create" | "edit">("create");
const i18n = useI18n();
const examYearStore = useExamDatesStore();

const showModal = computed(() => modal.show.value);
const loading = ref(false);

const examYears = computed(() => examYearStore.examYears);
const examYear = ref(examYears.value[0]);

onMounted(() => {
  examYearStore.fetchExamYears();
});
const openDepartmentFormDialog = () => {
  formType.value = "create";
  modal.setTitle("Add exam year");
  modal.setWidth("50%");
  modal.showModal();
};

const confirmDelete = (id: string) => {
  ElMessageBox.confirm(
    "This action cannot be undone. Continue?",
    i18n.t("shared.warning"),
    {
      confirmButtonText: "Yes",
      cancelButtonText: "Cencel",
      type: "warning",
      center: true,
    }
  )
    .then(async () => {
      try {
        loading.value = true;
        await examYearStore.removeExamYears(id);
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
const getOne = (row: any) => {
  router.push(`/admission/exam-years/${row.id}`);
};
const submitForm = async (data: any) => {
  try {
    loading.value = true;
    if (formType.value === "edit" && examYear.value) {
      data["id"] = examYear.value.id;
      await examYearStore.editExamYears(data);
      ElMessage({
        message: i18n.t("shared.updated"),
        type: "success",
      });
    } else {
      await examYearStore.createExamYears(data);
      ElMessage({
        message: i18n.t("shared.created"),
        type: "success",
      });
    }
    loading.value = false;
    modal.hideModal();
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
</script>

<style scoped></style>
