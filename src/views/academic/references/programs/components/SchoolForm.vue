<template>
  <div class="bg-white px-4 rounded">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
    >
      <div class="grid sm:grid-cols-1 gap-y-1">
        <el-form-item label="Name of school" prop="title">
          <el-input
            v-model="ruleForm.title"
            class="!rounded"
            type="text"
            autocomplete="off"
            :placeholder="$t('shared.text')"
          />
        </el-form-item>
        <el-form-item label="School dean" prop="chief_id">
          <el-select v-model="ruleForm.chief_id" filterable class="w-full">
            <el-option
              v-for="{ label, value } of staffStore.getStaffSelect"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="flex justify-end items-center" v-if="props.type === 'edit'">
      <!-- <button class="hover:text-primary text-black" @click="emit('delete')">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          class="stroke-current fill-transparent"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.3333 5.0013V4.33464C13.3333 3.40121 13.3333 2.9345 13.1517 2.57798C12.9919 2.26438 12.7369 2.00941 12.4233 1.84962C12.0668 1.66797 11.6001 1.66797 10.6667 1.66797H9.33333C8.39991 1.66797 7.9332 1.66797 7.57668 1.84962C7.26308 2.00941 7.00811 2.26438 6.84832 2.57798C6.66667 2.9345 6.66667 3.40121 6.66667 4.33464V5.0013M8.33333 9.58464V13.7513M11.6667 9.58464V13.7513M2.5 5.0013H17.5M15.8333 5.0013V14.3346C15.8333 15.7348 15.8333 16.4348 15.5608 16.9696C15.3212 17.44 14.9387 17.8225 14.4683 18.0622C13.9335 18.3346 13.2335 18.3346 11.8333 18.3346H8.16667C6.76654 18.3346 6.06647 18.3346 5.53169 18.0622C5.06129 17.8225 4.67883 17.44 4.43915 16.9696C4.16667 16.4348 4.16667 15.7348 4.16667 14.3346V5.0013"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button> -->
      <el-button
        type="primary"
        class="!w-[175px] !rounded"
        @click="submitForm(ruleFormRef)"
      >
        Approve
      </el-button>
    </div>
    <div v-else class="flex justify-center">
      <el-button
        type="primary"
        class="!w-[175px] !rounded"
        @click="submitForm(ruleFormRef)"
      >
        {{ $t("shared.save") }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStaffStore } from "@/stores";
import type { FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();
const staffStore = useStaffStore();
const props = defineProps<{
  school?: any | null;
  type?: "create" | "edit";
}>();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  title: "",
  chief_id: "",
});

const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  chief_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});

const emit = defineEmits(["onSubmit", "delete"]);

onMounted(() => {
  if (props.school && props.type === "edit") {
    const data = {
      id: props.school.id,
      title: props.school.title,
      chief_id: props.school.chief?.id || "",
    };
    Object.assign(ruleForm, data);
  }
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
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
