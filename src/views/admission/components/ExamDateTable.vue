<template>
  <el-table
    :data="props.examDate"
    stripe
    style="width: 100%"
    height="400"
    border
    show-summary
    sum-text="Grand Total"
    row-class-name="cursor-pointer whiteStripe"
  >
    <el-table-column prop="duration" label="Exam date" align="left" fixed />
    <el-table-column
      label="Exam date (Count All)"
      prop="count"
      align="right"
      width="206"
    >
      <template #default="{ row }">
        <div>
          {{ row.count }}
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
interface IExamDate {
  duration: string;
  count: string;
  exam_date_id: string;
}
const props = defineProps<{
  examDate: IExamDate[];
}>();
</script>
