<template>
  <div class="flex justify-between flex-wrap items-center mb-4 gap-4">
    <div class="md:!w-72">
      <el-input
        :prefix-icon="Search"
        type="text"
        autocomplete="off"
        v-model="searchAll"
        @keypress.enter="fetchList"
        size="large"
        placeholder="Search for students"
      />
    </div>
    <div class="flex items-center gap-4">
      <el-select
        @change="fetchList"
        class="!w-60"
        :placeholder="`${$t('shared.select')} school`"
        size="large"
        v-model="filter.program_id"
      >
        <el-option
          v-for="(item, i) in [
            { value: 'none', label: 'All' },
            ...guideStore.getProgramsSelct,
          ]"
          :key="i"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        @change="fetchList"
        v-model="filter.acceptance_year"
        class="!w-60"
        placeholder="Academic year"
        size="large"
      >
        <el-option
          v-for="(item, i) in [
            { value: 'none', label: 'All' },
            ...examYearStore.getYearsSelct,
          ]"
          :key="i"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div class="">
        <el-select
          v-model="filter.student_status"
          @change="fetchList"
          class="!w-60"
          placeholder="Status"
          size="large"
        >
          <el-option
            v-for="(item, i) of [
              { value: 'none', label: 'All status' },
              ...status,
            ]"
            :key="i"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- <el-select
          v-model="filter.is_archived"
          @change="fetchList"
          class="w-full"
          placeholder="Active"
          size="large"
        >
          <el-option
            v-for="(item, i) in [
              { label: 'Archived', value: true },
              { label: 'Active', value: false },
            ]"
            :key="i"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->
      </div>
      <!-- '#9E9E9E' -->
      <div class="!w-20">
        <el-select
          v-model="filter.limit"
          @change="fetchList"
          class="w-full"
          :placeholder="$t('shared.select')"
          size="large"
        >
          <el-option
            v-for="item in [20, 40, 50, 70, 100]"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
      <el-button type="primary" size="large" @click="openFormDialog"
        >+ Add student</el-button
      >
    </div>
  </div>
  <div class="table-wrapper" v-loading="loading">
    <el-table
      :data="students.data"
      style="width: 100%"
      class="whiteStripe"
      row-class-name="cursor-pointer"
    >
      <!-- @row-click="rowClick" -->
      <el-table-column
        label="Full name"
        min-width="150"
        max-width="200"
        align="left"
      >
        <template #default="{ row }">
          <span>{{ row.first_name + " " + row.last_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Status"
        min-width="90"
        max-width="200"
        align="left"
      >
        <template #default="{ row }">
          <span
            class="flex items-center gap-2"
            v-if="row.student_status === 'active'"
          >
            <div
              class="w-3 h-3 rounded-full"
              :style="{
                backgroundColor: 'rgba(76, 175, 80, 0.15)',
                borderColor: '#4CAF50',
                borderWidth: '1px',
                borderStyle: 'solid',
              }"
            ></div>
            {{ "Active" }}
          </span>
          <span
            class="flex items-center gap-2"
            v-if="row.student_status === 'graduated'"
          >
            <div
              class="w-3 h-3 rounded-full"
              :style="{
                backgroundColor: 'rgba(63, 81, 181, 0.15)',
                borderColor: '#3F51B5',
                borderWidth: '1px',
                borderStyle: 'solid',
              }"
            ></div>
            {{ "Graduated" }}
          </span>
          <span
            class="flex items-center gap-2"
            v-if="row.student_status === 'ala'"
          >
            <div
              class="w-3 h-3 rounded-full"
              :style="{
                backgroundColor: 'rgba(158, 158, 158, 0.15)',
                borderColor: '#9E9E9E',
                borderWidth: '1px',
                borderStyle: 'solid',
              }"
            ></div>
            {{ "ALA" }}
          </span>
          <span
            class="flex items-center gap-2"
            v-if="row.student_status === 'withdrawn'"
          >
            <div
              class="w-3 h-3 rounded-full"
              :style="{
                backgroundColor: 'rgba(163, 39, 29, 0.15)',
                borderColor: '#a3271d',
                borderWidth: '1px',
                borderStyle: 'solid',
              }"
            ></div>
            {{ "Withdrawn" }}
          </span>
          <span
            class="flex items-center gap-2"
            v-if="row.student_status === 'restricted'"
          >
            <div
              class="w-3 h-3 rounded-full"
              :style="{
                backgroundColor: 'rgba(244, 67, 54, 0.15)',
                borderColor: '#F44336',
                borderWidth: '1px',
                borderStyle: 'solid',
              }"
            ></div>
            {{ "Restricted" }}
          </span>
          <span
            class="flex items-center gap-2"
            v-if="row.student_status == null"
          >
            {{ "-" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="ID and email"
        min-width="150"
        max-width="200"
        align="left"
      >
        <template #default="{ row }">
          <p>{{ row.uid }}</p>
          <p>{{ row.email }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="Department"
        min-width="150"
        max-width="200"
        align="left"
      >
        <template #default="{ row }">
          <span>{{ row.program?.name || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="acceptance_year"
        label="Enrolled year"
        min-width="100"
        align="left"
      />
      <el-table-column
        prop="phone"
        label="Phone"
        min-width="90"
        max-width="160"
        align="left"
      />
      <!-- <el-table-column
        label="Archived"
        min-width="100"
        max-width="200"
        align="center"
        prop="is_archive"
      >
        <template #default="{ row }">
          <el-switch
            v-model="row.is_archived"
            @change="(status: any) => checkChange(status, row.uid)"
            class="ml-2"
            style="--el-switch-off-color: #13ce66; --el-switch-on-color: #ff4949"
          />
        </template>
      </el-table-column> -->
      <el-table-column width="120" align="center" prop="action">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-button
              @click="
                router.push({
                  name: 'reference-student-edit',
                  params: { id: row.id },
                })
              "
              class="action-button"
            >
              <SvgIcon name="local-pen-simple" size="23" />
            </el-button>
            <!-- <el-button @click="confirmDelete(row.id)" class="action-button">
              <SvgIcon name="local-trash" size="23" />
            </el-button> -->
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="py-4">
      <el-pagination
        background
        v-if="filter.limit < students.total"
        @current-change="onPaginationChange"
        layout="prev, pager, next"
        next-text="Next ->"
        prev-text="<- Previous"
        :page-size="filter.limit"
        :total="students.total"
      />
    </div>
    <teleport to="#modal" v-if="showModal">
      <CoursesForm
        :type="formType"
        :student="student"
        :years="examYearStore.getYearsSelct"
        :programs="guideStore.getProgramsSelct"
        :country="studentsStore.getCountryList"
        @on-submit="submitForm($event)"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import {
  useGuideStore,
  useStudentsStore,
  useAcademicStore,
  useFinanceStore,
} from "@/stores";
import { onMounted, computed, ref, reactive } from "vue";
import { Search, View } from "@element-plus/icons-vue";
import { useModal } from "@/composables";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import CoursesForm from "./components/StudentsForm.vue";
import type { IStudent } from "@/models/backend";
import { useRouter } from "vue-router";
import { number } from "echarts/core";

const router = useRouter();
const modal = useModal();
const formType = ref<"create" | "edit">("create");
const i18n = useI18n();

const guideStore = useGuideStore();
const studentsStore = useStudentsStore();
const examYearStore = useAcademicStore();
const financeStore = useFinanceStore();
const showModal = computed(() => modal.show.value);
const loading = ref(false);
const studentTutionFeePayments = computed(
  () => studentsStore.paymentStudentFee
);
const students = computed(() => studentsStore.students);
const student = computed(() => studentsStore.currentStudent);
// const country = computed(() => studentsStore.country);
const filter = reactive({
  page: 1,
  limit: 20,
  acceptance_year: undefined,
  program_id: undefined,
  phone: "",
  search: undefined as any,
  uid: null,
  email: null,
  is_archived: null as any,
  semester_id: undefined,
  status: undefined,
  level: undefined,
  student_uid: null as any,
  student_status: undefined,
});
const searchAll: any = ref("");
let status: { value: string; label: string; color: string }[] = [
  {
    label: "Active",
    value: "active",
    color: "#4CAF50",
  },
  {
    label: "Graduated",
    value: "graduated",
    color: "#3F51B5",
  },
  {
    label: "ALA (Academic Leave of Absence)",
    value: "ala",
    color: "#9E9E9E",
  },
  {
    label: "Withdrawn",
    value: "withdrawn",
    color: "#D32F2F",
  },
  {
    label: "Restricted",
    value: "restricted",
    color: "#F44336",
  },
];

// const checkChange = async (is_archived: boolean, uid: any) => {
//   try {
//     loading.value = true;
//     await studentsStore.toggleArchivedStudent({
//       uid,
//       is_archived,
//     });
//     loading.value = false;
//     if (is_archived == true) {
//       ElMessage.success(i18n.t("shared.archived"));
//     } else {
//       ElMessage.success(i18n.t("shared.unarchived"));
//     }
//     fetchList();
//   } catch (e) {
//     loading.value = false;
//     console.log(e);
//   }
// };
onMounted(() => {
  if (!guideStore.getProgramsSelct.length) {
    guideStore.fetchPrograms();
  }
  ``;
  if (!examYearStore.getSemestrsSelct.length) {
    examYearStore.fetchExamYears();
  }

  fetchList();
});
function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
const fetchList = () => {
  filter.acceptance_year =
    filter.acceptance_year === "none" ? undefined : filter.acceptance_year;
  filter.program_id =
    filter.program_id === "none" ? undefined : filter.program_id;
  if (isNumeric(searchAll.value)) {
    filter.uid = searchAll.value;
    filter.search = undefined;
  } else {
    filter.search = searchAll.value ? searchAll.value : undefined;
    filter.uid = null;
  }
  filter.program_id =
    filter.program_id === "none" ? undefined : filter.program_id;
  filter.semester_id =
    filter.semester_id === "none" ? undefined : filter.semester_id;
  filter.level = filter.level === "All study years" ? undefined : filter.level;
  filter.student_status =
    filter.student_status === "none" ? undefined : filter.student_status;
  if (filter.student_uid !== null) {
    filter.student_uid = parseInt(filter.student_uid);
  }

  studentsStore.fetchStudents(filter);
  financeStore.fetchPaymentsList(filter);
  studentsStore.fetchCountryList();
};
const rowClick = (row: any, column: any) => {
  if (column.property !== "action") {
    router.push({
      name: "reference-student-edit",
      params: { id: row.id },
    });
  }
};
const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};

const openFormDialog = () => {
  formType.value = "create";
  modal.setTitle("Add Student");
  modal.setWidth("60%");
  modal.showModal();
};

const openEditFormDialog = async (id: string) => {
  await studentsStore.getStudentById(id);
  formType.value = "edit";
  modal.setTitle("Update Student");
  modal.setWidth("60%");
  modal.showModal();
};

const confirmDelete = (id: string) => {
  router.push("");
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
        await studentsStore.removeStudent({ id: id });
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

const handleActionClick = async (command: string, row: IStudent) => {
  if (command === "edit") {
    await openEditFormDialog(row.id);
  }
  if (command === "delete") {
    confirmDelete(row.id);
  }
  if (command === "functions") {
    router.push({ name: "course-functions", params: { id: row.id } });
  }
  if (command === "student") {
    router.push({ name: "student", params: { id: row.id } });
  }
  if (command === "courses") {
    router.push({ name: "student-courses", params: { id: row.id } });
  }
  if (command === "transcript") {
    router.push({ name: "student-transcript", params: { id: row.id } });
  }
};

const submitForm = async (data: any) => {
  try {
    loading.value = true;
    if (formType.value === "edit" && student.value) {
      await studentsStore.editStudent(data);
      ElMessage({
        message: i18n.t("shared.updated"),
        type: "success",
      });
    } else {
      await studentsStore.createStudent(data);
      ElMessage({
        message: i18n.t("shared.created"),
        type: "success",
      });
    }
    fetchList();
    loading.value = false;
    modal.hideModal();
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
</script>

<style scoped></style>
