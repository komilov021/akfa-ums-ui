<template>
  <div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      require-asterisk-position="right"
    >
      <el-form-item prop="title">
        <el-input
          v-model="ruleForm.title"
          type="text"
          autocomplete="off"
          placeholder="Name"
        />
      </el-form-item>
      <el-form-item prop="description">
        <el-input
          type="textarea"
          autocomplete="off"
          placeholder="Description"
          v-model.trimEnd="ruleForm.description"
          :rows="6"
        />
      </el-form-item>
      <el-form-item prop="percentage">
        <el-input-number
          v-model.number="ruleForm.percentage"
          class="!w-1/4"
          autocomplete="off"
          placeholder="Percentage"
          :min="0"
          :max="100"
        />
      </el-form-item>
      <div class="flex justify-end">
        <el-button
          v-if="props.type == 'create'"
          type="primary"
          class="w-64"
          @click="submitForm(ruleFormRef)"
          >Save</el-button
        >
        <el-button
          v-else
          type="primary"
          class="w-64"
          @click="submitForm(ruleFormRef)"
          >Edit</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();
const emit = defineEmits(["onSubmit"]);
const props = defineProps<{
  type: any;
  data: any;
}>();
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  title: "",
  description: "",
  percentage: 0,
});
const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
    {
      min: 2,
      message: i18n.t("validation.minimumLength", { value: 2 }),
      trigger: ["blur", "change"],
    },
    {
      max: 120,
      message: i18n.t("validation.maxLength", { value: 120 }),
      trigger: ["blur", "change"],
    },
  ],
  description: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
    {
      min: 5,
      message: i18n.t("validation.minimumLength", { value: 5 }),
      trigger: ["blur", "change"],
    },
    {
      max: 250,
      message: i18n.t("validation.maxLength", { value: 250 }),
      trigger: ["blur", "change"],
    },
  ],
  percentage: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});
onMounted(() => {
  if (props.data && props.type === "edit") {
    Object.assign(ruleForm, props.data);
  }
});
const submitForm = async (formData: FormInstance | undefined) => {
  if (!formData) return;
  await formData.validate(async (valid, fields) => {
    if (valid) {
      console.log("ruleForm", ruleForm);
      emit("onSubmit", {
        ...ruleForm,
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<style scoped></style>
