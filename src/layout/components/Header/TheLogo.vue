<template>
  <div class="flex items-center">
    <LogoIcon
      classes="w-32 mr-2 cursor-pointer"
      @click="router.push('/')"
    ></LogoIcon>
    <div class="logo-devider mr-4"></div>
    <p class="description-text">
      Административная панель для контроля и управления бизнесом
    </p>
  </div>
</template>

<script lang="ts" setup>
import { LogoIcon } from "@/components/icons";
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<style scoped lang="scss">
.logo-devider {
  width: 1px;
  height: 61px;
  background-color: #87888d;
}
.description-text {
  font-weight: 500;
  font-size: 10px;
  line-height: 14px;
  color: #77787d;
  max-width: 260px;
}
</style>
