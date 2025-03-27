<template>
  <div class="xl:p-6 space-y-5 overflow-hidden">
    <div class="bg-white p-6 rounded-3xl flex items-center justify-between">
      <div class="flex items-center gap-3">
        <router-link to="/timetable">
          <svg
            width="18"
            height="15"
            viewBox="0 0 18 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.7144 6.11608H4.39019L7.33817 2.90652C7.46096 2.7774 7.55891 2.62295 7.62629 2.45218C7.69367 2.28141 7.72913 2.09774 7.73061 1.91188C7.7321 1.72603 7.69957 1.54171 7.63492 1.36969C7.57028 1.19767 7.47482 1.04139 7.35411 0.909968C7.23339 0.778545 7.08985 0.674611 6.93185 0.604232C6.77385 0.533853 6.60456 0.498438 6.43385 0.500053C6.26314 0.501668 6.09444 0.540281 5.93759 0.613639C5.78073 0.686997 5.63887 0.793631 5.52027 0.927318L0.377706 6.5262C0.257979 6.65622 0.162988 6.81068 0.098175 6.98073C0.033362 7.15079 0 7.33309 0 7.5172C0 7.70131 0.033362 7.88361 0.098175 8.05367C0.162988 8.22372 0.257979 8.37818 0.377706 8.5082L5.52027 14.1071C5.76275 14.3621 6.0875 14.5031 6.42459 14.4999C6.76169 14.4968 7.08414 14.3496 7.32251 14.09C7.56088 13.8305 7.69609 13.4794 7.69902 13.1124C7.70195 12.7454 7.57236 12.3919 7.33817 12.1279L4.39019 8.91552H16.7144C17.0553 8.91552 17.3823 8.76805 17.6234 8.50555C17.8645 8.24305 18 7.88703 18 7.5158C18 7.14457 17.8645 6.78855 17.6234 6.52605C17.3823 6.26355 17.0553 6.11608 16.7144 6.11608Z"
              fill="#1F2A37"
            />
          </svg>
        </router-link>
        <h5 class="font-semibold text-lg" v-if="calendarGetOne">
          {{ calendarGetOne.name }}
        </h5>
      </div>
      <el-button
        @click="downloadPDF"
        :loading="downloading"
        size="large"
        class="flex items-center gap-2"
        :icon="Download"
      >
        Download timetable
      </el-button>
    </div>
    <div class="bg-white p-6 rounded-3xl relative load" v-loading="loading">
      <!-- :teacherList="staffStore.getTeacherSelect" -->
      <div>
        <Calendar
          @onFetch="fetchList"
          :lessonTypes="lessonTypes"
          :assignCourses="curriculumStore.assignCourses"
          @fetchRooms="fetchRooms"
          :data="data"
          :allRooms="roomStore.getRoomReferencesSelect"
          :roomList="roomList.data"
          :calendarData="calendarGetOne"
          @openForm="openFormCalendar"
        />
      </div>
    </div>
    <div class="py-4">
      <el-pagination
        v-if="roomList.total > roomList.limit"
        background
        @current-change="changePagination"
        layout="prev, pager, next"
        next-text="Next ->"
        prev-text="<- Previous"
        :page-size="roomList.limit"
        :total="roomList.total"
      />
    </div>
    <el-dialog
      width="680px"
      v-model="openDialog"
      class="custom-dialog"
      :title="`Add ${selectEvent}`"
      :visible="dialogVisible"
      @close="handleClose"
    >
      <component
        :is="dialogComponent"
        :event="selectEvent"
        :currentSemester="calendarGetOne?.semester_info?.name"
        v-if="openDialog"
        @close-dialog="openDialog = false"
        @submit-success="handleFormSubmit"
        :calendarID="calendarGetOne"
        ref="ruleFormRef"
      />
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import {
  Download,
  Plus,
  ArrowRightBold,
  ArrowLeftBold,
} from "@element-plus/icons-vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { onMounted, reactive, ref, computed, watch } from "vue";
import Calendar from "./components/Calendar.vue";
import HolidayForm from "./forms/HolidayForm.vue";
import ClassForm from "./forms/ClassForm.vue";
import EventForm from "./forms/EventForm.vue";
import ExamForm from "./forms/ExamForm.vue";
import PracticeForm from "./forms/PracticeForm.vue";
import { useRoute, useRouter } from "vue-router";
import { dayjs } from "element-plus";
import { IEventFilter } from "@/models/backend";
import {
  useCurriculumStore,
  useLessonTypeStore,
  useRoomReferenceStore,
  useStaffStore,
  useTimeTableGroups,
  useTimetableStore,
} from "@/stores";

