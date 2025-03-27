<template>
  <div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
      @keydown.enter="submitForm(ruleFormRef)"
    >
      <div class="grid sm:grid-cols-1 gap-y-1">
        <el-form-item label="Date" prop="id">
          <el-date-picker
            v-model="ruleForm.duration"
            type="date"
            class="!w-full"
            autocomplete="off"
            placeholder="YYYY-MM-DD"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDate"
            @keydown.enter="submitForm(ruleFormRef)"
          />
        </el-form-item>
      </div>
      <p class="text-[#333333] font-semibold text-sm">Exam mode</p>
      <div class="flex items-center gap-4">
        <el-form-item prop="is_online">
          <el-checkbox
            v-model="ruleForm.is_online"
            label="Online"
            size="large"
          />
        </el-form-item>
        <el-form-item prop="is_offline">
          <el-checkbox
            v-model="ruleForm.is_offline"
            label="Offline"
            size="large"
          />
        </el-form-item>
      </div>
    </el-form>
    <div class="flex">
      <el-button
        type="primary"
        class="w-full"
        size="large"
        @click="submitForm(ruleFormRef)"
      >
        {{ $t("shared.save") }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();

const props = defineProps<{
  date?: any | null;
  type?: "create" | "edit";
}>();

const disabledDate = (time: Date) => {
  return time.getTime() <= Date.now();
};

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  duration: "",
  is_online: false,
  is_offline: true,
});

const rules = reactive<FormRules>({
  duration: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});

const emit = defineEmits(["onSubmit"]);

onMounted(() => {
  if (props.date && props.type === "edit") {
    Object.assign(ruleForm, props.date);
  }
});

const submitForm = async (formEl: FormInstance | undefined) => {
  // formEl.preventDefault();
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      emit("onSubmit", ruleForm);
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
