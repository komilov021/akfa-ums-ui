<template>
  <div class="">
    <el-form
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      ref="ruleFormRef"
      require-asterisk-position="right"
      v-loading="loading"
    >
      <div class="grid grid-cols-2 gap-4">
        <el-form-item
          label="Semester"
          class="w-full !mb-0"
          v-if="props.event === 'Class'"
        >
          <el-select
            v-model="selectedSemester"
            class="w-full"
            @change="fetchBySemester"
            :placeholder="`${$t('shared.select')} ${$t('app.semestrs')}`"
            size="large"
          >
            <el-option
              v-for="(item, i) in ExamDatesStore.getSemestrsSelct"
              :key="i"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Module"
          prop="assigned_course_id"
          class="w-full !mb-0"
          v-if="props.event === 'Class'"
        >
          <el-select
            v-model="ruleForm.assigned_course_id"
            clearable
            filterable
            placeholder="Select"
            class="w-full"
          >
            <el-option
              v-for="date of assignCourses.data"
              :key="date.id"
              :label="`${date.title} - ${date?.program_info.program} - ${date.code}`"
              :value="date.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Faculty members"
          prop="teacher_ids"
          class="w-full !mb-0"
        >
          <el-select
            v-model="ruleForm.teacher_ids"
            multiple
            clearable
            filterable
            collapse-tags
            placeholder="Choose class teacher"
            class="w-full"
            remote
            :remote-method="remoteMethod"
          >
            <el-option
              v-for="item of teacherList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Groups" prop="group_ids" class="w-full !mb-0">
          <el-select
            v-model="ruleForm.group_ids"
            multiple
            clearable
            collapse-tags
            filterable
            placeholder="Choose group"
            class="w-full"
            remote
            :remote-method="remoteMethod2"
          >
            <el-option
              v-for="item of groupList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Room" prop="room_id" class="w-full !mb-0">
          <el-select
            v-model="ruleForm.room_id"
            clearable
            filterable
            placeholder="Choose room"
            class="w-full"
          >
            <el-option
              v-for="{
                label,
                value,
              } of roomReferenceStore.getRoomReferencesSelect"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Lesson type"
          prop="lesson_type_id"
          class="!mb-0 w-full"
        >
          <el-select
            v-model="ruleForm.lesson_type_id"
            placeholder="Select"
            class="w-full"
          >
            <el-option
              v-for="{ label, value } of lessonTypeStore.getLessonTypesSelect"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Type calendar" class="w-full !mb-0">
          <el-select
            v-model="selectedTypeCalendar"
            placeholder="Choose type"
            class="w-full"
          >
            <el-option
              v-for="item in typeCalendarOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Date"
          prop="date"
          class="!mb-0"
          v-if="selectedTypeCalendar === 'single'"
        >
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
        <div class="flex items-center gap-3">
          <el-form-item prop="start_time" class="!mb-0">
            <template #label>
              Duration
              <span class="font-medium text-sm text-[#9ca3af]">From</span>
            </template>
            <el-input
              v-model="ruleForm.start_time"
              type="text"
              v-mask="'##:##'"
              placeholder="From"
              @change="(val: any) => timeChange(val, 'start')"
            />
          </el-form-item>
          <el-form-item prop="end_time" class="!mb-0">
            <template #label>
              <span class="font-medium text-sm text-[#9ca3af]">To</span>
            </template>
            <el-input
              v-model="ruleForm.end_time"
              type="text"
              v-mask="'##:##'"
              placeholder="To"
              @change="(val: any) => timeChange(val, 'end')"
              :disabled-hours="disabledHours"
              :disabled-minutes="disabledMinutes"
            />
          </el-form-item>
        </div>
        <el-form-item
          label="Reapeting day of the week"
          class="w-full !mb-0"
          v-if="selectedTypeCalendar === 'recurring'"
        >
          <el-select
            v-model="ruleForm.recurring_days"
            multiple
            placeholder="Choose weekday"
            class="w-full"
          >
            <el-option
              v-for="item in weekCalendarOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </div>
      <div v-if="showError" class="error-message mt-3">
        <p class="my-2 text-red-600">{{ errorMessage }}</p>
        <el-button type="primary" @click="downloadEnrollCourse"
          >Download</el-button
        >
      </div>
      <el-button
        class="w-full mt-8 !ml-0"
        type="primary"
        v-if="selectedTypeCalendar === 'recurring'"
        @click="showCalendar = true"
        :disabled="!isRecurringDaysSelected"
      >
        View calendar
      </el-button>
      <el-button
        class="w-full mt-8 !ml-0"
        type="primary"
        v-if="selectedTypeCalendar === 'single'"
        @click="submitForm(ruleFormRef)"
      >
        Add {{ props.event }}
      </el-button>
    </el-form>
    <el-dialog
      v-model="showCalendar"
      width="1000px"
      class="custom-dialog"
      @close="showCalendar = false"
      :before-close="handleClose"
    >
      <template #header>
        <h2 class="text-lg font-semibold text-[#111928]">Add frequency</h2>
      </template>
      <div class="calendar-grid">
        <div
          v-for="month in displayedMonths"
          :key="month.name"
          class="mx-auto p-4"
        >
          <div class="text-[#111928] font-bold text-center mb-2">
            {{ month.name }} 2024
          </div>
          <div class="grid grid-cols-7 gap-2 place-items-center">
            <div
              v-for="dayName in dayNames"
              :key="dayName"
              class="text-[#6B7280] font-semibold text-center text-sm"
            >
              {{ dayName }}
            </div>
            <div v-for="n in month.firstDay" :key="n" class="invisible"></div>
            <div
              v-for="day in month.days"
              :key="day.date"
              class="text-[#111928] font-bold text-center p-2 rounded-full w-[36px] bg-[#F3F4F6] cursor-pointer"
              @click="toggleDaySelection(day.date)"
              :class="{
                '!bg-[#7C3AED] text-white w-[36px]': resultDays.includes(
                  day.date
                ),
                'cursor-not-allowed': !ruleForm.recurring_days.includes(
                  dayjs(day.date).day()
                ),
              }"
            >
              {{ day.dayNumber }}
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-footer w-full flex gap-4 mt-8">
        <el-button @click="cancelSelection" class="w-full">Cancel</el-button>
        <el-button
          type="primary"
          class="w-full"
          @click="submitForm(ruleFormRef)"
          >Save</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ICreateClassCalendar } from "@/models/backend";
