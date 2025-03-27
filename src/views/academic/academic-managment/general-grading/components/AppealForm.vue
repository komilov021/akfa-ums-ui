<template>
  <div class="flex flex-col items-center justify-center">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      :hide-required-asterisk="true"
      label-position="top"
      label-width="auto"
      class="space-y-6 w-full"
    >
      <div class="flex gap-4 items-end w-full">
        <el-form-item
          label="Deadline for students"
          prop="student_date"
          required
          class="!w-full"
        >
          <el-date-picker
            v-model="ruleForm.student_date"
            type="date"
            placeholder="Select date"
            format="DD.MM.YYYY"
            value-format="YYYY-MM-DD"
            class="!w-full"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item prop="student_time" required class="!w-full">
          <el-input
            v-model="ruleForm.student_time"
            class="!w-full"
            type="text"
            placeholder="Select time"
            format="HH:mm"
            v-mask="'##:##'"
            :disabled-hours="disabledTime(ruleForm.student_time).disabledHours"
            :disabled-minutes="
              disabledTime(ruleForm.student_time).disabledMinutes
            "
            @change="timeChange1"
            maxlength="5"
          />
        </el-form-item>
      </div>
      <div class="flex gap-4 items-end w-full">
        <el-form-item
          label="Deadline for professor"
          prop="professor_date"
          required
          class="!w-full"
        >
          <el-date-picker
            v-model="ruleForm.professor_date"
            type="date"
            placeholder="Select date"
            format="DD.MM.YYYY"
            value-format="YYYY-MM-DD"
            class="!w-full"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item prop="professor_time" required class="!w-full">
          <el-input
            v-model="ruleForm.professor_time"
            class="!w-full"
            type="text"
            placeholder="Select time"
            format="HH:mm"
            v-mask="'##:##'"
            :disabled-hours="
              disabledTime(ruleForm.professor_time).disabledHours
            "
            :disabled-minutes="
              disabledTime(ruleForm.professor_time).disabledMinutes
            "
            @change="timeChange2"
            maxlength="5"
          />
        </el-form-item>
      </div>
      <el-button
        v-if="props.type == 'create'"
        :type="isFormValid ? 'primary' : 'gray'"
        class="w-full"
        @click="submitForm(ruleFormRef, true)"
      >
        Confirm and activate
      </el-button>
      <div v-else class="flex gap-2 w-full">
        <el-button class="w-full" @click="submitForm(ruleFormRef)">
          Update
        </el-button>
        <el-button
          type="danger"
          class="w-full"
          @click="submitForm(ruleFormRef, false)"
        >
          Deactivate
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { dayjs, ElMessage, FormInstance, FormRules } from "element-plus";
import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
const i18n = useI18n();
const emit = defineEmits(["onSubmit"]);
const ruleFormRef = ref<FormInstance>();
const props = defineProps<{
  data: any;
  type: string;
}>();
console.log(props.data, "type");
const disabledDate = (time: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return time < today;
};
const ruleForm = reactive({
  student_date: "",
  professor_date: "",
  student_time: "",
  professor_time: "",
  has_appeal: true,
});
const rules = reactive<FormRules>({
  student_date: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  professor_date: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  student_time: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  professor_time: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});
const isFormValid = computed(() => {
  return (
    ruleForm.student_date &&
    ruleForm.student_time &&
    ruleForm.professor_date &&
    ruleForm.professor_time
  );
});

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

const timeChange1 = (val: string) => {
  const [hour, minute] = val.split(":");
  if (parseInt(hour) >= 24 || parseInt(minute) >= 59) {
    ruleForm.student_time = "";
    ruleForm.professor_time = "";
    return;
  }
  const formattedTime = dayjs(val, "HH:mm").format("HH:mm");
  ruleForm.student_time = formattedTime;
};
const timeChange2 = (val: string) => {
  const [hour, minute] = val.split(":");
  if (parseInt(hour) >= 24 || parseInt(minute) >= 59) {
    ruleForm.student_time = "";
    ruleForm.professor_time = "";
    return;
  }
  const formattedTime = dayjs(val, "HH:mm").format("HH:mm");
  ruleForm.professor_time = formattedTime;
};

const submitForm = async (
  formEl: FormInstance | undefined,
  isDeactivate: boolean | null = null
) => {
  if (!formEl) return;

  await formEl.validate(async (valid) => {
    if (valid) {
      const studentDateTime = dayjs(
        `${ruleForm.student_date} ${ruleForm.student_time}`,
        "YYYY-MM-DD HH:mm"
      ).format("YYYY-MM-DD HH:mm:ss");
      const professorDateTime = dayjs(
        `${ruleForm.professor_date} ${ruleForm.professor_time}`,
        "YYYY-MM-DD HH:mm"
      ).format("YYYY-MM-DD HH:mm:ss");
      const payload = {
        student_appeal_deadline: studentDateTime,
        teacher_appeal_deadline: professorDateTime,
        has_appeal: isDeactivate !== null ? isDeactivate : ruleForm.has_appeal,
      };
      emit("onSubmit", payload);
    } else {
      ElMessage.error("Formda xatolik bor!");
    }
  });
};
watch(
  () => props?.data,
  (newVal) => {
    if (newVal) {
      const student = newVal.student_appeal_deadline
        ? newVal.student_appeal_deadline.split(" ")
        : [];
      const professor = newVal.teacher_appeal_deadline
        ? newVal.teacher_appeal_deadline.split(" ")
        : [];
      if (student.length > 0) {
        ruleForm.student_date = student[0];
        ruleForm.student_time = student[1];
      }
      if (professor.length > 0) {
        ruleForm.professor_date = professor[0];
        ruleForm.professor_time = professor[1];
      }
      ruleForm.has_appeal = newVal.has_appeal;
    }
  },
  { immediate: true }
);
</script>
