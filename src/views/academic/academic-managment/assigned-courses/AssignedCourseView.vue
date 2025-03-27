<template>
  <div class="mx-auto mt-6 md:mt-2">
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
        :to="{
          path: `/academic/managment/programs/${currentProgram?.id}/${route.params?.year}/${currentCurriculum?.id}/${route.params?.grade}`,
        }"
        ><span class="!text-primary font-semibold text-base underline">
          {{ currentCourse?.title + " " + currentCourse?.semester }}
        </span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <h1 class="text-text-900 font-semibold text-3xl">
      {{ currentCourse?.title }}
    </h1>
    <h1 class="text-tertiary-600 font-semibold text-base">
      {{ currentCourse?.code }}
    </h1>
    <div class="mt-4" v-if="currentCourse">
      <el-tabs v-model="activeTab">
        <el-tab-pane
          v-for="item of tabItems"
          :key="item.value"
          :label="item.label"
          :name="item.value"
        />
      </el-tabs>
      <div class="relative light-form" v-loading="loading">
        <AssignedCourseGeneralForm
          v-if="activeTab === UpdateRequestTypeEnum.course_general"
          :course="currentCourse"
          @activateRetake="activateRetake"
        />
        <AssignedCourseGradingForm
          v-if="activeTab === UpdateRequestTypeEnum.course_prerequisites"
          :course="currentCourse"
        />
        <!-- <AssignedCourseCourseLeaderForm
          v-if="activeTab === UpdateRequestTypeEnum.course_course_leader"
          :course="currentCourse"
        /> -->
        <AssignedCourseProfessorsForm
          v-if="activeTab === UpdateRequestTypeEnum.course_grade_components"
          :course="currentCourse"
        />
        <AssignedCourseLessonForm
          v-if="activeTab === UpdateRequestTypeEnum.course_lessons"
          :course="currentCourse"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { UpdateRequestTypeEnum } from "@/models/backend";
import { useRoute } from "vue-router";
import { useCurriculumStore, useGuideStore } from "@/stores";
import AssignedCourseGeneralForm from "./components/AssignedCourseGeneralForm.vue";
import AssignedCourseGradingForm from "./components/AssignedCourseGradingForm.vue";
import AssignedCourseProfessorsForm from "./components/AssignedCourseProfessorsForm.vue";
import AssignedCourseLessonForm from "./components/AssignedCourseLessonForm.vue";

import { ArrowRight } from "@element-plus/icons-vue";
import { ControlItem } from "@/models/frontend";
import { ElMessage } from "element-plus";
import AssignedCourseCourseLeaderForm from "./components/AssignedCourseCourseLeaderForm.vue";

const route = useRoute();

const curriculumStore = useCurriculumStore();
const guideStore = useGuideStore();

const loading = ref(false);
const activeTab = ref(UpdateRequestTypeEnum.course_general);
const currentCourse = computed(() => curriculumStore.currentCourse);
const currentCurriculum = computed(() => curriculumStore.currentCurriculum);
const tuitions = computed(() => guideStore.tuitions);
const currentProgram = ref();

const tabItems: ControlItem[] = [
  {
    label: "General",
    value: UpdateRequestTypeEnum.course_general,
  },
  {
    label: "Grading & credits",
    value: UpdateRequestTypeEnum.course_prerequisites,
  },
  // {
  //   label: "School and leader",
  //   value: UpdateRequestTypeEnum.course_course_leader,
  // },
  {
    label: "Professors",
    value: UpdateRequestTypeEnum.course_grade_components,
  },
  {
    label: "Lessons",
    value: UpdateRequestTypeEnum.course_lessons,
  },
];

const activateRetake = async () => {
  try {
    loading.value = true;
    await curriculumStore.activateRetake(route.params.grade as string);
    ElMessage({
      message: "Retake course activated",
      type: "success",
    });
    getAndSetCourse();
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error?.message);
  }
};
onMounted(async () => {
  getAndSetCourse();
  await curriculumStore.getCurriculumById(route.params.curriculum as string);

  if (tuitions.value.length === 0) await guideStore.fetchTuitions();
  currentProgram.value = tuitions.value.find(
    (tuition: any) => tuition.id === route.params.program
  );
});

const getAndSetCourse = async () => {
  curriculumStore.getAssignCourseById(route.params.grade as string);
};
</script>

<style scoped lang="scss"></style>
<style lang="scss">
.course-stepper {
  .el-step__title {
    line-height: normal !important;
  }
}
</style>
