<template>
  <div>
    <div
      v-if="visibleCalendar"
      @click="visibleCalendar = false"
      class="fixed top-0 left-0 w-full h-full z-40"
    ></div>
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-4 flex-wrap">
        <div class="flex items-center justify-center">
          <div class="border rounded-[10px] flex h-10">
            <button @click="prevDay" class="py-2 px-3 border-r">
              <ArrowLeftBold class="w-[10px]" color="#111928"></ArrowLeftBold>
            </button>
            <div
              class="flex items-center px-3 w-[240px] cursor-pointer"
              v-if="currentView == 'resourceTimelineWeek'"
            >
              <span
                class="text-black font-semibold absolute"
                @click="visibleCalendar = !visibleCalendar"
              >
                {{ currentRange?.start }} - {{ currentRange?.end }}
              </span>
              <el-date-picker
                v-model="calendarRange"
                type="week"
                class="!invisible"
                :visible="visibleCalendar"
                placeholder="Pick a week"
              />
            </div>
            <div class="flex items-center px-3 w-[125px]" v-else>
              <span class="text-black font-semibold">
                {{ currentRange?.end }}
              </span>
            </div>
            <button @click="nextDay" class="py-2 px-3 border-l">
              <ArrowRightBold class="w-[10px]" color="#111928"></ArrowRightBold>
            </button>
          </div>
        </div>
        <!-- <el-select v-model="currentView" class="!w-[130px]" :placeholder="$t('shared.select')" size="large"
          @change="setView">
          <el-option v-for="(item, i) in viewTypes" :key="i" :label="item.label" :value="item.value" />
        </el-select> -->
        <el-select
          v-model="selectedLesson"
          filterable
          @change="filterByLessons"
          placeholder="Choose type"
          class="!w-[220px]"
        >
          <el-option
            v-for="item in [
              { value: 'none', label: 'All' },
              ...props.lessonTypes,
            ]"
            :key="item.value"
            :label="item.label"
            :value="item"
          />
        </el-select>
        <el-input
          class="!w-[180px]"
          v-model="searchRoom"
          @keyup.enter="filterByLessons"
          clearable
          @clear="filterByLessons"
          placeholder="Search room"
        >
        </el-input>
        <el-select
          v-model="selectedTeacher"
          clearable
          collapse-tags
          :max-collapse-tags="2"
          filterable
          placeholder="Choose class teacher"
          @change="calendarFilter"
          class="!w-[200px]"
          remote
          :remote-method="remoteMethodTeacher"
        >
          <el-option
            v-for="(item, index) of [...teachers]"
            :key="index"
            :label="item.label"
            :value="item"
          />
        </el-select>
        <el-select
          v-model="filter.course_reference_id"
          @change="calendarFilter"
          remote
          clearable
          :remote-method="remoteMethodCourse"
          filterable
          placeholder="Select course"
          class="!w-[200px]"
        >
          <el-option
            v-for="course of [...courses]"
            :key="course.courses_reference_id"
            :label="`${course.title} - ${
              course?.program_info?.program || ''
            } - ${course?.code || ''}`"
            :value="course.courses_reference_id"
          />
        </el-select>
        <el-button @click="resetAllFilters" type="danger">
          Reset all
        </el-button>
      </div>
      <div class="flex items-center gap-3">
        <div class="calendar_drop relative" @click.self="dialogVisible = false">
          <el-button
            :icon="Plus"
            class="!h-10"
            type="primary"
            @click.stop="toggleDropdown"
          >
            Create field
          </el-button>
          <transition name="fade">
            <div
              class="!bg-[#fff] w-full text-[#374151] z-10 rounded-lg absolute left-0 top-12 border border-[#E5E7EB]"
              v-if="dialogVisible"
            >
              <li
                v-for="(item, index) in calendarEvent"
                :key="item.value"
                :class="{
                  'rounded-t-lg': index === 0,
                  'rounded-b-lg': index === calendarEvent.length - 1,
                }"
                class="w-full h-[40px] px-4 py-2 hover:text-[#7F56D9] hover:bg-[#F6F5FF] cursor-pointer list-none"
                @click="openFormCalendar(item.label)"
              >
                {{ item.label }}
              </li>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <FullCalendar ref="fullCalendar" :firstDay="1" :options="calendarOptionss">
      <template v-slot:eventContent="arg">
        <EventCard
          class="cursor-pointer"
          :arg="arg.event"
          :class="{
            ' !h-full !max-h-[50px]': currentView == 'resourceTimelineWeek',
          }"
        />
      </template>
    </FullCalendar>
    <el-dialog v-model="holidayForm" title="Holiday" @close="handleCloseDialog">
      <HolidayForm
        v-if="holidayForm"
        :holiday="holidayData"
        @submit-success="handleSubmitSuccess"
      />
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
// @ts-ignore
import EventCard from "./EventCard.vue";
// @ts-ignore
import HolidayEmpty from "./HolidayEmpty.vue";
import FullCalendar from "@fullcalendar/vue3";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import scrollgridPlugin from "@fullcalendar/scrollgrid";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from "vue";
import {
  ArrowLeftBold,
  ArrowRightBold,
  Plus,
  Filter,
  CloseBold,
} from "@element-plus/icons-vue";

import { useRoute, useRouter } from "vue-router";
import { dayjs } from "element-plus";
import { IEventFilter, IUser } from "@/models/backend";
import request from "@/utils/request";
import { useStaffStore, useTimetableStore } from "@/stores";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";
import HolidayForm from "../forms/HolidayForm.vue";

const staffStore = useStaffStore();
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.Ls.en.weekStart = 0;
export interface Props {
  data: any;
  calendarData: any;
  roomList: any;
  allRooms:
    | {
        label: string;
        value: string;
      }[]
    | any;
  lessonTypes:
    | {
        label: string;
        value: string;
      }[]
    | any;
  // teacherList: any;
  assignCourses: any;
}
const props = withDefaults(defineProps<Props>(), {
  data: null,
  calendarData: null as any,
  roomList: [] as any,
  allRooms: [] as any,
  lessonTypes: [] as any,
  // teacherList: [] as any,
  assignCourses: [] as any,
});
const emits = defineEmits(["onFetch", "openForm", "fetchRooms"]);
const router = useRouter();
const route = useRoute();
const searchRoom = ref(route.query?.room ? (route.query.room as any) : "");
const selectedLesson = ref(
  route.query?.lesson ? JSON.parse(route.query.lesson as any) : null
);
const teachers: any = ref([]);
const courses: any = ref([]);
const selectedTeacher = ref(
  route.query?.teacher ? JSON.parse(route.query.teacher as any) : null
);
const visibleCalendar = ref(false);
const calendarRange = ref(
  route.query?.from_date || (dayjs(new Date()).format("YYYY-MM-DD") as any)
);
const dialogVisible = ref(false);
const isHoliday = ref(false);
const calendarEvent = [
  {
    label: "Class",
    value: "class",
  },
  {
    label: "Event",
    value: "event",
  },
  {
    label: "Exam",
    value: "exam",
  },
  {
    label: "Practice",
    value: "practice",
  },
  {
    label: "Holiday",
    value: "holiday",
  },
];
const filter: IEventFilter = reactive({
  page: 1,
  limit: 6,
  calendar_id: route.params.id as string,
  from_date:
    route.query?.from_date || (dayjs(new Date()).format("YYYY-MM-DD") as any),
  to_date:
    route.query?.to_date || (dayjs(new Date()).format("YYYY-MM-DD") as any),
  type: "week",
  teacher_id: route.query?.teacher
    ? JSON.parse(route.query.teacher as any)?.value
    : undefined,
  course_reference_id: route.query?.course
    ? (route.query.course as any)
    : undefined,
});
const toggleDropdown = () => {
  dialogVisible.value = !dialogVisible.value;
};
const openFormCalendar = (val: string) => {
  emits("openForm", val);
};

const viewTypes = [
  {
    label: "Daily",
    value: "resourceTimeGridDay",
  },
  {
    label: "Weekly",
    value: "resourceTimelineWeek",
  },
];

const fetching = ref(false);
type IArg = {
  event: {
    _def: {
      extendedProps: {
        event_id: string;
      };
      ui: {
        display: string;
      };
    };
  };
  dateStr: string;
};
interface HolidayEvent {
  _def: {
    extendedProps: {
      event_id: string;
    };
    ui: {
      display: string;
    };
  };
}
const holidayForm = ref(false);
const holidayData = ref<HolidayEvent | null>(null);
const handleDateClick = (arg: IArg) => {
  const eventId = arg?.event?._def?.extendedProps?.event_id;
  const holiday = arg?.event?._def?.ui?.display;
  if (holiday) {
    (holidayForm.value = true), (holidayData.value = arg?.event);
  }
  const path =
    holiday == "background"
      ? `/timetable/calendar/${route.params.id}`
      : `/timetable/calendar/${route.params.id}/${eventId}`;
  router.push({ path });
};
const handleSubmitSuccess = () => {
  holidayForm.value = false;
  emits("onFetch");
};
const handleCloseDialog = () => {
  holidayForm.value = false;
  holidayData.value = null; // Dialog yopilganda tozalash
};
const fullCalendar = ref<typeof FullCalendar | null>(null);
const currentView = ref<"resourceTimeGridDay" | "resourceTimelineWeek">(
  "resourceTimelineWeek"
);
const currentRange = ref<{ start: string; end: string } | null>(null);
const calendarOptionss = ref({
  timeZone: "local", // or 'UTC',
  eventOverlap: true,
  schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
  plugins: [resourceTimeGridPlugin, resourceTimelinePlugin, scrollgridPlugin],
  initialView: currentView.value,
  defaultDate: route.query?.from_date,
  nowIndicator: true,
  allDaySlot: false,
  height: "auto", // Adjusts the calendar height automatically to fit content
  contentHeight: "auto",
  slotDuration: "00:15:00",
  slotLabelInterval: "01:00:00",
  slotMinTime: "07:30",
  slotMaxTime: "20:30",
  firstDay: 1,
  // slotMinWidth: 350,
  views: {
    timeGridDay: {
      slotLabelFormat: [
        {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        },
        {
          omitZeroMinute: false,
        },
      ],
    },
    resourceTimelineWeek: {
      type: "resourceTimelineWeek",
      // slotMinWidth: 350,
      nowIndicator: false,
      allDaySlot: true,
      daysOfWeek: [1, 2, 3, 4, 5],
      slotDuration: "24:00:00",
      slotLabelInterval: "24:00:00",
      resourceAreaWidth: "120px",
      resourceAreaHeaderContent: "Room #",
      slotLabelFormat: [{ day: "numeric", weekday: "short" }],
      slotLabelContent: function (arg: any) {
        const day = arg.date.getDate();
        const weekday = arg.date.toLocaleString("en-US", { weekday: "short" });
        return {
          html: `<div style="text-align: center;">
                <div>${day}</div>
                <div style="font-size: 12px;">${weekday}</div>
              </div>`,
        };
      },
      hiddenDays: [0],
    },
  },
  slotLabelFormat: [
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    },
    {
      omitZeroMinute: false,
    },
  ],
  eventClick: handleDateClick,
  headerToolbar: {
    left: "",
    center: "",
    right: "",
  },
  resourceAreaWidth: "20%",
  resourceAreaHeaderContent: "Rooms",
  resourceLabelContent: (arg: any) => {
    const code = arg.resource.extendedProps.code;
    const title = arg.resource.title;
    return {
      html: `<div style="text-align: center;">
                    <div>${code}</div>
                    <div style="font-size: 12px; color: gray;">${title}</div>
                  </div>`,
    };
  },
  resources: [],
  events: [],
  datesSet: (info: any) => {
    setTimeout(() => {
      updateNowIndicatorContent();
      updateEventWidths();
    }, 1000);
  },
  viewDidMount: () => {
    updateNowIndicatorContent();
    updateEventWidths();
  },
}) as any;
const debounce = (func: Function, wait: number) => {
  let timeout: number | undefined;
  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(null, args), wait);
  };
};
const remoteMethodTeacher = debounce(async (query: string) => {
  if (!query) {
    teachers.value = [];
    return;
  } else {
    try {
      await staffStore.getStaffs({
        page: 1,
        limit: 400,
        type: "teacher",
        search: query ? query : null,
      });
      teachers.value = staffStore.staffs?.data ? staffStore.staffs?.data : [];
      const teachersList = staffStore.staffs?.data.map((teacher: IUser) => ({
        value: teacher.teacher_id,
        label: `${teacher.first_name} ${teacher.last_name}`,
      }));

      teachers.value = Array.isArray(teachersList) ? teachersList : [];
    } catch (error: any) {
      console.error(
        "Error teacher search:",
        error?.message ? error?.message : error
      );
    }
  }
}, 300);

// const remoteMethodTeacher = (query: string) => {
//   if (query) {
//     teachers.value = props.teacherList.filter((item: any) => {
//       return item.label.toLowerCase().includes(query.toLowerCase());
//     });
//   } else {
//     teachers.value = [];
//   }
// };
// :label="`${course.title} - ${course?.program_info?.program || ''} - ${
//               course?.code || ''
//             }`"
const remoteMethodCourse = (query: string) => {
  if (query) {
    courses.value = props.assignCourses.data.filter((item: any) => {
      return item.title.toLowerCase().includes(query.toLowerCase());
    });
  } else {
    courses.value = [];
  }
};
function getWeekEndDate(startDate: Date) {
  const dayOfWeek = startDate.getDay();
  const daysUntilSaturday = 7 - dayOfWeek;
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + daysUntilSaturday);
  return endDate;
}
const updateEventWidths = () => {
  const timelineSlots = document.querySelectorAll(".fc-timeline-slot");
  const timelineEventHarnesses = document.querySelectorAll(
    ".fc-timeline-event-harness"
  );
  const timelineBgHarnesses = document.querySelectorAll(
    ".fc-timeline-bg-harness"
  );
  const calendarApi = getCalendarApi();
  // calendarOptionss.value.views.resourceTimelineWeek.slotMinWidth = 350;
  if (
    (timelineSlots.length > 0 && timelineEventHarnesses.length > 0) ||
    (timelineBgHarnesses.length && calendarApi)
  ) {
    const slotWidth = timelineSlots[0].clientWidth;
    const viewStart = calendarApi.view.currentStart;

    timelineEventHarnesses.forEach((harness: any) => {
      const event = harness.querySelector(".fc-timeline-event");

      if (event) {
        const eventStart = new Date(event.fcSeg?.eventRange?.range?.start);
        if (isNaN(eventStart.getTime())) {
          return;
        }

        const timeDifference = eventStart.getTime() - viewStart.getTime();
        const daysDifference = Math.floor(
          timeDifference / (1000 * 60 * 60 * 24)
        );

        const leftPosition = daysDifference * slotWidth;
        harness.style.left = `${leftPosition}px`;
        harness.style.width = `${slotWidth}px`;
        harness.style.height = `55px`;
        harness.style.maxWidth = `${slotWidth}px`;
      }
    });
    timelineBgHarnesses.forEach((harness: any) => {
      const event = harness.querySelector(".fc-bg-event");

      if (event) {
        const eventStart = new Date(event.fcSeg?.eventRange?.range?.start);
        if (isNaN(eventStart.getTime())) {
          return;
        }

        const timeDifference = eventStart.getTime() - viewStart.getTime();
        const daysDifference = Math.floor(
          timeDifference / (1000 * 60 * 60 * 24)
        );
        const leftPosition = daysDifference * slotWidth;
        harness.style.left = `${leftPosition}px`;
        harness.style.width = `${slotWidth}px`;
        harness.style.maxWidth = `${slotWidth}px`;
      }
    });
  }
};
const handleResize = debounce(() => {
  updateEventWidths();
}, 300);
const updateNowIndicatorContent = () => {
  const nowIndicatorArrow = document.querySelector(
    ".fc-timegrid-now-indicator-arrow"
  );
  if (nowIndicatorArrow) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
    nowIndicatorArrow.innerHTML = formattedTime;
  }
};
watch(calendarRange, (newValue: any) => {
  if (newValue) {
    let date = new Date(newValue);
    let nextDay = new Date(date);
    const calendarApi = getCalendarApi();
    nextDay.setDate(date?.getDate() + 1);
    (filter.from_date = dayjs(nextDay).format("YYYY-MM-DD")),
      (filter.to_date = dayjs(getWeekEndDate(nextDay)).format("YYYY-MM-DD")),
      router.replace({
        name: "",
        query: {
          ...route.query,
          view: filter.type,
          from_date: filter.from_date,
          to_date: filter.to_date,
        },
      });
    if (calendarApi) {
      calendarApi.gotoDate(filter.from_date);
      getCurrentRange(false);
      if (route.query?.room) {
        filterByLessons();
      } else {
        emits("onFetch", filter);
      }
      visibleCalendar.value = false;
    }
  }
});
const prevDay = () => {
  const calendarApi = getCalendarApi();
  if (calendarApi) {
    calendarApi.prev();
    getCurrentRange();
  }
};
const nextDay = () => {
  const calendarApi = getCalendarApi();
  if (calendarApi) {
    calendarApi.next();

    getCurrentRange();
  }
};
const getCurrentRange = (val: boolean = true) => {
  const calendarApi = getCalendarApi();
  if (calendarApi) {
    const view = calendarApi.view;
    const start = view.currentStart.toISOString().split("T")[0];
    const end = view.currentEnd.toISOString().split("T")[0];
    filter.from_date = currentView.value == "resourceTimeGridDay" ? end : start;
    filter.to_date = end;

    router.replace({
      name: "",
      query: {
        ...route.query,
        view: filter.type,
        formDate: undefined,
        from_date: filter.from_date,
        to_date: filter.to_date,
      },
    });
    if (val) {
      emits("onFetch", filter);
    }
    currentRange.value = { start, end };
  }
};
const getCalendarApi = () => {
  if (fullCalendar.value) {
    return fullCalendar.value.getApi();
  }
  return null;
};
function addMinutes(time: string, minutesToAdd: number) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(0, 0, 0, hours, minutes + minutesToAdd);
  const newHours = String(date.getHours()).padStart(2, "0");
  const newMinutes = String(date.getMinutes()).padStart(2, "0");
  return `${newHours}:${newMinutes}`;
}
const filterByLessons = () => {
  if (selectedLesson.value || searchRoom.value) {
    router.replace({
      name: "",
      query: {
        ...route.query,
        from_date: filter.from_date,
        to_date: filter.to_date,
        formDate: undefined,
        lesson: selectedLesson.value
          ? selectedLesson.value.value == "none"
            ? undefined
            : JSON.stringify(selectedLesson.value)
          : undefined,
        room: searchRoom.value ? searchRoom.value : undefined,
      },
    });

    setTimeout(() => {
      emits("fetchRooms", filter);
    });
  } else {
    resetFilterRooms();
  }
};
const resetFilterRooms = () => {
  searchRoom.value = "";
  router.replace({
    name: "",
    query: {
      ...route.query,
      room: undefined,
      lessons: undefined,
    },
  });
  setTimeout(() => {
    emits("fetchRooms");
  });
};
const calendarFilter = () => {
  filter.teacher_id = selectedTeacher.value?.value as string;
  filter.course_reference_id =
    filter.course_reference_id == "none"
      ? undefined
      : filter.course_reference_id;
  router.replace({
    name: "",
    query: {
      ...route.query,
      from_date: filter.from_date,
      to_date: filter.to_date,
      teacher: selectedTeacher.value
        ? JSON.stringify(selectedTeacher.value)
        : undefined,
      course: filter.course_reference_id
        ? filter.course_reference_id
        : undefined,
    },
  });
  emits("onFetch", filter);
};
const timeSlotSetUp = (data: any) => {
  const calendarApi = getCalendarApi();
  calendarApi.setOption("slotMinTime", data.start_time);
  calendarApi.setOption("slotMaxTime", addMinutes(data.end_time, 30));
  if (currentView.value == "resourceTimeGridDay") {
    calendarApi.setOption(
      "slotLabelInterval",
      addMinutes("00:00", data.duration_in_minutes)
    );
  }
};
const resetAllFilters = () => {
  filter.teacher_id = undefined;
  filter.course_reference_id = undefined;
  searchRoom.value = "";
  selectedLesson.value = "";
  selectedTeacher.value = undefined;
  const selectedDate = dayjs(new Date());
  const startOfWeek = selectedDate.startOf("week").format("YYYY-MM-DD"); // Monday
  router.replace({
    name: "",
    query: {},
  });
  calendarRange.value = startOfWeek;
  setTimeout(() => {
    calendarRange.value = startOfWeek;
  }, 1000);
  emits("fetchRooms");
  setTimeout(() => {
    emits("fetchRooms");
  }, 1000);
};
// Setting up time options
watch(
  () => props.calendarData,
  (data) => {
    timeSlotSetUp(data);
  }
);
watch(
  () => route.query?.formDate, // Watching route.query
  (newQuery, oldQuery) => {
    if (newQuery) {
      const selectedDate = dayjs(route.query?.formDate as string) as any;
      const startOfWeek = selectedDate.startOf("week").format("YYYY-MM-DD");
      calendarRange.value = startOfWeek;
      if (route.query?.room) {
        searchRoom.value = route.query?.room;
      }
      setTimeout(() => {
        calendarRange.value = startOfWeek;
      }, 1000);
    }
  },
  { deep: true, immediate: true }
);
// Setting up resourses rooms to calendar
watch(
  () => props.roomList,
  (data) => {
    if (data.length) {
      calendarOptionss.value.resources = [];
      data.forEach((element: any) => {
        calendarOptionss.value.resources.push({
          id: element.id,
          title: element.name,
          code: element.code,
        });
      });
    } else {
      calendarOptionss.value.resources = [];
    }
  }
);
// Setting up events to calendar
watch(
  () => props.data,
  (data) => {
    const calendarApi = getCalendarApi();
    if (data?.length) {
      calendarOptionss.value.events = data;
      calendarOptionss.value.events.forEach((task: any) => {
        task.start = task.start?.slice(0, 19);
        task.end = task.end?.slice(0, 19);
        if (task.resourceId === null) {
          delete task.resourceId;
        }
        if (currentView.value === "resourceTimeGridDay") {
          delete task.allDay;
        }
      });
      isHoliday.value = false;

      setTimeout(() => {
        updateEventWidths();
        if (calendarApi) {
          calendarApi.updateSize();
          calendarApi.render();
        }
      }, 1000);
    } else {
      isHoliday.value = false;
      calendarOptionss.value.events = [];
    }
  }
);
const handleClickOutside = (event: MouseEvent) => {
  const dropdownElement = document.querySelector(".calendar_drop");
  if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
    dialogVisible.value = false;
  }
};
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", handleResize);
  const calendarApi = getCalendarApi();
  if (route.query?.from_date) {
    calendarApi.gotoDate(route.query?.to_date);
  }
  if (calendarApi) {
    calendarApi.changeView(currentView.value);
    getCurrentRange();
  }
  if (props.calendarData && calendarApi) {
    timeSlotSetUp(props.calendarData);
  }
});
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
<style lang="scss">
.fc-theme-standard .fc-scrollgrid {
  border: 1px solid #e5e7eb !important;
  border-radius: 16px !important;
  border-collapse: collapse !important;
}

