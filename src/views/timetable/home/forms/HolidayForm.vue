<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    label-position="top"
    require-asterisk-position="right"
    ref="formEl"
  >
    <el-form-item
      label="Name of holiday"
      prop="name"
      class="text-sm text-[#111928] font-medium font-inter mb-2"
    >
      <el-input
        v-model="ruleForm.name"
        class="w-full"
        type="text"
        autocomplete="off"
        placeholder="Name of holiday"
      />
    </el-form-item>
    <el-form-item label="Date" prop="date" class="!mb-4">
      <el-date-picker
        v-model="ruleForm.date"
        type="date"
        format="DD.MM.YY"
        value-format="YYYY-MM-DD"
        class="!w-full"
        placeholder="Select date"
        :disabled-date="disabledDate"
      />
    </el-form-item>
    <div class="flex items-center">
      <el-button
        v-if="isEdit"
        type="red"
        class="w-full !h-[42px] mt-6"
        @click="confirmDelete"
      >
        Delete
      </el-button>
      <el-button
        :type="buttonType"
        class="w-full !h-[42px] mt-6"
        @click="openRemember(formEl)"
      >
        {{ isEdit ? "Edit holiday" : "Add holiday" }}
      </el-button>
    </div>
  </el-form>
  <el-dialog width="380px" v-model="infoForm" v-loading="loading">
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
        Are you sure you want to make this day as holiday? There
        {{ holidayEvents?.class }} classes, {{ holidayEvents?.event }} events,
        {{ holidayEvents?.practice }} practices,
        {{ holidayEvents?.exam }} exams.
      </p>
    </div>
    <div class="flex items-center gap-3">
      <el-button
        type="gray"
        size="large"
        class="w-full !h-[42px]"
        @click="infoForm = false"
      >
        Cancel
      </el-button>
      <el-button
        type="red"
        size="large"
        class="w-full !h-[42px]"
        @click="submitForm(formEl)"
      >
        Yes, I’m sure
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { useTimetableStore } from "@/stores";
import {
  dayjs,
  ElMessage,
  ElMessageBox,
  FormInstance,
  FormRules,
} from "element-plus";
import { computed, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const formEl = ref<FormInstance>();
const calendarStore = useTimetableStore();
const holidayEvents = computed(() => calendarStore.holidayEventCount);
const loading = ref(false);
const infoForm = ref(false);
const router = useRouter();
const props = defineProps(["holiday"]);
const i18n = useI18n();
const ruleForm = reactive({
  name: props.holiday?.title || "",
  date: props.holiday?.extendedProps?.event_date || "",
  description: "holiday",
});
const isEdit = computed(() => !!props.holiday?.extendedProps?.event_id);
const emit = defineEmits(["submit-success"]);
const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: "Holiday name is required",
      trigger: "blur",
    },
  ],
  date: [
    {
      required: true,
      message: "Date is required",
      trigger: "blur",
    },
  ],
});

const buttonType = computed(() => {
  return ruleForm.name || ruleForm.description || ruleForm.date
    ? "primary"
    : "gray";
});

const disabledDate = (time: Date) => {
  const currentDate: Date = new Date();
  currentDate.setDate(currentDate.getDate() - 1);
  return time.getTime() <= currentDate.getTime();
};

const openRemember = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        loading.value = true;
        infoForm.value = true;
        const params = {
          date: dayjs(ruleForm?.date).format("YYYY-MM-DD"),
          calendar_id: route.params.id as string,
        };
        await calendarStore.fetchHolidayEventCount(params);
        loading.value = false;
      } catch (error: any) {
        loading.value = false;
        console.log("error", error);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
const confirmDelete = () => {
  router.push("");
  ElMessageBox.confirm(
    "This action cannot be undone. Continue?",
    i18n.t("shared.warning"),
    {
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      type: "warning",
      center: true,
    }
  )
    .then(async () => {
      try {
        loading.value = true;
        await calendarStore.deleteCalendarEvent(
          props.holiday?.extendedProps?.event_id
        );
        ElMessage({
          type: "success",
          message: i18n.t("shared.deleteCompleted"),
        });
        emit("submit-success", {
          closeDialog: true,
        });
        router.go(-1);
        loading.value = false;
      } catch (error: any) {
        loading.value = false;
        console.log("error", error);
      }
    })
    .catch(() => {});
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        loading.value = true;
        const data = {
          ...ruleForm,
          calendar_id: route.params.id as string,
          start_time: null,
          end_time: null,
        };
        if (isEdit.value) {
          await calendarStore.editCalendarTask(
            props?.holiday?.extendedProps?.event_id,
            {
              ...ruleForm,
              type: props?.holiday?.display,
              date: dayjs(ruleForm?.date).format("YYYY-MM-DD"),
              start_time: null,
              end_time: null,
            }
          );
          ElMessage({
            message: "Updated",
            type: "success",
          });
        } else {
          await calendarStore.createHolidayCalendar(data);
          ElMessage({
            message: "Create",
            type: "success",
          });
        }
        router.replace({
          path: "",
          query: { ...route.query, formDate: ruleForm.date, room: undefined },
        });
        emit("submit-success", {
          closeDialog: true,
        });
        infoForm.value = false;
        loading.value = false;
      } catch (error: any) {
        loading.value = false;
        console.log("error", error);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
