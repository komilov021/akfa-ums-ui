<template>
  <div class="px-4">
    <div class="flex justify-between gap-2">
      <div class="flex items-center gap-2">
        <el-select
          v-model="options.level"
          filterable
          @change="fetchList"
          class="!w-[200px]"
          placeholder="Select"
          size="large"
        >
          <el-option
            v-for="item in [1, 2, 3, 4, 5, 6]"
            :key="item"
            :label="`Level ${item}`"
            :value="item"
          />
        </el-select>
        <el-select
          placeholder="Select"
          v-model="options.semester"
          @change="fetchList"
          class="!w-[200px]"
        >
          <el-option
            v-for="item in semesters"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
      <div v-if="configurationList?.length">
        <div v-if="!editable" class="flex items-center gap-2">
          <el-button @click="resetConfig()" type="success">Reset</el-button>
          <el-button @click="editable = true" type="primary">Edit</el-button>
        </div>

        <div v-else class="flex items-center gap-1">
          <el-button
            @click="
              reRenderForm();
              editable = false;
            "
            >Cancel</el-button
          >
          <el-button
            @click="submitForm(ruleFormRef)"
            type="success"
            v-loading="loading"
            >Save</el-button
          >
        </div>
      </div>
      <el-button v-else @click="createConfigurationList()" type="primary"
        >Create configuration</el-button
      >
    </div>
    <div class="table-wrapper mt-8" v-loading="loading">
      <el-form
        v-if="configurationList?.length"
        ref="ruleFormRef"
        :model="ruleForm"
      >
        <el-table
          :data="configurationList"
          style="width: 100%; max-height: 96vh"
          :header-cell-style="{ verticalAlign: 'bottom' }"
          class="simpleBorderTable"
        >
          <el-table-column
            prop="title"
            label="Program"
            min-width="300"
            align="left"
            fixed="left"
          />
          <el-table-column label="Student count" min-width="120" align="left">
            <template #default="{ row }">
              {{ beautify.formatNumber(row.student_count) }}
            </template>
          </el-table-column>
          <el-table-column
            label="Semester Based Academic Excellence Scholarship(AES) distribution"
            align="center"
          >
            <el-table-column label="100%" min-width="90" align="left">
              <template #default="{ row, $index }">
                <el-form-item
                  v-if="editable"
                  :prop="'configs.' + $index + '.percentage_100'"
                  :rules="{
                    required: true,
                    message: $t('validation.fillField'),
                    trigger: 'blur',
                    type: 'number',
                    min: 0,
                  }"
                  class="!mb-0"
                >
                  <el-input-number
                    v-model.number="ruleForm.configs[$index].percentage_100"
                    :min="0"
                    :controls="false"
                    size="small"
                    @keypress="onlyNumber"
                  />
                </el-form-item>
                <span v-else>{{
                  beautify.formatNumber(row.percentage_100)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="75%" min-width="90" align="left">
              <template #default="{ row, $index }">
                <el-form-item
                  v-if="editable"
                  :prop="'configs.' + $index + '.percentage_75'"
                  :rules="{
                    required: true,
                    message: $t('validation.fillField'),
                    trigger: 'blur',
                    type: 'number',
                    min: 0,
                  }"
                  class="!mb-0"
                >
                  <el-input-number
                    v-model.number="ruleForm.configs[$index].percentage_75"
                    :min="0"
                    :controls="false"
                    size="small"
                    @keypress="onlyNumber"
                  />
                </el-form-item>
                <span v-else>{{
                  beautify.formatNumber(row.percentage_75)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="50%" min-width="90" align="left">
              <template #default="{ row, $index }">
                <el-form-item
                  v-if="editable"
                  :prop="'configs.' + $index + '.percentage_50'"
                  :rules="{
                    required: true,
                    message: $t('validation.fillField'),
                    trigger: 'blur',
                    type: 'number',
                    min: 0,
                  }"
                  class="!mb-0"
                >
                  <el-input-number
                    v-model.number="ruleForm.configs[$index].percentage_50"
                    :min="0"
                    :controls="false"
                    size="small"
                    @keypress="onlyNumber"
                  />
                </el-form-item>
                <span v-else>{{
                  beautify.formatNumber(row.percentage_50)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="25%" min-width="90" align="left">
              <template #default="{ row, $index }">
                <el-form-item
                  v-if="editable"
                  :prop="'configs.' + $index + '.percentage_25'"
                  :rules="{
                    required: true,
                    message: $t('validation.fillField'),
                    trigger: 'blur',
                    type: 'number',
                    min: 0,
                  }"
                  class="!mb-0"
                >
                  <el-input-number
                    v-model.number="ruleForm.configs[$index].percentage_25"
                    :min="0"
                    :controls="false"
                    size="small"
                    @keypress="onlyNumber"
                  />
                </el-form-item>
                <span v-else>{{
                  beautify.formatNumber(row.percentage_25)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="20%" min-width="90" align="left">
              <template #default="{ row, $index }">
                <el-form-item
                  v-if="editable"
                  :prop="'configs.' + $index + '.percentage_20'"
                  :rules="{
                    required: true,
                    message: $t('validation.fillField'),
                    trigger: 'blur',
                    type: 'number',
                    min: 0,
                  }"
                  class="!mb-0"
                >
                  <el-input-number
                    v-model.number="ruleForm.configs[$index].percentage_20"
                    :min="0"
                    :controls="false"
                    size="small"
                    @keypress="onlyNumber"
                  />
                </el-form-item>
                <span v-else>{{
                  beautify.formatNumber(row.percentage_20)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="10%" min-width="90" align="left">
              <template #default="{ row, $index }">
                <el-form-item
                  v-if="editable"
                  :prop="'configs.' + $index + '.percentage_10'"
                  :rules="{
                    required: true,
                    message: $t('validation.fillField'),
                    trigger: 'blur',
                    type: 'number',
                    min: 0,
                  }"
                  class="!mb-0"
                >
                  <el-input-number
                    v-model.number="ruleForm.configs[$index].percentage_10"
                    :min="0"
                    :controls="false"
                    size="small"
                    @keypress="onlyNumber"
                  />
                </el-form-item>
                <span v-else>{{
                  beautify.formatNumber(row.percentage_10)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="Total number of scholarship holders"
              min-width="120"
              align="left"
              fixed="right"
            >
              <template #default="{ row }">
                {{ beautify.formatNumber(row.max_count) }}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-form>
      <el-empty v-else description="No data" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useAcademicStore, useFinanceStore } from "@/stores";
import { useBeautify } from "@/composables/useBeautify";
import { ElMessage, FormInstance } from "element-plus";
import { useI18n } from "vue-i18n";
import { nextSemester, currentSemester } from "@/utils/common";

const financeStore = useFinanceStore();
const academicStore = useAcademicStore();
const beautify = useBeautify();
const i18n = useI18n();

const editable = ref(false);
const semesters = ref<string[]>([]);
const configurationList = computed(() => financeStore.configurationList);
const loading = computed(() => financeStore.loading);

const options = reactive({
  level: 1,
  semester: "",
});

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<{
  configs: {
    id?: string;
    percentage_100: number;
    percentage_75: number;
    percentage_50: number;
    percentage_25: number;
    percentage_20: number;
    percentage_10: number;
  }[];
}>({
  configs: [],
});

onMounted(async () => {
  await academicStore.fetchSemestr();
  semesters.value = academicStore.listSemesters;
  options.semester = currentSemester();
  fetchList();
});

const fetchList = async () => {
  await financeStore.fetchscholarshipConfigurationList(options);
  reRenderForm();
};

const reRenderForm = () => {
  ruleForm.configs = configurationList.value.map((item) => ({
    id: item.id,
    percentage_100: item.percentage_100,
    percentage_75: item.percentage_75,
    percentage_50: item.percentage_50,
    percentage_25: item.percentage_25,
    percentage_20: item.percentage_20,
    percentage_10: item.percentage_10,
  }));
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await financeStore.editScholarshipConfigurationList({
        data: ruleForm.configs,
      });
      editable.value = false;
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

const onlyNumber = ($event: any) => {
  //console.log($event.keyCode); //keyCodes value
  let keyCode = $event.keyCode ? $event.keyCode : $event.which;
  if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
    // 46 is dot
    $event.preventDefault();
  }
};

const createConfigurationList = async () => {
  await financeStore.createScholarshipConfigurationList(options);
  fetchList();
};
const resetConfig = async () => {
  await financeStore.resetScholarshipConfigurationList(options);
  fetchList();
};
</script>

<style></style>
