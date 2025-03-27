<template>
  <div class="mx-auto mt-6 md:mt-2" v-loading="loading">
    <el-breadcrumb :separator-icon="ArrowRight" class="mb-2">
      <el-breadcrumb-item
        :to="{ path: `/academic/managment/programs/${currentProgram?.id}` }"
        ><span class="font-semibold text-base">
          {{ currentProgram?.program }}
        </span></el-breadcrumb-item
      >
      <el-breadcrumb-item
        :to="{
          path: `/academic/managment/programs/${currentProgram?.id}/${route.params?.year}`,
        }"
        ><span class="font-semibold text-base">
          {{ currentCurriculum?.semester1 }} -
          {{ currentCurriculum?.semester2 }}
        </span></el-breadcrumb-item
      >
      <el-breadcrumb-item
        :to="{
          path: `/academic/managment/programs/${currentProgram?.id}/${route.params?.year}/${currentCurriculum?.id}`,
          name: 'academic-managment-courses',
        }"
        ><span class="font-semibold text-base">
          Level {{ currentCurriculum?.study_year }}
        </span></el-breadcrumb-item
      >
      <el-breadcrumb-item
        ><span class="!text-primary font-semibold text-base underline">
          Student Profile
        </span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <StudentProfile :student="student" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useCurriculumStore, useGuideStore, useStudentsStore } from "@/stores";

import { ArrowRight } from "@element-plus/icons-vue";
import StudentProfile from "@/components/academic/StudentProfile.vue";

const route = useRoute();

const curriculumStore = useCurriculumStore();
const guideStore = useGuideStore();
const studentStore = useStudentsStore();

const loading = ref(false);
const student = computed(() => studentStore.currentStudent);
const currentCurriculum = computed(() => curriculumStore.currentCurriculum);
const tuitions = computed(() => guideStore.tuitions);
const currentProgram = ref();

onMounted(async () => {
  try {
    loading.value = true;
    await studentStore.getStudentById(route.params.student as string);
    await curriculumStore.getCurriculumById(route.params.curriculum as string);

    if (tuitions.value.length === 0) await guideStore.fetchTuitions();
    currentProgram.value = tuitions.value.find(
      (tuition: any) => tuition.id === route.params.program
    );
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error?.message);
  }
});
</script>

<style scoped lang="scss"></style>
<style lang="scss">
.course-stepper {
  .el-step__title {
    line-height: normal !important;
  }
}
</style>
