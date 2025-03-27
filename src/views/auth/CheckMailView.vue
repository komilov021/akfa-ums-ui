<template>
  <div class="flex items-center justify-center pt-6">
    <div class="header flex flex-col items-start space-y-6 md:space-y-6">
      <LogoIconWithName />
      <h1 class="header__title">Thank you for registration!</h1>
      <div class="space-y-4">
        <p class="font-medium">
          Please, verify your email from the message that has been sent to you
          via email, in order to use our system!
        </p>
        <p class="text-primary">
          Note, if you can not find the email, check the spam folder!
        </p>
      </div>
      <el-button
        class="mt-2 md:mt-4"
        type="primary"
        size="large"
        @click="resend"
        :loading="loading"
      >
        Resend
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LogoIconWithName } from "@/components/icons";
import { ref, onMounted } from "vue";
import { useUsersStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";

const i18n = useI18n();
const store = useUsersStore();
const router = useRouter();

const loading = ref(false);

onMounted(() => {
  if (store.user?.is_verified) {
    router.push("/");
  }
});

const resend = async () => {
  try {
    loading.value = true;
    await store.sendVerifyEmail();
    ElMessage({
      message: "Email sent",
      type: "success",
    });
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
};
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
