<template>
  <div class="space-y-3">
    <div class="grid grid-cols-5 gap-4">
      <h1 class="font-semibold leading-none">Course code</h1>
      <div class="input-wrapper col-span-2">
        {{ request.old_value?.title }}
      </div>
    </div>
    <div class="grid grid-cols-5 gap-4">
      <h1 class="font-semibold leading-none">Main course events</h1>
      <div class="col-span-2">
        <ul class="list-disc list-inside">
          <li v-for="c in request.old_value?.components" :key="c">
            {{ c?.name }}
          </li>
        </ul>
      </div>
    </div>
    <div class="grid grid-cols-5 gap-4">
      <h1 class="font-semibold leading-none">Retake course events</h1>
      <div class="col-span-2">
        <ul class="list-disc list-inside">
          <li v-for="c in request.old_value?.retake_components" :key="c">
            {{ c?.name }}
          </li>
        </ul>
      </div>
    </div>
    <div class="grid grid-cols-5 gap-4">
      <h1 class="font-semibold leading-none">Is this course elective?</h1>
      <p class="col-span-2">
        {{ request.old_value?.is_elective ? "Yes" : "No" }}
      </p>
    </div>
    <div class="grid grid-cols-5 gap-4">
      <h1 class="font-semibold leading-none">Retake course events</h1>
      <ul class="list-disc pl-3 col-span-2">
        <li
          v-for="c in request.old_value?.related_courses_reference_codes"
          :key="c"
        >
          {{ c }}
        </li>
      </ul>
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
