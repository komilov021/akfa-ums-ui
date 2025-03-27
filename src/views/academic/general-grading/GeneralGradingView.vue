<template>
  <div class="h-full flex flex-col mt-2" v-loading="loading">
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
        ><span class="font-semibold text-base">
          {{ currentCourse?.title + " " + currentCourse?.semester }}
        </span></el-breadcrumb-item
      >
      <el-breadcrumb-item class="underline"
        ><span class="!text-primary font-semibold text-base">
          {{ currentComponent?.name }}
        </span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <div class="flex items-center justify-between mt-2">
      <div class="flex flex-col gap-1" v-if="currentComponent">
        <h1 class="font-semibold text-xl">
          {{ currentComponent?.name }}
        </h1>
        <h1 class="text-tertiary-600">
          Weighting - {{ currentComponent?.weight }} %
        </h1>
      </div>
      <div class="flex items-center gap-2" v-if="!components.published">
        <!-- <div class="flex items-center gap-2 mr-3">
          <el-switch v-model="lmsIntegration" id="lmsIntegration" />
          <label for="lmsIntegration">LMS Integration: OFF</label>
        </div> -->
        <el-button @click="onCreateGrade">Add new grade</el-button>
        <!-- <el-button type="danger" @click="deleteGrades">Delete</el-button> -->
        <!-- <el-button @click="openImportModal">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.1873 16.25C12.1873 16.4158 12.1215 16.5747 12.0043 16.6919C11.8871 16.8092 11.7281 16.875 11.5623 16.875H9.37482C9.20906 16.875 9.05009 16.8092 8.93288 16.6919C8.81567 16.5747 8.74982 16.4158 8.74982 16.25V11.875C8.74982 11.7092 8.81567 11.5503 8.93288 11.4331C9.05009 11.3158 9.20906 11.25 9.37482 11.25C9.54058 11.25 9.69956 11.3158 9.81677 11.4331C9.93398 11.5503 9.99982 11.7092 9.99982 11.875V15.625H11.5623C11.7281 15.625 11.8871 15.6908 12.0043 15.8081C12.1215 15.9253 12.1873 16.0842 12.1873 16.25ZM7.23811 11.3664C7.17132 11.3187 7.09579 11.2846 7.01582 11.2661C6.93586 11.2476 6.85303 11.245 6.77207 11.2585C6.69111 11.272 6.6136 11.3013 6.54397 11.3447C6.47433 11.3882 6.41394 11.4449 6.36623 11.5117L5.31232 12.9875L4.25842 11.5117C4.21241 11.4409 4.15254 11.3802 4.08242 11.3332C4.01229 11.2862 3.93337 11.2539 3.85041 11.2382C3.76746 11.2225 3.68218 11.2238 3.59974 11.242C3.5173 11.2602 3.43939 11.2949 3.37073 11.344C3.30207 11.3931 3.24407 11.4556 3.20023 11.5278C3.15639 11.5999 3.12763 11.6802 3.11567 11.7638C3.10372 11.8474 3.10882 11.9325 3.13067 12.0141C3.15251 12.0956 3.19066 12.1719 3.24279 12.2383L4.54436 14.0625L3.24123 15.8867C3.15353 16.0217 3.12126 16.1852 3.15114 16.3434C3.18102 16.5015 3.27074 16.642 3.40163 16.7356C3.53252 16.8293 3.69448 16.8688 3.85379 16.846C4.01309 16.8232 4.15747 16.7399 4.25686 16.6133L5.31232 15.1375L6.36623 16.6133C6.46561 16.7399 6.60999 16.8232 6.7693 16.846C6.92861 16.8688 7.09057 16.8293 7.22146 16.7356C7.35234 16.642 7.44207 16.5015 7.47195 16.3434C7.50182 16.1852 7.46955 16.0217 7.38186 15.8867L6.08029 14.0625L7.38342 12.2383C7.43113 12.1715 7.46521 12.096 7.48373 12.016C7.50225 11.936 7.50483 11.8532 7.49134 11.7722C7.47785 11.6913 7.44854 11.6138 7.40509 11.5441C7.36164 11.4745 7.3049 11.4141 7.23811 11.3664ZM14.9678 13.3836C14.6553 13.293 14.3319 13.2 14.1514 13.0836C14.0537 13.0195 14.0553 13.0055 14.0639 12.9352C14.0651 12.8783 14.0799 12.8226 14.1071 12.7727C14.1342 12.7229 14.173 12.6802 14.2201 12.6484C14.5795 12.4047 15.4186 12.5141 15.7686 12.6047C15.9289 12.6469 16.0995 12.6236 16.2427 12.54C16.3859 12.4564 16.4901 12.3194 16.5322 12.159C16.5744 11.9986 16.5511 11.8281 16.4676 11.6848C16.384 11.5416 16.2469 11.4375 16.0865 11.3953C15.9217 11.3523 14.4459 10.9875 13.5217 11.6109C13.3268 11.7426 13.1632 11.9155 13.0424 12.1173C12.9216 12.3191 12.8465 12.5449 12.8225 12.7789C12.6662 14.0195 13.8889 14.3734 14.6194 14.5844C15.5615 14.857 15.6444 14.9688 15.6178 15.1773C15.5936 15.3656 15.5194 15.4375 15.4498 15.4844C15.0904 15.7234 14.2654 15.6055 13.9233 15.5117C13.7632 15.4673 13.592 15.4882 13.4474 15.57C13.3758 15.6105 13.3129 15.6647 13.2622 15.7295C13.2116 15.7943 13.1742 15.8684 13.1522 15.9477C13.1302 16.0269 13.124 16.1097 13.134 16.1914C13.144 16.273 13.17 16.3519 13.2104 16.4235C13.2922 16.5681 13.428 16.6743 13.5881 16.7188C13.9755 16.8208 14.3742 16.8733 14.7748 16.875C15.2295 16.875 15.7358 16.7969 16.1412 16.5266C16.3413 16.3935 16.5093 16.2178 16.6333 16.0121C16.7573 15.8064 16.8342 15.5757 16.8584 15.3367C17.0311 13.9844 15.7404 13.607 14.9678 13.3836ZM3.12482 8.75V3.125C3.12482 2.79348 3.25652 2.47554 3.49094 2.24112C3.72536 2.0067 4.0433 1.875 4.37482 1.875H11.8748C11.9569 1.87494 12.0382 1.89105 12.1141 1.92241C12.19 1.95378 12.2589 1.99979 12.317 2.05781L16.692 6.43281C16.75 6.4909 16.796 6.55985 16.8274 6.63572C16.8588 6.71159 16.8749 6.7929 16.8748 6.875V8.75C16.8748 8.91576 16.809 9.07473 16.6918 9.19194C16.5746 9.30915 16.4156 9.375 16.2498 9.375C16.0841 9.375 15.9251 9.30915 15.8079 9.19194C15.6907 9.07473 15.6248 8.91576 15.6248 8.75V7.5H11.8748C11.7091 7.5 11.5501 7.43415 11.4329 7.31694C11.3157 7.19973 11.2498 7.04076 11.2498 6.875V3.125H4.37482V8.75C4.37482 8.91576 4.30898 9.07473 4.19177 9.19194C4.07456 9.30915 3.91558 9.375 3.74982 9.375C3.58406 9.375 3.42509 9.30915 3.30788 9.19194C3.19067 9.07473 3.12482 8.91576 3.12482 8.75ZM12.4998 6.25H14.7404L12.4998 4.00859V6.25Z"
              fill="black"
            />
          </svg>

          Import
        </el-button> -->
        <el-button
          :disabled="!components.can_publish && !components.students?.length"
          @click="publishGrade"
          >Publish</el-button
        >
      </div>
      <el-tag
        v-else
        @click="publishGrade"
        effect="dark"
        size="large"
        class="!bg-[#47CD89] !border-0"
        >Published</el-tag
      >
    </div>
    <div class="flex flex-col grow justify-between mt-6">
      <el-table
        :data="components.students"
        style="width: 100%"
        class="whiteStripe"
        row-class-name="noHover"
      >
        <el-table-column
          label="ID"
          min-width="150"
          max-width="220"
          show-overflow-tooltip
          align="left"
          prop="uid"
        />
        <el-table-column
          label="Grade"
          min-width="150"
          max-width="220"
          show-overflow-tooltip
          align="left"
          prop="score"
        >
          <template #default="{ row }">
            <div
              class="border-[#ABEFC6] py-1 px-3 bg-[#ECFDF3] rounded-[32px] inline-block text-[#067647] w-[60px] text-center"
            >
              {{ row.score }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="Last edited by"
          min-width="120"
          show-overflow-tooltip
          align="left"
        >
          <template #default="{ row }">
            {{ row.changed_by_json?.last_name || "" }}
            {{ row.changed_by_json?.first_name || "" }}
          </template>
        </el-table-column>
        <el-table-column
          width="300"
          align="center"
          prop="action"
          label="Actions"
        >
          <template #default="{ row }">
            <div
              class="flex items-center justify-center gap-2"
              v-if="!components?.published"
            >
              <el-button class="action-button" @click="onEditGrade(row)">
                <SvgIcon name="local-pen" size="22" />
              </el-button>

              <el-button
                class="action-button"
                @click="openRequestModal('remove', row.id)"
              >
                <SvgIcon name="local-trash" size="22" />
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <el-dialog v-model="showModal" :width="450" class="reset" title="Grade">
    <GradingFrom
      v-if="dialogType === 'grade'"
      :grade="currentGrade"
      :form-type="formType"
      :component="currentComponent?.name"
      :program="currentProgram?.program"
      @on-submit="changeGrade"
    />
    <div
      v-if="dialogType === 'import'"
      class="flex flex-col items-start space-y-4"
    >
      <AppUpload @upload="(data: any) => (file = data)" @remove="file = null" />
      <el-button type="success" size="large" @click="importTemplate"
        >Submit</el-button
      >
    </div>
  </el-dialog>
  <teleport to="#modal" v-if="openModal">
    <UpdateRequestDialog @on-submit="submitForm($event)" />
  </teleport>
</template>

<script setup lang="ts">
import { ArrowRight } from "@element-plus/icons-vue";
import GradingFrom from "./components/GradingForm.vue";
import { useCurriculumStore, useGuideStore, useGradeStore } from "@/stores";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { IStudentGrade, RequestTypeEnum } from "@/models/backend";
import AppUpload from "@/components/common/AppUpload.vue";
import { useI18n } from "vue-i18n";
import UpdateRequestDialog from "@/components/common/UpdateRequestDialog.vue";
import { useModal } from "@/composables";
const route = useRoute();
const i18n = useI18n();

const curriculumStore = useCurriculumStore();
const guideStore = useGuideStore();
const gradeStore = useGradeStore();

const components = computed(() => gradeStore.mainGradeList);
const formType = ref("edit");
const currentCurriculum = computed(() => curriculumStore.currentCurriculum);
const currentCourse = computed(() => curriculumStore.currentCourse);
const tuitions = computed(() => guideStore.tuitions);
const generalGrades: any = computed(() => gradeStore.generalGrades);
const isRetake = computed(() => !!route.query.retake);
const currentGrade = ref();
const currentComponent = ref();
const dialogType = ref<"import" | "grade">();
const modal = useModal();
const openModal = computed(() => modal.show.value);
const lmsIntegration = ref();
const currentProgram = ref();
const file = ref();
const showModal = ref(false);
const loading = ref(false);
const filter = reactive({
  component_id: route.params.component as string,
  assigned_course_id: route.params.grade as string,
  retake: isRetake.value,
});
const currentSingleId = ref();
const fetchList = () => {
  gradeStore.fetchMainComponents(filter);
};
const currentFormVal = ref();
onMounted(async () => {
  try {
    loading.value = true;
    await curriculumStore.getAssignCourseById(route.params.grade as string);
    await curriculumStore.getCurriculumById(route.params.curriculum as string);

    fetchList();

    if (tuitions.value.length === 0) await guideStore.fetchTuitions();
    if (gradeStore.generalGrades.grading?.length === 0)
      await gradeStore.fetchGeneralGrades(route.params.grade as string);

    currentProgram.value = tuitions.value.find(
      (tuition: any) => tuition.id === route.params.program
    );
    setCurrentComponent();
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error?.message);
  }
});
const currentType = ref<RequestTypeEnum>(RequestTypeEnum.course_grading_remove);
const setCurrentComponent = () => {
  if (isRetake.value) {
    currentComponent.value = generalGrades.value?.retake_grading?.find(
      (grade: any) => grade.id === route.params.component
    );
  } else {
    currentComponent.value = generalGrades.value?.grading?.find(
      (grade: any) => grade.id === route.params.component
    );
  }
};

