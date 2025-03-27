<template>
  <div class="login">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.login {
  box-shadow: 0px 14px 20px rgba(20, 23, 38, 0.05);
  border-radius: 16px;
  padding: 36px 38px;
  background-color: #ffffff;
}
</style>
