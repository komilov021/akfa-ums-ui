<template>
  <div class="wrapper">
    <div class="content md:w-96 space-y-4 relative bottom-24">
      <div class="header flex flex-col items-center text-center mb-6">
        <!-- <LogoIconWithName /> -->
        <!-- <h1 class="header__title">{{ $t("app.setPassword") }}</h1> -->
        <h1 class="header__title">Set new password</h1>
        <p class="font-sm tracking-tight text-tertiary-600 font-normal">
          Your new password must be different to previously used passwords.
        </p>
      </div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <el-form-item :label="$t('app.password')" prop="password">
          <el-input
            v-model="ruleForm.password"
            type="password"
            autocomplete="off"
            placeholder="••••••••"
            size="small"
            class="!w-80 !h-11"
          />
        </el-form-item>
        <el-form-item
          :label="$t('app.confirmPassword')"
          prop="confirm_password"
        >
          <el-input
            v-model="ruleForm.confirm_password"
            type="password"
            autocomplete="off"
            :placeholder="$t('app.confirmPassword')"
            size="small"
            class="!w-80 !h-11"
          />
        </el-form-item>
        <!-- <RouterLink to="/forgot-password" class="forgot-password">{{
          $t("app.resendCode")
        }}</RouterLink> -->
        <div class="text-sm text-tertiary-600">
          <div class="flex flex-cols text-sm gap-1 mb-1 items-center">
            <el-icon :size="20"><CircleCheckFilled /></el-icon>
            <p>Must be at least 8 characters</p>
          </div>
          <div class="flex flex-cols text-sm gap-1 items-center">
            <el-icon :size="20"><SuccessFilled /></el-icon>
            <p>Must contain one special character</p>
          </div>
        </div>
        <el-button
          class="w-full mt-4 md:mt-7"
          type="primary"
          size="large"
          @click="submitForm(ruleFormRef)"
          :loading="loading"
        >
          Reset password
          <!-- {{ $t("shared.save") }} -->
        </el-button>
      </el-form>
      <div class="text-center text-sm relative top-4">
        <routerLink
          to="/login"
          class="flex flex-cols justify-center items-center gap-1 text-tertiary-600 font-normal font-sm"
        >
          <el-icon><Back /></el-icon>
          <span>Back to log in</span>
        </routerLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LogoIconWithName } from "@/components/icons";
import { reactive, ref } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { useUsersStore } from "@/stores/user";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import sha1 from "sha1";

const i18n = useI18n();
const store = useUsersStore();
const route = useRoute();
const router = useRouter();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  password: "",
  confirm_password: "",
});

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error(i18n.t("validation.fillField")));
  } else {
    if (ruleForm.confirm_password !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("confirm_password", () => null as any);
    }
    callback();
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error(i18n.t("validation.fillField")));
  } else if (value !== ruleForm.password) {
    callback(new Error(i18n.t("validation.passwordsDontMatch")));
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  password: [
    { validator: validatePass, trigger: "blur" },
    {
      min: 8,
      message: i18n.t("validation.minimumLength", { value: 8 }),
      trigger: "blur",
    },
  ],
  confirm_password: [{ validator: validatePass2, trigger: "blur" }],
});

const loading = ref(false);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        const data = {
          password: sha1(ruleForm.password),
          confirm_password: sha1(ruleForm.confirm_password),
          code: route.query.code as string,
        };
        // await store.resetPassword(data);
        loading.value = false;
        ElMessage({
          message: i18n.t("app.passwordChanged"),
          type: "success",
          duration: 5 * 1000,
        });
        router.push("/login");
      } catch (error: any) {
        console.log("error", error.message);

        loading.value = false;
      }
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
    padding: 2rem;
    border-radius: 10px;
    min-width: 300px;
  }
}

.header {
  &__logo {
    height: 25px;
    width: 129px;
    margin-bottom: 12px;
  }
  &__title {
    font-weight: 700;
    font-size: 26px;
    line-height: 36px;
    color: $bold-text;
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
</style>
