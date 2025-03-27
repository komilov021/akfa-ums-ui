<template>
  <div class="px-4">
    <h3 class="text-[#343434] font-semibold text-[30px]">Student Profile</h3>
    <div class="border rounded-2xl p-6 my-6 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="bg-black rounded-full w-12 h-12"></div>
        <div>
          <h6 class="text-[#101828] text-base font-medium">
            {{
              paymentByStudent.first_name +
              " " +
              paymentByStudent.last_name +
              " "
            }}
            (Him/His)
          </h6>
          <p class="text-[#6C737F] text-sm">
            {{ paymentByStudent.email }}
          </p>
        </div>
      </div>
      <div>
        <p class="text-[#6C737F] text-sm">ID</p>
        <p class="text-sm text-[#101828] font-medium">
          {{ paymentByStudent.uid }}
        </p>
      </div>
      <div>
        <p class="text-[#6C737F] text-sm">Phone number</p>
        <p class="text-sm text-[#101828] font-medium">
          {{ paymentByStudent.phone || "-" }}
        </p>
      </div>
      <div>
        <p class="text-[#6C737F] text-sm">Departement/School</p>
        <p class="text-sm text-[#101828] font-medium">
          {{ paymentByStudent.program?.name }}
        </p>
      </div>
      <div>
        <p class="text-[#6C737F] text-sm">Birthdate</p>
        <p class="text-sm text-[#101828] font-medium">
          {{
            paymentByStudent.birth_date
              ? dayjs(paymentByStudent.birth_date).format("DD/MM/YYYY")
              : "-"
          }}
        </p>
      </div>
      <div></div>
      <div></div>
    </div>
    <h3 class="text-[#343434] font-semibold text-[30px]">
      Student payment history
    </h3>
    <div class="mt-9">
      <div class="table-wrapper mt-8" v-loading="loading">
        <el-table
          :data="paymentByStudent.payments"
          style="width: 100%"
          class="whiteStripe"
          :header-cell-style="{ verticalAlign: 'bottom' }"
        >
          <el-table-column label="Semester" min-width="200" align="left">
            <template #default="{ row }">
              <el-tag
                v-if="row.name == 'FALL'"
                round
                color="#F9F5FF"
                class="!border-[#E9D7FE] !text-[#6941C6]"
              >
                Fall {{ row.academic_year }}
              </el-tag>
              <el-tag
                v-else
                round
                color="#EFF8FF"
                class="!border-[#B2DDFF] !text-[#175CD3]"
              >
                Spring {{ row.academic_year }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Payment #" min-width="100" align="left">
            <p class="!text-[#175CD3]">n/a</p>
          </el-table-column>
          <el-table-column
            prop="sum"
            label="Net tuition"
            width="250"
            align="center"
          >
            <template #default="{ row }">
              {{
                row.payment_total
                  ?.toString()
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
              }}
              {{ row.currency }}
            </template>
          </el-table-column>
          <el-table-column prop="sum" label="Paid" width="250" align="center">
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
          <el-table-column label="Prepayment" width="250" align="center">
            0
          </el-table-column>
          <el-table-column
            prop="deadline"
            label="Payment deadline"
            min-width="150"
            align="left"
          >
            <template #default="{ row }">
              <div class="flex items-center gap-2">
                {{ dayjs(row.deadline).format("DD/MM/YYYY") }}
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
          <!-- <el-table-column prop="is_blocked" label="Student status" width="200" align="center">
                        <template #default="{ row }">
                            {{ row.is_blocked ? 'Blocked' : "Active" }}
                        </template>
                    </el-table-column> -->
        </el-table>
      </div>
    </div>
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
import { useFinanceStore } from "@/stores";
import { ElMessage, dayjs } from "element-plus";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
const i18n = useI18n();
const route = useRoute();
const financeStore = useFinanceStore();
const loading = ref(false);
const paymentByStudent = computed(() => financeStore.studentPaymentHistory);
onMounted(() => {
  financeStore.fetchStudentPaymentHistory(route.params.id as string);
});
</script>

<style></style>
