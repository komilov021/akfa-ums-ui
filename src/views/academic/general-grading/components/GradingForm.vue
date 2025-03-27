<template>
  <div class="text-center">
    <ul class="flex flex-col gap-2 text-left">
      <li v-if="formType == 'edit'" class="border-l-2 border-black px-2">
        <span class="font-semibold text-black">Student ID:</span>
        {{ grade?.uid }}
      </li>
      <li class="border-l-2 border-black px-2">
        <span class="font-semibold text-black">Course:</span>
        {{ program }}
      </li>
      <li class="border-l-2 border-black px-2">
        <span class="font-semibold text-black">Grading:</span>
        {{ component }}
      </li>
    </ul>
    <el-divider class="my-2" />
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      :hide-required-asterisk="true"
      label-position="top"
      class="w-full"
    >
      <el-form-item v-if="formType == 'edit'" label="Old grade">
        <el-input :value="grade?.score" disabled />
      </el-form-item>
      <el-form-item v-if="formType == 'create'" label="Search by Id">
        <div class="flex items-center space-x-2 w-full">
          <el-input
            v-model="searchVal"
            type="number"
            @keyup.enter="searchUser"
            autocomplete="off"
            class="w-full"
            :placeholder="$t('shared.text')"
          />
          <el-button
            type="primary"
            :icon="Search"
            size="large"
            @click="searchUser"
            :disabled="searchVal?.length <= 2"
            >Search</el-button
          >
        </div>
        <p>Please click search button or enter to find student !!!</p>
      </el-form-item>
      <el-form-item prop="score" label="New grade">
        <el-input-number
          v-model="ruleForm.score"
          :min="0"
          :controls="false"
          class="!w-full"
          :value-on-clear="null"
        />
      </el-form-item>
      <el-button
        type="primary"
        size="large"
        class="mt-w w-full mt-4 !h-9 !mx-auto"
        @click="submitForm(ruleFormRef)"
      >
        Sumbit
      </el-button>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import sha1 from "sha1";
import { dayjs } from "element-plus";
import type { IStaff, IStudentGrade } from "@/models/backend";
import type { ControlItem } from "@/models/frontend";
import { useCourseGradesStore } from "@/stores";
import { Search } from "@element-plus/icons-vue";

const i18n = useI18n();
const props = defineProps<{
  grade: IStudentGrade;
  component: string;
  program: string;
  formType: string;
}>();
const coursesGradeStore = useCourseGradesStore();
const searchVal = ref();
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  student_id: "",
  score: null as any,
});
const rules = reactive<FormRules>({
  score: [
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
const searchUser = async () => {
  try {
    if (isNaN(+searchVal.value)) {
      ElMessageBox({
        message: "Please input only number value",
        type: "warning",
      });
      return;
    }
    const user = await coursesGradeStore.searchUser(+searchVal.value);

    if (!user) {
      ElMessage({
        message: "User not found",
        type: "error",
      });
      ruleForm.student_id = "";
      return;
    }
    ruleForm.student_id = user.id;
  } catch (error: any) {
    console.log("error", error.message);
  }
};
</script>
