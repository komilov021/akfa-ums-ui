<template>
  <div class="flex items-center justify-center pt-6"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

onMounted(() => {
  localStorage.setItem("sso-callback", JSON.stringify(route.query));
});
</script>

<style scoped lang="scss">
@import "@/assets/styles/mixins.scss";
@import "@/assets/styles/colors.scss";

.header {
  &__logo {
    height: 123px;
    width: 54px;
    margin-bottom: 12px;
  }
  &__title {
    font-weight: 600;
    font-size: 28px;
    line-height: 42px;
    color: #000000;
    max-width: 400px;
    margin-bottom: 8px;
  }

  &__text {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: $light-text;
  }
}

.forgot-password {
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: #8992a9;
}

.right-content {
  background: linear-gradient(180deg, #d1050c 21.19%, #a4040a 100%);
  p {
    font-weight: 600;
    font-size: 32px;
    line-height: 48px;
    text-align: center;

    color: #ffffff;
    text-align: center;
    max-width: 446px;
  }
}
</style>
