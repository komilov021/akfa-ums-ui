<template>
  <div class="mx-auto mt-6 md:mt-2" v-loading="loading">
    <el-breadcrumb :separator-icon="ArrowRight" class="mb-4">
      <el-breadcrumb-item
        class="underline"
        :to="{ path: '/academic/reference/curriculum' }"
        >Curriculum</el-breadcrumb-item
      >
      <el-breadcrumb-item class="underline"
        >{{
          route.query.action == "create" ? "Add new" : "Edit"
        }}
        curriculum</el-breadcrumb-item
      >
    </el-breadcrumb>
    <h1 class="text-main font-semibold text-3xl">
      {{ route.query.action == "create" ? "Add new" : "Edit" }} curriculum:
    </h1>
    <h1 class="font-semibold text-base">
      Study year - {{ currentCurriculum?.study_year }}
    </h1>
    <div class="mt-4" v-if="currentCurriculum">
      <div class="relative flex items-center gap-2 mb-6">
        <el-steps
          :active="activeIndex"
          align-center
          finish-status="success"
          class="course-stepper w-full"
        >
          <el-step :title="currentCurriculum.semester1"> </el-step>
          <el-step :title="currentCurriculum.semester2" />
          <el-step title="Progression rules" />
        </el-steps>
        <div v-if="activeIndex < 2" class="flex items-center gap-2">
          <el-button @click="populate">Update from old</el-button>
          <el-button type="primary" @click="addCourse">+ Add course</el-button>
        </div>
      </div>
      <div>
        <CurriculumCourseTable
          v-if="activeIndex === 0"
          :curriculum_id="(route.params.id as string)"
          :semester="currentCurriculum.semester1"
          @on-update="editCourse($event)"
          @on-delete="onDeleteCourse($event)"
        />
        <CurriculumCourseTable
          v-if="activeIndex === 1"
          :curriculum_id="(route.params.id as string)"
          :semester="currentCurriculum.semester2"
          @on-update="editCourse($event)"
          @on-delete="onDeleteCourse($event)"
        />
        <div v-if="activeIndex === 2">
          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="rules"
            label-position="top"
            require-asterisk-position="right"
            class="md:w-1/2"
          >
            <div class="grid sm:grid-cols-3 gap-3">
              <el-form-item
                label="Courses required to move to next level:"
                prop="courses_ids"
                class="sm:col-span-2"
              >
                <el-select
                  v-model="ruleForm.courses_ids"
                  class="w-full"
                  multiple
                >
                  <el-option
                    v-for="{
                      label,
                      value,
                    } of curriculumStore.getAssignCoursesCodeSelect"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="max_fails" label="Max. number of fails">
                <el-input-number
                  v-model="ruleForm.max_fails"
                  autocomplete="off"
                  class="!w-full"
                  :placeholder="$t('shared.text')"
                />
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <teleport to="#modal" v-if="showModal">
        <CreateCurriculumCourseDialog
          v-if="modalType === 'curriculum'"
          :course_references="courseReferances"
          :value="currentCourse"
          :type="formType"
          @on-submit="createCourse($event)"
          @on-update="onEditCourse($event)"
        />
        <UpdateRequestDialog
          v-if="modalType === 'request'"
          @on-submit="submitRequest($event)"
        />
      </teleport>
      <div class="mt-4 flex justify-end items-center">
        <el-button type="primary" @click="onPrevious" v-if="activeIndex > 0">
          {{ "<- Previous" }}</el-button
        >
        <el-button
          type="primary"
          @click="onNext"
          v-if="activeIndex < 2"
          :disabled="curriculumStore.assignCourses.data.length == 0"
          >Continue -></el-button
        >
        <el-button
          type="primary"
          @click="onProgressionSave"
          v-if="activeIndex == 2"
          >Save</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCurriculumStore, useCourseReferanceStore } from "@/stores";

import { useI18n } from "vue-i18n";
import { ArrowRight } from "@element-plus/icons-vue";
import { useModal } from "@/composables";
import { ElMessage, FormInstance, FormRules } from "element-plus";

import CurriculumCourseTable from "./components/CurriculumCourseTable.vue";
import CreateCurriculumCourseDialog from "./components/CreateCurriculumCourseDialog.vue";
import UpdateRequestDialog from "@/components/common/UpdateRequestDialog.vue";
import { ICurriculumCourse, RequestTypeEnum } from "@/models/backend";

const i18n = useI18n();
const route = useRoute();
const router = useRouter();
const modal = useModal();

const curriculumStore = useCurriculumStore();
const courseReferanceStore = useCourseReferanceStore();

const showModal = computed(() => modal.show.value);
const modalType = ref<"request" | "curriculum">();
const formType = ref<"create" | "edit">();
const requestType = ref<"progression" | "delete-course" | "edit-course">();
const currentCourse = ref();
const loading = ref(false);
const activeIndex = ref(0);

const courseReferances = computed(
  () => courseReferanceStore.courseReferances.data
);
const currentCurriculum = computed(() => curriculumStore.currentCurriculum);
const currentSemestr = computed(() =>
  activeIndex.value === 0
    ? currentCurriculum.value?.semester1
    : currentCurriculum.value?.semester2
);

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  max_fails: 0,
  courses_ids: [] as string[],
});

const rules = reactive<FormRules>({
  max_fails: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
      type: "number",
    },
  ],
  courses_ids: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
      type: "array",
    },
  ],
});

