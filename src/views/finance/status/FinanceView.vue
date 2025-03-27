<template>
  <div class="px-4">
    <div class="mb-6 grid grid-cols-2">
      <StudentPayment
        v-if="financeMetrics"
        @update="paymentUpdate"
        :financeMetrics="financeMetrics"
      />
      <div v-else>
        <el-skeleton :rows="3" animated />
      </div>
    </div>
    <template
      v-if="
        paymentList.total === 0 &&
        filter.semester_id == undefined &&
        filter.program_id == undefined &&
        filter.status == undefined &&
        filter.level === undefined &&
        filter.uid === undefined
      "
    >
      <fileImport></fileImport>
    </template>
    <template v-else>
      <div class="w-full flex justify-between">
        <div class="flex items-center">
          <el-input
            class="!w-60 m-2"
            size="large"
            v-model="filter.uid"
            placeholder="Search by ID"
            :suffix-icon="Search"
            @keyup.enter="filter?.uid ? fetchList() : ''"
          />
          <el-input
            class="!w-60 m-2"
            size="large"
            v-model="filter.full_name"
            placeholder="Search by name"
            :suffix-icon="Search"
            @keyup.enter="filter?.full_name ? fetchList() : ''"
          />
          <el-button
            type="primary"
            @click="filter.uid || filter?.full_name ? fetchList() : ''"
          >
            Search
          </el-button>
          <el-button
            @click="
              ((filter.uid = null), (filter.full_name = null)), fetchList()
            "
          >
            Reset
          </el-button>
        </div>
        <div class="flex items-center gap-4">
          <!-- <el-popover
            placement="bottom"
            :visible="popoverRef"
            :width="249"
            :height="271"
            trigger="click"
          >
            <template #reference>
              <el-button
                size="large"
                @click="popoverRef = !popoverRef"
                :type="popoverRef ? 'primary' : ''"
              >
                <svg
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  class="stroke-current fill-transparent"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 4L13 4M13 4C13 5.65686 14.3431 7 16 7C17.6569 7 19 5.65685 19 4C19 2.34315 17.6569 1 16 1C14.3431 1 13 2.34315 13 4ZM7 12L19 12M7 12C7 13.6569 5.65685 15 4 15C2.34315 15 1 13.6569 1 12C1 10.3431 2.34315 9 4 9C5.65685 9 7 10.3431 7 12Z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </el-button>
            </template>
<el-form ref="ruleFormRef" label-position="top" require-asterisk-position="right">
  <div class="grid sm:grid-cols-1">
    <el-form-item label="Choose year">
      <el-select class="w-full" placeholder="Select" v-model="filter.level">
        <el-option v-for="item in ['All study years', 1, 2, 3, 4, 5]" :key="item" :label="item" :value="item" />
      </el-select>
    </el-form-item>
    <el-form-item label="Choose Program">
      <el-select class="w-full" placeholder="Select" v-model="filter.program_id">
        <el-option v-for="(item, i) in [
                        { value: 'none', label: 'All programs' },
                        ...guideStore.getProgramsSelct,
                      ]" :key="i" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="Choose statutes">
      <el-select class="w-full" placeholder="Select" v-model="filter.status">
        <el-option v-for="item in [
                        { label: 'All statuses', value: 'none' },
                        { label: 'Waiting', value: 'waiting' },
                        { label: 'Paid', value: 'paid' },
                        { label: 'Debt', value: 'debt' },
                      ]" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="Choose semester">
      <el-select class="w-full" placeholder="Select" v-model="filter.semester_id">
        <el-option v-for="item in [
                        { value: 'none', label: 'All semesters' },
                        ...ExamDatesStore.getSemestrsSelct,
                      ]" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-button type="primary" @click="fetchList">
      Submit
    </el-button>
  </div>
