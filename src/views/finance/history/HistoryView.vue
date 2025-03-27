<template>
  <div class="px-4">
    <div class="w-full flex justify-between">
      <div>
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
      </div>
      <div class="flex items-center gap-5">
        <el-date-picker
          type="daterange"
          v-model="defaultTime"
          @change="dateFilter"
          autocomplete="off"
          start-placeholder="Start Date"
          end-placeholder="End Date"
          size="large"
        />
        <el-button size="large" @click="showStudentModal = true">
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
        <el-button
          @click="showPaymentModal = true"
          size="large"
          class="!font-semibold"
        >
          <exel-icon class="mr-2"></exel-icon>
          Import
        </el-button>
      </div>
    </div>
    <div class="table-wrapper mt-8" v-loading="loading">
      <el-table
        :data="paymentList.data"
        class="whiteStripe"
        row-class-name="noHover"
        style="width: 100%"
        height="82vh"
      >
        <el-table-column
          prop="student_uid"
          label="Student ID"
          min-width="50"
          align="left"
          fixed="left"
        >
          <!-- <template #default="{ row }">
            {{ row.student_uid }}
            <br>
            {{ row.mail }}
          </template> -->
        </el-table-column>
        <el-table-column
          prop="full_name"
          label="Student Name"
          min-width="50"
          align="left"
        />
        <el-table-column
          prop="date"
          label="Record create time"
          min-width="50"
          align="left"
        >
          <template #default="{ row }">
            {{ dayjs(row.created_at).format("DD/MM/YYYY HH:MM") }}
          </template>
        </el-table-column>
        <el-table-column
          prop="payment_date"
          label="Payment date"
          min-width="50"
          align="left"
        >
          <template #default="{ row }">
            {{ dayjs(row.payment_date).format("DD/MM/YYYY") }}
          </template>
        </el-table-column>
        <el-table-column
          prop="is_foreign"
          label="Foreign student"
          width="200"
          align="center"
        >
          <template #default="{ row }">
            {{ row.is_foreign ? "Yes" : "No" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="currency"
          label="Currency"
          width="200"
          align="center"
        />
        <el-table-column
          prop="sum"
          label="Payment sum"
          width="200"
          align="center"
        >
          <template #default="{ row }">
            {{
              row.amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
            }}
          </template>
        </el-table-column>
        <el-table-column label="Operations" align="center" fixed="right">
          <template #default="{ row }">
            <div class="flex justify-center space-x-3">
              <Delete
                class="h-4 w-4 text-primary"
                @click="confirmDelete(row.id)"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <hr class="mt-10" />
    <div class="py-3 px-6">
      <el-pagination
        background
        @current-change="onPaginationChange"
        layout="prev, pager, next"
        :page-size="filter.limit"
        next-text="Next ->"
        prev-text="<- Previous"
        :total="paymentList.total"
      />
    </div>
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
  </div>
</template>
<script lang="ts" setup>
import ExelIcon from "@/components/icons/ExelIcon.vue";
import { computed, onMounted, reactive, ref } from "vue";
import { Search, ArrowLeft, ArrowRight, Delete } from "@element-plus/icons-vue";
import { useFinanceStore, useAcademicStore } from "@/stores";
import studentForm from "./components/historyForm.vue";
import importPayment from "./components/importPayment.vue";
import { ElMessage, dayjs, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
const i18n = useI18n();
const ExamDatesStore = useAcademicStore();
const financeStore = useFinanceStore();
const showStudentModal = ref(false);
const loading = ref(false);
const paymentList = computed(() => financeStore.paymentHistory);
const defaultTime: any = ref(["", ""]);
const showPaymentModal = ref(false);
const filter = reactive({
  semester_id: null,
  status: null,
  level: null,
  program_id: null,
  student_uid: null as any,
  from_date: null as any,
  to_date: null as any,
  limit: 20,
  page: 1,
});
onMounted(() => {
  fetchList();
  if (!ExamDatesStore.getSemestrsSelct.length) {
    ExamDatesStore.fetchSemestr();
  }
});
const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};
const fetchList = () => {
  if (filter.student_uid !== null) {
    filter.student_uid = parseInt(filter.student_uid);
  }

  financeStore.fetchPaymentHistory(filter);
};
const confirmDelete = (id: string) => {
  ElMessageBox.confirm(
    "This action cannot be undone. Continue?",
    i18n.t("shared.warning"),
    {
      confirmButtonText: "Yes",
      cancelButtonText: "Cencel",
      type: "warning",
      center: true,
    }
  )
    .then(async () => {
      try {
        loading.value = true;
        await financeStore.removePaymentHistory(id);
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
const dateFilter = (val: any) => {
  filter.from_date = dayjs(val[0]).format("YYYY-MM-DD");
  filter.to_date = dayjs(val[1]).format("YYYY-MM-DD");
  fetchList();
};
const closeImport = () => {
  fetchList();
  showPaymentModal.value = false;
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
</script>

<style></style>
