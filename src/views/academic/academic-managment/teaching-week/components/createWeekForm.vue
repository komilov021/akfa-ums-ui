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
      >
        Sumbit
      </el-button>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import sha1 from "sha1";
import { dayjs } from "element-plus";
import type { IStaff } from "@/models/backend";
import type { ControlItem } from "@/models/frontend";
import { useCourseGradesStore } from "@/stores";
const i18n = useI18n();
const props = defineProps<{
  semester: string;
  assigned_course_id: string;
}>();
const CourseGradesStore = useCourseGradesStore();
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  title: "",
  assigned_course_id: props.assigned_course_id,
  semester: props.semester,
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
