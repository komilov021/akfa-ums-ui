<template>
  <el-form
    ref="ruleFormRef"
    :model="formData"
    :rules="rules"
    label-position="top"
    require-asterisk-position="right"
  >
    <div class="grid grid-cols-2 gap-4">
      <!-- Module Select -->
      <el-form-item
        label="Module"
        class="text-sm text-[#111928] font-medium font-inter"
        v-if="props.typeItem === 'class'"
      >
        <el-select
          v-model="formData.assigned_course_id"
          clearable
          filterable
          placeholder="Select"
          class="w-full"
        >
          <el-option
            v-for="course in assignCourses.data"
            :key="course.id"
            :label="`${course.title} - ${course?.program_info.program} - ${course.code}`"
            :value="course.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        :label="`Name of ${props.typeItem}`"
        prop="name"
        class="w-full !mb-0"
        v-if="props.typeItem !== 'class'"
      >
        <el-input
          v-model="formData.name"
          type="text"
          autocomplete="off"
          placeholder="Type the name of the class"
        ></el-input>
      </el-form-item>

      <!-- Faculty Member Select -->
      <el-form-item
        label="Faculty Member"
        class="text-sm text-[#111928] font-medium font-inter"
      >
        <el-select
          v-model="formData.teacher_ids"
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
            v-for="item in teacherList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="Lesson type info"
        class="text-sm text-[#111928] font-medium font-inter"
      >
        <el-select
          v-model="formData.lesson_type_id"
          clearable
          placeholder="Select"
          class="w-full"
        >
          <el-option
            v-for="room in lessonTypeStore.getLessonTypesSelect"
            :key="room.value"
            :label="room.label"
            :value="room.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="Room"
        class="text-sm text-[#111928] font-medium font-inter"
      >
        <el-select
          v-model="formData.room_id"
          clearable
          filterable
          placeholder="Choose room"
          class="w-full"
        >
          <el-option
            v-for="room in roomReferenceStore.getRoomReferencesSelect"
            :key="room.value"
            :label="room.label"
            :value="room.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="Description"
        prop="description"
        class="!w-full !mb-0 col-span-2"
        v-if="props.typeItem === 'exam' || props.typeItem === 'event'"
      >
        <el-input
          v-model="formData.description"
          :rows="6"
          type="textarea"
          placeholder="Type the description"
        />
      </el-form-item>
      <div>
        <div class="flex items-center gap-3">
          <el-form-item prop="start_time" class="!mb-0">
            <template #label>
              Duration
              <span class="font-medium text-sm text-[#9ca3af]">From</span>
            </template>
            <el-input
              v-model="formData.start_time"
              type="text"
              v-mask="'##:##'"
              placeholder="From"
              @change="(val: any) => timeChange(val, 'start')"
              :disabled-hours="disabledHours"
              :disabled-minutes="disabledMinutes"
            />
          </el-form-item>
          <el-form-item prop="end_time" class="!mb-0">
            <template #label>
              <span class="font-medium text-sm text-[#9ca3af]">To</span>
            </template>
            <el-input
              v-model="formData.end_time"
              type="text"
              v-mask="'##:##'"
              placeholder="To"
              @change="(val: any) => timeChange(val, 'end')"
              :disabled-hours="disabledHours"
              :disabled-minutes="disabledMinutes"
            />
          </el-form-item>
        </div>
      </div>

      <el-form-item label="Date" prop="date" class="!mb-0">
        <el-date-picker
          v-model="formData.date"
          type="date"
          format="DD.MM.YY"
          value-format="YYYY-MM-DD"
          class="!w-full"
          placeholder="Select date"
          :disabled-date="disabledDate"
        />
      </el-form-item>
    </div>

    <el-button
      type="primary"
      size="large"
      class="w-full !h-[41px] mt-8"
      @click="editSubmit"
    >
      Save changes
    </el-button>
  </el-form>
</template>

<script setup lang="ts">
import { Calendar } from "@/assets/svgs";
import {
  useCurriculumStore,
  useLessonTypeStore,
  useRoomReferenceStore,
  useStaffStore,
  useTimeTableGroups,
  useTimetableStore,
} from "@/stores";
import { dayjs, FormInstance, ElMessage, FormRules } from "element-plus";
import { watch } from "vue";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const roomReferenceStore = useRoomReferenceStore();
const staffStore = useStaffStore();
const groupsStore = useTimeTableGroups();
const lessonTypeStore = useLessonTypeStore();
const curriculumStore = useCurriculumStore();
const calendarStore = useTimetableStore();
const calendarGetOne = computed(() => calendarStore.calendarGetOne.data);
const assignCourses: any = computed(() => curriculumStore.assignCourses);
const route = useRoute();
const i18n = useI18n();
const ruleFormRef = ref<FormInstance>();
const teacherList = ref<any[]>([]);
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  typeItem: String,
});

