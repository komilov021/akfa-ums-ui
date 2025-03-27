<template>
  <div class="wrapper">
    <div class="content md:w-96 space-y-6 relative bottom-36">
      <div class="header flex flex-col items-center">
        <div class="p-[14px] rounded-lg border border-[#EAECF0]">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.8333 10.4999C19.8333 9.9028 19.6055 9.30568 19.1499 8.85008C18.6943 8.39447 18.0972 8.16667 17.5 8.16667M17.5 17.5C21.366 17.5 24.5 14.366 24.5 10.5C24.5 6.63401 21.366 3.5 17.5 3.5C13.634 3.5 10.5 6.63401 10.5 10.5C10.5 10.8193 10.5214 11.1336 10.5628 11.4415C10.6309 11.948 10.6649 12.2013 10.642 12.3615C10.6181 12.5284 10.5877 12.6184 10.5055 12.7655C10.4265 12.9068 10.2873 13.046 10.009 13.3243L4.04673 19.2866C3.84496 19.4884 3.74407 19.5893 3.67192 19.707C3.60795 19.8114 3.56081 19.9252 3.53224 20.0442C3.5 20.1785 3.5 20.3212 3.5 20.6065V22.6333C3.5 23.2867 3.5 23.6134 3.62716 23.863C3.73901 24.0825 3.91749 24.261 4.13701 24.3728C4.38657 24.5 4.71327 24.5 5.36667 24.5H8.16667V22.1667H10.5V19.8333H12.8333L14.6757 17.991C14.954 17.7127 15.0932 17.5735 15.2345 17.4945C15.3816 17.4123 15.4716 17.3819 15.6385 17.358C15.7987 17.3351 16.052 17.3691 16.5585 17.4372C16.8664 17.4786 17.1807 17.5 17.5 17.5Z"
              stroke="#344054"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <h1 class="header__title mt-4">Forgot password?</h1>
        <p class="header__p text-center tracking-tight text-tertiary-600">
          No worries, we’ll send you reset instructions.
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
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="ruleForm.email"
            type="text"
            placeholder="Enter your email"
            autocomplete="off"
            size="small"
            class="!h-11"
          />
        </el-form-item>
        <!-- <div class="md:mt-4 text-sm">
            <p>
              Just remembered your password?
              <RouterLink to="/login" class="text-primary font-medium"
                >Log In</RouterLink
              >
            </p>
          </div> -->

        <el-button
          class="w-full mt-4 md:mt-8"
          type="primary"
          size="large"
          @click="submitForm(ruleFormRef)"
          :loading="loading"
        >
          Reset password
        </el-button>
        <div class="text-center text-sm relative top-8">
          <routerLink
            to="/login"
            class="flex flex-cols justify-center items-center gap-1 text-tertiary-600 font-semibold"
          >
            <el-icon><Back /></el-icon>
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
import { reactive, ref } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { useUsersStore } from "@/stores/user";
import { useI18n } from "vue-i18n";

const i18n = useI18n();
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
