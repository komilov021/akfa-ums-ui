<template>
  <el-form label-width="120px">
    <div class="space-y-4">
      <div class="grid grid-cols-5 gap-4">
        <p class="font-semibold">Semester Fall</p>
        <h1 class="col-span-2 font-semibold">Before edit:</h1>
        <h1 class="col-span-2 font-semibold">After edit:</h1>
      </div>
      <div class="grid grid-cols-5 gap-4">
        <h1 class="font-semibold leading-none">Course code</h1>
        <div class="input-wrapper col-span-2 leading-none">
          {{ request.old_value?.title }}
        </div>
        <div class="input-wrapper col-span-2 leading-none">
          {{ request.new_value?.title }}
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
        <div class="col-span-2">
          <ul class="list-disc list-inside">
            <li v-for="c in request.new_value?.components" :key="c">
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
        <div class="col-span-2">
          <ul class="list-disc list-inside">
            <li v-for="c in request.new_value?.retake_components" :key="c">
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
        <p class="col-span-2">
          {{ request.new_value?.is_elective ? "Yes" : "No" }}
        </p>
      </div>
      <div class="grid grid-cols-5 gap-4">
        <h1 class="font-semibold leading-none">Related course:</h1>
        <ul class="list-disc pl-3 col-span-2">
          <li
            v-for="c in request.old_value?.related_courses_reference_codes"
            :key="c"
          >
            {{ c }}
          </li>
        </ul>
        <ul class="list-disc pl-3 col-span-2">
          <li
            v-for="c in request.new_value?.related_courses_reference_codes"
            :key="c"
          >
            {{ c }}
          </li>
        </ul>
      </div>
    </div>
  </el-form>
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

<style></style>
