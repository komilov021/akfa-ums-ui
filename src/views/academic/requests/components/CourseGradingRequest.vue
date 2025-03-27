<template>
  <div class="space-y-5">
    <div class="grid grid-cols-2 gap-4 text-start">
      <div>
        <h1 class="font-semibold mb-2">Before edit:</h1>
        <div class="grid grid-cols-3 gap-4 mb-2">
          <h1 class="font-medium col-span-2">Main course grading:</h1>
          <h1 class="font-medium">Credits:</h1>
        </div>
        <div class="grid grid-cols-3 gap-4 mb-2">
          <div class="input-wrapper col-span-2">
            {{ request.old_value?.grading_type }}
          </div>
          <div class="input-wrapper">
            {{ request.old_value?.credits }}
          </div>
        </div>
        <el-divider class="!my-4" />
        <div class="grid grid-cols-3 gap-4 mb-2">
          <h1 class="col-span-2 font-medium">Retake course grading:</h1>
          <h1 class="font-medium">Credits:</h1>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="input-wrapper col-span-2">Pass/Fail</div>
          <div class="input-wrapper">
            {{ request.old_value?.retake_credits }}
          </div>
        </div>
      </div>
      <div>
        <h1 class="font-semibold mb-2">After edit:</h1>
        <div class="grid grid-cols-3 gap-4 mb-2">
          <h1 class="col-span-2 font-medium">Main course grading:</h1>
          <h1 class="font-medium">Credits:</h1>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="input-wrapper col-span-2">
            {{ request.new_value?.grading_type }}
          </div>
          <div class="input-wrapper">
            {{ request.new_value?.credits }}
          </div>
        </div>
        <el-divider class="!my-4" />
        <div class="grid grid-cols-3 gap-4 mb-2">
          <h1 class="col-span-2 font-medium">Retake course grading:</h1>
          <h1 class="font-medium">Credits:</h1>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="input-wrapper col-span-2">Pass/Fail</div>
          <div class="input-wrapper">
            {{ request.new_value?.retake_credits }}
          </div>
        </div>
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
