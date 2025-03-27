<template>
  <div class="pt-6">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
      class="md:w-1/2"
    >
      <div class="grid sm:grid-cols-3 gap-3">
        <el-form-item
          label="Courses required to move to next level:"
          prop="courses_ids"
          class="sm:col-span-2"
        >
          <el-select v-model="ruleForm.courses_ids" class="w-full" multiple>
            <el-option
              v-for="{ label, value } of course_references"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="max_fails" label="Max. number of fails">
          <el-input-number
            v-model="ruleForm.max_fails"
            autocomplete="off"
            class="!w-full"
            :placeholder="$t('shared.text')"
          />
        </el-form-item>
      </div>
    </el-form>
    <div class="flex">
      <el-button
        type="primary"
        class="rounded"
        @click="submitForm(ruleFormRef)"
      >
        Submit
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ControlItem } from "@/models/frontend";
import type { FormInstance, FormRules } from "element-plus";
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();

const props = defineProps<{
  course_references: ControlItem[];
}>();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  max_fails: 0,
  courses_ids: [],
});

const rules = reactive<FormRules>({
  max_fails: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
      type: "number",
    },
  ],
  courses_ids: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
      type: "array",
    },
  ],
});

const emit = defineEmits(["onSubmit"]);

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

<style>
.request-upload .el-upload {
  width: 100%;
}
</style>
