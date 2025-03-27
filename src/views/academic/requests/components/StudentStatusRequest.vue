<template>
  <div v-loading="loading">
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4 text-start">
        <div>
          <h1 class="font-semibold mb-2">Academic Status Before edit:</h1>
          <div class="input-wrapper">
            {{ request.old_value?.academic_status || "-" }}
          </div>
          <el-divider class="!my-4" />
          <h1 class="font-semibold mb-2">Student Status Before edit:</h1>
          <div class="input-wrapper">
            {{ request.old_value?.student_status || "-" }}
          </div>
        </div>
        <div>
          <h1 class="font-semibold mb-2">Academic Status After edit:</h1>
          <div class="grid grid-cols-3 gap-4">
            <div class="input-wrapper col-span-2">
              {{ request.new_value?.academic_status || "-" }}
            </div>
          </div>
          <el-divider class="!my-4" />
          <h1 class="font-semibold mb-2">Student Status After edit:</h1>
          <div class="input-wrapper">
            {{ request.new_value?.student_status || "-" }}
          </div>
        </div>
        <div>
          <h1 class="font-semibold mb-2">Student uid:</h1>
          <div class="input-wrapper">
            {{ request.additional_data?.student_info?.uid || "-" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  request: any;
}>();
console.log(props.request, "data");
const loading = ref(false);
</script>
