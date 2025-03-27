<template>
  <div class="pt-6 request-upload">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
    >
      <div class="grid sm:grid-cols-1 gap-y-1">
        <el-form-item label="Reason for change" prop="explanation">
          <el-input
            v-model="ruleForm.explanation"
            type="textarea"
            placeholder="Enter explanation"
            :rows="6"
          />
        </el-form-item>
        <el-form-item class="pt-7 w-full" prop="file" label="Attach document">
          <AppUpload
            @upload="submitFile"
            accept="image/*, application/pdf"
            class="w-full"
          >
            <div
              class="cursor-pointer border border-[#D0D5DD] w-full p-2 rounded-lg"
            >
              + Attach document (pdf, jpg, png)
            </div>
          </AppUpload>
        </el-form-item>
      </div>
    </el-form>
    <div class="flex justify-end mt-6">
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
import AppUpload from "@/components/common/AppUpload.vue";
import { IFile } from "@/models/backend";
import type { FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  file: {
    id: "66e0210102b2f61b51de950d",
    created_at: "2024-09-10T10:35:45.606Z",
    type: "image/svg+xml",
    name: "1 (1).svg",
    size: 8480,
    bucket_name: "2024-9",
  } as any,
  explanation: "",
});

console.log(ruleForm, "datta");

const rules = reactive<FormRules>({
  file: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
  ],
  explanation: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
  ],
});
const submitFile = (file: IFile) => {
  ruleForm.file = file;
  ruleFormRef.value?.validate();
};
const emit = defineEmits(["onSubmit"]);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      emit("onSubmit", {
        explanation: ruleForm.explanation,
        files: [ruleForm.file],
      });
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
