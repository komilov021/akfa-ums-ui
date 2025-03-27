<template>
  <div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
      v-loading="loading"
      @keypress.enter="submitDialog(ruleFormRef)"
    >
      <div class="grid grid-cols-2 gap-4">
        <el-form-item class="w-full !mb-0" prop="parent">
          <el-select
            v-model="ruleForm.parent"
            placeholder="Select"
            class="w-full"
          >
            <el-option
              v-for="item in [
                {
                  value: 'Father',
                  label: 'Father',
                  disabled: disabledParents.male,
                },
                {
                  value: 'Mother',
                  label: 'Mother',
                  disabled: disabledParents.female,
                },
              ]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="w-full !mb-0" prop="fullname">
          <el-input v-model="ruleForm.fullname" placeholder="Full name" />
        </el-form-item>
        <el-form-item class="w-full !mb-0" prop="personal_number">
          <el-input
            v-model="ruleForm.personal_number"
            v-mask="'##############'"
            placeholder="Personal number (PINFL)"
          />
        </el-form-item>
        <el-form-item class="w-full !mb-0" prop="gender">
          <el-select
            v-model="ruleForm.gender"
            placeholder="Gender"
            class="w-full"
          >
            <el-option
              v-for="item in [
                {
                  value: 'male',
                  label: 'Male',
                  disabled: disabledParents.male,
                },
                {
                  value: 'female',
                  label: 'Female',
                  disabled: disabledParents.female,
                },
              ]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="w-full !mb-0" prop="passport_number">
          <el-input
            v-model="ruleForm.passport_number"
            v-mask="'AA#######'"
            placeholder="Passport"
          />
        </el-form-item>
        <el-form-item class="w-full !mb-0" prop="phone">
          <el-input
            v-mask="'+### ## ###-##-##'"
            :formatter="(value: any) => `+998 ${value}`"
            :parser="(value: any) => value.replace(/\+998\s?/g, '')"
            v-model="ruleForm.phone"
            placeholder="Phone number"
          />
        </el-form-item>
        <el-form-item class="w-full" prop="living_address">
          <el-input
            v-model="ruleForm.living_address"
            placeholder="Place of home"
          />
        </el-form-item>
        <el-form-item class="w-full" prop="workplace">
          <el-input v-model="ruleForm.workplace" placeholder="Place of work" />
        </el-form-item>
      </div>
      <div class="flex justify-end">
        <el-button type="primary" @click="submitDialog(ruleFormRef)"
          >Save</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import type { ElMessage, FormInstance, FormRules } from "element-plus";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const i18n = useI18n();
const route = useRoute();
const ruleFormRef = ref<FormInstance>();
const loading = ref(false);
const student_id = ref(route.params.id);
const emit = defineEmits(["onSubmit"]);
const ruleForm = reactive({
  parent: "",
  fullname: "",
  personal_number: "",
  gender: "",
  passport_number: "",
  phone: "",
  living_address: "",
  workplace: "",
});

const props = defineProps<{
  parents: any[];
  disabledParents: any;
}>();
const rules = reactive<FormRules>({
  parent: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  fullname: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  personal_number: [
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
  passport_number: [
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
  living_address: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  workplace: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});
const submitDialog = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let format = `+998${ruleForm.phone?.replace(/[^0-9]+/g, "")}`;
      emit("onSubmit", {
        student_id: student_id.value,
        ...ruleForm,
        phone: format,
      });
    }
  });
};
</script>

<style scoped></style>
