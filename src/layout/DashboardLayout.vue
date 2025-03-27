<template>
  <div class="wrapper">
    <TheHeader class="the-header"></TheHeader>
    <div class="content p-4 md:py-4 md:px-5 bg-[#F9FAFB]">
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
