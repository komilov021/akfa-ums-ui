<template>
  <div class="px-4">
    <template
      v-if="
        paymentList.total === 0 &&
        filter.semester_id == undefined &&
        filter.program_id == undefined &&
        filter.status == undefined &&
        filter.level === undefined &&
        filter.student_uid === undefined
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
            v-model="filter.student_uid"
            placeholder="Search by ID"
            :suffix-icon="Search"
            @keyup.enter="filter?.student_uid ? fetchList() : ''"
          />
          <el-button
            type="primary"
            @click="filter.student_uid ? fetchList() : ''"
          >
            Search
          </el-button>
          <el-button @click="(filter.student_uid = null), fetchList()">
            Reset
          </el-button>
        </div>
        <div>
          <el-popover
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
            <el-form
              ref="ruleFormRef"
              label-position="top"
              require-asterisk-position="right"
            >
              <div class="grid sm:grid-cols-1">
                <el-form-item label="Choose year">
                  <el-select
                    class="w-full"
                    placeholder="Select"
                    v-model="filter.level"
                  >
                    <el-option
                      v-for="item in ['All study years', 1, 2, 3, 4, 5]"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Choose Program">
                  <el-select
                    class="w-full"
                    placeholder="Select"
                    v-model="filter.program_id"
                  >
                    <el-option
                      v-for="(item, i) in [
                        { value: 'none', label: 'All programs' },
                        ...guideStore.getProgramsSelct,
                      ]"
                      :key="i"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Choose statutes">
                  <el-select
                    class="w-full"
                    placeholder="Select"
                    v-model="filter.status"
                  >
                    <el-option
                      v-for="item in [
                        { label: 'All statuses', value: 'none' },
                        { label: 'Waiting', value: 'waiting' },
                        { label: 'Paid', value: 'paid' },
                        { label: 'Debt', value: 'debt' },
                      ]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Choose semester">
                  <el-select
                    class="w-full"
                    placeholder="Select"
                    v-model="filter.semester_id"
                  >
                    <el-option
                      v-for="item in [
                        { value: 'none', label: 'All semesters' },
                        ...ExamDatesStore.getSemestrsSelct,
                      ]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-button type="primary" @click="fetchList">
                  Submit
                </el-button>
              </div>
            </el-form>
          </el-popover>
          <el-button size="large" @click="showModal()">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 21V15M16 18H22M12 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086, 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z"
                stroke="#667085"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </el-button>
          <el-button size="large" class="!font-semibold">
            <exel-icon class="mr-2"></exel-icon>
            Export
          </el-button>
        </div>
      </div>
      <div class="mt-9">
        <!-- <file-import></file-import> -->
        <div class="table-wrapper mt-8" v-loading="loading">
          <el-table
            :data="paymentList.data"
            style="width: 100%"
            class="whiteStripe"
            :header-cell-style="{ verticalAlign: 'bottom' }"
          >
            <el-table-column
              prop="student_uid"
              label="ID and Email"
              min-width="190"
              align="left"
            >
              <template #default="{ row }">
                <p>
                  {{ row.student_uid }}
                </p>
                <p>{{ row.student_uid }}@centralasian.uz</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="student_name"
              label="Full name"
              min-width="180"
              align="left"
            >
              <template #default="{ row }">
                <p class="text-[#101828] font-medium">
                  {{ row.student_name }}
                </p>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="program_name"
              label="Program"
              min-width="180"
              align="left"
            /> -->
            <el-table-column
              prop="level"
              label="Study year"
              min-width="130"
              align="center"
            />
            <!-- <el-table-column prop="currency" label="Currency" min-width="130" align="left" /> -->
            <el-table-column
              prop="debt"
              label="Total debt"
              width="250"
              align="center"
            >
              <template #default="{ row }">
                {{
                  row.debt.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                }}
                {{ row.currency }}
              </template>
            </el-table-column>
            <el-table-column
              prop="sum"
              label="Total payment"
              width="250"
              align="center"
            >
              <template #default="{ row }">
                {{
                  row.payment_total
                    .toString()
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
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
                <div
                  class="flex items-center gap-2 hover:text-primary cursor-pointer"
                  @click="showModal(row)"
                >
                  {{ dayjs(row.deadline).format("DD/MM/YYYY") }}
                  <EditPen class="w-5 h-5"></EditPen>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="Payment status"
              min-width="150"
              align="left"
            >
              <template #default="{ row }">
                <el-tag
                  v-if="row.status === 'waiting'"
                  class="!text-[#606266] !border-[#DCDFE6] !bg-white !font-semibold"
                  >Waiting</el-tag
                >
                <el-tag
                  v-if="row.status === 'paid'"
                  class="!text-[#17B26A] !border-[#17B26A] !bg-white !font-semibold"
                  >Paid</el-tag
                >
                <el-tag
                  v-if="row.status === 'overdue'"
                  class="!text-[#F04438] !border-[#F04438] !bg-white !font-semibold"
                  >Overdue</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="is_blocked"
              label="Student status"
              width="200"
              align="center"
            >
              <template #default="{ row }">
                <el-select
                  v-if="row.is_blocked"
                  class="w-full"
                  placeholder="Select"
                  v-model="row.is_blocked"
                  @change="showBlocked(row)"
                >
                  <el-option
                    v-for="item in [
                      { label: 'Blocked', value: true },
                      { label: 'Active', value: 'false' },
                    ]"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <div v-else>Active</div>
              </template>
            </el-table-column>
            <el-table-column label="Actions" min-width="150" align="center">
              <template #default="scope">
                <el-button class="!px-2" @click="view(scope.row.student_id)">
                  <View class="h-5 w-5" color="#0D0D0D" />
                </el-button>
                <!-- <el-dropdown trigger="click"
                                    @command="(command) => handleActionClick(command, scope.row.id)"
                                    class="flex justify-center white-card">
                                    <el-button>
                                        <MoreFilled class="h-4 w-4 dot-icon cursor-pointer" />
                                    </el-button>
                                    <template #dropdown>
                                        <el-dropdown-menu class="!p-1 space-y-1">
                                            <el-dropdown-item command="view"
                                                class="danger-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded">
                                                <View class="h-4 w-4" />
                                                <span>Details</span>
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <hr class="mt-20" />
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
        :student="student"
        :type="formType"
        @on-update="(showStudentModal = false), (student = null)"
        :semesters="ExamDatesStore.getSemestrsSelct"
        @on-submit="submitForm($event)"
      />
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import {
  Search,
  EditPen,
  View,
  ArrowLeft,
  ArrowRight,
} from "@element-plus/icons-vue";
import { useFinanceStore, useAcademicStore, useGuideStore } from "@/stores";
import fileImport from "./components/fileImport.vue";
import statusDetails from "./components/statusDetails.vue";
import studentForm from "./components/studentForm.vue";
import ExelIcon from "@/components/icons/ExelIcon.vue";
import { ElMessage, dayjs } from "element-plus";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const i18n = useI18n();
const router = useRouter();
const financeStore = useFinanceStore();
const ExamDatesStore = useAcademicStore();
const guideStore = useGuideStore();
const popoverRef = ref();
const showStudentModal = ref(false);
const showDetailModal = ref(false);
const loading = ref(false);
const student = ref();
const paymentList = computed(() => financeStore.payments);
const paymentByStudent = computed(() => financeStore.paymentStudent);
const formType = ref<"create" | "edit">("create");
const filter = reactive({
  semester_id: undefined,
  status: undefined,
  level: undefined,
  program_id: undefined,
  student_uid: null as any,
  limit: 20,
  page: 1,
});
onMounted(() => {
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
});
const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};
const fetchList = () => {
  filter.program_id =
    filter.program_id === "none" ? undefined : filter.program_id;
  filter.semester_id =
    filter.semester_id === "none" ? undefined : filter.semester_id;
  filter.level = filter.level === "All study years" ? undefined : filter.level;
  filter.status = filter.status === "none" ? undefined : filter.status;
  if (filter.student_uid !== null) {
    filter.student_uid = parseInt(filter.student_uid);
  }

  financeStore.fetchPaymentsList(filter);
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
const view = async (id: string) => {
  financeStore.fetchPaymentByStudent(id as string);
  router.push({
    path: "/academic/reference/student/" + id,
    query: { payment: "payment" },
  });
};
const submitForm = async (data: any) => {
  try {
    loading.value = true;
    if (formType.value === "edit" && student.value) {
      console.log(student);

      const form = {
        payment_id: student.value.id,
        deadline: data.payment_deadline,
      };
      await financeStore.updatePayment(form);
      ElMessage({
        message: i18n.t("shared.updated"),
        type: "success",
      });
      student.value = null;
    } else {
      await financeStore.createPayment(data);
      ElMessage({
        message: i18n.t("shared.created"),
        type: "success",
      });
    }
    fetchList();
    loading.value = false;
    showStudentModal.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
</script>

<style></style>