.fc-theme-standard td,
.fc-theme-standard th {
  border: 1px solid #e5e7eb;
}

.fc .fc-col-header-cell-cushion {
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  color: #1c1b1f;
  padding: 16px 0px;
}

.fc .fc-timegrid-slot {
  background: white;
  border-left: 1px solid #e5e7eb;
}

.fc-direction-ltr .fc-timegrid-slot-label-frame {
  text-align: center;
}

.fc-timegrid-slot-label-cushion {
  padding: 5px 10px !important;
  font-family: IBM Plex Sans Condensed;
  font-size: 12px;
  font-weight: 400;
  line-height: 15.6px;
  color: #1c1b1f;
}

.fc-timegrid-slot {
  // border-top: none !important;
  // border-bottom: none !important;
}

.custom-border {
  border-top: 1px solid #e5e7eb !important;
}

.fc .fc-timegrid-now-indicator-line {
  z-index: 9999;
  border: 1px solid #7f56d9 !important;
}

.fc .fc-timegrid-now-indicator-arrow {
  border-bottom-color: transparent;
  z-index: 9999;
  border-top-color: transparent;
  border-color: #7f56d9;
  background: #7f56d9;
  font-family: IBM Plex Sans Condensed;
  font-size: 12px;
  font-weight: 700;
  line-height: 15.6px;
  color: white;
  width: 100%;
  margin-top: -15px;
  padding: 5px 5px 5px 4px;
}