const onNext = () => {
  if (curriculumStore.assignCourses.data.length !== 0) {
    activeIndex.value += 1;
  }
};
const onPrevious = () => {
  activeIndex.value -= 1;
};

const fetchCourses = () => {
  curriculumStore.fetchAssignCourses({
    page: 1,
    limit: 30,
    curriculum_id: route.params.id as string,
    semester: currentSemestr.value,
  });
};

const populate = async () => {
  try {
    loading.value = true;
    await curriculumStore.populate({
      academic_year: currentCurriculum.value?.academic_year?.name,
      study_year: currentCurriculum.value?.study_year,
      program_id: currentCurriculum.value?.program_id,
      curriculum_id: route.params.id as string,
      semester: currentSemestr.value,
    });
    loading.value = false;
  } catch (error) {
    console.log("error", error);
    loading.value = false;
  }
};

const createCourse = async (data: any) => {
  try {
    loading.value = true;
    const formData = {
      ...data,
      curriculum_id: route.params.id as string,
      semester: currentSemestr.value,
    };
    await curriculumStore.createAssignCourses(formData);
    ElMessage({
      message: i18n.t("shared.created"),
      type: "success",
    });
    modal.hideModal();
    fetchCourses();
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};

const updateProgression = async (request: any) => {
  try {
    loading.value = true;
    request.type = "assigned_student_progression";
    const formData = {
      ...ruleForm,
      curriculum_id: route.params.id as string,
      request,
    };
    await curriculumStore.editProgressionRule(formData);
    ElMessage({
      message: i18n.t("shared.updated"),
      type: "success",
    });
    modal.hideModal();
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};

const createProgression = async () => {
  try {
    loading.value = true;
    const formData = {
      ...ruleForm,
      curriculum_id: route.params.id as string,
    };
    await curriculumStore.saveProgressionRule(formData);
    ElMessage({
      message: i18n.t("shared.created"),
      type: "success",
    });

    modal.hideModal();
    router.push("/academic/reference/curriculum");
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};

const submitRequest = async (request: any) => {
  if (requestType.value === "progression") {
    updateProgression(request);
  } else if (requestType.value === "delete-course") {
    request.type =
      activeIndex.value === 0
        ? RequestTypeEnum.assigned_semester1_remove
        : RequestTypeEnum.assigned_semester2_remove;

    await curriculumStore.deleteAssignCourses({
      curriculum_id: route.params.id as string,
      semester: currentSemestr.value,
      id: currentCourse.value.id,
      request,
    });

    ElMessage({
      message: i18n.t("shared.requestSent"),
      type: "success",
    });
    modal.hideModal();
  } else if (requestType.value === "edit-course") {
    request.type =
      activeIndex.value === 0
        ? RequestTypeEnum.assigned_semester1
        : RequestTypeEnum.assigned_semester2;

    await curriculumStore.editAssignCourses({
      curriculum_id: route.params.id as string,
      semester: currentSemestr.value,
      ...currentCourse.value,
      request,
    });
    ElMessage({
      message: i18n.t("shared.requestSent"),
      type: "success",
    });
    modal.hideModal();
  }
  modal.hideModal();
  router.push("/academic/reference/curriculum");
};

const onProgressionSave = () => {
  ruleFormRef.value?.validate((valid) => {
    if (valid) {
      if (currentCurriculum.value?.required_courses) {
        modalType.value = "request";
        requestType.value = "progression";
        modal.setTitle("Curriculum and student progression rules");
        modal.setWidth("40vw");
        modal.showModal();
      } else {
        createProgression();
      }
    }
  });
};

const addCourse = () => {
  formType.value = "create";
  modalType.value = "curriculum";
  modal.setTitle("Curriculum and student progression rules");
  modal.setWidth("40vw");
  modal.showModal();
};

const editCourse = (course: ICurriculumCourse) => {
  formType.value = "edit";
  currentCourse.value = course;
  modalType.value = "curriculum";
  requestType.value = "edit-course";
  modal.setTitle("Curriculum and student progression rules");
  modal.setWidth("40vw");
  modal.showModal();
};

const onDeleteCourse = (course: ICurriculumCourse) => {
  currentCourse.value = course;
  modalType.value = "request";
  requestType.value = "delete-course";
  modal.setTitle("Delete course");
  modal.setWidth("40vw");
  modal.showModal();
};

const onEditCourse = (course: ICurriculumCourse) => {
  currentCourse.value = course;
  modalType.value = "request";
  requestType.value = "edit-course";
  modal.setTitle("Edit course");
  modal.setWidth("40vw");
  modal.showModal();
};

onMounted(async () => {
  await curriculumStore.getCurriculumById(route.params.id as string);
  if (currentCurriculum.value?.max_fails) {
    ruleForm.max_fails = currentCurriculum.value?.max_fails;
    ruleForm.courses_ids = currentCurriculum.value?.required_courses.map(
      (i) => i.id
    ) as string[];
  }

  courseReferanceStore.fetchCourseReferances({
    page: 1,
    limit: 100,
  });
  curriculumStore.fetchCourseReferancesByCurriculum({
    page: 1,
    limit: 100,
    curriculum_id: route.params.id as string,
  });
});

onBeforeMount(() => {
  curriculumStore.clearCurrentCurriculum();
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
