<template>
  <div class="bg-white px-4 py-8 rounded">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
    >
      <div class="grid sm:grid-cols-3 gap-4">
        <el-form-item label="First name" prop="first_name">
          <el-input
            type="text"
            autocomplete="off"
            v-model="ruleForm.first_name"
            size="large"
            class="w-full"
            :placeholder="$t('shared.text')"
          />
        </el-form-item>
        <el-form-item label="Last name" prop="last_name">
          <el-input
            type="text"
            autocomplete="off"
            v-model="ruleForm.last_name"
            size="large"
            class="w-full"
            :placeholder="$t('shared.text')"
          />
        </el-form-item>
        <el-form-item label="Birth date" prop="birth_date">
          <el-date-picker
            v-model="ruleForm.birth_date"
            type="date"
            autocomplete="off"
            class="!w-full"
            :placeholder="$t('shared.date')"
            size="large"
          />
        </el-form-item>
        <el-form-item label="Gender" prop="gender">
          <el-select
            v-model="ruleForm.gender"
            class="w-full"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="item in [
                { value: 'male', label: 'MALE' },
                { value: 'female', label: 'FEMALE' },
              ]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input
            type="email"
            autocomplete="off"
            v-model="ruleForm.email"
            size="large"
            class="w-full"
            placeholder="example@gmail.com"
          />
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
          <el-input
            type="number"
            autocomplete="off"
            v-model="ruleForm.phone"
            size="large"
            class="w-full"
            placeholder="+998"
          />
        </el-form-item>
        <el-form-item label="Passport serial and number" prop="passport">
          <el-input
            type="text"
            autocomplete="off"
            v-model="ruleForm.passport"
            size="large"
            class="w-full"
            placeholder="AA1234567"
          />
        </el-form-item>
        <el-form-item label="PINFL" prop="pinfl">
          <el-input
            type="number"
            autocomplete="off"
            v-model="ruleForm.pinfl"
            size="large"
            class="w-full"
            placeholder="30241045335510"
          />
        </el-form-item>
        <el-form-item label="UID" prop="uid">
          <el-input
            type="number"
            autocomplete="off"
            v-model="ruleForm.uid"
            size="large"
            class="w-full"
            placeholder="220008"
          />
        </el-form-item>
        <el-form-item label="Acceptance Year" prop="acceptance_year">
          <el-select
            v-model="ruleForm.acceptance_year"
            class="w-full"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="item in $props.years"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Department" prop="program_id">
          <el-select
            v-model="ruleForm.program_id"
            class="w-full"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="item in $props.programs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Study year" prop="study_year">
          <el-input
            type="text"
            autocomplete="off"
            v-model="ruleForm.study_year"
            size="large"
            class="w-full"
            placeholder="MS1"
          />
        </el-form-item>
        <el-form-item label="Level" prop="level">
          <el-input
            type="number"
            autocomplete="off"
            v-model.number="ruleForm.level"
            size="large"
            class="w-full"
            placeholder="1"
          />
        </el-form-item>
        <el-form-item label="Graduation year" prop="graduation_year">
          <el-date-picker
            v-model="ruleForm.graduation_year"
            type="year"
            autocomplete="off"
            value-format="YYYY"
            size="large"
            class="!w-full"
            placeholder="Select year"
          />
        </el-form-item>
        <el-form-item label="Residency" prop="country_id">
          <el-select
            v-model="ruleForm.country_id"
            class="w-full"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="item in $props.country"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('dashboard.photo')" prop="avatar" id="avatar">
          <AppUpload
            @upload="(file: any) => { ruleForm.avatar = file, ruleFormRef?.clearValidate('photo') }"
            class=" "
            @remove="() => (ruleForm.avatar = null)"
            list-type="picture"
            accept="image/*"
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
import AppUpload from "@/components/common/AppUpload.vue";
import type { ControlItem } from "@/models/frontend";
import { dayjs, type FormInstance, type FormRules } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();

const props = defineProps<{
  student?: any | null;
  programs: ControlItem[];
  country: any;
  years: ControlItem[];
  type?: "create" | "edit";
}>();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  id: undefined,
  uid: "",
  program_id: "",
  first_name: "",
  last_name: "",
  email: "",
  level: 1,
  passport: "",
  pinfl: "",
  acceptance_year: "",
  gender: "",
  birth_date: "",
  // emergency_contact: "",
  graduation_year: "",
  phone: "",
  study_year: 1 as number,
  avatar: null,
  country_id: "",
  // parent_gender: "male"
});

const rules = reactive<FormRules>({
  uid: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
    {
      min: 2,
      message: i18n.t("validation.minimumLength", { value: 2 }),
      trigger: "blur",
    },
  ],
  program_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  country_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  first_name: [
    {
      min: 2,
      message: i18n.t("validation.minimumLength", { value: 2 }),
      trigger: "blur",
    },
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  last_name: [
    {
      min: 2,
      message: i18n.t("validation.minimumLength", { value: 2 }),
      trigger: "blur",
    },
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  email: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  avatar: [
    {
      required: false,
      message: i18n.t("validation.fillField"),
      trigger: "blur, change",
    },
  ],
  level: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  passport: [
    {
      min: 8,
      message: i18n.t("validation.minimumLength", { value: 8 }),
      trigger: "blur",
    },
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  pinfl: [
    {
      min: 14,
      message: i18n.t("validation.minimumLength", { value: 14 }),
      trigger: "blur",
    },
    {
      max: 14,
      message: i18n.t("validation.maximumLength", { value: 14 }),
      trigger: "blur",
    },
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  acceptance_year: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  gender: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  birth_date: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  phone: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  study_year: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  graduation_year: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});

const emit = defineEmits(["onSubmit"]);

onMounted(() => {
  if (props.student && props.type === "edit") {
    ruleForm.id = props.student.id;
    ruleForm.uid = props.student.uid;
    ruleForm.program_id = props.student?.program?.id;
    ruleForm.first_name = props.student.first_name;
    ruleForm.last_name = props.student.last_name;
    ruleForm.email = props.student.email;
    ruleForm.level = props.student.level;
    ruleForm.passport = props.student.passport;
    ruleForm.pinfl = props.student.pinfl;
    ruleForm.acceptance_year = props.student.acceptance_year;
    ruleForm.gender = props.student.gender;
    ruleForm.birth_date = props.student.birth_date;
    ruleForm.phone = props.student.phone;
    ruleForm.study_year = props.student.study_year;
    ruleForm.country_id = props.student.country_id;
  }
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      (ruleForm.birth_date = dayjs(ruleForm.birth_date).format("YYYY-MM-DD")),
        (ruleForm.graduation_year = parseInt(ruleForm.graduation_year) as any);
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
