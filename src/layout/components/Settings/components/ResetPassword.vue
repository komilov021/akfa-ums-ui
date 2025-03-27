<template>
  <div class="reset-password">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      :hide-required-asterisk="true"
      label-position="top"
      class="w-full !mb-5"
    >
      <el-form-item prop="password">
        <el-input
          v-model="ruleForm.new_password"
          type="password"
          autocomplete="off"
          placeholder="Enter your new password"
          show-password
          class="!text-xs"
        />
      </el-form-item>
      <el-form-item prop="confirm_password">
        <el-input
          v-model="ruleForm.confirm_new_password"
          type="password"
          autocomplete="off"
          placeholder="Re-enter your new password"
          class="!text-xs"
          show-password
        />
      </el-form-item>
      <el-button
        class="w-full !text-xs"
        type="primary"
        @click="submitForm(ruleFormRef)"
        :loading="loading"
      >
        Update password
      </el-button>
    </el-form>
    <el-divider class="!my-3" />
    <p class="text-[#C8C7C7] text-xs text-center">
      If you have difficulties, contact the IT department
    </p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { useUsersStore } from "@/stores";
import { useI18n } from "vue-i18n";
import sha1 from "sha1";

const emit = defineEmits(["onUpdate"]);

const i18n = useI18n();
const store = useUsersStore();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  new_password: "",
  confirm_new_password: "",
});

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error(i18n.t("validation.fillField")));
  } else {
    if (ruleForm.confirm_new_password !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("confirm_password", () => null as any);
    }
    callback();
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error(i18n.t("validation.fillField")));
  } else if (value !== ruleForm.new_password) {
    callback(new Error(i18n.t("validation.passwordsDontMatch")));
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  new_password: [
    { validator: validatePass, trigger: "blur" },
    {
      min: 8,
      message: i18n.t("validation.minimumLength", { value: 8 }),
      trigger: "blur",
    },
  ],
  confirm_new_password: [{ validator: validatePass2, trigger: "blur" }],
});

const loading = ref(false);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        const data = {
          new_password: sha1(ruleForm.new_password),
          confirm_new_password: sha1(ruleForm.confirm_new_password),
        };
        console.log("data", data);
        await store.resetPassword(data);
        loading.value = false;
        ElMessage({
          message: i18n.t("app.passwordChanged"),
          type: "success",
          duration: 5 * 1000,
        });
        emit("onUpdate");
      } catch (error: any) {
        console.log("error", error.message);

        loading.value = false;
      }
    }
  });
};
</script>

<style lang="scss">
.reset-password {
  .el-input__wrapper {
    background-color: #fafafb !important;
  }
}
</style>
