<template>
  <div>
    <div class="flex justify-between items-center">
      <div class="flex flex-col">
        <h1 class="text-text-900 font-semibold text-xl">Family information</h1>
        <p class="text-tertiary-600">Other information about student</p>
      </div>
      <div class="flex gap-3">
        <el-button
          v-if="ruleForm.data?.length < 2"
          type="primary"
          class="w-36"
          @click="openCreateStudentParent"
          >Create Parent</el-button
        >
      </div>
    </div>
    <div v-if="parents?.length">
      <div v-for="(item, index) in ruleForm.data" :key="index">
        <div class="flex justify-between items-center">
          <h1 class="font-semibold text-sm text-gray-800">
            {{ ruleForm.data[index].parent.toLocaleUpperCase() }}
          </h1>
          <div class="flex justify-end mb-3">
            <el-button
              type="primary"
              v-if="!ruleForm.data[index].editable"
              @click="ruleForm.data[index].editable = true"
              >Edit</el-button
            >
            <div v-else>
              <el-button @click="ruleForm.data[index].editable = false"
                >Cancel</el-button
              >
              <el-button type="primary" @click="submitForm(ruleFormRef, index)"
                >Save</el-button
              >
            </div>
          </div>
        </div>
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          label-position="left"
          label-width="280"
          require-asterisk-position="right"
        >
          <el-form-item
            label="Full name"
            :prop="'data.' + index + '.fullname'"
            :rules="{
              required: true,
              message: $t('validation.fillField'),
              trigger: ['change', 'blur'],
            }"
          >
            <el-input
              autocomplete="off"
              v-model="ruleForm.data[index].fullname"
              class="w-full"
              :disabled="!ruleForm.data[index].editable"
            />
          </el-form-item>
          <el-form-item
            label="Personal number (PINFL)"
            class="w-full"
            :prop="'data.' + index + '.personal_number'"
            :rules="{
              required: true,
              message: $t('validation.fillField'),
              trigger: ['change', 'blur'],
            }"
          >
            <el-input
              class="!w-full"
              v-mask="'##############'"
              v-model="ruleForm.data[index].personal_number"
              :disabled="!ruleForm.data[index].editable"
              autocomplete="off"
              placeholder="Enter personal number (PINFL)"
            />
          </el-form-item>
          <el-form-item
            label="Gender"
            :prop="'data.' + index + '.gender'"
            :rules="{
              required: true,
              message: $t('validation.fillField'),
              trigger: ['change', 'blur'],
            }"
          >
            <el-select
              v-model="ruleForm.data[index].gender"
              class="w-full"
              placeholder="Select"
              :disabled="!ruleForm.data[index].editable"
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
          <el-form-item
            label="Passport"
            :prop="'data.' + index + '.passport_number'"
            :rules="{
              required: true,
              message: $t('validation.fillField'),
              trigger: ['change', 'blur'],
            }"
          >
            <el-input
              type="text"
              autocomplete="off"
              v-model="ruleForm.data[index].passport_number"
              class="w-full"
              v-mask="'AA#######'"
              placeholder="AA1234567"
              :disabled="!ruleForm.data[index].editable"
            />
          </el-form-item>
          <el-form-item
            label="Phone number"
            :prop="'data.' + index + '.phone'"
            :rules="{
              required: true,
              message: $t('validation.fillField'),
              trigger: 'blur',
              min: 0,
            }"
          >
            <el-input
              class="w-full"
              v-mask="'+998 ## ###-##-##'"
              v-model="ruleForm.data[index].phone"
              autocomplete="off"
              placeholder="Phone number"
              :disabled="!ruleForm.data[index].editable"
            />
          </el-form-item>
          <el-form-item
            label="Place of home"
            :prop="'data.' + index + '.living_address'"
            :rules="{
              required: true,
              message: $t('validation.fillField'),
              trigger: ['change', 'blur'],
            }"
          >
            <el-input
              type="text"
              autocomplete="off"
              v-model="ruleForm.data[index].living_address"
              class="w-full"
              placeholder="Text"
              :disabled="!ruleForm.data[index].editable"
            />
          </el-form-item>
          <el-form-item
            label="Place of work"
            :prop="'data.' + index + '.workplace'"
            :rules="{
              required: true,
              message: $t('validation.fillField'),
              trigger: ['change', 'blur'],
            }"
          >
            <el-input
              type="text"
              autocomplete="off"
              v-model="ruleForm.data[index].workplace"
              class="w-full"
              placeholder="Text"
              :disabled="!ruleForm.data[index].editable"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-empty v-else description="No Data" />
  </div>
  <el-dialog v-model="additionalDialog" title="Family Information">
    <AdditionalInfoDialog
      v-if="additionalDialog"
      :parents="parents"
      :disabledParents="disabledParents"
      @on-submit="submitParent($event)"
    ></AdditionalInfoDialog>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useStudentsStore } from "@/stores";
