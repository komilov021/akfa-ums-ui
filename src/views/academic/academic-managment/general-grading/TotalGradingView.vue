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
          {{ totalText }} grade
        </span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <h1 class="text-3xl font-semibold mt-2">
      {{ currentCourse?.title }} {{ currentCurriculum?.semester1 }} -
      {{ currentCurriculum?.semester2 }}
    </h1>
    <div class="flex items-center justify-between mt-2">
      <h1 class="font-semibold text-xl">{{ totalText }} grade</h1>
      <div class="flex items-center gap-2" v-if="!isPublished">
        <el-button type="danger" @click="deleteGrades">Delete</el-button>
        <el-button
          type="primary"
          @click="generateTotalGrade"
          v-if="!students.data.length"
          >Generate {{ totalText }} grade</el-button
        >
        <el-button
          type="primary"
          v-if="!gradeStore.total_grade_is_published"
          @click="publishGrade"
          >Publish</el-button
        >
      </div>
      <el-tag
        v-else
        effect="dark"
        @click="publishGrade"
        size="large"
        class="!bg-[#47CD89] !border-0"
        >Published</el-tag
      >
    </div>
    <div class="flex flex-col grow justify-between mt-6">
      <el-table
        :data="students.data"
        class="whiteStripe"
        row-class-name="noHover"
      >
        <el-table-column
          prop="student_uid"
          min-width="120"
          label="ID"
          align="left"
          show-overflow-tooltip
        />
        <el-table-column
          prop="student_name"
          min-width="160"
          label="Name"
          align="left"
          show-overflow-tooltip
        />
        <el-table-column min-width="80" label="Total" align="center">
          <template #default="scope">
            {{ formatNumber(scope.row.total_score) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="grade"
          min-width="70"
          label="Grade"
          align="center"
        />
        <el-table-column width="220" label="Score" align="left">
          <template #default="{ row }">
            <div class="flex flex-col leading-tight">
              <span v-for="score of row.scores" :key="score.component">
                {{ score.component }}:
                {{ score.score }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="gpa" min-width="70" label="GPA" align="center" />
        <el-table-column width="80" label="Status" align="center">
          <template #default="{ row }">
            <div class="flex flex-col leading-tight">
              <span>
                {{ row.is_failed ? "F" : "Pass" }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="150" label="Calculation type" align="center">
          <template #default="{ row }">
            <div class="flex flex-col leading-tight">
              {{ row.is_custom ? "Custom" : "Auto" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column width="80" align="center" prop="action" fixed="right">
          <template #default="scope">
            <el-dropdown
              trigger="click"
              class="flex justify-center white-card"
              @command="(command: any) => handleActionClick(command, scope.row)"
            >
              <el-button text>
                <MoreFilled class="h-4 w-4 rotate-90 dot-icon cursor-pointer" />
              </el-button>
              <template #dropdown>
                <el-dropdown-menu class="!p-1 space-y-1">
                  <el-dropdown-item
                    command="edit"
                    class="simple-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded"
                  >
                    <EditPen class="h-4 w-4 icon" />
                    <span>Update</span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    command="delete"
                    class="danger-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded"
                  >
                    <Delete class="h-4 w-4" />
                    <span>Delete</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="py-4">
        <el-divider />
        <el-pagination
          background
          @current-change="onPaginationChange"
          layout="prev, pager, next"
          next-text="Next ->"
          prev-text="<- Previous"
          :page-size="filter.limit"
          :total="students.total"
        />
      </div>
      <teleport to="#modal" v-if="showModal">
        <CourseGradeStudentForm
          :type="formType"
          :student="student"
          @on-submit="submitForm($event)"
        />
      </teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from "@element-plus/icons-vue";
import {
  useCurriculumStore,
  useGuideStore,
  useGradeStore,
  useCourseStudentsStore,
} from "@/stores";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import { useModal } from "@/composables";
import { IFunction } from "@/models/backend";
import CourseGradeStudentForm from "../../courses/components/CourseGradeStudentForm.vue";

const route = useRoute();
const i18n = useI18n();

const curriculumStore = useCurriculumStore();
const guideStore = useGuideStore();
const gradeStore = useGradeStore();
const courseStudentsStore = useCourseStudentsStore();
const students = computed(() => gradeStore.students);
const currentCurriculum = computed(() => curriculumStore.currentCurriculum);
const currentCourse = computed(() => curriculumStore.currentCourse);
const tuitions = computed(() => guideStore.tuitions);
const isRetake = computed(() => !!route.query.retake);
const isPublished = computed(() =>
  isRetake.value
    ? gradeStore.students.retake_grade_published
    : gradeStore.students.grade_published
);
const totalText = computed(() => (route.query.retake ? "Retake" : "Total"));

const currentProgram = ref();
const loading = ref(false);
const modal = useModal();
const showModal = computed(() => modal.show.value);
const student = ref();
const formType = ref<"edit">("edit");
const filter = reactive({
  page: 1,
  limit: 30,
  assigned_course_id: route.params.grade as string,
  retake: isRetake.value,
  student_uid: null,
});

const fetchList = () => {
  if (!filter.student_uid) filter.student_uid = null;
  gradeStore.fetchGradingStudents(filter);
};

const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};

const generateTotalGrade = async () => {
  try {
    loading.value = true;
    await gradeStore.generateTotalGrade({
      assigned_course_id: route.params.grade as string,
      retake: isRetake.value,
    });
    fetchList();
    ElMessage({
      message: "Calculated",
      type: "success",
    });
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error?.message);
  }
};

function formatNumber(number: number) {
  if (number === Math.floor(number)) {
    return number.toString();
  }
  const decimalPlaces = number.toString().split(".")[1];
  if (decimalPlaces && decimalPlaces.length <= 2) {
    return number.toFixed(decimalPlaces.length);
  }
  const truncatedNumber = Math.floor(number * 100) / 100;
  return truncatedNumber.toFixed(2);
}

onMounted(async () => {
  try {
    loading.value = true;
    await curriculumStore.getAssignCourseById(route.params.grade as string);
    await curriculumStore.getCurriculumById(route.params.curriculum as string);

    fetchList();

    if (tuitions.value.length === 0) await guideStore.fetchTuitions();
    if (gradeStore.generalGrades?.grading?.length === 0)
      await gradeStore.fetchGeneralGrades(route.params.grade as string);

    currentProgram.value = tuitions.value.find(
      (tuition: any) => tuition.id === route.params.program
    );
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error?.message);
  }
});

const publishGrade = () => {
  ElMessageBox.confirm(
    `This will close the "${totalText?.value} grade" and you will not be able to edit the grades. Are you sure?`,
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
        await gradeStore.publishTotalGrade({
          assigned_course_id: route.params.grade as string,
          retake: isRetake.value,
          is_published: !isPublished.value,
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

const openEditFormDialog = (row: any) => {
  student.value = row;
  formType.value = "edit";
  modal.setTitle(`Update Student (${row.student_name})`);
  modal.setWidth("50%");
  modal.showModal();
};
const handleActionClick = async (command: string, row: IFunction) => {
  if (command === "edit") {
    openEditFormDialog(row);
  }
  // if (command === "delete") {
  //   // deleteGrades(row);
  // }
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
        await gradeStore.removeTotalGrade({
          assigned_course_id: route.params.grade as string,
          retake: isRetake.value,
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

const submitForm = async (data: any) => {
  try {
    loading.value = true;
    data["id"] = student.value.id;
    await courseStudentsStore.editCourseStudentsGrading(data);
    ElMessage({
      message: i18n.t("shared.updated"),
      type: "success",
    });
    fetchList();
    loading.value = false;
    modal.hideModal();
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
