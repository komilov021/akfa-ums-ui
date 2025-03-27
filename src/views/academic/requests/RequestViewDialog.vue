<template>
  <div v-loading="loading">
    <component :is="requestComponents[request.type]" :request="request" />
    <div class="mt-6">
      <div
        v-if="
          request.type == 'component_grade_import_with_excel' ||
          request.type == 'component_grade_remove'
        "
        class="grid grid-cols-1 mb-5"
      >
        <h1
          class="font-semibold mb-1"
          v-if="request.additional_data?.course_info?.title"
        >
          Course:
          <span class="font-normal">
            {{ request.additional_data.course_info.title }}
          </span>
        </h1>
        <h1
          class="font-semibold mb-1"
          v-if="request.additional_data?.component_info?.name"
        >
          Component:
          <span class="font-normal">
            {{ request.additional_data.component_info?.name }}
          </span>
        </h1>
        <h1 class="font-semibold mb-1" v-if="request.additional_data?.retake">
          Retake
        </h1>
      </div>
      <div v-if="request.type == 'grade_appeal_edit'">
        <h1 class="font-medium text-[#111928] mb-1">
          Confirmation text <span class="text-[#FF4444]"> * </span>
        </h1>
        <el-input
          v-model="requestComment"
          class="w-full"
          :disabled="request.status !== 0"
          :rows="6"
          type="textarea"
          label="Confirmation text *"
          placeholder="Type the confirmation"
        />
      </div>
      <div v-else>
        <h1 class="font-semibold mb-1">Explanation:</h1>
        <div class="input-wrapper h-28">
          {{ request.explanation }}
        </div>
      </div>
    </div>
    <a
      v-if="request.files?.length"
      @click="downloadFile(request.files[0].id)"
      class="underline truncate leading-normal cursor-pointer mt-4 block"
      >View attachment</a
    >
    <div class="mt-6">
      <div v-if="request.status == 0" class="flex justify-end gap-2">
        <el-button class="w-full" type="danger" plain @click="onUpdate(1)"
          ><span class="font-bold">Reject</span></el-button
        >
        <el-button class="w-full" type="success" plain @click="onUpdate(2)">
          <span class="font-bold"> Approve </span>
        </el-button>
      </div>
      <div v-else class="flex justify-center">
        <el-tag
          v-if="request.status == 2"
          class="w-1/3 !h-9"
          size="large"
          type="success"
          effect="dark"
          >Approved</el-tag
        >
        <el-tag
          v-if="request.status == 1"
          class="w-1/3 !h-9"
          size="large"
          type="danger"
          effect="dark"
          ><span> Rejected </span></el-tag
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RequestTypeEnum } from "@/models/backend";
import CourseGeneralRequest from "./components/CourseGeneralRequest.vue";
import CoursePrerequisitesRequest from "./components/CoursePrerequisitesRequest.vue";
import CourseGradingRequest from "./components/CourseGradingRequest.vue";
import CourseLeaderRequest from "./components/CourseLeaderRequest.vue";
import CourseGradeMainRequest from "./components/CourseGradeMainRequest.vue";
import CourseGradeScoreRequest from "./components/CourseGradeScoreRequest.vue";
import CourseGradeRetakeRequest from "./components/CourseGradeRetakeRequest.vue";
import CourseGradeComponentsRequest from "./components/CourseGradeComponentsRequest.vue";
import CourseLessonsRequest from "./components/CourseLessonsRequest.vue";
import AssignedSemester1Request from "./components/AssignedSemester1Request.vue";
import AssignedSemester2Request from "./components/AssignedSemester2Request.vue";
import AssignedSemester1RemoveRequest from "./components/AssignedSemester1RemoveRequest.vue";
import AssignedSemester2RemoveRequest from "./components/AssignedSemester2RemoveRequest.vue";
import AssignedStudentProgressionRequest from "./components/AssignedStudentProgressionRequest.vue";
import AssignedGradingCreditsRequest from "./components/AssignedGradingCreditsRequest.vue";
import AssignedRetakeGradingCreditsRequest from "./components/AssignedRetakeGradingCreditsRequest.vue";
import AssignedGradingLeaderRequest from "./components/AssignedGradingLeaderRequest.vue";
import AssignedCourseComponentEdit from "./components/AssignedCourseComponentEdit.vue";
import RPLInsert from "./components/RPLInsertRequest.vue";
import RPLEdit from "./components/RPLEditRequest.vue";
import RPLRemove from "./components/RPLRemoveRequest.vue";

