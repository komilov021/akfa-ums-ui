<template>
  <div class="space-y-3">
    <div class="grid grid-cols-4 gap-4">
      <h1>Semester</h1>
      <h1>All Credits</h1>
      <h1>Overall Gpa</h1>
      <h1>TS</h1>
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
    <el-divider />
    <div class="">
      <h1 class="font-bold">Courses</h1>
      <div class="grid grid-cols-3 mt-1 gap-20 font-semibold text-center">
        <div>Grade</div>
        <div>Credit</div>
        <div>Subject</div>
      </div>
      <div class="" v-for="(item, key) in data" :key="key">
        <div class="grid grid-cols-3 gap-20 text-center">
          <div>
            {{ item.grade }}
          </div>
          <div>
            {{ item.credit }}
          </div>
          <div>
            {{ item.subject }}
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
let data = computed(() => props.request.new_value?.courses);

onMounted(() => {
  console.log("request", props.request);
});
</script>

<style scoped></style>
