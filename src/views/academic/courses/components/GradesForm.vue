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
        <el-form-item label="Grade" prop="grade">
          <el-input
            v-model="ruleForm.grade"
            type="text"
            autocomplete="off"
            size="large"
            :placeholder="$t('shared.text')"
          />
        </el-form-item>
        <el-form-item label="Student Proportion (%)" prop="student_proportion">
          <el-input-number
            v-model="ruleForm.student_proportion"
            autocomplete="off"
            class="!w-full"
            :placeholder="$t('shared.text')"
            size="large"
          />
        </el-form-item>
        <el-form-item label="GPA Equivalent" prop="gpa">
          <el-input-number
            v-model="ruleForm.gpa"
            autocomplete="off"
            class="!w-full"
            :placeholder="$t('shared.text')"
            size="large"
          />
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
import type { FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();

const props = defineProps<{
  grade?: any | null;
  type?: "create" | "edit";
}>();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  grade: "",
  student_proportion: 0,
  gpa: 0,
});

const rules = reactive<FormRules>({
  grade: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  student_proportion: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  gpa: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});

const emit = defineEmits(["onSubmit"]);

onMounted(() => {
  if (props.grade && props.type === "edit") {
    Object.assign(ruleForm, props.grade);
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