import type { IStudentParent } from "@/models/backend";
import { FormRules, FormInstance, ElMessage, ElMessageBox } from "element-plus";
import AdditionalInfoDialog from "./components/AdditionalInfoDialog.vue";

const i18n = useI18n();
const route = useRoute();
const store = useStudentsStore();
const loading = ref(false);
const additionalDialog = ref(false);
const formType = ref<"edit" | "create">("create");
const ruleFormRef = ref<FormInstance[]>();

const parents = computed(() => store.getstudentparents);
const disabledParents = computed(() => {
  return {
    male: parents.value.some((parent) => parent.gender === "male"),
    female: parents.value.some((parent) => parent.gender === "female"),
  };
});
const ruleForm = reactive({
  data: [
    {
      parent_id: "",
      student_id: "",
      parent: "Father",
      fullname: "",
      personal_number: "",
      gender: "",
      passport_number: "",
      phone: "",
      living_address: "",
      workplace: "",
      editable: false,
    },
    {
      parent_id: "",
      student_id: "",
      parent: "Mother",
      fullname: "",
      personal_number: "",
      gender: "",
      passport_number: "",
      phone: "",
      living_address: "",
      workplace: "",
      editable: false,
    },
  ],
});

onMounted(async () => {
  await fetchList();
});

const reactiveParent = () => {
  ruleForm.data = parents.value?.map((parent: IStudentParent) => ({
    parent_id: parent.id,
    ...parent,
  })) as any[];
};
const fetchList = async () => {
  await store.getStudentParentsList(route.params.id as string);
  reactiveParent();
};

const submitParent = async (data: IStudentParent) => {
  try {
    loading.value = true;
    await store.createStudentParenst(data);
    ElMessage({
      message: i18n.t("shared.created"),
      type: "success",
    });
    loading.value = false;
    fetchList();
    additionalDialog.value = false;
  } catch (error) {
    loading.value = false;
    additionalDialog.value = false;
    console.log("error", error);
  }
};

const openCreateStudentParent = () => {
  formType.value = "create";
  additionalDialog.value = true;
};

const submitForm = async (formEl: any, index: number) => {
  if (ruleFormRef.value && Array.isArray(ruleFormRef.value)) {
    formEl = ruleFormRef.value[index];
  }
  if (!formEl) return;
  await formEl.validate(async (valid: any, fields: any) => {
    if (valid) {
      const formValue = ruleForm.data[index];
      await store.updateStudentParents({ ...formValue });
      ruleForm.data[index].editable = false;
      ElMessage({
        message: i18n.t("shared.updated"),
        type: "success",
      });
      fetchList();
    } else {
      ElMessage({
        message: "Please, Fill all fields",
        type: "error",
        duration: 5 * 1000,
      });
      console.log("error submit!", fields);
    }
  });
};
</script>

<style scoped></style>
