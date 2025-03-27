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
        <el-form-item label="Faculties & Departments" prop="program">
          <el-input
            v-model="ruleForm.program"
            type="text"
            autocomplete="off"
            :placeholder="$t('shared.text')"
            size="large"
          />
        </el-form-item>
        <el-form-item label="Local Students (UZS)" prop="per_semester">
          <el-input
            v-model="ruleForm.per_semester"
            autocomplete="off"
            :placeholder="$t('shared.text')"
            size="large"
            type="number"
          />
        </el-form-item>
        <el-form-item
          label="International Students (USD)"
          prop="fee_foreign_student"
        >
          <el-input
            v-model="ruleForm.fee_foreign_student"
            autocomplete="off"
            :placeholder="$t('shared.text')"
            size="large"
            type="number"
          />
        </el-form-item>
        <el-form-item label="Language" prop="lang">
          <el-select
            v-model="ruleForm.lang"
            size="large"
            class="w-full"
            multiple
          >
            <el-option
              v-for="lang of langs"
              :key="lang.code"
              :label="lang.name"
              :value="lang.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Duration (Semestrs)" prop="duration">
          <el-input
            v-model="ruleForm.duration"
            autocomplete="off"
            :placeholder="$t('shared.text')"
            size="large"
          />
        </el-form-item>
        <el-form-item prop="has_scholarship" label="Scholarship">
          <el-radio-group v-model="ruleForm.has_scholarship">
            <el-radio :label="true">Yes</el-radio>
            <el-radio :label="false">No</el-radio>
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
import type { FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();

const props = defineProps<{
  department?: any | null;
  langs?: any | null;
  type?: "create" | "edit";
}>();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  program: "",
  per_semester: "",
  fee_foreign_student: "",
  duration: "",
  lang: [],
  has_scholarship: false,
});

const rules = reactive<FormRules>({
  program: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  per_semester: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  fee_foreign_student: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  duration: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
    },
  ],
  lang: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
    },
  ],
});

const emit = defineEmits(["onSubmit"]);

onMounted(() => {
  if (props.department && props.type === "edit") {
    Object.assign(ruleForm, props.department);
  }
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

<style scoped>
.title {
  font-weight: 700;
  font-size: 18px;
  line-height: 25px;
  color: #1f1f1f;
}
</style>
