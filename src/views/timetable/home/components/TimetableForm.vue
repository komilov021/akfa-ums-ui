<template>
  <div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
      v-loading="loading"
    >
      <template v-if="props.type === 'edit'">
        <div class="grid grid-cols-2 gap-4">
          <el-form-item
            label="Name of calendar"
            prop="name"
            class="text-sm text-[#111928] font-medium font-inter mb-2"
          >
            <el-input
              v-model="ruleForm.name"
              class="gray w-full"
              type="text"
              autocomplete="off"
              placeholder="Name of calendar"
              size="large"
            />
          </el-form-item>
          <el-form-item
            label="Duration of periods per day"
            class="text-sm text-[#111928] font-medium font-inter mb-2"
            prop="duration_in_minutes"
          >
            <el-select
              v-model="ruleForm.duration_in_minutes"
              class="w-full"
              placeholder="Choose the duration of periods"
            >
              <el-option
                v-for="(item, index) in munitesData"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="flex items-center gap-3 mb-6">
          <el-switch
            v-model="isActiveCalendar"
            @change="handleSwitchChange"
            style="
              --el-switch-on-color: #7f56d9;
              --el-switch-off-color: #e5e7eb;
            "
            label="Calendar inactive"
          />
          <span class="text-[#111928] text-sm font-medium">
            {{ isActiveCalendar ? "Calendar active" : "Calendar inactive" }}
          </span>
        </div>
      </template>
      <template v-else>
        <div class="grid grid-cols-2 gap-4">
          <el-form-item
            label="Name of calendar"
            class="text-sm text-[#111928] font-medium font-inter mb-2"
            prop="name"
          >
            <el-input
              v-model="ruleForm.name"
              class="w-full"
              type="text"
              autocomplete="off"
              placeholder="Name of calendar"
            />
          </el-form-item>
          <el-form-item
            label="Semester"
            class="text-sm text-[#111928] font-medium font-inter mb-2"
            prop="semester_id"
          >
            <el-select
              v-model="ruleForm.semester_id"
              class="w-full"
              placeholder="Choose semester"
            >
              <el-option
                v-for="(item, i) in ExamDatesStore.getSemestrsSelct"
                :key="i"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="Choose duration of calendar"
            class="text-sm text-[#111928] font-medium font-inter mb-2"
          >
            <el-date-picker
              size="large"
              v-model="fromToDate"
              class="!w-full"
              type="daterange"
              start-placeholder="From"
              end-placeholder="To"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              @change="dateChange"
              :disabled-date="disabledDate"
            >
              <template #prefix>
                <el-icon>
                  <Calendar />
                </el-icon>
              </template>
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="Duration of periods per day"
            class="text-sm text-[#111928] font-medium font-inter mb-2"
            prop="duration_in_minutes"
          >
            <el-select
              v-model="ruleForm.duration_in_minutes"
              class="w-full"
              placeholder="Choose the duration of periods"
            >
              <el-option
                v-for="(item, index) in munitesData"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <div class="flex items-center gap-3 mb-8 !w-full">
            <el-form-item prop="start_time" class="!mb-0 !w-full">
              <template #label>
                Duration
                <span class="font-medium text-sm text-[#9ca3af]">From</span>
              </template>
              <el-input
                v-model="ruleForm.start_time"
                type="text"
                v-mask="'##:##'"
                placeholder="From"
                @change="(val:any) => timeChange(val, 'start')"
                :disabled-hours="disabledHours"
                :disabled-minutes="disabledMinutes"
              />
            </el-form-item>
            <el-form-item prop="end_time" class="!mb-0 !w-full">
              <template #label>
                <span class="font-medium text-sm text-[#9ca3af]">To</span>
              </template>
              <el-input
                v-model="ruleForm.end_time"
                type="text"
                v-mask="'##:##'"
                placeholder="To"
                @change="(val:any) => timeChange(val, 'end')"
                :disabled-hours="disabledHours"
                :disabled-minutes="disabledMinutes"
              />
            </el-form-item>
          </div>
        </div>
      </template>
      <div class="flex w-full">
        <el-button
          v-if="props.type == 'create'"
          size="large"
          type="primary"
          class="w-full !h-[42px]"
          @click="submitForm(ruleFormRef)"
          >Add calendar</el-button
        >
        <el-button
          v-else
          class="w-full !h-[42px]"
          type="primary"
          size="large"
          @click="submitForm(ruleFormRef)"
          >Save changes</el-button
        >
      </div>
    </el-form>
  </div>
  <el-dialog
    width="380px"
    class="custom-dialog"
    v-model="dialogVisible"
    v-loading="loading"
    :close-on-click-modal="false"
    @close="handleDialogClose"
  >
    <div class="flex justify-center mx-auto mb-4">
      <svg
        width="42"
        height="42"
        viewBox="0 0 42 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 3.5C17.5388 3.5 14.1554 4.52636 11.2775 6.44928C8.39967 8.37221 6.15665 11.1053 4.83212 14.303C3.50758 17.5007 3.16102 21.0194 3.83627 24.4141C4.51151 27.8087 6.17822 30.9269 8.62564 33.3744C11.0731 35.8218 14.1913 37.4885 17.5859 38.1637C20.9806 38.839 24.4993 38.4924 27.697 37.1679C30.8947 35.8433 33.6278 33.6003 35.5507 30.7225C37.4736 27.8446 38.5 24.4612 38.5 21C38.4949 16.3603 36.6495 11.912 33.3687 8.63126C30.088 5.35048 25.6397 3.5051 21 3.5ZM21 29.75C20.6539 29.75 20.3155 29.6474 20.0278 29.4551C19.74 29.2628 19.5157 28.9895 19.3832 28.6697C19.2508 28.3499 19.2161 27.9981 19.2836 27.6586C19.3512 27.3191 19.5178 27.0073 19.7626 26.7626C20.0073 26.5178 20.3191 26.3511 20.6586 26.2836C20.9981 26.2161 21.3499 26.2508 21.6697 26.3832C21.9895 26.5157 22.2628 26.74 22.4551 27.0277C22.6474 27.3155 22.75 27.6539 22.75 28C22.75 28.4641 22.5656 28.9092 22.2374 29.2374C21.9093 29.5656 21.4641 29.75 21 29.75ZM22.75 22.75C22.75 23.2141 22.5656 23.6592 22.2374 23.9874C21.9093 24.3156 21.4641 24.5 21 24.5C20.5359 24.5 20.0908 24.3156 19.7626 23.9874C19.4344 23.6592 19.25 23.2141 19.25 22.75V14C19.25 13.5359 19.4344 13.0907 19.7626 12.7626C20.0908 12.4344 20.5359 12.25 21 12.25C21.4641 12.25 21.9093 12.4344 22.2374 12.7626C22.5656 13.0907 22.75 13.5359 22.75 14V22.75Z"
          fill="#F05252"
        />
      </svg>
    </div>
    <div class="flex justify-center mb-5">
      <p
        class="w-[300px] text-center flex justify-center text-[#6B7280] text-base"
      >
        Are you sure you want to deactivate “Name of calendar”?
      </p>
    </div>
    <div class="flex items-center gap-3">
      <el-button
        type="gray"
        size="large"
        class="w-full !h-[41px]"
        @click="handleCancel"
      >
        Cancel
      </el-button>
      <el-button
        type="red"
        size="large"
        class="w-full !h-[41px]"
        @click="handleConfirm"
      >
        Yes, I’m sure
      </el-button>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { useAcademicStore } from "@/stores";
