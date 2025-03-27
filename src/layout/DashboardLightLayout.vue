<template>
  <div class="wrapper">
    <TheHeader class="the-header"></TheHeader>
    <div class="content max-w-screen-2xl md:px-4 md:py-4 bg-[#F9FAFB] h-full">
      <RouterView />
    </div>
  </div>
</template>
<script setup lang="ts">
import TheHeader from "./components/Header/TheHeader.vue";
import { ref } from "vue";
const drawer = ref(true);
</script>

<style scoped lang="scss">
@import "@/assets/styles/colors.scss";

.wrapper {
  height: 100vh;
  max-width: 100vw;
  display: grid;
  grid-template-rows: auto 1fr;
}

.content {
  max-width: 100vw;
  overflow-x: hidden;
}
</style>

<style>
.el-drawer__body {
  padding: 12px 0px !important;
}

.el-menu {
  border: none !important;
}
</style>