import {
  useCourseReferanceStore,
  useCurriculumStore,
  useLessonTypeStore,
  useRoomReferenceStore,
  useStaffStore,
  useTimeTableGroups,
  useTimetableStore,
  useAcademicStore,
} from "@/stores";
import { saveFile } from "@/utils/common";
import { dayjs, ElMessage, FormInstance, FormRules } from "element-plus";
import { computed } from "vue";
import { ref, reactive, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
const roomReferenceStore = useRoomReferenceStore();
const staffStore = useStaffStore();
const ExamDatesStore = useAcademicStore();
const groupsStore = useTimeTableGroups();
const calendarStore = useTimetableStore();
const lessonTypeStore = useLessonTypeStore();
const curriculumStore = useCurriculumStore();
const assignCourses: any = computed(() => curriculumStore.assignCourses);
const i18n = useI18n();
// const type = ref<"start" | "end">();
const loading = ref(false);
const teacherList = ref<any[]>([]);
const groupList = ref<any[]>([]);
const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<FormInstance>();
const durationmaxTime = "23:59";
const errorMessage = ref<string | null>(null);
const showError = ref(false);
const ruleForm = reactive<ICreateClassCalendar>({
  teacher_ids: [] as string[],
  assigned_course_id: "",
  lesson_type_id: "",
  room_id: "",
  group_ids: [] as string[],
  date: null,
  start_time: "",
  end_time: "",
  recurring_days: [],
  recurring_dates: null,
  is_recurring: false,
});
const props = defineProps<{
  event: string;
  calendarID: any;
  currentSemester?: string;
}>();
const selectedSemester = ref();
const rules = reactive<FormRules>({
  start_time: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          const startTime = dayjs(value, "HH:mm");
          const minTime = dayjs(prop_start_time, "HH:mm");
          const maxTime = dayjs(prop_end_time, "HH:mm");

          if (!validateTime(value)) {
            callback(new Error(i18n.t("validation.invalidTime")));
          } else if (startTime.isBefore(minTime)) {
            callback(
              new Error(
                i18n.t("validation.startBeforeMinTime", {
                  value: minTime.format("HH:mm"),
                })
              )
            );
          } else if (startTime.isAfter(maxTime)) {
            callback(
              new Error(
                i18n.t("validation.startAfterMaxTime", {
                  value: maxTime.format("HH:mm"),
                })
              )
            );
          } else if (
            ruleForm.end_time &&
            startTime.isAfter(dayjs(ruleForm.end_time, "HH:mm"))
          ) {
            callback(new Error(i18n.t("validation.startBeforeEnd")));
          } else {
            callback();
          }
        } else {
          callback();
        }
      },
      trigger: "change",
    },
  ],
  end_time: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          const endTime = dayjs(value, "HH:mm");
          const minTime = dayjs(prop_start_time, "HH:mm");
          const maxTime = dayjs(prop_end_time, "HH:mm");

          if (!validateTime(value)) {
            callback(new Error(i18n.t("validation.invalidTime")));
          } else if (endTime.isBefore(minTime)) {
            callback(
              new Error(
                i18n.t("validation.endBeforeMinTime", {
                  value: minTime.format("HH:mm"),
                })
              )
            );
          } else if (endTime.isAfter(maxTime)) {
            callback(
              new Error(
                i18n.t("validation.endAfterMaxTime", {
                  value: maxTime.format("HH:mm"),
                })
              )
            );
          } else if (
            ruleForm.start_time &&
            endTime.isBefore(dayjs(ruleForm.start_time, "HH:mm"))
          ) {
            callback(new Error(i18n.t("validation.endBeforeStart")));
          } else {
            callback();
          }
        } else {
          callback();
        }
      },
      trigger: "change",
    },
  ],
  assigned_course_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  teacher_ids: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  group_ids: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});