const importTemplate = async () => {
  if (!file.value) {
    ElMessage({
      message: "Upload file",
      type: "error",
    });
  }
  try {
    loading.value = true;

    await gradeStore.importMainGradingSystem({
      file_id: file.value.id,
      component_id: route.params.component as string,
      assigned_course_id: route.params.grade as string,
      retake: isRetake.value,
      request: null,
    });
    await fetchList();
    showModal.value = false;
    ElMessage({
      message: "Data imported",
      type: "success",
    });
    loading.value = false;
  } catch (error: any) {
    console.log("error", error.message);
    loading.value = false;
  }
};

const publishGrade = () => {
  ElMessageBox.confirm(
    `This will close the "${currentComponent?.value?.name}" and you will not be able to edit the grades. Are you sure?`,
    "Warning",
    {
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      type: "warning",
    }
  )
    .then(async () => {
      try {
        loading.value = true;
        await gradeStore.publishGrade({
          component_id: route.params.component as string,
          assigned_course_id: route.params.grade as string,
          is_published: !components.value.published,
          retake: isRetake.value,
          request: null,
        });
        await fetchList();
        ElMessage({
          message: "Grade published",
          type: "success",
        });
        loading.value = false;
      } catch (error: any) {
        console.log("error", error.message);
        loading.value = false;
      }
    })
    .catch(() => {});
};

