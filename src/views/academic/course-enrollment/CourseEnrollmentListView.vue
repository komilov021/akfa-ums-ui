<template>
  <div class="mt-8">
    <button
      @click="openDepartmentFormDialog"
      class="bg-white rounded-lg shadow-lg flex items-center p-6 gap-4 font-bold text-[22px] hover:shadow-2xl transition-all hover:translate-y-[-2px] cursor-pointer"
    >
      <Plus class="w-6 h-6"></Plus>
      <span>Add enrollment</span>
    </button>
    <div class="grid grid-cols-4 2xl:grid-cols-6 gap-5 mt-16">
      <div
        v-for="enrollment in enrollments"
        :key="enrollment.id"
        @click="
          router.push(`/academic/course-enrollment/summary/${enrollment.id}`)
        "
        class="py-5 px-8 bg-white rounded-xl shadow-lg text-sm font-semibold hover:shadow-2xl transition-all hover:translate-y-[-2px] cursor-pointer"
      >
        {{ enrollment.semester + " " + enrollment.academic_year }} / Study year
        - {{ enrollment.study_year }}
      </div>
    </div>
    <teleport to="#modal" v-if="showModal">
      <EnrollmentForm
        :type="formType"
        @on-submit="submitForm($event)"
      ></EnrollmentForm>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { Plus } from "@element-plus/icons-vue";
import { useAcademicStore, useCourseEnrollmentStore } from "@/stores";
import type { IcreateCourseEnrollment } from "@/models/backend";
import { computed, onMounted, ref } from "vue";
import EnrollmentForm from "./components/EnrollmentForm.vue";
import { useModal } from "@/composables";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const enrollments = computed(() => EnrollmentStore.enrollments);
const EnrollmentStore = useCourseEnrollmentStore();
const modal = useModal();
const formType = ref<"create" | "edit">("create");
const i18n = useI18n();

const showModal = computed(() => modal.show.value);
const loading = ref(false);
const router = useRouter();
const examYearStore = useAcademicStore();
const examYears = computed(() => examYearStore.semestrs);
onMounted(() => {
  EnrollmentStore.fetchCourseEnrollment();
});
const openDepartmentFormDialog = () => {
  formType.value = "create";
  modal.setTitle("Add enrollment");
  modal.setWidth("30%");
  modal.showModal();
};
const submitForm = async (data: IcreateCourseEnrollment) => {
  try {
    loading.value = true;
    const res = await EnrollmentStore.createCourseEnrollment(data);
    EnrollmentStore.regenerateCourseEnrollment(res.id);
    ElMessage({
      message: i18n.t("shared.created"),
      type: "success",
    });
    modal.hideModal();
    loading.value = false;
    router.push(`/academic/course-enrollment/summary/${res.id}`);
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
</script>

<style></style>
