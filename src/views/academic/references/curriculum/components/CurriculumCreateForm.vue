<template>
  <div class="pt-6">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="left"
      label-width="220"
      require-asterisk-position="right"
    >
      <div class="grid sm:grid-cols-1 gap-y-1">
        <el-form-item label="Program" prop="program_id">
          <el-select v-model="ruleForm.program_id" class="w-full">
            <el-option
              v-for="{ label, value } of programs"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="School year (level)" prop="study_year">
          <el-select v-model="ruleForm.study_year" class="w-full">
            <el-option
              v-for="item of [1, 2, 3, 4, 5, 6, 7]"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Academic year" prop="academic_year">
          <el-select v-model="ruleForm.academic_year" class="w-full">
            <el-option
              v-for="{ label, value } of academicYears"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="flex justify-end mt-6">
      <el-button
        type="primary"
        class="rounded"
        @click="submitForm(ruleFormRef)"
      >
        Continue
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { ControlItem } from "@/models/frontend";

const i18n = useI18n();

const props = defineProps<{
  programs: ControlItem[];
  academicYears: ControlItem[];
}>();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  study_year: null as any,
  program_id: "",
  academic_year: "",
});

const rules = reactive<FormRules>({
  program_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  study_year: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  academic_year: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});

const emit = defineEmits(["onSubmit"]);

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