const onEditGrade = (grade: IStudentGrade) => {
  dialogType.value = "grade";
  formType.value = "edit";
  currentGrade.value = grade;
  showModal.value = true;
};
const onCreateGrade = () => {
  dialogType.value = "grade";
  formType.value = "create";
  showModal.value = true;
};
const openImportModal = () => {
  dialogType.value = "import";
  showModal.value = true;
};
const changeGrade = (data: any) => {
  currentFormVal.value = data;
  if (formType.value == "edit") {
    openRequestModal("edit", currentGrade.value.id);
  } else {
    openRequestModal("create");
  }
};
const openRequestModal = (type: any, id?: string) => {
  currentSingleId.value = id;
  if (type === "create") {
    currentType.value = RequestTypeEnum.course_grading_insert;
  } else if (type === "edit") {
    currentType.value = RequestTypeEnum.course_grading_edit;
  } else {
    currentType.value = RequestTypeEnum.course_grading_remove;
  }
  modal.setTitle(currentType.value);
  modal.setWidth("35vw");
  modal.showModal();
};
const deleteGrades = () => {
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
        await gradeStore.removeMainGrading({
          component_id: route.params.component as string,
          assigned_course_id: route.params.grade as string,
          retake: isRetake.value,
          request: null,
        });
        fetchList();
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
const submitForm = async (request: any) => {
  request.type = currentType.value;
  try {
    loading.value = true;
    if (request.type == RequestTypeEnum.course_grading_insert) {
      await gradeStore.createSingleGrade({
        ...filter,
        ...currentFormVal.value,
        request,
      });
      ElMessage({
        message: i18n.t("shared.created"),
        type: "success",
      });
    } else if (request.type == RequestTypeEnum.course_grading_edit) {
      await gradeStore.editSingleGrade({
        ...filter,
        id: currentSingleId.value,
        ...currentFormVal.value,
        request,
      });
      ElMessage({
        message: i18n.t("shared.updated"),
        type: "success",
      });
    } else {
      await gradeStore.removeSingleGrade({
        id: currentSingleId.value,
        request,
      });
      ElMessage({
        message: i18n.t("shared.deleteCompleted"),
        type: "success",
      });
    }
    showModal.value = false;
    modal.hideModal();
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
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
}
</style>
