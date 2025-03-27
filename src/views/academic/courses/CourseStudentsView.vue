<template>
  <div class="flex justify-between items-center mb-4">
    <div class="flex items-center space-x-4">
      <el-button type="primary" @click="router.back()" link>
        <ArrowLeft class="h-4 w-4" /> Back
      </el-button>
      <h1 class="font-medium text-base">
        {{ currentCourse?.semester?.year }} {{ currentCourse?.semester?.name }}
        {{ currentCourse?.subject?.title }}
      </h1>
    </div>
    <div class="flex items-center gap-4">
      <el-input
        type="text"
        autocomplete="off"
        v-model="filter.student_uid"
        @keypress.enter="fetchStudents"
        size="large"
        class="w-48"
        placeholder="Search by ID"
      />
      <!-- <el-button type="primary" size="large" @click="removeCourseStudents">REMOVE ALL</el-button> -->
      <el-button type="primary" size="large" @click="generateGrade"
        >GENERATE TOTAL GRADE</el-button
      >
    </div>
  </div>
  <div class="table-wrapper" v-loading="loading">
    <el-table
      :data="students.data"
      :row-class-name="tableRowClassName"
      stripe
      :cell-style="customStyle"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="student_email"
        min-width="150"
        label="Email"
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
      <el-table-column
        prop="total_score"
        min-width="80"
        label="Total"
        align="center"
      />
      <el-table-column
        prop="grade"
        min-width="70"
        label="Grade"
        align="center"
      />
      <el-table-column width="220" label="Score" align="left">
        <template #default="{ row }">
          <div class="flex flex-col leading-tight">
            <span v-for="score of row.scores" :key="score.function_name">
              {{ score.function_name }}:
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
            @command="(command:any) => handleActionClick(command, scope.row)"
            class="flex justify-center white-card"
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
      <el-pagination
        background
        @current-change="onPaginationChange"
        layout="prev, pager, next"
        :page-size="students.limit"
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
</template>

<script setup lang="ts">
import { useCourseStudentsStore, useCoursesStore } from "@/stores";
import { onMounted, computed, ref, reactive, watch } from "vue";
import { ArrowLeft, Delete, EditPen, Finished } from "@element-plus/icons-vue";
import { useModal } from "@/composables";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import CourseGradeStudentForm from "./components/CourseGradeStudentForm.vue";
import type { IFunction } from "@/models/backend";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const modal = useModal();
const formType = ref<"edit">("edit");
const i18n = useI18n();
const courseStudentsStore = useCourseStudentsStore();
const coursesStore = useCoursesStore();

const showModal = computed(() => modal.show.value);
const loading = ref(false);
const currentCourse = computed(() => coursesStore.currentCourse);
const headers = computed(() => courseStudentsStore.headers);
const students = computed(() => courseStudentsStore.students);
const sameTotalScores = ref<any>([]);
const student = ref();
const scoreHeader = ref<any>([]);

const filter = reactive({
  page: 1,
  limit: 20,
  course_id: "",
  student_uid: null,
});

onMounted(() => {
  filter.course_id = route.params.id as string;
  coursesStore.getCourseById(route.params.id as string);
  fetchStudents();
});

const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchStudents();
};

const fetchStudents = () => {
  if (!filter.student_uid) filter.student_uid = null;
  courseStudentsStore.fetchCourseStudents(filter);
};

const generateGrade = async () => {
  try {
    loading.value = true;
    await courseStudentsStore.calculateGrade(route.params.id as string);
    loading.value = false;
    fetchStudents();
  } catch (error) {
    loading.value = false;
  }
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
  if (command === "delete") {
    confirmDelete(row);
  }
};

const tableRowClassName = ({ row }: { row: any }) => {
  if (row.is_failed) {
    return "failed-row noHover";
  }
  return "noHover";
};
const customStyle = ({ row, column }: { row: any; column: any }) => {
  const hasSame = students.value.data.filter(
    (x) => x.total_score === row.total_score
  );
  const filtered = sameTotalScores.value.filter(
    (x: any) => x.score === row.total_score
  );
  var max = 0xffffff;
  if (hasSame.length > 1 && filtered.length === 0) {
    sameTotalScores.value.push({
      score: row.total_score,
      color: "#" + Math.round(Math.random() * max).toString(16),
    });
  }
  if (filtered.length) {
    return { background: `${filtered[0].color} !important`, color: "black" };
  }
  return {};
};
const confirmDelete = (row: any) => {
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
        await courseStudentsStore.removeCourseSingleStudent({
          course_id: route.params.id as string,
          student_id: row.student_id,
        });
        fetchStudents();
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
const removeCourseStudents = () => {
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
        await courseStudentsStore.removeCourseStudents(
          route.params.id as string
        );
        fetchStudents();
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
    await courseStudentsStore.editCourseStudents(data);
    ElMessage({
      message: i18n.t("shared.updated"),
      type: "success",
    });
    // }
    // else {
    //   await useCourseStudentsStore.createGrade(data);
    //   ElMessage({
    //     message: i18n.t("shared.created"),
    //     type: "success",
    //   });
    // }
    fetchStudents();
    loading.value = false;
    modal.hideModal();
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
</script>

<style>
.el-table .failed-row td.el-table__cell {
  /* --el-table-tr-bg-color: rgba(209, 5, 12, 0.2) !important; */
  background: rgba(209, 5, 12, 0.2) !important;
}
</style>
