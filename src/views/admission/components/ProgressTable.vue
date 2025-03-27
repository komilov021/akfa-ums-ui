<template>
  <div
    class="card p-2 md:p-6 flex flex-col !shadow-md w-full mx-auto md:w-full pb-4"
  >
    <p
      class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-lg 2xl:text-xl h-12 inline-block text-center"
    >
      Applicants Count Per Day
    </p>
    <div class="space-y-3">
      <el-scrollbar height="400px">
        <el-table
          :data="props.applicantsPerDay"
          stripe
          style="width: 100%"
          border
          show-summary
          sum-text="Grand Total"
          row-class-name="cursor-pointer whiteStripe"
          height="400"
        >
          <el-table-column
            prop="apply_date"
            label="Created time"
            align="left"
            min-width="140"
            fixed
          />
          <el-table-column
            label="Created time (Count All)"
            prop="total_registered_student"
            align="right"
          ></el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IType {
  apply_date: string;
  total_registered_student: number | null;
}
const props = defineProps<{
  applicantsPerDay: IType[] | undefined;
}>();
</script>
