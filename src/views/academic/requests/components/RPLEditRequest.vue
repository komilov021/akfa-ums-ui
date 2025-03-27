<template>
  <div>
    <div class="font-semibold">
      <h1 class="text-[#000] text-[16px]">Before edit:</h1>
      <div class="grid grid-cols-4 gap-4">
        <h1>Semester</h1>
        <h1>All Credits</h1>
        <h1>Overall Gpa</h1>
        <h1>TS</h1>
      </div>
    </div>
    <div class="grid grid-cols-4 gap-4">
      <div class="input-wrapper">
        {{ request.old_value?.semester }}
      </div>
      <div class="input-wrapper">
        {{ request.old_value?.all_credits }}
      </div>
      <div class="input-wrapper">
        {{ request.old_value?.overall_gpa }}
      </div>
      <div class="input-wrapper">
        {{ request.old_value?.ts }}
      </div>
    </div>
    <div>
      <h1 class="font-bold text-md">Courses</h1>
      <div class="grid grid-cols-3 mt-1 gap-20 font-semibold text-center">
        <div>Grade</div>
        <div>Credit</div>
        <div>Subject</div>
      </div>
      <div v-for="(item, key) in getoldCourses" :key="key">
        <div class="grid grid-cols-3 gap-20 text-center">
          <div>
            {{ item?.grade }}
          </div>
          <div>
            {{ item?.credit }}
          </div>
          <div>
            {{ item?.subject }}
          </div>
        </div>
      </div>
    </div>
    <div class="h-[1px] bg-gray-300 my-3"></div>
    <div class="font-semibold">
      <h1 class="text-black text-[16px]">After edit:</h1>
      <div class="grid grid-cols-4 gap-4">
        <h1>Semester</h1>
        <h1>All Credits</h1>
        <h1>Overall Gpa</h1>
        <h1>TS</h1>
      </div>
    </div>
    <div class="grid grid-cols-4 gap-4">
      <div class="input-wrapper">
        {{ request.new_value?.semester }}
      </div>
      <div class="input-wrapper">
        {{ request.new_value?.all_credits }}
      </div>
      <div class="input-wrapper">
        {{ request.new_value?.overall_gpa }}
      </div>
      <div class="input-wrapper">
        {{ request.new_value?.ts }}
      </div>
    </div>
    <div class="">
      <h1 class="font-bold text-md">Courses</h1>
      <div class="grid grid-cols-3 mt-1 gap-20 font-semibold text-center">
        <div>Grade</div>
        <div>Credit</div>
        <div>Subject</div>
      </div>
      <div class="" v-for="(item, key) in getnewCourses" :key="key">
        <div class="grid grid-cols-3 gap-20 text-center">
          <div>
            {{ item?.grade }}
          </div>
          <div>
            {{ item?.credit }}
          </div>
          <div>
            {{ item?.subject }}
          </div>
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
const getnewCourses = computed(() =>
  typeof props.request.new_value?.courses === "string"
    ? JSON.parse(props.request.new_value.courses)
    : props.request.new_value.courses
);
const getoldCourses = computed(() =>
  typeof props.request.old_value?.courses === "string"
    ? JSON.parse(props.request.old_value.courses)
    : props.request.old_value.courses
);

onMounted(() => {
  console.log("request", props.request);
});
</script>

<style scoped></style>
