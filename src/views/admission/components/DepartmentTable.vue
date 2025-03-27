<template>
  <div
    class="card p-2 md:p-6 flex flex-col !shadow-md w-full mx-auto md:w-full pb-4"
  >
    <p
      class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-lg 2xl:text-xl h-12 inline-block text-center"
    >
      Applicants Programms
    </p>
    <div class="space-y-3">
      <el-table
        :data="programsAvarageFee.admission_programs"
        stripe
        style="width: 100%"
        v-if="programsAvarageFee?.admission_programs?.length"
        row-class-name="cursor-pointer whiteStripe"
        :summary-method="getSummaries"
        show-summary
        height="400"
        border
      >
        <el-table-column
          label="Department"
          prop="title"
          align="left"
          min-width="100"
          fixed
        >
          <!-- <template #default="{ row }">
                      <div>
                          {{ row.title }}
                      </div>
                  </template> -->
        </el-table-column>
        <el-table-column
          prop="applied_applicant_count"
          label="Quantity"
          align="center"
        />
        <el-table-column
          label="Price per year"
          prop="contract_price"
          align="center"
          width="120"
          fixed
        >
          <template #default="{ row }">
            <div>$ {{ row.contract_price.toLocaleString() }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IProgramsAvgFee } from "@/models/backend";
import { TableColumnCtx } from "element-plus";

const props = defineProps<{
  programsAvarageFee?: IProgramsAvgFee | any;
}>();

console.log(props.programsAvarageFee);
interface admission_programs {
  title: string;
  contract_price: number;
  applied_applicant_count: number;
}

interface SummaryMethodProps<T = admission_programs> {
  columns: TableColumnCtx<T>[];
  data: T[];
}

const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param;
  const sums: string[] = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = "Grand Total";
      return;
    }
    if (index === 1) {
      const values = data?.map((item: any) => Number(item[column.property]));
      if (!values.every((value) => Number.isNaN(value))) {
        const sum =
          values.reduce((prev, curr) => prev + curr, 0) / values.length;
        sums[index] = `$ ${sum.toFixed(2)}`;
      } else {
        sums[index] = "N/A";
      }
    } else {
      const values = data?.map((item: any) => Number(item[column.property]));
      if (!values.every((value) => Number.isNaN(value))) {
        sums[index] = `${values.reduce((prev, curr) => {
          const value = Number(curr);
          if (!Number.isNaN(value)) {
            return prev + curr;
          } else {
            return prev;
          }
        }, 0)}`;
      } else {
        sums[index] = "N/A";
      }
    }
  });
  return sums;
};
</script>

<style></style>
