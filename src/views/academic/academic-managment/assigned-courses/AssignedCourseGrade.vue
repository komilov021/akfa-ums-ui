<template>
  <div class="mt-2">
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
    <div>
      <h1 class="text-text-900 font-semibold text-3xl">
        {{ currentCourse?.title + " " + currentCourse?.semester }}
      </h1>
      <el-divider></el-divider>
    </div>
    <div>
      <h4 class="text-xl font-semibold text-[#101828]">Attendance</h4>
      <div class="flex flex-wrap gap-8 mt-4">
        <div
          v-for="grade of grades.attendance"
          :key="grade.id"
          class="card flex items-center justify-center gap-6 px-6 py-7"
          @click="router.push({ name: 'academic-managment-weeks' })"
        >
          <div class="flex flex-col gap-2 flex-1">
            <h1 class="card__title capitalize">{{ grade.semester }}</h1>
            <h2 class="card__subtitle">
              Acceptable: {{ roundToTwo(grade.acceptable) }}%
            </h2>
            <!-- <h2 class="card__subtitle">Students: {{ grade.student_total }}</h2> -->
            <el-tag
              round
              color="#F9FAFB"
              class="!text-[#344054] !w-28 !border-[#EAECF0] mt-6 !font-medium"
            >
              Not published
            </el-tag>
          </div>
          <el-icon :size="20">
            <ArrowRight />
          </el-icon>
        </div>
      </div>
      <div
        class="flex gap-4 items-center mt-10"
        :class="{ 'justify-between': editOpen }"
      >
        <h4 class="text-xl font-semibold text-[#101828] grid">
          General grading
          <span v-if="editOpen" class="text-[#475467] text-sm font-normal"
            >Information about the weight of events that affects the final
            estimate
          </span>
        </h4>
        <el-button
          type="primary"
          v-if="!editOpen"
          size="large"
          @click="editOpen = true"
        >
          Edit
        </el-button>
        <template v-else>
          <div class="flex items-center gap-3">
            <el-button @click="editOpen = false">Cancel</el-button>
            <el-button @click="onSave" color="#344054">Save</el-button>
          </div>
        </template>
      </div>
      <div v-if="!editOpen" class="flex flex-wrap gap-8 mt-4">
        <div
          v-for="grade of grades.grading"
          :key="grade.id"
          @click="
            router.push({
              name: 'academic-managment-grading-view',
              params: {
                component: grade.id,
              },
            })
          "
          class="card flex items-center justify-center gap-6 px-6 py-7"
        >
          <div class="flex flex-col gap-2 flex-1 relative">
            <div class="flex items-center absolute -right-4 top-0">
              <el-tag
                round
                @click.stop="exportGrade(grades.grading, grade.name)"
                color="#ECFDF3"
                class="!text-[#344054] !w-23 !py-3 !border-[#EAECF0] !font-medium"
              >
                Grade Export
              </el-tag>
            </div>
            <div class="flex justify-between items-center">
              <h1 class="card__title">{{ grade.name }}</h1>
            </div>
            <h2 class="card__subtitle">Weight: {{ grade.weight }}%</h2>
            <!-- <h2 class="card__subtitle">Students: {{ grade.student_total }}</h2> -->
            <el-tag
              v-if="grade.is_published"
              round
              color="#ECFDF3"
              class="!text-[#067647] !w-28 !border-[#ABEFC6] mt-6 !font-medium"
            >
              Published
            </el-tag>
            <el-tag
              v-else
              round
              color="#F9FAFB"
              class="!text-[#344054] !w-28 !border-[#EAECF0] mt-6 !font-medium"
            >
              Not published
            </el-tag>
          </div>

          <el-icon :size="20">
            <ArrowRight />
          </el-icon>
        </div>
      </div>
      <div v-else>
        <GeneralGradingEdit
          :grade="grades.grading"
          @on-change="
            updateForm(
              $event,
              UpdateRequestTypeEnum.assigned_course_component_edit
            )
          "
          :value="
            ruleForm[UpdateRequestTypeEnum.assigned_course_component_edit]
          "
        />
      </div>
      <div v-if="grades.retake_grading">
        <h4 class="text-xl font-semibold text-[#101828] mt-10">
          Retake grading
        </h4>
        <div class="flex flex-wrap gap-8 mt-4">
          <div
            v-for="grade of grades.retake_grading"
            :key="grade.id"
            @click="
              router.push({
                name: 'academic-managment-grading-view',
                params: {
                  component: grade.id,
                },
                query: {
                  retake: 'true',
                },
              })
            "
            class="card flex items-center justify-center gap-6 px-6 py-7"
          >
            <div class="flex flex-col gap-2 flex-1 relative">
              <div class="flex items-center absolute -right-4 top-0">
                <el-tag
                  round
                  @click.stop="
                    exportRetakeGrade(grades.retake_grading, grade.name)
                  "
                  color="#ECFDF3"
                  class="!text-[#344054] !w-23 !py-3 px-3 !border-[#EAECF0] !font-medium"
                >
                  Retake Export
                </el-tag>
              </div>
              <h1 class="card__title">{{ grade.name }}</h1>
              <h2 class="card__subtitle">Weight: {{ grade.weight }}%</h2>
              <el-tag
                v-if="grade.is_published"
                round
                color="#ECFDF3"
                class="!text-[#067647] !w-28 !border-[#ABEFC6] mt-6 !font-medium"
              >
                Published
              </el-tag>
              <el-tag
                v-else
                round
                color="#F9FAFB"
                class="!text-[#344054] !w-28 !border-[#EAECF0] mt-6 !font-medium"
              >
                Not published
              </el-tag>
            </div>
            <el-icon :size="20">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
      </div>
      <div class="grid md:grid-cols-2 gap-8">
        <div>
          <h4 class="text-xl font-semibold text-[#101828] mt-10 mb-4">
            Total grade
          </h4>
          <div
            @click="
              router.push({
                name: 'academic-managment-total-grading',
                params: {
                  grade: route.params?.grade,
                },
              })
            "
            class="card card-total flex items-center justify-center gap-6 px-6 py-7"
          >
            <div class="flex flex-col gap-2 flex-1">
              <h1 class="card__title">Total grade</h1>
              <el-tag
                v-if="grades?.total?.grade_published"
                round
                color="#ECFDF3"
                class="!text-[#067647] !w-28 !border-[#ABEFC6] mt-6 !font-medium"
              >
                Published
              </el-tag>
              <el-tag
                v-else
                round
                color="#F9FAFB"
                class="!text-[#344054] !w-28 !border-[#EAECF0] mt-6 !font-medium"
              >
                Not published
              </el-tag>
            </div>
            <el-icon :size="20">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
        <div v-if="currentCourse?.has_retake">
          <div class="flex items-center gap-4 mt-10 mb-4">
            <h4 class="text-xl font-semibold text-[#101828]">Retake grade</h4>
            <!-- <button @click="deActive">
              <Delete class="h-5 w-5"></Delete>
            </button> -->
          </div>
          <div
            @click="
              router.push({
                name: 'academic-managment-total-grading',
                params: {
                  grade: route.params?.grade,
                },
                query: {
                  retake: 'true',
                },
              })
            "
            class="card card-total flex items-center justify-center gap-6 px-6 py-7"
          >
            <div class="flex flex-col gap-2 flex-1">
              <h1 class="card__title">Retake grade</h1>
              <el-tag
                v-if="grades?.total?.retake_grade_published"
                round
                color="#ECFDF3"
                class="!text-[#067647] !w-28 !border-[#ABEFC6] mt-6 !font-medium"
              >
                Published
              </el-tag>
              <el-tag
                v-else
                round
                color="#F9FAFB"
                class="!text-[#344054] !w-28 !border-[#EAECF0] mt-6 !font-medium"
              >
                Not published
              </el-tag>
            </div>
            <el-icon :size="20">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="openModal" :width="450">
      <UpdateRequestDialog @on-submit="submitForm($event)" />
    </el-dialog>
    <teleport to="#modal" v-if="showModal">
      <UpdateRequestDialog @on-submit="submitForm($event)" />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, Delete } from "@element-plus/icons-vue";
