<template>
  <div class="space-y-3">
    <div>
      <h1 class="font-semibold">Before edit:</h1>
      <div class="grid grid-cols-3 gap-4 my-2 leading-none">
        <h1 class="font-medium">Title</h1>
        <h1 class="font-medium">Code</h1>
        <h1 class="font-medium leading-none">Retake courses code:</h1>
      </div>
    </div>
    <div
      class="grid grid-cols-3 gap-4 mb-4"
      v-for="requestProgress of request.old_value?.required_courses"
      :key="requestProgress"
    >
      <div class="input-wrapper">
        {{ requestProgress.title }}
      </div>
      <div class="input-wrapper">
        {{ requestProgress.code }}
      </div>
      <div class="input-wrapper">
        {{ requestProgress.retake_code }}
      </div>
    </div>
  </div>
  <el-divider />
  <div>
    <div>
      <h1 class="font-semibold">After edit:</h1>
      <div class="grid grid-cols-3 gap-4 my-2 leading-none">
        <h1 class="font-medium">Title</h1>
        <h1 class="font-medium">Code</h1>
        <h1 class="font-medium">Retake courses code:</h1>
      </div>
    </div>
    <div
      class="grid grid-cols-3 gap-4 mb-4"
      v-for="requestProgress of request.new_value?.required_courses"
      :key="requestProgress"
    >
      <div class="input-wrapper">
        {{ requestProgress.title }}
      </div>
      <div class="input-wrapper">
        {{ requestProgress.code }}
      </div>
      <div class="input-wrapper">
        {{ requestProgress.retake_code }}
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
