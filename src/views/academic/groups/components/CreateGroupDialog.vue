<template>
  <div class="text-center">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      :hide-required-asterisk="true"
      label-position="top"
      class="w-full !mb-5"
    >
      <el-form-item prop="title" label="Title">
        <el-input
          v-model="ruleForm.title"
          autocomplete="off"
          placeholder="Name"
          class="!text-xs"
        />
      </el-form-item>
      <el-button
        type="primary"
        size="large"
        class="mt-4 !w-44 !h-9 !mx-auto"
        @click="submitForm(ruleFormRef)"
        v-loading="loading"
      >
        Sumbit
      </el-button>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["onSubmit"]);
const props = defineProps<{
  loading: boolean | any;
}>();
const i18n = useI18n();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  title: "",
});

const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      emit("onSubmit", ruleForm);
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
