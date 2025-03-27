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
          v-model="ruleForm.student_uid"
          @input="searchStudent"
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
      <el-form-item prop="payment_date" label="Payment date:">
        <el-date-picker
          v-model="ruleForm.payment_date"
          type="date"
          autocomplete="off"
          class="!w-full"
        />
      </el-form-item>
      <el-form-item label="Choose semester">
        <el-select
          class="w-full"
          placeholder="Select"
          v-model="ruleForm.semester_id"
        >
          <el-option
            v-for="item in semesters"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="amount" label="Current amount">
        <el-input
          v-model="ruleForm.amount"
          autocomplete="off"
          placeholder="700"
          class="!text-xs"
        />
      </el-form-item>
      <el-form-item
        prop="transaction_company_name"
        label="Transaction company name"
      >
        <el-input
          v-model="ruleForm.transaction_company_name"
          autocomplete="off"
          placeholder="Transaction company name"
          class="!text-xs"
        />
      </el-form-item>
      <el-form-item prop="transaction_number" label="Transaction number">
        <el-input
          v-model="ruleForm.transaction_number"
          autocomplete="off"
          type="number"
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
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { dayjs } from "element-plus";
import { useCourseGradesStore } from "@/stores";
import { selectSemesterByNumber } from "@/utils/common";

const i18n = useI18n();
const props = defineProps<{
  semesters: Array<any>;
}>();

const CourseGradesStore = useCourseGradesStore();
const semestrs = ref<any[]>([]);

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  student_uid: "",
  semester_id: "",
  amount: "",
  payment_date: new Date(),
  transaction_company_name: "",
  transaction_number: "",
});
const currency = ref(null);
const rules = reactive<FormRules>({
  student_uid: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  amount: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  payment_date: [
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

onMounted(() => {
  const semestr1 = props.semesters?.find(
    (s) => s.label === selectSemesterByNumber(1)
  );
  const semestr2 = props.semesters?.find(
    (s) => s.label === selectSemesterByNumber(2)
  );

  if (semestr1 && semestr2) {
    semestrs.value = [semestr1, semestr2];
    ruleForm.semester_id = semestr2.value;
  } else {
    semestrs.value = props.semesters;
  }
});

const searchStudent = async (uid: string) => {
  if (uid.length === 6) {
    const res = await CourseGradesStore.searchUser(parseInt(uid));
    currency.value = res.currency;
  }
};
const emit = defineEmits(["onSubmit"]);

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const date = dayjs(ruleForm.payment_date).format("YYYY-MM-DD");
      const data = {
        ...ruleForm,
        student_uid: parseInt(ruleForm.student_uid),
        amount: parseInt(ruleForm.amount),
        payment_date: dayjs(ruleForm.payment_date).format("YYYY-MM-DD"),
      };
      emit("onSubmit", data);
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
