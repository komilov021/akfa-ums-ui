<template>
  <div class="space-y-3">
    <div>
      <div>
        <h1 class="font-semibold">Before edit:</h1>
        <div class="grid grid-cols-3 gap-4 my-2 leading-none">
          <h1 class="font-medium">Test</h1>
          <h1 class="font-medium">Min</h1>
          <h1 class="font-medium">Max</h1>
        </div>
      </div>
      <div
        class="grid grid-cols-3 gap-4"
        v-for="v of request.old_value?.tests"
        :key="v"
      >
        <div class="input-wrapper">
          {{ v.name }}
        </div>
        <div class="input-wrapper">
          {{ v.min }}
        </div>
        <div class="input-wrapper">
          {{ v.max }}
        </div>
      </div>
      <div class="flex flex-col gap-3 mt-4">
        <h1 class="font-semibold leading-none">Prerequisites course:</h1>
        <ul class="list-disc pl-3 col-span-2">
          <li v-for="p in request.old_value?.prerequisite_ids" :key="p">
            {{ getCourseName(p) }}
          </li>
        </ul>
      </div>
    </div>
    <el-divider />
    <div>
      <div>
        <h1 class="font-semibold">After edit:</h1>
        <div class="grid grid-cols-3 gap-4 my-2 leading-none">
          <h1 class="font-medium">Test</h1>
          <h1 class="font-medium">Min</h1>
          <h1 class="font-medium">Max</h1>
        </div>
      </div>
      <div
        class="grid grid-cols-3 gap-4"
        v-for="v of request.new_value?.tests"
        :key="v"
      >
        <div class="input-wrapper">
          {{ v.name }}
        </div>
        <div class="input-wrapper">
          {{ v.min }}
        </div>
        <div class="input-wrapper">
          {{ v.max }}
        </div>
      </div>
      <div class="flex flex-col gap-4 mt-4">
        <h1 class="font-semibold leading-none">Prerequisites course:</h1>
        <ul class="list-disc pl-3 col-span-2">
          <li v-for="p in request.new_value?.prerequisite_ids" :key="p">
            {{ getCourseName(p) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCourseReferanceStore } from "@/stores";
import { onMounted } from "vue";

const courseReferanceStore = useCourseReferanceStore();

const props = defineProps<{
  request: any;
}>();

onMounted(async () => {
  console.log(props.request);
  if (courseReferanceStore.getCourseReferanceSelect.length === 0) {
    await courseReferanceStore.fetchCourseReferances({
      page: 1,
      limit: 100,
    });
  }
});

const getCourseName = (id: string) => {
  return courseReferanceStore.getCourseReferanceSelect.find(
    (item) => item.value === id
  )?.label;
};
</script>