const emit = defineEmits(["close-dialog", "on-submit"]);

const formData = reactive({
  id: props.data?.id as string,
  type: props.data?.type as string,
  assigned_course_id: props.data?.module_info?.id as string,
  room_id: props.data?.room_info?.id as string,
  teacher_ids: props.data?.faculty_members?.map(
    (member: { id: string }) => member.id
  ) as string[],
  start_time: "",
  end_time: "",
  date: props.data?.to_char as string,
  description: props.data?.description as string,
  name: props.data?.name as string,
  lesson_type_id: props.data?.lesson_type_info.id as string,
});

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
          const minTime = dayjs(prop_start_time.value, "HH:mm");
          const maxTime = dayjs(prop_end_time.value, "HH:mm");

          if (startTime.isBefore(minTime) || startTime.isAfter(maxTime)) {
            callback(new Error(i18n.t("validation.startOutOfRange")));
          } else if (
            formData.end_time &&
            startTime.isAfter(dayjs(formData.end_time, "HH:mm"))
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
          const minTime = dayjs(prop_start_time.value, "HH:mm");
          const maxTime = dayjs(prop_end_time.value, "HH:mm");

          if (endTime.isBefore(minTime) || endTime.isAfter(maxTime)) {
            callback(new Error(i18n.t("validation.endOutOfRange")));
          } else if (
            formData.start_time &&
            endTime.isBefore(dayjs(formData.start_time, "HH:mm"))
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
});
const editSubmit = () => {
  const startTime = dayjs(formData.start_time, "HH:mm");
  const endTime = dayjs(formData.end_time, "HH:mm");

  if (!startTime.isValid() || !endTime.isValid()) {
    ElMessage({
      message: "Invalid start or end time format.",
      type: "error",
    });
    return;
  }

  emit("on-submit", {
    ...formData,
  });
  console.log("answer: ", formData);
};
const disabledDate = (time: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return time < today;
};
const prop_start_time = computed(() => calendarGetOne.value?.start_time || "");
const prop_end_time = computed(() => calendarGetOne.value?.end_time || "");

const startTime = computed(() => dayjs(prop_start_time.value, "HH:mm"));
const endTime = computed(() => dayjs(prop_end_time.value, "HH:mm"));

const disabledHours = () => {
  const startHour = startTime.value.hour();
  const endHour = endTime.value.hour();

  return Array.from({ length: 24 }, (_, i) => i).filter(
    (hour) => hour < startHour || hour > endHour
  );
};
const disabledMinutes = (hour: number) => {
  const startHour = startTime.value.hour();
  const endHour = endTime.value.hour();
  const startMinute = startTime.value.minute();
  const endMinute = endTime.value.minute();

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

const timeChange = (val: any, type: any) => {
  const timeFormat = "HH:mm";
  const parsedTime = dayjs(val, timeFormat);
  if (!parsedTime.isValid()) {
    ElMessage({
      message: "Invalid time format.",
      type: "error",
    });
    return;
  }
  const formattedTime = parsedTime.format(timeFormat);
  if (type === "start") {
    formData.start_time = formattedTime;
  } else if (type === "end") {
    formData.end_time = formattedTime;
  }
  if (
    formData.start_time &&
    formData.end_time &&
    formData.start_time === formData.end_time
  ) {
    formData.start_time = "";
    formData.end_time = "";
    ElMessage({
      message: "Start time and end time cannot be the same.",
      type: "warning",
    });
  }
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

onMounted(() => {
  roomReferenceStore.fetchRoomReferences();
  groupsStore.fetchTimetableGroupList();
  staffStore.getStaffs({
    page: 1,
    limit: 400,
  });
  lessonTypeStore.fetchLessonTypes({ limit: 100, page: 1 });
  calendarStore.getDetailCalendar(route.params.id as string);
  curriculumStore.fetchAssignCourses({
    limit: 400,
    page: 1,
    semester: calendarGetOne?.value?.semester_info?.name as string,
  });
  if (props.data?.faculty_members) {
    teacherList.value = props.data.faculty_members.map((member: any) => ({
      value: member.id,
      label: `${member.first_name} ${member.last_name}`,
    }));
  }
  if (props.data?.event_end && props.data?.event_start) {
    formData.start_time = props.data?.event_start.slice(11, 16);
    formData.end_time = props.data?.event_end.slice(11, 16);
  }
});
</script>

<style scoped lang="scss"></style>
