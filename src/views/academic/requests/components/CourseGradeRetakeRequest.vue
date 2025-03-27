<template>
  <div class="space-y-3">
    <div class="grid grid-cols-5 gap-4">
      <div></div>
      <h1 class="col-span-2 font-semibold">Before edit:</h1>
      <h1 class="col-span-2 font-semibold">After edit:</h1>
    </div>
    <div class="grid grid-cols-5 gap-4">
      <h1 class="font-semibold">Pass/Fail settings:</h1>
      <div class="input-wrapper col-span-2">
        {{ request.old_value?.retake_grade.grade }}
      </div>
      <div class="input-wrapper col-span-2">
        {{ request.new_value?.retake_grade.grade }}
      </div>
    </div>
    <div class="grid grid-cols-5 gap-4">
      <h1 class="font-semibold">Fail Cutline</h1>
      <div class="input-wrapper col-span-2">
        {{ request.old_value?.retake_grade.proportion }}
      </div>
      <div class="input-wrapper col-span-2">
        {{ request.new_value?.retake_grade.proportion }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

const props = defineProps<{
  request: any;
}>();

onMounted(() => {
  console.log("request", props.request);
});
</script>
