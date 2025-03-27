<template>
  <div class="space-y-3">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <h1 class="font-semibold mb-2">Before edit:</h1>
        <div class="grid grid-cols-3 gap-4 mb-2">
          <h1 class="font-semibold col-span-2">Main course events:</h1>
          <h1 class="font-semibold">Weight:</h1>
        </div>
        <div
          class="grid grid-cols-3 gap-4 mb-2"
          v-for="oldValue of request.old_value?.components"
          :key="oldValue"
        >
          <div class="input-wrapper col-span-2">
            {{ oldValue.name }}
          </div>
          <div class="input-wrapper">
            {{ oldValue.weight }}
          </div>
        </div>
        <el-divider class="!my-4" />
      </div>
      <div>
        <h1 class="font-semibold mb-2">After edit:</h1>
        <div class="grid grid-cols-3 gap-4 mb-2">
          <h1 class="font-semibold col-span-2">Main course events:</h1>
          <h1 class="font-semibold">Weight:</h1>
        </div>
        <div
          class="grid grid-cols-3 gap-4 mb-2"
          v-for="newValue of request.new_value?.components"
          :key="newValue"
        >
          <div class="input-wrapper col-span-2">
            {{ newValue.name }}
          </div>
          <div class="input-wrapper">
            {{ newValue.weight }}
          </div>
        </div>
        <el-divider class="!my-4" />
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
  console.log("request edit", props.request);
});
</script>
