<template>
  <div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
      class="grid sm:grid-cols-1 gap-y-1"
    >
      <el-form-item label="Academic year" prop="academic_year">
        <el-select
          v-model="ruleForm.academic_year"
          class="w-full"
          placeholder="Academic year"
        >
          <el-option
            v-for="(item, i) in examYearStore.getYearsSelct"
            :key="i"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Semester" prop="semester">
        <el-select
          @change="handleSemesterChange"
          v-model="ruleForm.semester"
          class="w-full"
          placeholder="Semester"
        >
          <el-option
            v-for="(item, i) in examYearStore.getSemestrsSelct"
            :key="i"
            :label="item.label"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Study Year" prop="study_year">
        <el-select
          v-model="ruleForm.study_year"
          class="w-full"
          placeholder="Select"
        >
          <el-option
            v-for="(item, i) in [1, 2, 3, 4, 5, 6]"
            :key="i"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <div class="flex justify-center mt-5">
        <el-button type="primary" size="large" @click="submitForm(ruleFormRef)">
          {{ $t("shared.save") }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { dayjs, FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useAcademicStore } from "@/stores";

const i18n = useI18n();

const props = defineProps<{
  semestr?: any | null;
  type?: "create" | "edit";
}>();
const academicStore = useAcademicStore();
const examYearStore = useAcademicStore();
const examYears = computed(() => academicStore.years);
const examSemesters = computed(() => academicStore.semestrs);
const ruleFormRef = ref<FormInstance>();
const now = new Date();
const currentSemester = ref(
  now.getMonth() >= 9 && now.getMonth() <= 11 ? "SPRING" : "FALL"
);
console.log("year", examYears.value);
interface SemesterOption {
  label: string;
  value: string | number;
}
const ruleForm = reactive({
  study_year: 1,
  semester: "" as string,
  academic_year: "" as string,
});
const handleSemesterChange = (selectedItem: SemesterOption) => {
  const semesterLabel = selectedItem.label;
  const shortLabel = semesterLabel.split("-")[1];
  ruleForm.semester = shortLabel;
};
const rules = reactive<FormRules>({
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
  semester: [
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
  academicStore.fetchSemestr();
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      emit("onSubmit", {
        study_year: ruleForm.study_year,
        semester: ruleForm.semester,
        academic_year: String(ruleForm.academic_year),
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
