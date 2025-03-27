<template>
  <div class="flex justify-between items-center mb-4">
    <div class="flex items-center space-x-2">
      <el-button text @click="router.back()">
        <Back class="h-4 w-4 text-blue-500" />
      </el-button>
      <h1>{{ route.params.id }}</h1>
    </div>
    <el-button type="primary" size="large" @click="openExamDateFormDialog">
      Add Exam Date
    </el-button>
  </div>
  <div class="table-wrapper" v-loading="loading">
    <el-table
      :data="examDates"
      stripe
      style="width: 100%"
      row-class-name="cursor-pointer"
    >
      <el-table-column label="Exam Date" min-width="200" align="left">
        <template #default="scope">
          <div>
            {{ getTime(scope.row.exam_at) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Location" min-width="200" align="left">
        <template #default="scope">
          {{ scope.row.location || "N/A" }}
        </template>
      </el-table-column>
      <el-table-column label="Exam Type" min-width="200" align="left">
        <template #default="scope">
          {{ scope.row.exam_type }}
        </template>
      </el-table-column>
      <el-table-column label="Operations" align="center">
        <template #default="scope">
          <div class="flex justify-center space-x-3">
            <EditPen
              class="h-4 w-4 text-primary"
              @click="onEditClick(scope.row)"
            />
            <Delete
              class="h-4 w-4 text-primary"
              @click="confirmDelete(scope.row.id)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <teleport to="#modal" v-if="showModal">
      <ExamDateForm
        :type="formType"
        :date="examDate"
        @on-submit="submitForm($event)"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { useExamDatesStore } from "@/stores";
import { onMounted, computed, ref } from "vue";
import { Delete, EditPen, Back } from "@element-plus/icons-vue";
import { useModal } from "@/composables";
import { ElMessage, ElMessageBox, dayjs } from "element-plus";
import { useI18n } from "vue-i18n";
import ExamDateForm from "../exam/ExamDateForm.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const modal = useModal();
const formType = ref<"create" | "edit">("create");
const i18n = useI18n();
const examYearStore = useExamDatesStore();

const showModal = computed(() => modal.show.value);
const loading = ref(false);

const examDates = computed(() => examYearStore.examDates);
const examDate = ref(examDates.value[0]);

onMounted(async () => {
  try {
    await examYearStore.fetchExamDates(route.params.id as string);
  } catch (error) {
    router.push("/404");
  }
});
function getTime(_getime: string) {
  return _getime.replace("T", " ").replace(/:\d{2}\.\d{3}Z$/, "");
}
const openExamDateFormDialog = () => {
  formType.value = "create";
  modal.setTitle("Add exam date");
  modal.setWidth("50%");
  modal.showModal();
};

const onEditClick = async (row: any) => {
  try {
    examDate.value = row;
    formType.value = "edit";
    modal.setTitle(i18n.t("Edit exam date"));
    modal.setWidth("50%");
    modal.showModal();
  } catch (error: any) {
    console.log("error", error.message);
  }
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
        await examYearStore.removeExamDates(id);
        fetchDates();
        ElMessage({
          type: "success",
          message: i18n.t("shared.deleteCompleted"),
        });
        loading.value = false;
      } catch (error: any) {
        loading.value = false;
        console.log("error", error);
      }
    })
    .catch(() => {});
};

const submitForm = async (data: any) => {
  try {
    loading.value = true;
    data["year_id"] = route.params.id;
    if (formType.value === "edit" && examDate.value) {
      data["id"] = examDate.value.id;
      await examYearStore.editExamDates(data);
      ElMessage({
        message: i18n.t("shared.updated"),
        type: "success",
      });
      loading.value = false;
    } else {
      loading.value = false;
      await examYearStore.createExamDates(data);
      ElMessage({
        message: i18n.t("shared.created"),
        type: "success",
      });
    }
    fetchDates();
    loading.value = false;
    modal.hideModal();
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};

const fetchDates = () => {
  examYearStore.fetchExamDates(route.params?.id as string);
};
</script>

<style scoped></style>
