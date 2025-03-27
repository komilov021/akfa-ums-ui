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
      >Add Grade</el-button
    >
  </div>
  <div class="table-wrapper" v-loading="loading">
    <el-table
      :data="grades"
      stripe
      style="width: 100%"
      row-class-name="noHover"
    >
      <el-table-column
        prop="grade"
        label="Grade"
        min-width="120"
        align="left"
      />
      <el-table-column
        prop="student_proportion"
        label="Student Proportion (%)"
        min-width="120"
        align="center"
      />
      <el-table-column
        prop="gpa"
        label="GPA Equivalent"
        min-width="120"
        align="center"
      />
      <el-table-column label="Operations" align="center">
        <template #default="scope">
          <div class="flex justify-center space-x-3">
            <Edit
              class="h-4 w-4 text-green-500"
              @click="openEditFormDialog(scope.row)"
            />
            <!-- <Delete
              v-if="!scope.row.is_active"
              class="h-4 w-4 text-primary"
              @click="confirmDelete(scope.row.id)"
            /> -->
          </div>
        </template>
      </el-table-column>
    </el-table>
    <teleport to="#modal" v-if="showModal">
      <GradesForm
        :type="formType"
        :grade="grade"
        @on-submit="submitForm($event)"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { useCoursesStore, useGradeStore } from "@/stores";
import { onMounted, computed, ref } from "vue";
import { Edit } from "@element-plus/icons-vue";
import { useModal } from "@/composables";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import GradesForm from "./components/GradesForm.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const modal = useModal();
const formType = ref<"create" | "edit">("create");
const i18n = useI18n();
const gradeStore = useGradeStore();
const coursesStore = useCoursesStore();

const showModal = computed(() => modal.show.value);
const loading = ref(false);
const currentCourse = computed(() => coursesStore.currentCourse);

const grades = computed(() => gradeStore.grades);
const grade = ref();

onMounted(() => {
  coursesStore.getCourseById(route.params.id as string);
  fetchList();
});
const fetchList = () => {
  gradeStore.fetchGrades(route.params.id as string);
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

const submitForm = async (data: any) => {
  try {
    loading.value = true;
    const formData = {
      ...data,
      course_id: route.params.id,
    };
    if (formType.value === "edit" && grade.value) {
      formData["id"] = grade.value.id;
      await gradeStore.editGrade(formData);
      ElMessage({
        message: i18n.t("shared.updated"),
        type: "success",
      });
    } else {
      await gradeStore.createGrade(formData);
      ElMessage({
        message: i18n.t("shared.created"),
        type: "success",
      });
    }
    fetchList();
    loading.value = false;
    modal.hideModal();
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
</script>

<style scoped></style>
