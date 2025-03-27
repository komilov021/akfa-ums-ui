<template>
  <div class="max-w-screen-2xl mx-auto mt-5">
    <div class="grid grid-cols-1 md:grid-cols-2 px-5 md:px-0 gap-6 my-6">
      <div class="stat-card">
        <TeacherTimeSpendChart
          v-if="dailySpendTeacher"
          :data="dailySpendTeacher"
          :currentdate="spendTeacherDaily"
        />
        <div class="p-7" v-else>
          <el-skeleton :rows="8" animated />
        </div>
        <div class="h-[1px] bg-[#EAECF0]" />
        <div class="flex justify-end px-3 py-2 !h-11">
          <el-date-picker
            v-model="spendTeacherDaily"
            type="daterange"
            class="!invisible dateRange"
            popper-class="dateRange"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :visible="datePickerVisible2"
            placeholder="Pick a day"
            :disabled-date="disabledDate"
          />
          <div>
            <el-button
              @click="datePickerVisible2 = !datePickerVisible2"
              class="stat-btn"
              >Select range</el-button
            >
          </div>
        </div>
      </div>
      <div class="stat-card flex flex-col">
        <p
          class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-lg 2xl:text-xl leading-6 p-4 pb-0"
        >
          Facility utilization is a metric that is indicated by room
        </p>
        <div class="flex items-center text-[#C8C7C7] text-[12.57px] px-4 pb-3">
          <div class="first-letter:uppercase">
            <span class="lowercase">{{
              dayjs(from_date).format("YYYY-MM-DD")
            }}</span>
          </div>
          <div>&nbsp;-&nbsp;</div>
          <div class="first-letter:uppercase">
            <span class="lowercase">{{
              dayjs(to_date).format("YYYY-MM-DD")
            }}</span>
          </div>
        </div>
        <FacilityUtilizationPie
          v-if="facilityUtilizations"
          :data="facilityUtilizations"
        />
        <div class="p-7" v-else>
          <el-skeleton :rows="8" animated />
        </div>

        <div class="h-[1px] bg-[#EAECF0]" />
        <div class="flex justify-end px-3 py-2 !h-11">
          <el-date-picker
            v-model="indicatedByRoom"
            type="daterange"
            class="!invisible dateRange"
            popper-class="dateRange"
            :visible="datePickerVisible4"
            placeholder="Pick a day"
            :disabled-date="disabledDate"
          />
          <div class="">
            <el-button
              @click="datePickerVisible4 = !datePickerVisible4"
              class="stat-btn"
              >Select range</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="visibleCloser"
      class="fixed top-0 left-0 w-full h-screen"
      @click="closeAll"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { useStatisticsStore } from "@/stores";
import {
  ActiveTeacherPerSchoolChart,
  ActiveUsersBySchool,
  QuantityActiveStudentChart,
  StudentTimeSpendChart,
  TeacherTimeSpendChart,
  FacilityUtilizationPie,
} from "./index";
import datareseachJson from "../../researchPaoers";
import { computed, ref, watch, onMounted } from "vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const statisticsStore = useStatisticsStore();
const researchPaper = ref();
const getRoombyName = ref();
function getWeekStartDate(dateStart: any) {
  const day = dayjs(dateStart);
  return day.startOf("week").add(1, "day").toDate();
}
const spendTeacherDaily = ref([
  dayjs(getWeekStartDate(new Date())).format("YYYY-MM-DD"),
  dayjs(new Date()).format("YYYY-MM-DD"),
]);
const spendStudentDaily = ref();
const researchPaperCount = ref();
const indicatedByRoom = ref([
  dayjs(getWeekStartDate(new Date())).format("YYYY-MM-DD"),
  dayjs(new Date()).format("YYYY-MM-DD"),
]);

const fetching = ref(false);
const datePickerVisible = ref(false);
const datePickerVisible2 = ref(false);
const datePickerVisible3 = ref(false);
const datePickerVisible4 = ref(false);
const colors = ["#2F2F2F", "#8039FF", "#AA6CFF", "#959595"];
const measurementsOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: "{b} - {c}",
  },
  color: colors,
  series: [
    {
      name: "Applications",
      type: "pie",
      label: {
        formatter: "{c}",
      },
      labelLine: {
        length: 0.2,
      },
      radius: ["40%", "70%"],
      data: [],
    },
  ],
});

