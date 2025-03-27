<template>
  <div class="flex justify-end mb-4">
    <el-button type="primary" size="large" @click="openDepartmentFormDialog"
      >Add programs</el-button
    >
  </div>
  <div class="table-wrapper" v-loading="loading">
    <el-table :data="tuitions" style="width: 100%" class="noHover" stripe>
      <el-table-column
        prop="program"
        label="Faculties & Departments"
        min-width="200"
        align="left"
      />
      <el-table-column
        prop="alng"
        label="Language"
        max-width="100"
        align="center"
      >
        <template #default="{ row }">
          <div class="flex gap-2 w-full justify-center">
            <div
              v-for="lang in row.lang || ['-']"
              class="uppercase"
              :key="lang"
            >
              {{ lang }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="per_semester"
        label="Local Students (UZS)"
        min-width="160"
        align="center"
      >
        <template #default="{ row }">
          {{ $n(row.per_semester) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="fee_foreign_student"
        label="International Students (USD)"
        min-width="160"
        align="center"
      >
        <template #default="{ row }">
          {{ $n(row.fee_foreign_student) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="duration"
        label="Duration (Semestrs)"
        min-width="180"
        align="center"
      />
      <el-table-column label="Operations" align="center">
        <template #default="scope">
          <div class="flex justify-center space-x-3">
            <EditPen
              class="h-4 w-4 text-blue-500 cursor-pointer"
              @click="onEditClick(scope.row)"
            />
            <Delete
              class="h-4 w-4 text-primary cursor-pointer"
              @click="confirmDelete(scope.row.id)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <teleport to="#modal" v-if="showModal">
      <DepartmentForm
        :type="formType"
        :department="tuition"
        :langs="langs"
        @on-submit="submitForm($event)"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { useGuideStore } from "@/stores";
import { onMounted, computed, ref } from "vue";
import { Delete, EditPen } from "@element-plus/icons-vue";
import { useModal } from "@/composables";
import DepartmentForm from "./components/DepartmentForm.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
const modal = useModal();
const formType = ref<"create" | "edit">("create");
const i18n = useI18n();
const guideStore = useGuideStore();
const showModal = computed(() => modal.show.value);
const loading = ref(false);

const tuitions = computed(() => guideStore.tuitions);
const langs = computed(() => guideStore.langs);
const tuition = ref(tuitions.value[0]);

onMounted(() => {
  guideStore.fetchTuitions();
  guideStore.fetchTuitionsLang();
});
const openDepartmentFormDialog = () => {
  formType.value = "create";
  modal.setTitle("Add department");
  modal.setWidth("50%");
  modal.showModal();
};
const onEditClick = async (row: any) => {
  try {
    tuition.value = row;
    formType.value = "edit";
    modal.setTitle(i18n.t("Edit department"));
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
      cancelButtonText: "Cencel",
      type: "warning",
      center: true,
    }
  )
    .then(async () => {
      try {
        loading.value = true;
        await guideStore.removeTuition(id);
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
const submitForm = async (department: any) => {
  try {
    loading.value = true;
    const data = {
      ...department,
      per_semester: +department.per_semester,
      fee_foreign_student: +department.fee_foreign_student,
    };
    if (formType.value === "edit" && tuition.value) {
      data["id"] = tuition.value.id;
      await guideStore.editTuition(data);
      ElMessage({
        message: i18n.t("shared.updated"),
        type: "success",
      });
    } else {
      await guideStore.createTuition(data);
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

<style>
.hover-row > td {
  background-color: initial !important;
}
</style>