import { Calendar } from "@element-plus/icons-vue";
import { FormInstance, dayjs, ElMessage, FormRules } from "element-plus";
import { ref, reactive, onMounted } from "vue";

const ExamDatesStore = useAcademicStore();
const ruleFormRef = ref<FormInstance>();
const emit = defineEmits(["onSubmit"]);
const dialogVisible = ref(false);
const loading = ref(false);
const fromToDate: any = ref([]);
const fromToTime: any = ref([]);
const props = defineProps<{
  type: "create" | "edit";
  data: any;
}>();
const ruleForm = reactive({
  name: "" as any,
  duration_in_minutes: null,
  ...props.data,
});
const isActiveCalendar = ref(
  props.data ? props.data.status === "active" : true
);

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: "Name is required",
      trigger: "blur",
    },
  ],
  duration_in_minutes: [
    {
      required: true,
      message: "Duration in minutes is required",
      trigger: "blur",
    },
    {
      type: "number",
      min: 30,
      max: 120,
      message:
        "Duration should be within the specified range of 30 to 120 minutes per day",
      trigger: "blur",
    },
  ],
  semester_id: [
    {
      required: true,
      message: "Semester is required",
      trigger: "blur",
    },
  ],
  fromToDate: [
    {
      required: true,
      message: "Date range is required",
      trigger: "change",
    },
  ],
  fromToTime: [
    {
      required: true,
      message: "The start time (From) cannot be later than the end time (To)",
      trigger: "change",
    },
  ],
  timeError: [
    {
      required: true,
      trigger: "change",
    },
  ],
});
const munitesData = ref<any[]>([
  {
    label: "30",
    value: 30,
  },
  // {
  //   label: "40",
  //   value: 40,
  // },
  // {
  //   label: "50",
  //   value: 50,
  // },
  {
    label: "60",
    value: 60,
  },
  // {
  //   label: "70",
  //   value: 70,
  // },
  // {
  //   label: "80",
  //   value: 80,
  // },
  {
    label: "90",
    value: 90,
  },
  // {
  //   label: "100",
  //   value: 100,
  // },
  // {
  //   label: "110",
  //   value: 110,
  // },
  {
    label: "120",
    value: 120,
  },
]);

