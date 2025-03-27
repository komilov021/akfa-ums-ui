<template>
  <div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
      v-loading="loading"
    >
      <el-form-item
        label="Semester-Year"
        :rules="[
          {
            required: true,
            message: i18n.t('validation.fillField'),
            trigger: ['blur', 'change'],
          },
        ]"
        prop="semester_id"
      >
        <el-select
          v-model="ruleForm.semester_id"
          placeholder="Select"
          class="w-full"
        >
          <el-option
            v-for="item of props.semester"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <div class="grid grid-cols-3 gap-5">
        <el-form-item label="All Credit" prop="all_credits">
          <el-input-number
            v-model="ruleForm.all_credits"
            autocomplete="off"
            :controls="false"
            placeholder="Number"
            type="number"
            class="!w-full"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="TS" prop="ts">
          <el-input-number
            v-model="ruleForm.ts"
            autocomplete="off"
            :controls="false"
            placeholder="Number"
            class="!w-full"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="Over All GPA" prop="overall_gpa">
          <el-input-number
            v-model="ruleForm.overall_gpa"
            autocomplete="off"
            :controls="false"
            placeholder="Number"
            class="!w-full"
            :min="0"
          />
        </el-form-item>
      </div>
      <div class="border-solid border-2 p-3 rounded-xl mb-3 shadow-sm bg-white">
        <h1 class="text-xl pb-2 font-semibold text-[#000]">Courses</h1>
        <div
          class="flex items-center gap-4 mb-4"
          v-for="(item, index) in ruleForm.courses"
          :key="index"
        >
          <el-form-item
            :label="index === 0 ? 'Subject' : ''"
            class="!mb-0 w-full"
            :prop="'courses.' + index + '.subject'"
            :rules="[
              {
                required: true,
                message: i18n.t('validation.fillField'),
                trigger: ['blur', 'change'],
              },
              {
                max: 64,
                message: i18n.t('validation.maxLength', { value: '64' }),
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-input
              placeholder="Text"
              type="text"
              :controls="true"
              v-model.trimStart="item.subject"
              class="!w-full"
            />
          </el-form-item>
          <el-form-item
            :label="index === 0 ? 'Credit' : ''"
            class="!mb-0 w-full"
            :prop="'courses.' + index + '.credit'"
            :rules="[
              {
                validator: checkLength,
                trigger: ['change', 'blur'],
              },
              {
                required: true,
                message: i18n.t('validation.fillField'),
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-input-number
              placeholder="Number"
              v-model="item.credit"
              class="!w-full"
              :controls="false"
              :min="0"
            />
          </el-form-item>
          <el-form-item
            :label="index === 0 ? 'Grade' : ''"
            class="!mb-0 w-full"
            :prop="'courses.' + index + '.grade'"
            :rules="[
              {
                required: true,
                message: i18n.t('validation.fillField'),
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-select v-model="item.grade" placeholder="Select" class="w-full">
              <el-option
                v-for="item of props.grade"
                :key="item.grade"
                :label="item.grade"
                :value="item.grade"
              />
            </el-select>
          </el-form-item>
          <el-button
            :icon="Minus"
            circle
            size="small"
            :class="{ '!invisible': index === 0 }"
            @click="removeCourses(index)"
          />
        </div>
        <div class="">
          <el-button @click="addCourses()" link>+ Add Courses</el-button>
        </div>
      </div>
      <div class="flex justify-end">
        <el-button
          v-if="props.type == 'edit'"
          class="w-36"
          type="primary"
          @click="submitForm(ruleFormRef)"
          >Save</el-button
        >
        <el-button
          v-else
          type="primary"
          @click="submitForm(ruleFormRef)"
          class="w-36"
          >Create</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useAcademicStore, useCurriculumStore } from "@/stores";
import { InfoFilled } from "@element-plus/icons-vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { Minus } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();
const emit = defineEmits(["onSubmit"]);
const props = defineProps<{
  semester?: any;
  student_id: string;
  grade: any;
  type: any;
  rpltranscriptsForm: any;
}>();
const ruleForm = reactive({
  semester_id: "",
  all_credits: 0,
  ts: 0,
  overall_gpa: 0,
  courses: [
    {
      subject: "",
      credit: 0,
      grade: "",
    },
  ],
});
const rules = reactive<FormRules>({
  all_credits: [
    {
      validator: lengthCheck,
      trigger: ["change", "blur"],
    },
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["change", "blur"],
    },
  ],
  ts: [
    {
      validator: lengthCheck,
      trigger: ["change", "blur"],
    },
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["change", "blur"],
    },
  ],
  overall_gpa: [
    {
      validator: lengthCheck,
      trigger: ["change", "blur"],
    },
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
  ],
});
const addCourses = () => {
  ruleForm.courses.push({
    subject: "",
    credit: 0,
    grade: "",
  });
};
const removeCourses = (index: number) => {
  ruleForm.courses.splice(index, 1);
};
// rule: any,
function lengthCheck(value: any, callback: any) {
  if (Number(value) > 100) {
    callback(new Error(i18n.t("validation.maxLength", { value: 100 })));
  } else {
    return true;
  }
}
// rule: any
function checkLength(value: any, callback: any) {
  if (Number(value) > 15) {
    callback(new Error(i18n.t("validation.maxLength", { value: 15 })));
  } else {
    return true;
  }
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log("ruleForm", ruleForm);
      emit("onSubmit", {
        ...ruleForm,
        student_id: props.student_id,
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};
onMounted(() => {
  if (props.rpltranscriptsForm && props.type === "edit") {
    console.log("Enter");
    const semester_id = props.semester?.find(
      (s: any) => s.label === props.rpltranscriptsForm.title
    );
    Object.assign(ruleForm, props.rpltranscriptsForm);
    ruleForm.semester_id = semester_id.value;
  }
});
</script>

<style scoped></style>
