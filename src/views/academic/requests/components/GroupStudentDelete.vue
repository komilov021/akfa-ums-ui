<template>
  <div v-loading="loading">
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4 text-start">
        <div>
          <h1 class="font-semibold mb-2">Student UID:</h1>
          <div class="input-wrapper">
            {{ request.additional_data?.uid || "-" }}
          </div>
          <el-divider class="!my-4" />
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
