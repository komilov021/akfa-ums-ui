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
      <div class="grid grid-cols-2 gap-4">
        <el-form-item label="Name of exam" prop="name" class="w-full !mb-0">
          <el-input
            v-model="ruleForm.name"
            type="text"
            autocomplete="off"
            placeholder="Type the name of the exam"
          ></el-input>
        </el-form-item>
        <el-form-item class="!w-full !mb-0" prop="teacher_ids">
          <template #label>
            Faculty member
            <span class="font-medium text-sm text-[#9ca3af]">(optional)</span>
          </template>
          <el-select
            v-model="ruleForm.teacher_ids"
            placeholder="Choose faculty member"
            class="w-full"
            multiple
            collapse-tags
            filterable
            clearable
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

        <el-form-item
          label="Description"
          prop="description"
          class="!w-full !mb-0 col-span-2"
        >
          <el-input
            v-model="ruleForm.description"
            :rows="6"
            type="textarea"
            placeholder="Type the description"
          />
        </el-form-item>
        <el-form-item label="Groups" prop="group_ids" class="w-full !mb-0">
          <el-select
            v-model="ruleForm.group_ids"
            placeholder="Choose group"
            class="w-full"
            multiple
            collapse-tags
            filterable
            clearable
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
        <el-form-item label="Room" class="w-full !mb-0">
          <el-select
            v-model="ruleForm.room_id"
            placeholder="Choose room"
            class="w-full"
            filterable
            clearable
          >
            <el-option
              v-for="item in roomStore.getRoomReferencesSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div class="!w-full col-span-2">
          <div class="grid grid-cols-2 gap-3">
            <el-form-item label="Date" prop="date" class="!mb-0">
              <el-date-picker
                v-model="ruleForm.date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                class=""
                :disabled-date="disabledDate"
                placeholder="Select date"
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
          </div>
        </div>
      </div>
      <el-button
        class="w-full mt-8 !ml-0"
        type="primary"
        @click="submitForm(ruleFormRef)"
      >
        Add {{ event.toLowerCase() }}
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {
  useRoomReferenceStore,
  useStaffStore,
  useTimeTableGroups,
  useTimetableStore,
} from "@/stores";
import { FormInstance, FormRules, ElMessage, dayjs } from "element-plus";
import { ref, reactive, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const i18n = useI18n();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const staff = useStaffStore();
const ruleFormRef = ref<FormInstance>();
const roomStore = useRoomReferenceStore();
const timetableStore = useTimetableStore();
const timegroupStore = useTimeTableGroups();
const durationmaxTime = "23:59";
const props = defineProps<{
  event: string;
  calendarID: any;
}>();
const emit = defineEmits(["submit-success"]);
const ruleForm = reactive({
  name: "",
  description: "Midterm",
  room_id: "",
  date: "",
  start_time: "",
  end_time: "",
  group_ids: [] as string[],
  teacher_ids: [] as string[],
});
const teacherList = ref<any[]>([]);
const groupList = ref<any[]>([]);
const rules = reactive<FormRules>({
  name: [
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
  description: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  room_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
    },
  ],
  date: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
    },
  ],
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
            callback(
              new Error(i18n.t("validation.greaterThanvalue", { value: 64 }))
            );
          }
          if (startTime.isBefore(minTime) || startTime.isAfter(maxTime)) {
            callback(new Error(i18n.t("validation.startOutOfRange")));
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
            callback(
              new Error(
                `Kiritilgan vaqt ${durationmaxTime}
                )} dan katta. Iltimos, vaqtni qayta tekshiring.`
              )
            );
          }
          if (endTime.isBefore(minTime) || endTime.isAfter(maxTime)) {
            callback(new Error(i18n.t("validation.endOutOfRange")));
          } else if (
            ruleForm.start_time &&
            endTime.isBefore(dayjs(ruleForm.start_time, "HH:mm"))
          ) {
            callback(new Error(i18n.t("validation.endOutOfRange")));
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

const disabledDate = (time: Date) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  return time < currentDate;
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
function validateTime(time: any) {
  if (time > durationmaxTime) {
    ruleForm.start_time = "";
    ruleForm.end_time = "";
  }
  return true;
}
const remoteMethod = (query: any) => {
  if (query) {
    teacherList.value = staff.getTeacherSelect.filter((item) => {
      return item.label.toLowerCase().includes(query.toLowerCase());
    });
  } else {
    teacherList.value = [];
  }
};
const remoteMethod2 = async (query: any) => {
  if (query) {
    await timegroupStore.fetchTimetableGroupList({
      limit: 100,
      page: 1,
      search: query,
    });
    groupList.value = timegroupStore.getTimetableGroupList;
  } else {
    groupList.value = [];
  }
};
const submitForm = async (formData: FormInstance | undefined) => {
  if (!formData) return;
  await formData.validate(async (valid, fields) => {
    if (valid) {
      try {
        loading.value = true;
        let params = {
          ...ruleForm,
          start_time: ruleForm.start_time,
          end_time: ruleForm.end_time,
          calendar_id: route.params.id as string,
          teacher_ids: ruleForm.teacher_ids,
          group_ids: ruleForm.group_ids,
        };
        await timetableStore.fetchCreateTaskexam(params);
        const room = roomStore.getRoomReferencesSelect.filter(
          (x: any) => x.value == ruleForm.room_id
        )[0];
        router.replace({
          path: "",
          query: { ...route.query, formDate: ruleForm.date, room: room.label },
        });
        ElMessage({
          message: i18n.t("shared.created"),
          type: "success",
        });
        emit("submit-success", {
          closeDialog: true,
        });
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

<style scoped></style>
