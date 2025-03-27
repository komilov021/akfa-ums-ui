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
      <div class="grid sm:grid-cols-1">
        <el-form-item label="Exam Date" prop="exam_at">
          <el-date-picker
            v-model="ruleForm.exam_at"
            type="date"
            class="!w-full"
            autocomplete="off"
            placeholder="YYYY-MM-DD"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item label="Exam Date" prop="time">
          <el-time-picker
            v-model="ruleForm.time"
            placeholder="Arbitrary time"
            format="HH:mm"
            value-format="HH:mm"
          />
        </el-form-item>
        <el-form-item prop="location" label="Location">
          <el-input placeholder="Location" v-model="ruleForm.location" />
        </el-form-item>
        <el-form-item label="Exam Type" prop="exam_type">
          <el-select v-model="ruleForm.exam_type" class="w-full">
            <el-option
              v-for="(item, i) in ['offline', 'online']"
              :key="i"
              :label="item"
              :value="item"
            />
          </el-select>
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
import { useRoute, useRouter } from "vue-router";

const i18n = useI18n();
const route = useRoute();
const router = useRouter();
const props = defineProps<{
  date?: any | null;
  type?: "create" | "edit";
}>();

const disabledDate = (time: Date) => {
  return time.getTime() <= Date.now();
};

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  exam_at: "",
  location: "",
  exam_type: "",
  time: "",
  year_id: route.path?.slice(22),
});

const rules = reactive<FormRules>({
  exam_at: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  location: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  exam_type: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  time: [
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
      ruleForm.exam_at = ruleForm.exam_at
        ? `${ruleForm.exam_at} ${ruleForm.time}`
        : "";
      let { time, ...data } = ruleForm;
      emit("onSubmit", data);
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
