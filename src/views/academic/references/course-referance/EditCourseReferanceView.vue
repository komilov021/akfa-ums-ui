<template>
  <div class="mx-auto mt-6 md:mt-2">
    <el-breadcrumb :separator-icon="ArrowRight" class="mb-4">
      <el-breadcrumb-item
        class="underline"
        :to="{ path: '/academic/reference/course-referance' }"
        >Course catalogue</el-breadcrumb-item
      >
      <el-breadcrumb-item class="underline">{{
        ruleForm.course_general?.title
      }}</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 class="text-text-900 font-semibold text-3xl">
      {{ ruleForm.course_general?.title }}
    </h1>
    <h1
      v-if="ruleForm.course_general?.title"
      class="text-tertiary-600 font-semibold text-base"
    >
      {{ ruleForm.course_general?.code }}
    </h1>
    <div class="mt-4" v-if="courseReferance">
      <el-tabs v-model="activeTab">
        <el-tab-pane
          v-for="item of tabItems"
          :key="item.value"
          :label="item.label"
          :name="item.value"
        />
      </el-tabs>
      <div class="relative light-form">
        <GeneralCourseReferanceForm
          v-if="activeTab === UpdateRequestTypeEnum.course_general"
          :value="ruleForm[UpdateRequestTypeEnum.course_general]"
          :disabled="disabled"
          @on-change="updateForm($event, UpdateRequestTypeEnum.course_general)"
        />
        <PrerequisiteTestReferanceForm
          v-if="activeTab === UpdateRequestTypeEnum.course_prerequisites"
          :value="ruleForm[UpdateRequestTypeEnum.course_prerequisites]"
          :disabled="disabled"
          @on-change="
            updateForm($event, UpdateRequestTypeEnum.course_prerequisites)
          "
        />
        <GradingCreditsReferanceForm
          v-if="activeTab === UpdateRequestTypeEnum.course_grading"
          :value="ruleForm[UpdateRequestTypeEnum.course_grading]"
          :disabled="disabled"
          @on-change="updateForm($event, UpdateRequestTypeEnum.course_grading)"
        />
        <CourseLeaderAndSchoolReferanceForm
          v-if="activeTab === UpdateRequestTypeEnum.course_course_leader"
          :value="ruleForm[UpdateRequestTypeEnum.course_course_leader]"
          :disabled="disabled"
          @on-change="
            updateForm($event, UpdateRequestTypeEnum.course_course_leader)
          "
        />
        <MainGradeSettingsReferanceForm
          v-if="activeTab === UpdateRequestTypeEnum.course_grade_main"
          :value="ruleForm[UpdateRequestTypeEnum.course_grade_main]"
          :disabled="disabled"
          :grading_type="ruleForm.course_grading?.grading_type"
          @on-change="
            updateForm($event, UpdateRequestTypeEnum.course_grade_main)
          "
        />
        <RetakeGradeSettingsReferanceForm
          v-if="activeTab === UpdateRequestTypeEnum.course_grade_retake"
          :value="ruleForm[UpdateRequestTypeEnum.course_grade_retake]"
          :disabled="disabled"
          @on-change="
            updateForm($event, UpdateRequestTypeEnum.course_grade_retake)
          "
        />
        <GradeComponentsReferanceForm
          v-if="activeTab === UpdateRequestTypeEnum.course_grade_components"
          :value="ruleForm[UpdateRequestTypeEnum.course_grade_components]"
          :disabled="disabled"
          @on-change="
            updateForm($event, UpdateRequestTypeEnum.course_grade_components)
          "
        />
        <LessonsReferanceForm
          v-if="activeTab === UpdateRequestTypeEnum.course_lessons"
          :value="ruleForm[UpdateRequestTypeEnum.course_lessons]"
          :disabled="disabled"
          @on-change="updateForm($event, UpdateRequestTypeEnum.course_lessons)"
        />
        <div class="flex items-center gap-2 absolute right-0 top-2">
          <el-button v-if="disabled" @click="disabled = false">Edit</el-button>
          <template v-else>
            <el-button @click="disabled = true">Cancel</el-button>
            <el-button @click="onSave" color="#344054">Save</el-button>
          </template>
        </div>
      </div>
      <teleport to="#modal" v-if="showModal">
        <UpdateRequestDialog @on-submit="submitForm($event)" />
      </teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { UpdateRequestTypeEnum } from "@/models/backend";
import { useRoute } from "vue-router";
import { useCourseReferanceStore } from "@/stores";

