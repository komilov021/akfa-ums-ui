<template>
  <div v-loading="loading">
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4 text-start">
        <div>
          <h1 class="font-semibold mb-2">Name before edit:</h1>
          <div class="input-wrapper">
            {{ request.old_value?.name || "-" }}
          </div>
          <el-divider class="!my-4" />
          <h1 class="font-semibold mb-2">Color before edit:</h1>
          <div class="input-wrapper flex gap-2">
            {{ request.old_value?.color_info?.name || "-" }}
            <span
              class="w-5 h-5 rounded-full"
              :style="{
                backgroundColor:
                  request.old_value?.color_info?.hex_code || '#ffffff',
              }"
            >
            </span>
          </div>
        </div>
        <div>
          <h1 class="font-semibold mb-2">Name after edit:</h1>
          <div class="input-wrapper col-span-2">
            {{ request.new_value?.name || "-" }}
          </div>
          <el-divider class="!my-4" />
          <h1 class="font-semibold mb-2">Color after edit:</h1>
          <div class="input-wrapper flex gap-2">
            {{ request.new_value?.color_info?.name || "-" }}
            <span
              class="w-5 h-5 rounded-full"
              :style="{
                backgroundColor:
                  request.new_value?.color_info?.hex_code || '#ffffff',
              }"
            >
            </span>
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