const disabledDate = (time: Date) => {
  const currentDate: Date = new Date();
  currentDate.setDate(currentDate.getDate() - 1);
  return time.getTime() <= currentDate.getTime();
};
const dateChange = (val: any) => {
  ruleForm.start_date = val[0];
  ruleForm.end_date = val[1];
};
const makeRange = (start: number, end: number) => {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
};
const disabledHours = () => {
  return makeRange(0, 8).concat(makeRange(19, 23));
};
const disabledMinutes = (hour: number) => {
  if (hour === 9) {
    return makeRange(1, 0);
  }
  if (hour === 18) {
    return makeRange(1, 0);
  }
};
const timeChange = (val: any, type: string) => {
  if (val) {
    if (type == "start") {
      ruleForm.start_time = dayjs(val, "HH:mm").format("HH:mm");
    } else if (type == "end") {
      ruleForm.end_time = dayjs(val, "HH:mm").format("HH:mm");
    }
    if (ruleForm.start_time === ruleForm.end_time) {
      ruleForm.start_time = "";
      ruleForm.end_time = "";
      ElMessage({
        message: "Start time and end time cannot be the same.",
        type: "warning",
      });
    }
  }
};
const submitForm = async (formData: FormInstance | undefined) => {
  if (!formData) return;
  await formData.validate(async (valid, fields) => {
    if (valid) {
      console.log("ruleForm", ruleForm);
      emit("onSubmit", {
        ...ruleForm,
        status: isActiveCalendar.value ? "active" : "inactive",
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

onMounted(() => {
  if (props.data && props.type === "edit") {
    Object.assign(ruleForm, props.data);
  }
  if (!ExamDatesStore.getSemestrsSelct.length) {
    ExamDatesStore.fetchSemestr();
  }
});

const previousState = ref(isActiveCalendar.value);
const handleSwitchChange = (value: boolean | any) => {
  previousState.value = isActiveCalendar.value;
  if (!value) {
    dialogVisible.value = true;
  } else {
    isActiveCalendar.value = true;
  }
};
const handleConfirm = () => {
  isActiveCalendar.value = false;
  dialogVisible.value = false;
};
const handleCancel = () => {
  isActiveCalendar.value = !previousState.value;
  dialogVisible.value = false;
};
const handleDialogClose = () => {
  if (!dialogVisible.value) {
    isActiveCalendar.value = previousState.value;
  }
};
</script>

<style scoped lang="scss">
.el-select__popper {
  .el-select-dropdown {
    &__list {
      .el-select-dropdown__item.selected {
        background-color: #edebfe !important;
      }
    }
  }
}
</style>