import {
  useCurriculumStore,
  useGradeComponentsStore,
  useGradeStore,
  useGuideStore,
  useFileStore,
} from "@/stores";
import { computed, onMounted, ref, reactive, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import { useModal, useStepper } from "@/composables";
import { saveFile } from "@/utils/common";
import StudentGroupDialog from "./components/StudentGroupDialog.vue";
import { useI18n } from "vue-i18n";
import GeneralGradingEdit from "./components/GeneralGradingEdit.vue";
import UpdateRequestDialog from "@/components/common/UpdateRequestDialog.vue";
import { UpdateRequestTypeEnum } from "@/models/backend";

const i18n = useI18n();
const modal = useModal();
const route = useRoute();
const router = useRouter();
const curriculumStore = useCurriculumStore();
const guideStore = useGuideStore();
const fileStore = useFileStore();
const gradeStore = useGradeStore();
const editOpen = ref(false);
const { check } = useStepper();
const loading = ref(false);
const grades: any = computed(() => gradeStore.generalGrades);
const currentCurriculum = computed(() => curriculumStore.currentCurriculum);
const currentCourse = computed(() => curriculumStore.currentCourse);
const tuitions = computed(() => guideStore.tuitions);
const currentProgram = ref();
const showModal = computed(() => modal.show.value);
const openModal = ref(false);
const activeSemestr = ref(currentCurriculum.value?.semester1);

// grade edit

const onSave = () => {
  check.next("next");
};

const currentType = ref<UpdateRequestTypeEnum>(
  UpdateRequestTypeEnum.assigned_course_component_edit
);
const updateForm = (data: any, type: UpdateRequestTypeEnum) => {
  ruleForm[type] = data;
  currentType.value = type;
  modal.setTitle(type);
  modal.setWidth("35vw");
  modal.showModal();
};

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

const submitForm = async (request: any) => {
  try {
    loading.value = true;
    request.type = currentType.value;
    await curriculumStore.updateAssignCoursesComponents({
      assigned_course_id: route.params.grade,
      components: request.components,
      request: {
        explanation: request.explanation,
        files: request.files,
        type: "assigned_course_component_edit",
      },
      ...ruleForm[currentType.value],
    });
    ElMessage({
      message: i18n.t("shared.created"),
      type: "success",
    });
    modal.hideModal();
    openModal.value = false;
    fetch();
    editOpen.value = false;
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};

const deActive = () => {
  ElMessageBox.confirm(
    "This will deactivates retake. Are you sure?",
    "Warning",
    {
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      type: "warning",
    }
  )
    .then(async () => {
      try {
        await curriculumStore.deactivateRetake(route.params.grade as string);
        await fetch();
        ElMessage({
          message: "Deactivated",
          type: "success",
        });
      } catch (error: any) {
        console.log(error, "error");
      }
    })
    .catch(() => {});
};
const fetch = async () => {
  gradeStore.fetchGeneralGrades(route.params.grade as string);
  curriculumStore.getAssignCourseById(route.params.grade as string);
  await curriculumStore.getCurriculumById(route.params.curriculum as string);
  if (tuitions.value.length === 0) await guideStore.fetchTuitions();
  currentProgram.value = tuitions.value.find(
    (tuition: any) => tuition.id === route.params.program
  );
  activeSemestr.value = currentCurriculum.value?.semester1;
};

const openGroupDialog = (index: number) => {
  modal.setTitle("Select group");
  modal.setWidth("50%");
  modal.showModal();
};
function checkNameInArray(array: any, name: any) {
  let res = array.filter((item: any) => item.name == name);
  return res;
}
const exportGrade = async (e: any, name: any) => {
  try {
    loading.value = true;
    let check = checkNameInArray(e, name);
    const exportFil = await gradeStore.exportGrade({
      assigned_course_id: check[0].assigned_course_id,
      component_id: check[0].id,
      retake: false,
    });
    const data = await fileStore.downloadById(exportFil.id);
    saveFile(data, exportFil?.name);
    ElMessage({
      message: i18n.t("shared.download"),
      type: "success",
    });
    loading.value = false;
  } catch (e) {
    console.log(e);
  }
};
const exportRetakeGrade = async (e: any, name: any) => {
  try {
    loading.value = true;
    let check = checkNameInArray(e, name);
    const exportFil = await gradeStore.exportGrade({
      assigned_course_id: check[0].assigned_course_id,
      component_id: check[0].id,
      retake: true,
    });
    const data = await fileStore.downloadById(exportFil.id);
    saveFile(data, exportFil?.name);
    ElMessage({
      message: i18n.t("shared.download"),
      type: "success",
    });
    loading.value = false;
  } catch (e) {
    console.log(e);
  }
};
const goToGroup = (form: any) => {
  modal.hideModal();
  router.push({
    name: "academic-managment-weeks",
    params: {
      group: form.group,
    },
  });
};
onMounted(async () => {
  fetch();
});

const roundToTwo = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};
</script>

<style scoped lang="scss">
.card {
  border-radius: 17.505px;
  background: #fff;
  box-shadow: 0.53488px 0.53488px 5.34882px 0.2334px rgba(0, 0, 0, 0.25);
  width: 350px;

  &__title {
    color: #1b1b1b;
    font-size: 22px;
    font-style: normal;
    font-weight: 500;
    display: -webkit-box;
    max-width: 400px;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }

  &__subtitle {
    color: #7c7c7c;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
  }

  @media (min-width: 640px) {
    &-total {
      width: 100%;
    }
  }
}
</style>