import { useFileStore } from "@/stores";
import { onMounted, ref } from "vue";
import StudentStatusRequest from "./components/StudentStatusRequest.vue";
import TimetableGroupEdition from "./components/TimetableGroupEdition.vue";
import GroupStudentDelete from "./components/GroupStudentDelete.vue";
import AssignedCourseGradesPublish from "./components/AssignedCourseGradesPublish.vue";
import CourseAppealEditRequest from "./components/CourseAppealEditRequest.vue";
import { ElMessage } from "element-plus";
const props = defineProps<{
  request: any;
}>();
console.log(props.request, "data");
const requestComment = ref("");
const emit = defineEmits(["onSubmit"]);

const fileStore = useFileStore();

const loading = ref(false);

const requestComponents = {
  [RequestTypeEnum.course_general]: CourseGeneralRequest,
  [RequestTypeEnum.course_prerequisites]: CoursePrerequisitesRequest,
  [RequestTypeEnum.course_grading]: CourseGradingRequest,
  [RequestTypeEnum.course_course_leader]: CourseLeaderRequest,
  [RequestTypeEnum.course_grade_main]: CourseGradeMainRequest,
  [RequestTypeEnum.course_grade_retake]: CourseGradeRetakeRequest,
  [RequestTypeEnum.course_grade_components]: CourseGradeComponentsRequest,
  [RequestTypeEnum.course_lessons]: CourseLessonsRequest,
  [RequestTypeEnum.assigned_lessons]: CourseLessonsRequest,
  [RequestTypeEnum.grade_appeal_edit]: CourseAppealEditRequest,
  [RequestTypeEnum.course_grading_remove]: CourseGradeScoreRequest,
  [RequestTypeEnum.course_grading_insert]: CourseGradeScoreRequest,
  [RequestTypeEnum.course_grading_edit]: CourseGradeScoreRequest,
  [RequestTypeEnum.assigned_semester1]: AssignedSemester1Request,
  [RequestTypeEnum.assigned_semester2]: AssignedSemester2Request,
  [RequestTypeEnum.assigned_semester1_remove]: AssignedSemester1RemoveRequest,
  [RequestTypeEnum.assigned_semester2_remove]: AssignedSemester2RemoveRequest,
  [RequestTypeEnum.assigned_student_progression]:
    AssignedStudentProgressionRequest,
  [RequestTypeEnum.assigned_grading_credits]: AssignedGradingCreditsRequest,
  [RequestTypeEnum.assigned_retake_grading_credits]:
    AssignedRetakeGradingCreditsRequest,
  [RequestTypeEnum.assigned_grading_leader]: AssignedGradingLeaderRequest,
  [RequestTypeEnum.assigned_course_component_edit]: AssignedCourseComponentEdit,
  [RequestTypeEnum.rpl_insert]: RPLInsert,
  [RequestTypeEnum.rpl_edit]: RPLEdit,
  [RequestTypeEnum.rpl_remove]: RPLRemove,
  [RequestTypeEnum.student_status]: StudentStatusRequest,
  [RequestTypeEnum.group_edit]: TimetableGroupEdition,
  [RequestTypeEnum.student_from_group_remove]: GroupStudentDelete,
  [RequestTypeEnum.publish_component_course_edit]: AssignedCourseGradesPublish,
  [RequestTypeEnum.unpublish_component_course_edit]:
    AssignedCourseGradesPublish,
} as any;

const downloadFile = async (id: string) => {
  const data = await fileStore.downloadById(id);
  window.open(URL.createObjectURL(data));
};

const onUpdate = (status: number) => {
  const comment = requestComment.value ? requestComment.value : undefined;
  if (props.request.type == "grade_appeal_edit" && !comment) {
    ElMessage({
      message: "Please enter the confirmation text",
      type: "error",
    });
    return;
  }

  emit("onSubmit", {
    status,
    id: props.request.id,
    comment,
  });
};
onMounted(() => {
  if (props.request.status !== 0) {
    requestComment.value =
      props.request?.comment || "Confirmation text not available";
  }
});
</script>

<style scoped></style>