const fromToTime: any = ref([]);
const disabledDate = (time: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return time < today;
};

const downloadEnrollCourse = async () => {
  try {
    loading.value = true;
    showError.value = false;
    const data = await calendarStore.fetchStudentDonwloadEnrollCourse({
      group_ids: ruleForm.group_ids.length ? ruleForm.group_ids : [],
      assigned_course_id: ruleForm.assigned_course_id,
    });
    saveFile(data, "Not enrollment course students list.xlsx");
    loading.value = false;
  } catch (error: any) {
    console.log("error", error?.message);
    loading.value = false;
    showError.value = true;
  }
};

const typeCalendarOptions = ref([
  {
    label: "Single",
    value: "single",
  },
  {
    label: "Recurring",
    value: "recurring",
  },
]);
const showCalendar = ref(false);
const selectedTypeCalendar = ref("single");
const emit = defineEmits(["submit-success"]);
const weekCalendarOptions = ref([
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
]);
const weekDayMapping = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
const dayNames = ref(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
const convertedRecurringDays = computed(() => {
  return ruleForm.recurring_days.map((day: number) => weekDayMapping[day]);
});
const isRecurringDaysSelected = computed(
  () => ruleForm.recurring_days.length > 0
);
const startDate = dayjs(props.calendarID.start_date);
const endDate = dayjs(props.calendarID.end_date);

const resultDays = ref<string[]>([]);

function getDays(
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs,
  week: number[]
): string[] {
  const days: string[] = [];
  let currentDate = startDate;

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
    if (week.includes(currentDate.day())) {
      days.push(currentDate.format("YYYY-MM-DD"));
    }
    currentDate = currentDate.add(1, "day");
  }

  return days;
}
function updateResultDays() {
  if (ruleForm.recurring_days?.length > 0) {
    const weekDays = ruleForm.recurring_days.map((day: number) =>
      day === 7 ? 0 : day
    );
    resultDays.value = getDays(startDate, endDate, weekDays);
  } else {
    resultDays.value = [];
  }
}

function generateSelectedDays() {
  return getDays(
    startDate,
    endDate,
    ruleForm.recurring_days.map((day: number) => (day === 7 ? 0 : day))
  );
}

const displayedMonths = computed(() => {
  const months = [];
  for (let month = startDate.month(); month <= endDate.month(); month++) {
    const daysInMonth = dayjs(
      `${startDate.year()}-${month + 1}-01`
    ).daysInMonth();
    const firstDay = dayjs(`${startDate.year()}-${month + 1}-01`).day();
    const days = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = dayjs(`${startDate.year()}-${month + 1}-${day}`).format(
        "YYYY-MM-DD"
      );
      days.push({ dayNumber: day, date });
    }

    months.push({
      name: dayjs(`${startDate.year()}-${month + 1}-01`).format("MMMM"),
      firstDay,
      days,
    });
  }
  return months;
});
function toggleDaySelection(date: string) {
  const dayOfWeek = dayjs(date).day();
  if (ruleForm.recurring_days.includes(dayOfWeek)) {
    if (resultDays.value.includes(date)) {
      resultDays.value = resultDays.value.filter((day) => day !== date);
    } else {
      resultDays.value.push(date);
    }
  }
}
onMounted(() => {
  updateResultDays();
  if (!ExamDatesStore.getSemestrsSelct.length) {
    ExamDatesStore.fetchSemestr();
  }
  console.log(props.currentSemester, "props.currentSemester");
  selectedSemester.value = `${props.currentSemester?.split(" ")[1]}-${
    props.currentSemester?.split(" ")[0]
  }`;
});
watch(() => ruleForm.recurring_days, updateResultDays, { immediate: true });
resultDays.value = generateSelectedDays();