import GeneralCourseReferanceForm from "./components/GeneralCourseReferanceForm.vue";
import PrerequisiteTestReferanceForm from "./components/PrerequisiteTestReferanceForm.vue";
import GradingCreditsReferanceForm from "./components/GradingCreditsReferanceForm.vue";
import CourseLeaderAndSchoolReferanceForm from "./components/CourseLeaderAndSchoolReferanceForm.vue";
import MainGradeSettingsReferanceForm from "./components/MainGradeSettingsReferanceForm.vue";
import RetakeGradeSettingsReferanceForm from "./components/RetakeGradeSettingsReferanceForm.vue";
import GradeComponentsReferanceForm from "./components/GradeComponentsReferanceForm.vue";
import LessonsReferanceForm from "./components/LessonsReferanceForm.vue";
import UpdateRequestDialog from "@/components/common/UpdateRequestDialog.vue";

import { useI18n } from "vue-i18n";
import { ArrowRight } from "@element-plus/icons-vue";
import { ControlItem } from "@/models/frontend";
import { useStepper } from "@/composables";
import { useModal } from "@/composables";
import { ElMessage } from "element-plus";

const i18n = useI18n();
const route = useRoute();
const { check } = useStepper();
const modal = useModal();
const disabled = ref(true);

const courseReferanceStore = useCourseReferanceStore();

const showModal = computed(() => modal.show.value);
const loading = ref(false);
const currentType = ref<UpdateRequestTypeEnum>(
  UpdateRequestTypeEnum.course_general
);
const activeTab = ref(UpdateRequestTypeEnum.course_general);
const courseReferance = computed(() => courseReferanceStore.courseReferance);

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

const tabItems: ControlItem[] = [
  {
    label: "General",
    value: UpdateRequestTypeEnum.course_general,
  },
  {
    label: "Prerequisites",
    value: UpdateRequestTypeEnum.course_prerequisites,
  },
  {
    label: "Grading & Credits",
    value: UpdateRequestTypeEnum.course_grading,
  },
  {
    label: "School and leader",
    value: UpdateRequestTypeEnum.course_course_leader,
  },
  {
    label: "Grade settings - main",
    value: UpdateRequestTypeEnum.course_grade_main,
  },
  {
    label: "Grade settings - retake",
    value: UpdateRequestTypeEnum.course_grade_retake,
  },
  {
    label: "Grade components",
    value: UpdateRequestTypeEnum.course_grade_components,
  },
  {
    label: "Lessons",
    value: UpdateRequestTypeEnum.course_lessons,
  },
];

const updateForm = (data: any, type: UpdateRequestTypeEnum) => {
  ruleForm[type] = data;
  currentType.value = type;
  modal.setTitle(type);
  modal.setWidth("35vw");
  modal.showModal();
};

const onSave = () => {
  check.next("next");
};

const submitForm = async (request: any) => {
  try {
    loading.value = true;
    request.type = currentType.value;
    await courseReferanceStore.editCourseReferance({
      ...ruleForm[currentType.value],
      id: route.params.id,
      request,
    });
    ElMessage({
      message: i18n.t("shared.created"),
      type: "success",
    });
    modal.hideModal();
    getAndSetCourse();
    disabled.value = true;
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
onMounted(async () => {
  getAndSetCourse();
});
const getAndSetCourse = async () => {
  await courseReferanceStore.getCourseReferanceById(route.params.id as string);
  if (courseReferance.value) {
    const {
      program_id,
      code,
      retake_code,
      title,
      prerequisite_ids,
      tests,
      grading_type,
      credits,
      retake_credits,
      school_id,
      chief_id,
      grade,
      retake_grade,
      lessons,
      components,
      retake_components,
    } = courseReferance.value;
    ruleForm[UpdateRequestTypeEnum.course_general] = {
      title,
      program_id,
      code,
      retake_code,
    };

    ruleForm[UpdateRequestTypeEnum.course_prerequisites] = {
      prerequisite_ids,
      tests: Array.isArray(tests) ? tests : [],
    };

    ruleForm[UpdateRequestTypeEnum.course_grading] = {
      grading_type,
      credits,
      retake_credits,
    };

    ruleForm[UpdateRequestTypeEnum.course_course_leader] = {
      school_id,
      chief_id,
    };

    ruleForm[UpdateRequestTypeEnum.course_grade_main] = {
      grade,
    };

    ruleForm[UpdateRequestTypeEnum.course_grade_retake] = {
      retake_grade,
    };

    ruleForm[UpdateRequestTypeEnum.course_grade_components] = {
      components,
      retake_components,
    };

    ruleForm[UpdateRequestTypeEnum.course_lessons] = {
      lessons,
    };
  }
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
