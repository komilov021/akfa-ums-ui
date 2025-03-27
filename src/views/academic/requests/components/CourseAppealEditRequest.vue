<template>
  <div class="space-y-6">
    <div>
      <h4 class="!text-[#111928] font-bold text-lg">
        ID: {{ props.request?.additional_data?.student_info?.uid }}
      </h4>
      <p class="text-sm text-[#6B7280]">
        {{ props.request.additional_data?.student_reason || "-" }}
      </p>
    </div>
    <div>
      <div class="flex items-center gap-5">
        <h4 class="!text-[#111928] font-bold text-lg">
          {{ props.request?.additional_data?.teacher_info?.first_name }}
          {{ props.request?.additional_data?.teacher_info?.last_name }}
        </h4>
        <div
          class="bg-[#F9FAFB] rounded-lg p-1 px-2 text-xs text-[#111928] font-semibold"
        >
          {{ props.request?.additional_data?.course_info?.title }}
        </div>
      </div>
      <p class="text-sm text-[#6B7280]">
        {{ props.request.additional_data?.teacher_reason || "-" }}
      </p>
    </div>
    <div class="grid grid-cols-4 gap-4">
      <div>
        <h1 class="font-medium text-[#111928] text-sm">Grade before</h1>
        <div class="input-wrapper mt-1">
          <p>{{ props.request.old_value.score || "-" }}</p>
        </div>
      </div>
      <div>
        <h1 class="font-medium text-[#111928] text-sm">Grade after</h1>
        <div class="input-wrapper mt-1">
          <p>{{ props.request.new_value.score || "-" }}</p>
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
