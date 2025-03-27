<template>
  <div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      :hide-required-asterisk="true"
      label-position="top"
      label-width="auto"
      class="space-y-6 !w-full"
    >
      <div class="flex !w-full items-end gap-4">
        <el-form-item
          label="Deadline Date"
          required
          class="!w-full"
          prop="deadline_date"
        >
          <el-date-picker
            v-model="ruleForm.deadline_date"
            type="date"
            placeholder="Select date"
            format="DD.MM.YYYY"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item required class="!w-full" prop="deadline_time">
          <el-input
            v-model="ruleForm.deadline_time"
            type="text"
            placeholder="Select time"
            format="HH:mm:ss"
            v-mask="'##:##:##'"
            :disabled-hours="disabledTime(ruleForm.deadline_time).disabledHours"
            :disabled-minutes="
              disabledTime(ruleForm.deadline_time).disabledMinutes
            "
            @change="timeChange"
            maxlength="8"
          />
        </el-form-item>
      </div>
      <el-button
        class="w-full"
        :type="isFormValid ? 'primary' : 'default'"
        :disabled="!isFormValid"
        @click="submitForm(ruleFormRef)"
      >
        {{ props.type == "create" ? "Confirm" : "Update" }}
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { dayjs, FormInstance, FormRules } from "element-plus";
import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
const i18n = useI18n();
const emit = defineEmits(["onSubmit"]);
const ruleFormRef = ref<FormInstance>();
const props = defineProps<{
  data: any;
  type: string;
}>();
const ruleForm = reactive({
  deadline_date: "",
  deadline_time: "",
});
const disabledDate = (time: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return time < today;
};
const disabledTime = (date: Date | any) => {
  const now = dayjs();
  const selectedDay = dayjs(date).startOf("day");
  if (selectedDay.isSame(now, "day")) {
    return {
      disabledHours: () =>
        Array.from({ length: 24 }, (_, i) => i).filter(
          (hour) => hour < now.hour()
        ),
      disabledMinutes: (hour: number) => {
        if (hour === now.hour()) {
          return Array.from({ length: 60 }, (_, i) => i).filter(
            (minute) => minute < now.minute()
          );
        }
        return [] as any;
      },
    };
  }
  return {
    disabledHours: () => [] as any,
    disabledMinutes: () => [] as any,
  };
};

const timeChange = (val: string) => {
  const [hour, minute] = val.split(":");
  if (parseInt(hour) >= 24 || parseInt(minute) >= 59) {
    ruleForm.deadline_time = "";
    return;
  }
  const formattedTime = dayjs(val, "HH:mm:ss").format("HH:mm:ss");
  ruleForm.deadline_time = formattedTime;
};

const isFormValid = computed(() => {
  return ruleForm.deadline_time && ruleForm.deadline_date;
});
const rules = reactive<FormRules>({
  deadline_date: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  deadline_time: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      emit("onSubmit", ruleForm);
    } else {
      console.log("error submit!", fields);
    }
  });
};
watch(
  () => props?.data,
  (newVal) => {
    if (newVal) {
      const date = newVal.published_deadline
        ? newVal.published_deadline.split(" ")
        : [];
      if (date.length > 0) {
        ruleForm.deadline_date = date[0];
        ruleForm.deadline_time = date[1];
      }
    }
  },
  { immediate: true }
);
</script>