function cancelSelection() {
  showCalendar.value = false;
}

function handleClose() {
  showCalendar.value = false;
}

const makeRange = (start: number, end: number) => {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
};
const prop_start_time = props?.calendarID?.start_time;
const prop_end_time = props?.calendarID?.end_time;

const startTime = computed(() => dayjs(prop_start_time, "HH:mm"));
const endTime = computed(() => dayjs(prop_end_time, "HH:mm"));

const disabledHours = () => {
  const startHour = startTime.value.hour();
  const endHour = endTime.value.hour();

  return Array.from({ length: 24 }, (_, i) => i).filter(
    (hour) => hour < startHour || hour > endHour
  );
};
const disabledMinutes = (hour: number) => {
  const startHour = dayjs(prop_start_time, "HH:mm").hour();
  const endHour = dayjs(prop_end_time, "HH:mm").hour();
  const startMinute = dayjs(prop_start_time, "HH:mm").minute();
  const endMinute = dayjs(prop_end_time, "HH:mm").minute();

  if (hour === startHour) {
    return Array.from({ length: 60 }, (_, i) => i).filter(
      (minute) => minute < startMinute
    );
  } else if (hour === endHour) {
    return Array.from({ length: 60 }, (_, i) => i).filter(
      (minute) => minute > endMinute
    );
  }
  return [];
};
const fetchBySemester = async () => {
  const semester = selectedSemester.value.split("-");
  await curriculumStore.fetchAssignCourses({
    limit: 400,
    page: 1,
    semester: `${semester[1]} ${semester[0]}`,
  });
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

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        loading.value = true;
        const data = {
          ...ruleForm,
          type: props.event,
          calendar_id: route.params.id as string,
          start_time: ruleForm.start_time,
          end_time: ruleForm.end_time,
          teacher_ids: ruleForm.teacher_ids.length ? ruleForm.teacher_ids : [],
          group_ids: ruleForm.group_ids.length ? ruleForm.group_ids : [],
          recurring_dates: resultDays.value ?? undefined,
          recurring_days: convertedRecurringDays.value ?? undefined,
        };
        await calendarStore.createClassCalendar(data);
        const room = roomReferenceStore.getRoomReferencesSelect.filter(
          (x: any) => x.value == ruleForm.room_id
        )[0];
        router.replace({
          path: "",
          query: {
            ...route.query,
            formDate: ruleForm.date || resultDays.value[0],
            room: room.label,
          },
        });
        ElMessage({
          message: "Create",
          type: "success",
        });
        emit("submit-success", {
          closeDialog: true,
        });
        showCalendar.value = false;
        loading.value = false;
        showError.value = false;
      } catch (error: any) {
        loading.value = false;
        if (error?.response?.data?.error?.statusCode === 400) {
          errorMessage.value = error?.response?.data?.error?.message;
          showError.value = true;
        } else {
          console.log("error", error);
          showError.value = false;
        }
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
const remoteMethod = (query: any) => {
  if (query) {
    teacherList.value = staffStore.getTeacherSelect.filter((item) => {
      return item.label.toLowerCase().includes(query.toLowerCase());
    });
  } else {
    teacherList.value = [];
  }
};
function validateTime(time: any) {
  if (time > durationmaxTime) {
    ruleForm.start_time = "";
    ruleForm.end_time = "";
  }
  return true;
}

const remoteMethod2 = async (query: any) => {
  if (query) {
    await groupsStore.fetchTimetableGroupList({
      limit: 100,
      page: 1,
      search: query,
    });
    groupList.value = groupsStore.getTimetableGroupList;
    // .filter((item: any) => {
    //   return item.label.toLowerCase().includes(query.toLowerCase());
    // });
  } else {
    groupList.value = [];
  }
};
watch(selectedTypeCalendar, (newValue) => {
  if (newValue === "recurring") {
    ruleForm.is_recurring = true;
    ruleForm.recurring_dates = [];
    ruleForm.recurring_days = [];
  } else {
    ruleForm.is_recurring = false;
    ruleForm.recurring_dates = null;
    ruleForm.recurring_days = null;
  }
});
</script>

<style lang="scss" scoped>
.calendar-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 20px;
}

.calendar-title {
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-weight: bold;
  margin-bottom: 10px;
}

.day-header {
  font-weight: bold;
  text-align: center;
}

.day {
  padding: 10px;
  border-radius: 8px !important;
  cursor: pointer;
  color: #111928 !important;
  font-weight: 700 !important;
  text-align: center;
}

.day.selected {
  background-color: #7f56d9;
  color: #fff !important;
}

.day.empty {
  visibility: hidden;
}
</style>
