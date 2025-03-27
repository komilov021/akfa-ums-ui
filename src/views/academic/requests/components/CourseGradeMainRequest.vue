<template>
  <div class="space-y-3">
    <h1 class="font-semibold text-lg">Main course grading</h1>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <h1 class="font-semibold">Before edit:</h1>
        <div
          class="request-grading-main my-4 flex shadow-sm rounded-md max-w-[320px] overflow-hidden"
        >
          <el-table
            :data="oldGrade"
            size="small"
            header-cell-class-name="!leading-none"
          >
            <el-table-column
              prop="grade"
              label="Grade"
              width="70"
              align="left"
            />
            <el-table-column prop="gpa" label="GPA" width="70" align="center" />
            <el-table-column
              prop="proportion"
              label="Student proportion"
              min-width="70"
              align="center"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div>
        <h1 class="font-semibold">After edit:</h1>
        <div
          class="request-grading-main border my-4 flex shadow-sm rounded-md max-w-[320px] overflow-hidden"
        >
          <el-table
            :data="newGrade"
            size="small"
            header-cell-class-name="!leading-none"
          >
            <el-table-column
              prop="grade"
              label="Grade"
              width="70"
              align="left"
            />
            <el-table-column prop="gpa" label="GPA" width="70" align="center" />
            <el-table-column
              prop="proportion"
              label="Student proportion"
              min-width="70"
              align="center"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";

const props = defineProps<{
  request: any;
}>();

const oldGrade = computed(() =>
  typeof props.request.old_value?.grade === "string"
    ? JSON.parse(props.request.old_value?.grade)
    : props.request.old_value?.grade
);

const newGrade = computed(() =>
  typeof props.request.new_value?.grade === "string"
    ? JSON.parse(props.request.new_value?.grade)
    : props.request.new_value?.grade
);

onMounted(() => {
  console.log("request", props.request);
});
</script>
<style lang="scss">
.request-grading-main .el-table {
  &__cell .cell {
    line-height: 1 !important;
  }
}
</style>
