<template>
  <div class="space-y-3">
    <div class="grid grid-cols-5 gap-4">
      <h1 class="font-semibold">Course name | Code</h1>
      <div class="input-wrapper col-span-2">
        {{ request.additional_data?.course_info?.title }}
        {{ request.additional_data?.course_info?.code }}
      </div>
    </div>
    <div class="grid grid-cols-5 gap-4">
      <h1 class="font-semibold">Component name</h1>
      <div class="input-wrapper col-span-2">
        {{ request?.additional_data?.component_info?.name }}
      </div>
    </div>
    <div class="grid grid-cols-5 gap-4">
      <h1 class="font-semibold">Status</h1>
      <div class="input-wrapper col-span-2">
        {{ request.is_published ? "Publish" : "Unpublish" }}
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
