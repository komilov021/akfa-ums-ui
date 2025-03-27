<template>
  <div class="px-4 py-8 rounded">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
    >
      <div class="grid sm:grid-cols-1 gap-y-1">
        <el-form-item label="Year" prop="academic_year_id">
          <el-select
            v-model="ruleForm.academic_year_id"
            class="w-full"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="item in examYears"
              :key="item.id"
              :label="item.year"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-select
            v-model="ruleForm.name"
            class="w-full"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="(item, i) in ['SPRING', 'FALL']"
              :key="i"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="flex justify-end">
      <el-button type="primary" size="large" @click="submitForm(ruleFormRef)">
        {{ $t("shared.save") }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useAcademicStore } from "@/stores";

const i18n = useI18n();

const props = defineProps<{
  semestr?: any | null;
  type?: "create" | "edit";
}>();
const academicStore = useAcademicStore();

const examYears = computed(() => academicStore.years);
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  name: "",
  academic_year_id: {
    value: "",
    label: "",
  },
});

const rules = reactive<FormRules>({
  id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});

const emit = defineEmits(["onSubmit"]);

onMounted(() => {
  academicStore.fetchExamYears();
  if (props.semestr && props.type === "edit") {
    ruleForm.academic_year_id = {
      value: props.semestr.id,
      label: props.semestr.year,
    };
    ruleForm.name = props.semestr.name;
  }
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const form = {
        ...ruleForm,
        academic_year_id: ruleForm.academic_year_id.value
          ? ruleForm.academic_year_id.value
          : ruleForm.academic_year_id,
      };
      emit("onSubmit", form);
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
