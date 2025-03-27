<template>
  <div class="px-4 grid gap-4">
    <div
      v-for="(detail, index) of programDetails"
      :key="detail.semester"
      class="grid gap-2"
    >
      <div class="flex items-center justify-between gap-2">
        <h1 class="font-semibold text-lg">{{ detail.semester }}</h1>
        <div>
          <el-button
            v-if="!detail.editable"
            @click="detail.editable = true"
            type="primary"
            >Edit</el-button
          >
          <div v-else class="flex items-center gap-1">
            <el-button @click="detail.editable = false">Cancel</el-button>
            <el-button
              @click="submitForm(detail, index)"
              type="success"
              v-loading="loading"
              >Save</el-button
            >
          </div>
        </div>
      </div>
      <el-form ref="ruleFormRef" :model="ruleForms.config[index]">
        <el-table
          :data="detail.data"
          class="whiteStripe"
          row-class-name="noHover"
          style="width: 100%"
        >
          <el-table-column
            prop="level"
            label="Level"
            min-width="150"
            align="left"
          />
          <el-table-column label="Amount UZS" min-width="160" align="left">
            <template #default="{ row, $index }">
              <el-form-item
                v-if="detail.editable"
                :prop="'data.' + $index + '.amount'"
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
                  v-model.number="ruleForms.config[index].data[$index].amount"
                  :min="0"
                  :controls="false"
                  size="small"
                  @keypress="onlyNumber"
                />
              </el-form-item>
              <span v-else>{{ beautify.formatNumber(row.amount) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Amount USD" min-width="160" align="left">
            <template #default="{ row, $index }">
              <el-form-item
                v-if="detail.editable"
                :prop="'data.' + $index + '.amount_usd'"
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
                  v-model.number="
                    ruleForms.config[index].data[$index].amount_usd
                  "
                  :min="0"
                  :controls="false"
                  size="small"
                  @keypress="onlyNumber"
                />
              </el-form-item>
              <span v-else>{{ beautify.formatNumber(row.amount_usd) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Credit" min-width="160" align="left">
            <template #default="{ row, $index }">
              <el-form-item
                v-if="detail.editable"
                :prop="'data.' + $index + '.credit'"
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
                  v-model.number="ruleForms.config[index].data[$index].credit"
                  :min="0"
                  :controls="false"
                  size="small"
                  @keypress="onlyNumber"
                />
              </el-form-item>
              <span v-else>{{ beautify.formatNumber(row.credit) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useFinanceStore, useGuideStore } from "@/stores";
import { useRoute } from "vue-router";
import { useBeautify } from "@/composables/useBeautify";
import { ElMessage, FormInstance } from "element-plus";
import { useI18n } from "vue-i18n";

const i18n = useI18n();
const financeStore = useFinanceStore();
const guideStore = useGuideStore();

const loading = ref(false);
const programDetails = computed(() => financeStore.programDetails);
const currentProgram = computed(() => guideStore.currentTuition);

const beautify = useBeautify();
const route = useRoute();

const ruleFormRef = ref<FormInstance[]>();
const ruleForms = reactive<{
  config: {
    semester?: string;
    data: {
      amount: number;
      amount_usd: number;
      credit: number;
    }[];
  }[];
}>({
  config: [],
});

onMounted(() => {
  fetchList();
  guideStore.getTuitionById(route.params?.id as string);
});
const fetchList = async () => {
  await financeStore.fetchPaymentProgramDetailList(route.params?.id as string);
  reRenderForm();
};

const reRenderForm = () => {
  ruleForms.config = programDetails.value.map((item: any) => ({
    semester: item?.semester,
    data: item?.data,
  }));
};

const onlyNumber = ($event: any) => {
  let keyCode = $event.keyCode ? $event.keyCode : $event.which;
  if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
    $event.preventDefault();
  }
};
console.log("ruleFormRef.value", ruleFormRef.value);

const submitForm = async (form: any, index: number) => {
  let formEl;
  if (ruleFormRef.value && Array.isArray(ruleFormRef.value)) {
    formEl = ruleFormRef.value[index];
  }

  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const formValue = ruleForms.config[index];
      const formData = formValue.data?.map((item) => ({
        ...item,
        semester: formValue.semester,
        program_id: route.params?.id as string,
        title: currentProgram.value?.program,
      }));
      await financeStore.editPaymentProgramDetailList({
        data: formData,
      });
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

<style></style>
