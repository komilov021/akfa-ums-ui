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
      <el-form-item prop="student_uid" label="Student ID: ">
        <el-input
          :disabled="!!props.student"
          @input="searchStudent"
          v-model="ruleForm.student_uid"
          autocomplete="off"
          placeholder="200001"
          class="!text-xs"
        />
      </el-form-item>
      <div class="flex flex-col text-start mb-5" v-if="currency">
        <p class="my-2 text-sm font-semibold">
          Foreign student:
          <span class="text-primary">{{
            currency === "USD" ? "Yes" : "No"
          }}</span>
        </p>
        <p class="text-sm font-semibold">
          Currency: <span class="text-primary">{{ currency }}</span>
        </p>
      </div>
      <el-form-item prop="payment_deadline" label="Payment dealine:">
        <el-date-picker
          v-model="ruleForm.payment_deadline"
          type="date"
          autocomplete="off"
          class="!w-full"
        />
      </el-form-item>
      <el-form-item label="Choose semester" v-if="props.type == 'create'">
        <el-select
          :disabled="!!props.student"
          class="w-full"
          placeholder="Select"
          v-model="ruleForm.semester_id"
        >
          <el-option
            v-for="item in [
              { value: 'none', label: 'All' },
              ...props.semesters,
            ]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="total_tuition_fee" label="Total amount">
        <el-input
          :disabled="!!props.student"
          v-model="ruleForm.total_tuition_fee"
          autocomplete="off"
          placeholder="700"
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
import { ref, reactive, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { dayjs } from "element-plus";
import { IPaymentForm } from "@/models/backend";
import { useCourseGradesStore } from "@/stores";
const i18n = useI18n();
const props = defineProps<{
  semesters: Array<any>;
  student: any;
  type?: "create" | "edit";
}>();
const CourseGradesStore = useCourseGradesStore();
const ruleFormRef = ref<FormInstance>();
const currency = ref();
const ruleForm = reactive({
  student_uid: "" as string,
  semester_id: props.semesters[props.semesters.length - 3].value,
  total_tuition_fee: "" as string,
  payment_deadline: new Date(),
});

const rules = reactive<FormRules>({
  student_uid: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  total_tuition_fee: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  payment_deadline: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  semester_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});

const searchStudent = async (uid: string) => {
  if (uid.length === 6) {
    const res = await CourseGradesStore.searchUser(parseInt(uid));
    currency.value = res.currency;
  }
};
onMounted(() => {
  if (props.student && props.type === "edit") {
    searchStudent(props.student.student_uid.toString());
    (ruleForm.student_uid = props.student.student_uid),
      (ruleForm.semester_id = props.student.semester_id),
      (ruleForm.total_tuition_fee = props.student.payment_total),
      (ruleForm.payment_deadline = props.student.deadline);
  }
});

const emit = defineEmits(["onSubmit"]);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const data = {
        ...ruleForm,
        student_uid: parseInt(ruleForm.student_uid),
        total_tuition_fee: parseInt(ruleForm.total_tuition_fee),
        payment_deadline: dayjs(ruleForm.payment_deadline).format("YYYY-MM-DD"),
      };
      emit("onSubmit", data);
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