.fc-event {
  border-radius: 0px;
  padding: 0px;
  margin: 2px 0px !important;
  border: 1px solid #e5e7eb !important;
  /* background: transparent !important; */
}

.fc .fc-event {
  border-radius: 0;
  padding: 0;
  margin: 2px 0px !important;
  border: 1px solid #e5e7eb !important;
  /* background: transparent !important; */
}

.fc-timegrid-event .fc-event-main {
  padding: 0px !important;
}

.fc .fc-datagrid-cell-cushion {
  font-family: "Inter";
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: #1c1b1f;
  text-align: center;
  width: 100%;
}

.fc .fc-timeline-slot-cushion {
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: center;
  width: 100%;
}

.fc-day-today {
  color: #7f56d9;
}

.fc-timeline-event:not(.fc-event-end)::after,
.fc-timeline-event:not(.fc-event-start)::before {
  display: none;
}

.fc-bg-event {
  background: #f9fafb !important;
  opacity: 1 !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fc-h-event,
.fc-v-event {
  background: transparent !important;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.custom-dialog {
  background: #fff !important;

  .el-dialog__close {
    background: white !important;
    color: var(--gray-400, #9ca3af) !important;
    font-size: 21px !important;
  }

  .el-input__wrapper,
  .el-select__wrapper,
  .el-select__caret,
  .el-textarea__inner {
    background-color: #f9fafb !important;
  }

  .el-select__caret {
    color: #6b7280;
  }
}

.fc .fc-timegrid-col.fc-day-today {
  background: white;
  // display: none !important;
}
</style>
