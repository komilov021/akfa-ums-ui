<template>
  <div class="grid md:grid-cols-2 h-full">
    <div class="space-y-6 px-4 md:px-24 pt-4 md:pt-6 h-full relative">
      <div class="header flex flex-col items-start space-y-6 md:space-y-6">
        <LogoIconWithName />
        <h1 class="header__title">Welcome to AKFA University</h1>
      </div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        :hide-required-asterisk="true"
        label-position="top"
      >
        <el-form-item label="First Name" prop="first_name">
          <el-input
            v-model="ruleForm.first_name"
            type="text"
            autocomplete="off"
            class="!h-11"
          />
        </el-form-item>
        <el-form-item label="Last Name" prop="last_name">
          <el-input
            v-model="ruleForm.last_name"
            type="text"
            autocomplete="off"
            class="!h-11"
          />
        </el-form-item>
        <el-form-item label="E-mail Address" prop="email">
          <el-input
            v-model.trim="ruleForm.email"
            type="text"
            autocomplete="off"
            class="!h-11"
          />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            v-model.trim="ruleForm.password"
            type="password"
            autocomplete="off"
            class="!h-11"
          />
        </el-form-item>
        <el-form-item label="Confirm Password" prop="confirm_password">
          <el-input
            v-model.trim="ruleForm.confirm_password"
            type="password"
            autocomplete="off"
            class="!h-11"
          />
        </el-form-item>
        <el-button
          class="mt-2 md:mt-4"
          type="primary"
          size="large"
          @click="submitForm(ruleFormRef)"
          :loading="loading"
        >
          Create Account
        </el-button>
        <div class="mt-4 md:mt-6 mb-2">
          <p>
            Already have an account?
            <RouterLink to="/login" class="text-primary font-medium"
              >Log In</RouterLink
            >
          </p>
        </div>
      </el-form>
    </div>
    <div
      class="relative hidden md:flex right-content h-full flex items-center justify-center"
    >
      <p>Join us now and start empowering your future!</p>
      <a
        class="ml-2 absolute text-sm bottom-2 text-white text-center"
        href="tel:+998-71-200-05-22"
        >If you have questions or difficulties, please contact us:
        +998-71-200-05-22</a
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import sha1 from "sha1";
import { LogoIconWithName } from "@/components/icons";
import { onMounted, reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useUsersStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import type { ISigninForm } from "@/models/backend";

const i18n = useI18n();
const store = useUsersStore();
const router = useRouter();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  first_name: "",
  last_name: "",
  email: "",
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
  first_name: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  last_name: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
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
        const data: ISigninForm = {
          ...ruleForm,
          password: sha1(ruleForm.password),
          confirm_password: sha1(ruleForm.confirm_password),
        };
        await store.signin(data);
        await store.sendVerifyEmail();
        router.push("/check-mail");
        loading.value = false;
      } catch (error) {
        console.log("error", error);
        loading.value = false;
      }
    }
  });
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
