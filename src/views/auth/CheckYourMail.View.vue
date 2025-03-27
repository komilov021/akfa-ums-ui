<template>
  <div class="wrapper">
    <div class="content md:w-96 space-y-6 relative bottom-36">
      <div class="header flex flex-col items-center">
        <el-icon :size="28"><Message /></el-icon>
        <!-- <div class="text-center space-y-4"></div>
          <LogoIconWithName /> -->
        <h1 class="header__title mt-4">Check your email</h1>
        <p class="header__p text-center tracking-tight text-tertiary-600">
          We sent a password reset link to olivia@untitledui.com
        </p>
      </div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        :hide-required-asterisk="true"
        label-position="top"
        v-if="!success"
      >
        <!-- <el-form-item label="Email" prop="email">
            <el-input
              v-model="ruleForm.email"
              type="text"
              placeholder="Enter your email"
              autocomplete="off"
              size="small"
              class="!h-11"
            />
          </el-form-item> -->
        <!-- <div class="md:mt-4 text-sm">
            <p>
              Just remembered your password?
              <RouterLink to="/login" class="text-primary font-medium"
                >Log In</RouterLink
              >
            </p>
          </div> -->

        <el-button
          class="w-full"
          type="primary"
          size="large"
          @click="submitForm(ruleFormRef)"
          :loading="loading"
        >
          Open email app
        </el-button>
        <div
          class="flex flex-cols justify-center text-sm gap-1 tracking-tight mt-6"
        >
          <p class="text-tertiary-600">Didn’t receive the email?</p>
          <router-link to="" class="text-primary font-semibold"
            >Click to resend</router-link
          >
        </div>
        <div class="text-center text-sm relative top-8">
          <routerLink
            to="/login"
            class="flex flex-cols justify-center items-center gap-1 text-tertiary-600 font-bold"
          >
            <el-icon><ArrowLeftBold /></el-icon>
            <span>Back to log in</span>
          </routerLink>
        </div>
      </el-form>
      <div v-else>
        <p class="font-medium mb-2">
          Please, verify your email from the message that has been sent to you
          via email!
        </p>
        <p class="text-primary">
          Note, if you can not find the email, check the spam folder!
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { LogoIconWithName } from "@/components/icons";
import { reactive, ref } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { useUsersStore } from "@/stores/user";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const i18n = useI18n();
const router = useRouter();
const store = useUsersStore();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  email: "",
});

const rules = reactive<FormRules>({
  email: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
    {
      type: "email",
      message: i18n.t("validation.inputEmail"),
      trigger: "blur",
    },
  ],
});
const loading = ref(false);
const success = ref(false);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;
      await store.sendCodeToEmail(ruleForm);
      ElMessage({
        message: i18n.t("app.codeSentToEmail"),
        type: "success",
        duration: 5 * 1000,
      });
      loading.value = false;
      success.value = true;
      // router.push("/reset-password");
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/mixins.scss";
@import "@/assets/styles/colors.scss";

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    // @include card;
    padding: 2rem;
    border-radius: 10px;
    min-width: 300px;
  }
}
.header {
  &__logo {
    height: 25px;
    width: 129px;
  }
  &__title {
    font-weight: 700;
    font-size: 26px;
    line-height: 36px;
    color: $bold-text;
    margin-bottom: 8px;
    text-align: center;
  }

  &__text {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: $light-text;
  }
  &__p {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }
}
</style>
