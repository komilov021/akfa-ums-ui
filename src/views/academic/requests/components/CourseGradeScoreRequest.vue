<template>
  <div class="space-y-3">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <h1 class="font-semibold">Before edit:</h1>
        <div class="input-wrapper">
          <p>{{ oldGrade || "-" }}</p>
        </div>
      </div>
      <div>
        <h1 class="font-semibold">After edit:</h1>
        <div class="input-wrapper">
          <p>{{ newGrade || "-" }}</p>
        </div>
      </div>
      <div>Student uid : {{ newuid ? newuid : olduid }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";

const props = defineProps<{
  request: any;
}>();

const oldGrade = computed(() =>
  typeof props.request.old_value?.score === "string"
    ? JSON.parse(props.request.old_value?.score)
    : props.request.old_value?.score
);

const newGrade = computed(() =>
  typeof props.request.new_value?.score === "string"
    ? JSON.parse(props.request.new_value?.score)
    : props.request.new_value?.score
);
const newuid = computed(() => props.request.new_value.student_uid);
const olduid = computed(() => props.request.old_value.student_uid);

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