const calendarStore = useTimetableStore();
const lessonStore = useLessonTypeStore();
const roomStore = useRoomReferenceStore();
const groupsStore = useTimeTableGroups();
const staffStore = useStaffStore();
const lessonTypeStore = useLessonTypeStore();
const curriculumStore = useCurriculumStore();
const route = useRoute();
const router = useRouter();
const data = computed(() => calendarStore.events.data);
const calendarGetOne = computed(() => calendarStore.calendarGetOne.data);
const roomList = computed(() => roomStore.roomCalendarReference);
const lessonTypes = computed(() => lessonStore.getLessonTypesSelect);
const screen = ref(2);
const loading = ref(false);
const downloading = ref(false);
const selectedDate = dayjs(new Date());
const startOfWeek = selectedDate.startOf("week").format("YYYY-MM-DD"); // Monday
const endOfWeek = selectedDate.endOf("week").format("YYYY-MM-DD");
const filter: IEventFilter = reactive({
  page: 1,
  limit: 6,
  calendar_id: route.params.id as string,
  from_date: (route.query?.from_date as string) || startOfWeek,
  to_date: (route.query?.to_date as string) || endOfWeek,
  type: "week",
  room_ids: [],
  teacher_id: route.query?.teacher
    ? JSON.parse(route.query.teacher as any)?.value
    : undefined,
  course_reference_id: route.query?.course
    ? (route.query.course as any)
    : undefined,
  lesson_type_id: route.query?.lesson
    ? JSON.parse(route.query.lesson as any)?.value
    : undefined,
});
const roomFilter = reactive({
  page: parseInt(route.query?.page as string) || 1,
  limit: 30,
  search: route.query?.room ? route.query?.room : (undefined as any),
  lesson_type_id: route.query?.lesson
    ? JSON.parse(route.query?.lesson as string).value
    : (undefined as any),
});
const totalPage = computed(
  () => roomStore.roomCalendarReference.total / roomFilter.limit
);
const selectEvent = ref("");
const ruleFormRef = ref(null);
const openDialog = ref(false);
const editSingle = ref(false);
const dialogVisible = ref(false);
const editData = ref(null);
const fetchList = async (params: IEventFilter = filter) => {
  loading.value = true;
  const data = {
    room_ids: roomList.value.data.map((x: { id: string }) => x.id),
  };
  filter.course_reference_id = (route.query?.course as string) || undefined;
  if (roomList.value.total) {
    await calendarStore.fetchCalendarEvents(params, data);
  }
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};
const changePagination = (val: number) => {
  loading.value = true;
  roomFilter.page = val;
  router.replace({ name: "", query: { ...route.query, page: val } });
  fetchRooms();
};
const fetchRooms = async () => {
  loading.value = true;
  (roomFilter.search = route.query?.room ? route.query?.room : undefined),
    (filter.lesson_type_id = route.query?.lesson
      ? JSON.parse(route.query?.lesson as any)?.value
      : undefined);
  if (route.query.room) {
    filter.from_date = route.query.from_date as string;
    filter.to_date = route.query.to_date as string;
  }
  await roomStore.fetchRoomCalendarReferences(roomFilter);
  fetchList(filter);
};
const openFormCalendar = (val: string, isEdit = false) => {
  selectEvent.value = val;
  if (isEdit) {
    editSingle.value = true;
  } else {
    openDialog.value = true;
  }
  dialogVisible.value = false;
};
const dialogComponent = computed(() => {
  switch (selectEvent.value) {
    case "Holiday":
      return HolidayForm;
    case "Class":
      return ClassForm;
    case "Event":
      return EventForm;
    case "Exam":
      return ExamForm;
    case "Practice":
      return PracticeForm;
    default:
      return null;
  }
});
const handleClose = () => {
  openDialog.value = false;
};
function handleFormSubmit(data: any) {
  if (data.closeDialog) {
    openDialog.value = false;
  } else if (data.openNewDialog) {
    selectEvent.value = data.newEventType;
    openDialog.value = true;
  }
  // setTimeout(() => {
  //   fetchList(filter);
  // }, 1000);
}
const downloadPDF = () => {
  downloading.value = true;
  const calendarElement = document.querySelector(".fc") as HTMLElement;

  if (calendarElement) {
    html2canvas(calendarElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("calendar.pdf");
    });
  } else {
    console.error("FullCalendar element not found.");
  }
  setTimeout(() => {
    downloading.value = false;
  }, 1500);
};
watch(selectEvent, () => {
  openDialog.value = true;
});
watch(
  () => route.query,
  (newQuery) => {
    filter.teacher_id = newQuery?.teacher
      ? JSON.parse(newQuery.teacher as any)?.value
      : undefined;
    filter.page = parseInt(newQuery.page as string) || 1;
  }
);
watch(
  () => route.query,
  (newQuery) => {
    filter.lesson_type_id = newQuery?.lesson
      ? JSON.parse(newQuery.lesson as any)?.value
      : undefined;
  }
);
onMounted(async () => {
  await lessonStore.fetchLessonTypes();
  fetchRooms();
  console.log(
    !calendarStore.calendarGetOne.data,
    "!calendarStore.calendarGetOne.data"
  );

  if (
    !calendarStore.calendarGetOne.data ||
    calendarStore.calendarGetOne.data.id !== route.params.id
  ) {
    await calendarStore.getDetailCalendar(route.params.id as string);
  }
  if (!roomStore.roomReference?.data?.length) {
    await roomStore.fetchRoomReferences();
  }
  await groupsStore.fetchTimetableGroupList({ limit: 100, page: 1 });
  if (!staffStore.staffs.data.length) {
    await staffStore.getStaffs({
      page: 1,
      limit: 400,
    });
  }
  if (!lessonTypeStore.lessonTypes.data.length) {
    await lessonTypeStore.fetchLessonTypes({ limit: 100, page: 1 });
  }
  await curriculumStore.fetchAssignCourses({
    limit: 400,
    page: 1,
    semester: calendarGetOne?.value?.semester_info?.name,
  });
});
</script>
<style>
.load .el-loading-mask {
  background: #fff !important;
}
</style>
