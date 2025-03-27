<template>
  <div class="wrapper">
    <div class="relative">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.wrapper {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
