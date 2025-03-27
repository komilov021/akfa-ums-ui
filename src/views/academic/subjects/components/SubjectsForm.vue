<template>
  <div class="bg-white px-4 py-8 rounded">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
    >
      <div class="grid sm:grid-cols-1 gap-y-1">
        <el-form-item label="Title" prop="title">
          <el-input
            v-model="ruleForm.title"
            type="text"
            autocomplete="off"
            size="large"
            :placeholder="$t('shared.text')"
          />
        </el-form-item>
        <el-form-item label="Code" prop="code">
          <el-input
            v-model="ruleForm.code"
            type="text"
            autocomplete="off"
            class="!h-11"
          />
        </el-form-item>

        <el-form-item label="Program" prop="program_id">
          <el-select
            v-model="ruleForm.program_id"
            class="w-full"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="item in $props.programs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Grading" prop="grading">
          <el-select
            v-model="ruleForm.grading"
            class="w-full"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="(item, i) in ['GPA', 'PASS/FAIL']"
              :key="i"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Credits" prop="credits">
          <el-input-number
            v-model="ruleForm.credits"
            autocomplete="off"
            class="!w-full"
            :placeholder="$t('shared.text')"
            size="large"
          />
        </el-form-item>
        <el-form-item prop="retake" label="Retake">
          <el-radio-group v-model="ruleForm.retake">
            <el-radio :label="1">Yes</el-radio>
            <el-radio :label="0">No</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
    </el-form>
    <div class="flex">
      <el-button type="primary" size="large" @click="submitForm(ruleFormRef)">
        {{ $t("shared.save") }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ControlItem } from "@/models/frontend";
import type { FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();

const props = defineProps<{
  subject?: any | null;
  programs: ControlItem[];
  type?: "create" | "edit";
}>();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  title: "",
  code: "",
  grading: "",
  program_id: "",
  credits: 0,
  retake: 0,
});

const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  code: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  grading: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  program_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  credits: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});

const emit = defineEmits(["onSubmit"]);

onMounted(() => {
  if (props.subject && props.type === "edit") {
    Object.assign(ruleForm, props.subject);
  }
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      emit("onSubmit", {
        ...ruleForm,
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<style scoped>
.title {
  font-weight: 700;
  font-size: 18px;
  line-height: 25px;
  color: #1f1f1f;
}
</style>