</el-form>
</el-popover> -->
          <el-button size="large" @click="showModal()">
            <svg
              width="24"
              height="24"
              class="mr-3"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 21V15M16 18H22M22 10H2M22 12V8.2C22 7.0799 22 6.51984 21.782 6.09202C21.5903 5.7157 21.2843 5.40974 20.908 5.21799C20.4802 5 19.9201 5 18.8 5H5.2C4.0799 5 3.51984 5 3.09202 5.21799C2.7157 5.40973 2.40973 5.71569 2.21799 6.09202C2 6.51984 2 7.0799 2 8.2V15.8C2 16.9201 2 17.4802 2.21799 17.908C2.40973 18.2843 2.71569 18.5903 3.09202 18.782C3.51984 19 4.0799 19 5.2 19H12"
                stroke="#667085"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Add payment
          </el-button>
          <el-select
            v-model="filter.is_blocked"
            @change="fetchList"
            placeholder="All"
            size="large"
            class="!w-[110px]"
          >
            <el-option
              v-for="(item, i) in [
                { label: 'All', value: 'none' },
                { label: 'Blocked', value: true },
                { label: 'Active', value: false },
              ]"
              :key="i"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button @click="allExport" size="large">Export</el-button>
          <el-button
            @click="showPaymentModal = true"
            size="large"
            class="!font-semibold"
          >
            <exel-icon class="mr-2"></exel-icon>
            Import
          </el-button>
          <!-- <el-button size="large" class="!font-semibold">
            <exel-icon class="mr-2"></exel-icon>
            Export
          </el-button> -->
        </div>
      </div>
      <div class="mt-9">
        <div class="table-wrapper mt-8" v-loading="loading">
          <el-table
            :data="paymentList.data"
            style="width: 100%; min-height: 82vh"
            :header-cell-style="{ verticalAlign: 'bottom' }"
            class="simpleBorderTable"
          >
            <el-table-column
              prop="student_uid"
              label="ID and Email"
              min-width="200"
              align="left"
              fixed="left"
            >
              <template #default="{ row }">
                <p>
                  {{ row.uid }}
                </p>
                <p>{{ row.uid }}@centralasian.uz</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="full_name"
              label="Full name"
              min-width="220"
              align="left"
            >
              <template #default="{ row }">
                <p class="text-[#101828] font-medium">
                  {{ row.full_name }}
                </p>
              </template>
            </el-table-column>

            <el-table-column label="Total debt" min-width="160" align="left">
              <template #default="{ row }">
                {{ beautify.formatNumber(row.debt) }}
              </template>
            </el-table-column>

            <el-table-column label="Over pay" min-width="160" align="left">
              <template #default="{ row }">
                {{ beautify.formatNumber(row.over_pay) }}
              </template>
            </el-table-column>

            <el-table-column label="Extra debt" min-width="160" align="left">
              <template #default="{ row }">
                {{ beautify.formatNumber(row.extra_debt) }}
              </template>
            </el-table-column>

            <el-table-column prop="currency" label="Currency" min-width="120" />

            <el-table-column label="FALL" align="center">
              <el-table-column
                prop="semester1"
                label="Semester"
                min-width="120"
              />
              <el-table-column
                prop="semester1_contract"
                label="Contract"
                min-width="120"
              >
                <template #default="{ row }">
                  {{ beautify.formatNumber(row.semester1_contract) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="semester1_paid"
                label="Paid"
                min-width="120"
              >
                <template #default="{ row }">
                  {{ beautify.formatNumber(row.semester1_paid) }}
                </template>
              </el-table-column>
              <el-table-column
                v-for="(item, i) in uniqueCriteriaFall"
                :key="i"
                :label="item"
                min-width="140"
                align="left"
              >
                <template #default="{ row }">
                  <p>
                    {{
                      row.semester1_criteria?.filter(
                        (x: any) => x.criteria == item
                      )?.[0]?.percentage || 0
                    }}%
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                prop="semester1_distribution"
                label="Distribution"
                min-width="150"
              >
                <template #default="{ row }">
                  {{
                    row.semester1_distribution
                      ? row.semester1_distribution.criteria +
                        " - " +
                        row.semester1_distribution.percentage +
                        " %"
                      : "-"
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="semester1_scholarship"
                label="Scholarship"
                min-width="120"
              >
                <template #default="{ row }">
                  {{
                    row.semester1_scholarship
                      ? row.semester1_scholarship + " %"
                      : "-"
                  }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="SPRING" align="center">
              <el-table-column
                prop="semester2"
                label="Semester"
                min-width="120"
              />
              <el-table-column
                prop="semester2_contract"
                label="Contract"
                min-width="120"
              >
                <template #default="{ row }">
                  {{ beautify.formatNumber(row.semester2_contract) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="semester2_paid"
                label="Paid"
                min-width="120"
              >
                <template #default="{ row }">
                  {{ beautify.formatNumber(row.semester2_paid) }}
                </template>
              </el-table-column>
              <el-table-column
                v-for="(item, i) in uniqueCriteriaSpring"
                :key="i"
                :label="item"
                min-width="140"
                align="left"
              >
                <template #default="{ row }">
                  <p>
                    {{
                      row.semester2_criteria?.filter(
                        (x: any) => x.criteria == item
                      )?.[0]?.percentage || 0
                    }}%
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                prop="semester2_distribution"
                label="Distribution"
                min-width="150"
              >
                <template #default="{ row }">
                  {{
                    row.semester2_distribution
                      ? row.semester2_distribution.criteria +
                        " - " +
                        row.semester2_distribution.percentage +
                        " %"
                      : "-"
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="semester2_scholarship"
                label="Scholarship"
                min-width="120"
              >
                <template #default="{ row }">
                  {{
                    row.semester2_scholarship
                      ? row.semester2_scholarship + " %"
                      : "-"
                  }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              label="Actions"
              min-width="120"
              align="center"
              fixed="right"
            >
              <template #default="scope">
                <div class="flex items-center">
                  <el-button class="!px-2" @click="view(scope.row)">
                    <View class="h-5 w-5" color="#0D0D0D" />
                  </el-button>
                  <el-button class="!px-2" @click="toggleLock(scope.row)">
                    <template v-if="scope.row.is_blocked">
                      <Lock class="h-5 w-5" color="#0D0D0D" />
                    </template>
                    <template v-else>
                      <Unlock class="h-5 w-5" color="#0D0D0D" />
                    </template>
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <hr class="mt-10" />
        <div class="py-3 px-6 flex items-center justify-between">
          <el-button class="!w-24">
            <ArrowLeft class="w-5 h-5 ml-[-3px]"></ArrowLeft>
            Previous
          </el-button>
          <el-pagination
            background
            @current-change="onPaginationChange"
            layout="prev, pager, next"
            :page-size="filter.limit"
            :total="paymentList.total"
          />
          <el-button class="!w-20">
            Next
            <ArrowRight class="h-5 w-5 mr-[-5px]"></ArrowRight>
          </el-button>
        </div>
      </div>
    </template>
    <el-dialog v-model="showStudentModal" :width="396" class="reset">
      <studentForm
        v-if="showStudentModal"
        @on-update="showStudentModal = false"
        :semesters="ExamDatesStore.getSemestrsSelct"
        @on-submit="submitForm($event)"
      />
    </el-dialog>
    <el-dialog
      v-model="showPaymentModal"
      title="Import payments"
      :width="350"
      class="reset"
    >
      <importPayment @on-update="closeImport" />
    </el-dialog>
    <el-dialog
      v-if="studentTutionFeePayments"
      v-model="paymentHistoryModal"
      title="Payment history"
      width="70vw"
      class="reset"
      @update:visible="handleModalVisibleChange"
    >
      <div class="flex justify-between items-end mb-4">
        <h1 class="text-lg font-medium">{{ student?.full_name }}</h1>
        <div class="flex items-center space-x-2">
          <el-select
            v-model="certificateYear1"
            placeholder="First year"
            @change="handleYear1Change(student.id)"
            class="!w-[100px]"
          >
            <el-option
              v-for="year in yearRange"
              :key="year"
              :label="year.toString()"
              :value="year"
            />
          </el-select>
          <el-select
            v-model="certificateYear2"
            placeholder="Last year"
            @change="handleYear2Change(student.id)"
            class="!w-[100px]"
          >
            <el-option
              v-for="year in filteredYearRange"
              :key="year"
              :label="year.toString()"
              :value="year"
            >
            </el-option>
          </el-select>
          <el-button type="primary" @click="Download(student.id)"
            >Download</el-button
          >
        </div>
      </div>
      <div class="table-wrapper mt-2" v-loading="loading">
        <el-table
          :data="studentTutionFeePayments?.payments"
          style="width: 100%"
          class="whiteStripe"
          :header-cell-style="{ verticalAlign: 'bottom' }"
          :key="tableKey"
        >
          <el-table-column min-width="50" prop="id" align="center">
            <template #default="{ row }">
              <el-checkbox
                :checked="isChecked(row.id)"
                @change="() => handleCheckboxChange(row.id)"
              />
            </template>
          </el-table-column>

          <el-table-column prop="sum" label="Paid" width="200" align="center">
            <template #default="{ row }">
              {{
                row.amount?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
              }}
              {{ row.currency }}
            </template>
          </el-table-column>
          <el-table-column prop="debt" label="Debt" width="250" align="center">
            <template #default="{ row }">
              {{
                row.dept?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
              }}
              {{ row.currency }}
            </template>
          </el-table-column>
          <el-table-column
            prop="deadline"
            label="Payment deadline"
            min-width="150"
            align="left"
          >
            <template #default="{ row }">
              <div class="flex items-center gap-2">
                {{ dayjs(row.payment_date).format("DD/MM/YYYY") }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="Record create time"
            min-width="150"
            align="left"
          >
            <template #default="{ row }">
              {{ dayjs(row.created_at).format("DD/MM/YYYY HH:MM") }}
            </template>
          </el-table-column>
          <el-table-column
            prop="transaction_name"
            label="Transaction name"
            width="250"
            align="center"
          >
            <template #default="{ row }">
              {{ row.transaction_company_name || "-" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="transaction_number"
            label="Transaction number"
            width="150"
            align="center"
          >
            <template #default="{ row }">
              {{ row.transaction_number || "-" }}
            </template>
          </el-table-column>
        </el-table>
        <div class="flex justify-end mt-4">
          <el-button type="primary" @click="openPayment()"
            >Open profile</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import {
  Search,
  View,
  ArrowLeft,
  ArrowRight,
  Lock,
  Unlock,
} from "@element-plus/icons-vue";
import {
  useFinanceStore,
  useAcademicStore,
  useGuideStore,
  useStudentsStore,
  useStatisticsStore,
  useFileStore,
} from "@/stores";
import fileImport from "./components/fileImport.vue";

import ExelIcon from "@/components/icons/ExelIcon.vue";
import importPayment from "../history/components/importPayment.vue";
import studentForm from "../history/components/historyForm.vue";
import { ElMessage, ElMessageBox, dayjs } from "element-plus";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useBeautify } from "@/composables/useBeautify";
import { saveFile } from "@/utils/common";
// import StudentPayment from "@/views/dashboard/components/students/StudentPayment.vue";
const i18n = useI18n();
const router = useRouter();
const financeStore = useFinanceStore();
const ExamDatesStore = useAcademicStore();
const studentsStore = useStudentsStore();
const fileStore = useFileStore();
const guideStore = useGuideStore();
const statisticsStore = useStatisticsStore();
const beautify = useBeautify();
const popoverRef = ref();
const showStudentModal = ref(false);
const showPaymentModal = ref(false);
const paymentHistoryModal = ref(false);
const loading = ref(false);
const showSelect = ref(false);
const isModalVisible = ref(false);
const student = ref();
const checkId = ref<number[]>([]);
const selectAll = ref(false);
const tableKey = ref(0);
const examSemesters = computed(() => ExamDatesStore.semestrs);
const paymentList = computed(() => financeStore.payments);
const paymentByStudent = computed(() => financeStore.paymentStudent);
const financeMetrics = computed(() => statisticsStore.financeMetrics);
const studentTutionFeePayments = computed<StudentTutionFeePayments | null>(
  () => studentsStore.paymentStudentFee
);
const certificateYear1 = ref<any | null>(null);
const certificateYear2 = ref<any | null>(null);

const defaultYear1 = ref<number>(0);
const defaultYear2 = ref<number>(0);
interface Payment {
  id: number;
  amount: number;
  currency: string;
  debt: number;
  payment_date: string;
  created_at: string;
}
interface StudentTutionFeePayments {
  payments: Payment[];
  first_year: number;
  last_year: number;
  debt: number;
}
interface Criteria {
  criteria: string;
  percentage: number;
}
const uniqueCriteriaFall = computed((): string[] => {
  const criteriaSet = new Set<string>();
  paymentList.value.data.forEach((student: any) => {
    if (student.semester1_criteria) {
      student.semester1_criteria.forEach((criteria: Criteria) => {
        criteriaSet.add(criteria.criteria);
      });
    }
  });
  return Array.from(criteriaSet);
});
const uniqueCriteriaSpring = computed((): string[] => {
  const criteriaSet = new Set<string>();
  paymentList.value.data.forEach((student: any) => {
    if (student.semester2_criteria) {
      student.semester2_criteria.forEach((criteria: Criteria) => {
        criteriaSet.add(criteria.criteria);
      });
    }
  });
  return Array.from(criteriaSet);
});
const formType = ref<"create" | "edit">("create");

const filter = reactive({
  semester_id: undefined,
  status: undefined,
  level: undefined,
  program_id: undefined,
  uid: null as any,
  is_blocked: null as any,
  full_name: null as any,
  limit: 20,
  page: 1,
});
const gpaPaymentFilter = ref({
  level: undefined,
  custom_rate: null as any,
  school_id: null as any,
});

onMounted(async () => {
  fetchList();
  if (!ExamDatesStore.getSemestrsSelct.length) {
    ExamDatesStore.fetchSemestr();
  }
  if (!ExamDatesStore.getYearsSelct.length) {
    ExamDatesStore.fetchExamYears();
  }
  if (!guideStore.getProgramsSelct.length) {
    guideStore.fetchPrograms();
  }
  statisticsStore.fetchFinance();
});
const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};
const allExport = async () => {
  try {
    loading.value = true;
    await financeStore.fetchFinanceExportList();
    const data = await fileStore.downloadById(financeStore.allExport?.id);
    saveFile(data, financeStore.allExport?.name);
    ElMessage({
      message: i18n.t("shared.download"),
      type: "success",
    });
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    ElMessage({
      message: i18n.t("shared.warning"),
      type: "error",
    });
    console.log("error", error.message);
  }
};
const fetchList = async () => {
  try {
    loading.value = true;
    filter.is_blocked =
      filter.is_blocked === "none" ? undefined : filter.is_blocked;
    filter.program_id =
      filter.program_id === "none" ? undefined : filter.program_id;
    filter.semester_id =
      filter.semester_id === "none" ? undefined : filter.semester_id;
    filter.level =
      filter.level === "All study years" ? undefined : filter.level;
    filter.status = filter.status === "none" ? undefined : filter.status;
    if (filter.uid !== null) {
      filter.uid = parseInt(filter.uid);
    }
    await financeStore.fetchFinanceList(filter);
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error?.message);
  }
};

const showModal = (data?: any) => {
  if (data) {
    formType.value = "edit";
    student.value = data;
  } else {
    student.value = null;
  }

  showStudentModal.value = true;
};

const showBlocked = (data?: any) => {
  if (data.is_blocked) {
    data.is_blocked = true;
    formType.value = "edit";
    student.value = data;
    showStudentModal.value = true;
  }
};
const paymentUpdate = (params: any) => {
  if (params.range !== undefined || params.range.length !== 0) {
    gpaPaymentFilter.value.custom_rate = parseInt(params.range);
  }
  if (params.level !== undefined) {
    gpaPaymentFilter.value.level = params.level;
  }
  if (params.school_id !== undefined) {
    gpaPaymentFilter.value.school_id = params.school_id;
  }
  statisticsStore.fetchFinance(gpaPaymentFilter.value);
};
const closeImport = () => {
  fetchList();
  showPaymentModal.value = false;
};

const view = async (data: any) => {
  // financeStore.fetchPaymentByStudent({ student_id: id });
  student.value = data;
  await studentsStore.tutionFeeStudents({ student_id: data.id });
  checkId.value = [];
  tableKey.value += 1;
  if (studentTutionFeePayments.value) {
    certificateYear1.value = studentTutionFeePayments.value?.first_year;
    certificateYear2.value = studentTutionFeePayments.value?.last_year;
    defaultYear1.value = studentTutionFeePayments.value?.first_year;
    defaultYear2.value = studentTutionFeePayments.value?.last_year;
  }
  paymentHistoryModal.value = true;
  showSelect.value = false;
  // router.push({
  //   path: "/academic/reference/student/" + id,
  //   query: { payment: "payment" },
  // });
};
function handleModalVisibleChange(visible: boolean) {
  if (!visible) {
    checkId.value = [];
    selectAll.value = false;
    tableKey.value += 1;
  }
}
watch(paymentHistoryModal, (newValue) => {
  if (newValue) {
    checkId.value = [];
    tableKey.value += 1;
  }
});
const toggleLock = async (student: any) => {
  const action = student.is_blocked ? "unblock" : "block";
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to ${action} this student?`,
      "Warning",
      {
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        type: "warning",
      }
    );
    const newStatus = !student.is_blocked;
    await studentsStore.fetchStudentBlockStatus({
      id: student.id,
      is_blocked: newStatus,
    });
    student.is_blocked = newStatus;
    ElMessage({
      message: student.is_blocked
        ? "Student successfully blocked"
        : "Student successfully unblocked",
      type: "success",
    });
  } catch (error) {
    console.log("error", error);
  }
};

const openPayment = () => {
  router.push({
    path: "/academic/reference/student/" + student.value.id,
    query: { payment: "payment" },
  });
};

const submitForm = async (data: any) => {
  try {
    loading.value = true;
    await financeStore.createPaymentHistory(data);
    ElMessage({
      message: i18n.t("shared.created"),
      type: "success",
    });

    fetchList();
    showStudentModal.value = false;
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
const Download = async (id: any) => {
  try {
    loading.value = true;
    const certificate =
      (await studentsStore.StudentFinanceCertificateFileDownload({
        student_id: id as string,
        payment_ids: checkId.value.length == 0 ? [] : checkId.value,
      })) as any;
    showSelect.value = false;
    paymentHistoryModal.value = false;
    const data = await fileStore.downloadById(certificate?.id);
    saveFile(data, certificate.name || "FileName.pdf");
    showSelect.value = false;
    paymentHistoryModal.value = false;
    loading.value = false;
  } catch (error: any) {
    console.log("error", error?.message);
    loading.value = false;
  }
};

function isChecked(id: number): boolean {
  return checkId.value.includes(id);
}
const allPaymentsSelected = computed<boolean>(() => {
  const payments = studentTutionFeePayments.value?.payments || [];
  return payments.length > 0 && payments.length === checkId.value.length;
});
function handleCheckboxChange(id: number) {
  if (checkId.value.includes(id)) {
    checkId.value = checkId.value.filter((selectedId) => selectedId !== id);
  } else {
    checkId.value.push(id);
  }
  selectAll.value = allPaymentsSelected.value;
}

const yearRange = computed(() => {
  const years: number[] = [];
  if (studentTutionFeePayments?.value) {
    for (let year = defaultYear1.value; year < defaultYear2.value; year++) {
      years.push(year);
    }
  }
  return years;
});

const filteredYearRange = computed(() => {
  if (certificateYear1.value !== null) {
    return [
      ...yearRange.value.filter((year) => year > certificateYear1.value),
      defaultYear2.value,
    ];
  }
  return yearRange.value;
});

function handleYear1Change(studentId: any) {
  if (
    certificateYear2.value !== null &&
    certificateYear2.value <= certificateYear1.value
  ) {
    certificateYear2.value = null;
  }
  fetchTutionFeeFilter(studentId);
}

function handleYear2Change(studentId: any) {
  if (
    certificateYear2.value !== null &&
    certificateYear1.value !== null &&
    certificateYear2.value <= certificateYear1.value
  ) {
    certificateYear2.value = null;
  }
  fetchTutionFeeFilter(studentId);
}

const fetchTutionFeeFilter = async (studentId: string) => {
  try {
    loading.value = true;
    if (certificateYear1.value !== null && certificateYear2.value !== null) {
      await studentsStore.tutionFeeStudents({
        student_id: studentId,
        start_year: certificateYear1.value ? certificateYear1.value + "" : null,
        last_year: certificateYear2.value ? certificateYear2.value + "" : null,
      });
    }
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error?.message);
  }
};

watch(certificateYear1, (newVal, oldVal) => {
  if (certificateYear2.value !== null && certificateYear2.value <= newVal) {
    certificateYear2.value = null;
  }
});
</script>

<style></style>