const visibleCloser = computed(
  () =>
    datePickerVisible.value ||
    datePickerVisible2.value ||
    datePickerVisible4.value
);
const dailySpendStudent = computed(() => statisticsStore.avgTimeSpendStudent);
const dailySpendTeacher = computed(() => statisticsStore.avgTimeSpendTeacher);
const from_date = computed(() => indicatedByRoom.value[0]);
const to_date = computed(() => indicatedByRoom.value[1]);
const facilityUtilizations = computed(
  () => statisticsStore.facilityUtilizations
);
const staffPerStudentRadio = computed(
  () => statisticsStore.staffPerStudentRadio
);
const teacherPerStudentRadio = computed(
  () => statisticsStore.teacherPerStudentRadio
);
const activeStudentCount = computed(() => statisticsStore.activeStudentCount);
const pointLeaders = computed(() => statisticsStore.pointLeaders);
const sortedByName = computed(() => getSortTimeWithName());

watch(spendStudentDaily, (newValue: any) => {
  const data = {
    date: dayjs(newValue).format("YYYY-MM-DD"),
  };
  statisticsStore.fetchAvgSpendStudent(data);
  datePickerVisible.value = false;
});
watch(spendTeacherDaily, (newValue: any) => {
  const data = {
    from_date: dayjs(newValue[0]).format("YYYY-MM-DD"),
    to_date: dayjs(newValue[1]).format("YYYY-MM-DD"),
  };
  statisticsStore.fetchAvgSpendTeacher(data);
  datePickerVisible2.value = false;
});
watch(indicatedByRoom, (newValue: any) => {
  const data = {
    from_date: dayjs(newValue[0]).format("YYYY-MM-DD"),
    to_date: dayjs(newValue[1]).format("YYYY-MM-DD"),
  };

  statisticsStore.fetchFacilityUtilization(data);
  datePickerVisible4.value = false;
});
watch(researchPaper, (newValue: any) => {
  researchPaperCount.value = datareseachJson[newValue];
  updateChartData(newValue);
  datePickerVisible3.value = false;
});

onMounted(() => {
  // const data = {
  //   date: dayjs(new Date()).format("YYYY-MM-DD"),
  // };
  // statisticsStore.fetchFacilityUtilization(data);
  selectRoom("All");
  const date = dayjs(new Date()).format("YYYY");
  researchPaperCount.value = datareseachJson[date];
  updateChartData(date);
});

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};
const closeAll = () => {
  datePickerVisible4.value = false;
  datePickerVisible.value = false;
  datePickerVisible2.value = false;
};

const getSummaries = (param: any) => {
  const { columns } = param;
  const sums: string[] = [];
  columns.forEach((column: any, index: any) => {
    if (column.property === "occupied_room_percentage") {
      sums[index] = facilityUtilizations.value?.total_average;
    } else {
      sums[index] = "Average";
    }
  });
  return sums;
};

const updateChartData = (year: string) => {
  const yearData = datareseachJson[year];
  if (yearData) {
    const schoolData = yearData.schools.map((school: any) => ({
      value: school.papers,
      name: school.school,
    }));
    measurementsOptions.value.series[0].data = schoolData;
  } else {
    measurementsOptions.value.series[0].data = [];
  }
};

const getSortTimeWithName = () => {
  const rooms = facilityUtilizations.value?.rooms || [];
  const filteredRooms =
    getRoombyName.value === "All"
      ? rooms
      : rooms.filter((room: any) => room.name === getRoombyName.value);
  return filteredRooms.sort((a: any, b: any) =>
    a.code.toLowerCase() < b.code.toLowerCase()
      ? -1
      : a.code.toLowerCase() > b.code.toLowerCase()
      ? 1
      : 0
  );
};

const selectRoom = (roomName: any) => {
  getRoombyName.value = roomName;
};

const updateLeaders = async (data: any) => {
  fetching.value = true;
  await statisticsStore.fetchPointLeaders(data);
  fetching.value = false;
};
</script>

<style></style>
