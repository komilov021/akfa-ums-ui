<template>
  <div class="mx-auto mt-6 md:mt-2">
    <el-breadcrumb :separator-icon="ArrowRight" class="mb-4">
      <el-breadcrumb-item
        class="underline"
        :to="{ path: '/academic/reference/course-referance' }"
        >Course catalogue</el-breadcrumb-item
      >
      <el-breadcrumb-item class="underline">Add new course</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 class="text-text-900 font-semibold text-3xl">Add new course:</h1>
    <h1
      v-if="ruleForm.course_general?.title"
      class="text-tertiary-600 font-semibold text-base"
    >
      {{ ruleForm.course_general?.title }}
    </h1>
    <div class="mt-4">
      <el-steps
        :active="activeIndex"
        align-center
        finish-status="success"
        class="course-stepper"
      >
        <el-step title="General"> </el-step>
        <el-step title="Prerequisites" />
        <el-step title="Grading & Credits" />
        <el-step title="School and leader" />
        <el-step title="Grade settings - main" />
        <el-step title="Grade settings -retake" />
        <el-step title="Grade components" />
        <el-step title="Lessons" />
      </el-steps>
      <div class="light-form">
        <GeneralCourseReferanceForm
          v-if="activeIndex === 0"
          :value="ruleForm[UpdateRequestTypeEnum.course_general]"
          @on-change="updateForm($event, UpdateRequestTypeEnum.course_general)"
        />
        <PrerequisiteTestReferanceForm
          v-if="activeIndex === 1"
          :value="ruleForm[UpdateRequestTypeEnum.course_prerequisites]"
          @on-change="
            updateForm($event, UpdateRequestTypeEnum.course_prerequisites)
          "
        />
        <GradingCreditsReferanceForm
          v-if="activeIndex === 2"
          :value="ruleForm[UpdateRequestTypeEnum.course_grading]"
          @on-change="updateForm($event, UpdateRequestTypeEnum.course_grading)"
        />
        <CourseLeaderAndSchoolReferanceForm
          v-if="activeIndex === 3"
          :value="ruleForm[UpdateRequestTypeEnum.course_course_leader]"
          @on-change="
            updateForm($event, UpdateRequestTypeEnum.course_course_leader)
          "
        />
        <MainGradeSettingsReferanceForm
          v-if="activeIndex === 4"
          :value="ruleForm[UpdateRequestTypeEnum.course_grade_main]"
          :grading_type="ruleForm.course_grading?.grading_type"
          @on-change="
            updateForm($event, UpdateRequestTypeEnum.course_grade_main)
          "
        />
        <RetakeGradeSettingsReferanceForm
          v-if="activeIndex === 5"
          :value="ruleForm[UpdateRequestTypeEnum.course_grade_retake]"
          @on-change="
            updateForm($event, UpdateRequestTypeEnum.course_grade_retake)
          "
        />
        <GradeComponentsReferanceForm
          v-if="activeIndex === 6"
          :value="ruleForm[UpdateRequestTypeEnum.course_grade_components]"
          @on-change="
            updateForm($event, UpdateRequestTypeEnum.course_grade_components)
          "
        />
        <LessonsReferanceForm
          v-if="activeIndex === 7"
          :value="ruleForm[UpdateRequestTypeEnum.course_lessons]"
          @on-change="updateForm($event, UpdateRequestTypeEnum.course_lessons)"
        />
      </div>
      <div class="mt-6 flex justify-end items-center">
        <el-button
          size="large"
          v-if="activeIndex > 0"
          type="primary"
          @click="onPrev"
        >
          <el-icon :size="20"><Back /></el-icon>
          <span class="ml-2">Previous</span></el-button
        >
        <el-button
          v-if="formLength - 1 !== activeIndex"
          type="primary"
          size="large"
          @click="onNext"
          ><span class="mr-2">Continue</span>
          <el-icon :size="20"><Right /></el-icon
        ></el-button>
        <el-button size="large" v-else type="primary" @click="onSave"
          >Save</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStepper } from "@/composables";
import { onMounted, onBeforeMount, reactive, ref, computed } from "vue";
import { UpdateRequestTypeEnum } from "@/models/backend";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { useRoute, useRouter } from "vue-router";
import { useCourseReferanceStore } from "@/stores";

import GeneralCourseReferanceForm from "./components/GeneralCourseReferanceForm.vue";
import PrerequisiteTestReferanceForm from "./components/PrerequisiteTestReferanceForm.vue";
import GradingCreditsReferanceForm from "./components/GradingCreditsReferanceForm.vue";
import CourseLeaderAndSchoolReferanceForm from "./components/CourseLeaderAndSchoolReferanceForm.vue";
import MainGradeSettingsReferanceForm from "./components/MainGradeSettingsReferanceForm.vue";
import RetakeGradeSettingsReferanceForm from "./components/RetakeGradeSettingsReferanceForm.vue";
import GradeComponentsReferanceForm from "./components/GradeComponentsReferanceForm.vue";
import LessonsReferanceForm from "./components/LessonsReferanceForm.vue";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { ArrowRight } from "@element-plus/icons-vue";

const courseReferanceStore = useCourseReferanceStore();

const i18n = useI18n();
const route = useRoute();
const router = useRouter();
const destroy = new Subject<any>();
const { next$, create$, check } = useStepper();

const ruleForm = reactive<Record<UpdateRequestTypeEnum, any>>({
  [UpdateRequestTypeEnum.course_general]: null,
  [UpdateRequestTypeEnum.course_prerequisites]: null,
  [UpdateRequestTypeEnum.course_grading]: null,
  [UpdateRequestTypeEnum.course_course_leader]: null,
  [UpdateRequestTypeEnum.course_grade_main]: null,
  [UpdateRequestTypeEnum.course_grade_retake]: null,
  [UpdateRequestTypeEnum.course_grade_components]: null,
  [UpdateRequestTypeEnum.course_lessons]: null,
  [UpdateRequestTypeEnum.assigned_course_component_edit]: null,
});

const loading = ref(false);
const activeIndex = ref(0);

const onNext = () => {
  check.next("next");
};

const onPrev = () => {
  activeIndex.value -= 1;
};

const updateForm = (data: any, type: UpdateRequestTypeEnum) => {
  ruleForm[type] = data;
};

const onSave = () => {
  check.next("create");
};

const formLength = computed(() => Object.keys(ruleForm).length);
onMounted(() => {
  if (route.query?.tab) {
    activeIndex.value = +route.query.tab;
  }
  next$.pipe(takeUntil(destroy)).subscribe(() => {
    activeIndex.value += 1;
  });

  create$.pipe(takeUntil(destroy)).subscribe(async () => {
    let data = {} as any;
    Object.values(ruleForm).forEach((form) => {
      if (typeof form === "object") {
        data = { ...data, ...form };
      }
    });
    try {
      loading.value = true;
      await courseReferanceStore.createCourseReferance(data);
      ElMessage({
        message: i18n.t("shared.created"),
        type: "success",
      });
      router.back();
      loading.value = false;
    } catch (error: any) {
      loading.value = false;
      console.log("error", error);
    }
  });
});

onBeforeMount(() => {
  destroy.next(null);
  destroy.complete();
});
</script>

<style scoped lang="scss">
.degree {
  max-width: 500px;
  min-width: 400px;
  border-radius: 7.237px;
  background: #fff;
  box-shadow: 0px 0.72368px 3.61842px 0.72368px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr auto;
  &__title {
    font-size: 16.699px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
}
</style>
<style lang="scss">
.course-stepper {
  .el-step__title {
    line-height: normal !important;
  }
}
</style>
