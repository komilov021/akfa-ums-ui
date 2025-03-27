<template>
  <div class="w-full">
    <h1 class="text-text-900 font-semibold text-3xl">{{ props.title }}</h1>
    <h1 class="text-[#7C7C7C] font-semibold text-base">
      {{ props.subTitle }}
    </h1>
    <el-divider></el-divider>
  </div>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string;
    subTitle: string;
  }>(),
  {
    title: "Modules",
    subTitle: "Choose some modules",
  }
);
</script>
