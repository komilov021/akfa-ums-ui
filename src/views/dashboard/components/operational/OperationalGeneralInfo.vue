<template>
  <div
    class="grid grid-cols-2 lg:grid-cols-4 max-w-screen-2xl mx-auto gap-3 sm:gap-6 px-5 md:px-0 mt-6"
  >
    <div class="miniCard">
      <div class="py-2 px-4" @click="datePickerVisible = !datePickerVisible">
        <p
          class="font-semibold tracking-tight leading-none sm:text-[16.24px] text-xs md:text-36"
        >
          Daily active students
        </p>
        <p
          class="text-[#C8C7C7] sm:text-[11px] text-[11px] md:mt-2 mt-0.5 tracking-tight leading-none"
        >
          {{
            activeStudentDaily
              ? dayjs(activeStudentDaily).format("DD MMMM")
              : "current day"
          }}
        </p>
        <h1
          class="text-2xl md:text-[53px] sm:text-[40px] my-auto font-bold mt-4 md:mt-7"
        >
          {{ $n(dailyActiveStudent || 0) }}
        </h1>
      </div>
      <div class="h-[1px] mt-5 bg-[#EAECF0] space" />
      <div class="flex justify-end px-3 py-1 sm:py-3">
        <el-date-picker
          v-model="activeStudentDaily"
          type="date"
          class="!invisible"
          :visible="datePickerVisible"
          placeholder="Pick a day"
          :disabled-date="disabledDate"
        />
        <div class="">
          <el-button
            @click="datePickerVisible = !datePickerVisible"
            class="stat-btn"
            >Select day</el-button
          >
        </div>
      </div>
    </div>
    <!-- <div class="miniCard">
      <div class="py-2 px-4" @click="datePickerVisible5 = !datePickerVisible5">
        <p
          class="font-semibold tracking-tight leading-none sm:text-[16.24px] text-[11px] md:text-36"
        >
          Weekly students attendance
        </p>
        <p
          class="text-[#C8C7C7] sm:text-[11px] text-[8.22px] md:mt-2 mt-1 tracking-tight leading-none"
        >
          {{
            activeStudentWeekly1
              ? dayjs(activeStudentWeekly1).format("DD MMMM") +
                " - " +
                dayjs(getWeekEndDate(activeStudentWeekly1)).format("DD MMMM")
              : "current week"
          }}
        </p>
        <h1
          class="text-2xl md:text-[53px] sm:text-[40px] my-auto font-bold mt-1 md:mt-7"
        >
          {{ $n(weeklyStudentAttendance || 0) }}
        </h1>
      </div>
      <div class="h-[1px] mt-5 bg-[#EAECF0] hidden md:flex" />
      <div class="flex justify-end px-3 py-3">
        <el-date-picker
          v-model="activeStudentWeekly1"
          type="week"
          class="!invisible"
          :visible="datePickerVisible5"
          placeholder="Pick a day"
          :disabled-date="disabledDate"
        />
        <div class="hidden md:flex">
          <el-button
            @click="datePickerVisible5 = !datePickerVisible5"
            class="stat-btn"
            >Select week</el-button
          >
        </div>
      </div>
    </div>
    <div class="miniCard">
      <div class="py-2 px-4" @click="datePickerVisible2 = !datePickerVisible2">
        <p
          class="font-semibold tracking-tight leading-none sm:text-[16.24px] text-[11px] md:text-36"
        >
          Daily students attendance
        </p>
        <p
          class="text-[#C8C7C7] sm:text-[11px] text-[8.22px] md:mt-2 mt-1 tracking-tight leading-none"
        >
          {{
            activeStudentDaily2
              ? dayjs(activeStudentDaily2).format("DD MMMM")
              : "current day"
          }}
        </p>
        <h1
          class="text-2xl md:text-[53px] sm:text-[40px] my-auto font-bold mt-2 md:mt-7"
        >
          {{ $n(dailyStudentAttendance || 0) }}
        </h1>
      </div>
      <div class="h-[1px] mt-5 bg-[#EAECF0] hidden md:flex" />
      <div class="flex justify-end px-3 py-3">
        <el-date-picker
          v-model="activeStudentDaily2"
          type="date"
          class="!invisible"
          :visible="datePickerVisible2"
          placeholder="Pick a day"
          :disabled-date="disabledDate"
        />
        <div class="hidden md:flex">
          <el-button
            @click="datePickerVisible2 = !datePickerVisible2"
            class="stat-btn"
            >Select day</el-button
          >
        </div>
      </div>
    </div> -->

    <div class="miniCard">
      <div class="py-2 px-4" @click="datePickerVisible3 = !datePickerVisible3">
        <p
          class="font-semibold tracking-tight leading-none sm:text-[16.24px] text-xs md:text-36"
        >
          Daily active teachers
        </p>
        <p
          class="text-[#C8C7C7] sm:text-[11px] text-[11px] md:mt-2 mt-0.5 tracking-tight leading-none"
        >
          {{
            activeStudentDaily3
              ? dayjs(activeStudentDaily3).format("DD MMMM")
              : "current day"
          }}
        </p>
        <h1
          class="text-2xl md:text-[53px] sm:text-[40px] my-auto font-bold mt-4 md:mt-7"
        >
          {{ $n(dailyActiveTeacher || 0) }}
        </h1>
      </div>
      <div class="h-[1px] mt-5 bg-[#EAECF0] space" />
      <div class="flex justify-end px-3 py-1 sm:py-3">
        <el-date-picker
          v-model="activeStudentDaily3"
          type="date"
          class="!invisible"
          :visible="datePickerVisible3"
          placeholder="Pick a day"
          :disabled-date="disabledDate"
        />
        <div class="">
          <el-button
            @click="datePickerVisible3 = !datePickerVisible3"
            class="stat-btn"
            >Select day</el-button
          >
        </div>
      </div>
    </div>
    <div class="miniCard">
      <div class="py-2 px-4">
        <p
          class="font-semibold tracking-tight md:leading-none sm:text-[16.24px] text-xs md:text-36"
        >
          Students who was online for all time
        </p>
        <!-- <p class="text-[#C8C7C7] text-[12.57px]">current week</p> -->
        <h1
          class="text-2xl md:text-[53px] sm:text-[36px] my-auto font-bold mt-6 md:mt-12"
        >
          {{ $n(onlineStudents?.count || 0) }}
        </h1>
      </div>
      <!-- <div class="h-[1px] mt-5 bg-[#EAECF0]" /> -->
      <!-- <div class="flex justify-end px-3 py-3">
            <el-date-picker
              v-model="activeStudentWeekly3"
              type="week"
              class="!invisible"
              :visible="datePickerVisible7"
              placeholder="Pick a day"
              :disabled-date="disabledDate"
            />
            <el-button
              @click="datePickerVisible7 = !datePickerVisible7"
              class="stat-btn"
              >Select week</el-button
            >
          </div> -->
    </div>
    <div class="miniCard">
      <div class="py-2 px-4 text-[#000]">
        <p
          class="font-semibold tracking-tight md:leading-none sm:text-[16.24px] text-xs md:text-36"
        >
          Teachers who was online for all time
        </p>
        <!-- <p class="text-[#C8C7C7] text-[12.57px]">current day</p> -->
        <h1
          class="text-2xl md:text-[53px] sm:text-[40px] my-auto font-bold mt-6 md:mt-12"
        >
          {{ $n(onlineTeachers?.count || 0) }}
        </h1>
      </div>
      <!-- <div class="h-[1px] mt-5 bg-[#EAECF0]" /> -->
      <!-- <div class="flex justify-end px-3 py-3">
            <el-date-picker
              v-model="activeStudentDaily3"
              type="date"
              class="!invisible"
              :visible="datePickerVisible3"
              placeholder="Pick a day"
              :disabled-date="disabledDate"
            />
            <el-button
              @click="datePickerVisible3 = !datePickerVisible3"
              class="stat-btn"
              >Select day</el-button
            >
          </div> -->
    </div>
    <div class="miniCard">
      <div class="py-2 px-4" @click="datePickerVisible4 = !datePickerVisible4">
        <p
          class="font-semibold tracking-tight leading-none sm:text-[16.24px] text-xs md:text-36"
        >
          Weekly active students
        </p>
        <p
          class="text-[#C8C7C7] sm:text-[11px] text-[11px] md:mt-2 mt-0.5 tracking-tight leading-none"
        >
          {{
            activeStudentWeekly
              ? dayjs(activeStudentWeekly).format("DD MMMM") +
                " - " +
                dayjs(getWeekEndDate(activeStudentWeekly)).format("DD MMMM")
              : "current week"
          }}
        </p>
        <h1
          class="text-2xl md:text-[53px] sm:text-[40px] my-auto font-bold mt-3 md:mt-7"
        >
          {{ $n(weeklyActiveStudent || 0) }}
        </h1>
      </div>
      <div class="h-[1px] mt-5 bg-[#EAECF0] space" />
      <div class="flex justify-end px-3 py-1.5 sm:py-3">
        <el-date-picker
          v-model="activeStudentWeekly"
          type="week"
          class="!invisible"
          :visible="datePickerVisible4"
          placeholder="Pick a day"
          :disabled-date="disabledDate"
        />
        <div class="">
          <el-button
            @click="datePickerVisible4 = !datePickerVisible4"
            class="stat-btn"
            >Select week</el-button
          >
        </div>
      </div>
    </div>
    <div class="miniCard">
      <div class="py-2 px-4" @click="datePickerVisible7 = !datePickerVisible7">
        <p
          class="font-semibold tracking-tight leading-none sm:text-[16.24px] text-xs md:text-36"
        >
          Weekly active teachers
        </p>
        <p
          class="text-[#C8C7C7] sm:text-[11px] text-[11px] md:mt-2 mt-0.5 tracking-tight leading-none"
        >
          {{
            activeStudentWeekly3
              ? dayjs(activeStudentWeekly3).format("DD MMMM") +
                " - " +
                dayjs(getWeekEndDate(activeStudentWeekly3)).format("DD MMMM")
              : "current week"
          }}
        </p>
        <h1
          class="text-2xl md:text-[53px] sm:text-[40px] my-auto font-bold mt-3 md:mt-7"
        >
          {{ $n(weeklyActiveTeacher || 0) }}
        </h1>
      </div>
      <div class="h-[1px] mt-5 bg-[#EAECF0] space" />
      <div class="flex justify-end px-3 py-1.5 sm:py-3">
        <el-date-picker
          v-model="activeStudentWeekly3"
          type="week"
          class="!invisible"
          :visible="datePickerVisible7"
          placeholder="Pick a day"
          :disabled-date="disabledDate"
        />
        <div class="">
          <el-button
            @click="datePickerVisible7 = !datePickerVisible7"
            class="stat-btn"
            >Select week</el-button
          >
        </div>
      </div>
    </div>
    <!-- <div
      class="miniCard grid grid-cols-subgrid md:col-span-1 col-span-2 sticky md:relative"
    >
      <div class="py-2 px-4" @click="datePickerVisible9 = !datePickerVisible9">
        <p
          class="font-semibold tracking-tight leading-none sm:text-[16.24px] text-xs md:text-36"
        >
          Number of announcement
        </p>
        <p
          class="text-[#C8C7C7] sm:text-[11px] text-[11px] md:mt-2 mt-0.5 tracking-tight leading-none"
        >
          {{ numberAnnouncement[0] }} - {{ numberAnnouncement[1] }}
        </p>
        <h1
          class="text-2xl md:text-[53px] sm:text-[40px] my-auto font-bold mt-3 md:mt-7"
        >
          {{ $n(numberAnnouncementData || 0) }}
        </h1>
      </div>
      <div class="h-[1px] mt-5 bg-[#EAECF0] space" />
      <div class="flex justify-end px-3 py-1.5 sm:py-3">
        <el-date-picker
          v-model="numberAnnouncement"
          type="daterange"
          class="!invisible"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :visible="datePickerVisible9"
          placeholder="Pick a day"
          :disabled-date="disabledDate"
        />
        <div class="absolute right-2">
          <el-button
            @click="datePickerVisible9 = !datePickerVisible9"
            class="stat-btn"
            >Select week</el-button
          >
        </div>
      </div>
    </div> -->
  </div>
  <div
    class="grid md:grid-cols-2 grid-cols-1 p-5 md:p-0 max-w-screen-2xl mx-auto mt-0 md:mt-6 gap-4 md:gap-6"
  >
    <div class="charts relative">
      <div class="py-2 px-4 flex flex-col">
        <p
          class="text-black font-semibold sm:text-[16.24px] text-[14.24px] md:text-base"
        >
          Content availability
        </p>
        <p class="text-[#C8C7C7] text-[12.57px]">
          {{ activeStudentWeekly4[0] }} - {{ activeStudentWeekly4[1] }}
        </p>
        <AvailabilitySchooleChart
          v-if="contentAvailability"
          :data="contentAvailability"
        />
        <div v-else>
          <el-skeleton :rows="6" animated />
        </div>
      </div>
      <div class="h-[1px] bg-[#EAECF0]" />
      <div class="flex justify-end px-3 py-3">
        <el-date-picker
          v-model="activeStudentWeekly4"
          type="daterange"
          class="!invisible"
          popper-class="dateRange"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :visible="datePickerVisible8"
          placeholder="Pick a day"
          :disabled-date="disabledDate"
        />
        <el-button
          @click="datePickerVisible8 = !datePickerVisible8"
          class="stat-btn"
          >Select week</el-button
        >
      </div>
    </div>
    <AvarageAttendanceStudentsBySchool
      v-if="avarageAttendanceBySchool"
      :level="avarageAttendaceForLevel"
      :data="avarageAttendanceBySchool"
      @update="AvarageAttendanceStudentsUpdate"
    />
    <div v-else>
      <el-skeleton :rows="6" animated />
    </div>
    <div class="card charts flex flex-col justify-around">
      <div class="pt-4 pb-5 px-4">
        <p
          class="font-semibold tracking-tight leading-none sm:text-[16.24px] text-[11px] md:text-36"
        >
          Research papers per professor for {{ researchPaper }}
        </p>
        <div class="grid grid-cols-2 items-center justify-between">
          <div class="flex flex-col">
            <h1
              class="text-2xl md:text-[53px] sm:text-[40px] my-auto font-bold mt-4 md:mt-7"
            >
              {{ researchPaperCount?.paperPerProfessorAvg.toFixed(2) || 0 }}
              <span class="text-xl md:text-[33px] sm:text-[20px]"> to 1</span>
            </h1>
            <h1
              class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-lg 2xl:text-xl mt-4"
            >
              Total - {{ researchPaperCount?.totalPapers || "No data" }}
            </h1>
          </div>
          <div
            v-if="measurementsOptions.series[0].data.length"
            class="md:w-[260px] w-[180px] h-full"
          >
            <v-chart
              class="md:h-[528px] h-36"
              :option="measurementsOptions"
              autoresize
            />
          </div>
        </div>
      </div>
      <div>
        <div class="h-[1px] bg-[#EAECF0] flex" />
        <div class="flex justify-end px-3 py-2">
          <el-date-picker
            v-model="researchPaper"
            type="year"
            class="!invisible"
            :visible="datePickerVisible10"
            placeholder="Pick a day"
            format="YYYY"
            value-format="YYYY"
            :disabled-date="disabledDate"
          />
          <div
            v-if="datePickerVisible10"
            class="fixed top-0 left-0 w-full h-full z-40"
            @click="datePickerVisible10 = false"
          ></div>
          <div class="md:flex">
            <el-button
              @click="datePickerVisible10 = !datePickerVisible10"
              class="stat-btn"
              >Select year</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <LeaderBoards
      v-if="pointLeaders && !fetching"
      :data="pointLeaders?.data"
      :level="leadersforLevel"
      @update="updateLeaders"
    />
    <div v-else>
      <el-skeleton :rows="16" animated />
    </div>

    <ImploymentRateChart
      v-if="imploymentRates && !fetchingImployment"
      :data="imploymentRates"
      :school="imploymentRateChartSchool"
      @update="updateImploymentRate"
    />
    <div v-else>
      <el-skeleton :rows="16" animated />
    </div>
    <ProjectsBudget v-if="budgetData" :data="budgetData" />
    <div v-else>
      <el-skeleton :rows="6" animated />
    </div>
    <EmploymentStatus
      v-if="employmentList"
      :data="employmentList"
      :label="employmentforLabel"
      @update="updateEmployment"
    />
    <div v-else>
      <el-skeleton :rows="6" animated />
    </div>
  </div>
  <div
    v-if="visibleCloser"
    class="fixed top-0 left-0 w-full h-screen"
    @click="closeAll"
  ></div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted, watchEffect } from "vue";
import datareseachJson from "../../researchPaoers";
import { dayjs } from "element-plus";
import VChart from "vue-echarts";
import {
  LeaderBoards,
  AvailabilitySchooleChart,
  AvarageAttendanceStudentsBySchool,
  ImploymentRateChart,
  EmploymentStatus,
  ProjectsBudget,
} from "./index";
import { useOperationalsStore, useStatisticsStore } from "@/stores";
const statisticsStore = useStatisticsStore();
const operationalsStore = useOperationalsStore();
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};
function getWeekEndDate(startDate: Date) {
  const dayOfWeek = startDate.getDay();
  const daysUntilSaturday = 7 - dayOfWeek;
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + daysUntilSaturday);
  return endDate;
}

const dropdown1 = ref<any>();
const dropdown2 = ref<any>();
const dropdown3 = ref<any>();
const dropdown4 = ref<any>();
const dropdown5 = ref<any>();
const dropdown6 = ref<any>();
const colors = ["#2F2F2F", "#8039FF", "#AA6CFF", "#959595"];
const measurementsOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: "{b} - {c}",
    textStyle: {
      fontSize: window.innerWidth <= 768 ? 10 : 14,
    },
  },
  legend: {
    orient: "horizontal", // Legenda yo'nalishi: "vertical" yoki "horizontal"
    left: "left", // Legenda joylashuvi
    bottom: "0",
    pageIconSize: [30, 50],
    textStyle: {
      fontSize: window.innerWidth <= 768 ? 6 : 14,
    },
    type: "plain",
    itemWidth: window.innerWidth <= 768 ? 6 : 10,
    itemHeight: window.innerWidth <= 768 ? 6 : 10,
    width: window.innerWidth <= 768 ? "80px" : "100px",
    height: window.innerWidth <= 768 ? "30px" : "39px",
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
const avarageAttendanceBySchool = computed(
  () => statisticsStore.avarageAttendanceBySchool
);
const datePickerVisible = ref(false);
const activeStudentDaily = ref();
const researchPaperCount = ref();
const researchPaper = ref();
const datePickerVisible2 = ref(false);
const activeStudentDaily2 = ref();

const datePickerVisible3 = ref(false);
const activeStudentDaily3 = ref();

const datePickerVisible4 = ref(false);
const activeStudentWeekly = ref();

const activeStudentWeekly1 = ref();
const datePickerVisible5 = ref(false);

const activeStudentWeekly2 = ref();
const datePickerVisible6 = ref(false);

const activeStudentWeekly3 = ref();
const datePickerVisible7 = ref(false);
const datePickerVisible10 = ref(false);
const activeStudentWeekly4 = ref([
  "2025-01-27",
  dayjs(new Date()).format("YYYY-MM-DD"),
]);
const numberAnnouncement = ref([
  "2024-09-14",
  dayjs(new Date()).format("YYYY-MM-DD"),
]);
const datePickerVisible9 = ref(false);
const datePickerVisible8 = ref(false);
const pointLeaders = computed(() => statisticsStore.pointLeaders);
const imploymentRates = computed(() => operationalsStore.imploymentRate);
const CardVisible = ref(false);

const visibleCloser = computed(
  () =>
    datePickerVisible.value ||
    datePickerVisible2.value ||
    datePickerVisible3.value ||
    datePickerVisible4.value ||
    datePickerVisible5.value ||
    datePickerVisible6.value ||
    datePickerVisible7.value ||
    datePickerVisible8.value ||
    datePickerVisible9.value
);
let dailyActiveStudent = computed(() => operationalsStore.dailyActiveStudent);
let weeklyActiveStudent = computed(() => operationalsStore.weeklyActiveStudent);
let dailyActiveTeacher = computed(() => operationalsStore.dailyActiveTeacher);
let budgetData = computed(() => operationalsStore.projectBudgetPercentages);
let employmentList = computed(() => operationalsStore.studentEmployStatistic);
let weeklyActiveTeacher = computed(() => operationalsStore.weeklyActiveTeacher);
let numberAnnouncementData = computed(
  () => operationalsStore.numberAnnouncement
);
const contentAvailability = computed(
  () => operationalsStore.contentAvailability
);
const onlineTeachers = computed(() => operationalsStore.onlineTeachers);
const onlineStudents = computed(() => operationalsStore.onlineStudents);
let weeklyStudentAttendance = computed(
  () => operationalsStore.weeklyStudentAttendance
);
let dailyStudentAttendance = computed(
  () => operationalsStore.dailyStudentAttendance
);
let mostHightRankedCourse = computed(
  () => operationalsStore.mostHightRankedCourse
);
function calculateDateDifference(newValue: any) {
  const currentDate = new Date();
  const selectedDate = new Date(newValue);
  const differenceInMs = selectedDate.getTime() - currentDate.getTime();
  return Math.abs(Math.ceil(differenceInMs / (1000 * 3600 * 24)));
}
const fetching = ref(false);
// for level propdan berish uchun, tanlangan levelni va labelni chiqarib berish uchun
const avarageAttendaceForLevel = ref();
const leadersforLevel = ref();
const employmentforLabel = ref();
const imploymentRateChartSchool = ref();
// end..
const closeAll = () => {
  datePickerVisible.value = false;

  datePickerVisible2.value = false;

  datePickerVisible3.value = false;

  datePickerVisible4.value = false;

  datePickerVisible5.value = false;

  datePickerVisible6.value = false;

  datePickerVisible7.value = false;
  datePickerVisible8.value = false;
  datePickerVisible9.value = false;
};
const AvarageAttendanceStudentsUpdate = (level: number) => {
  avarageAttendaceForLevel.value = level;
  statisticsStore.fetchAverageAttendanceByGpa(level);
};
const updateChartData = (year: string) => {
  researchPaper.value = year;
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

watch(activeStudentDaily, (newValue: any) => {
  const data = {
    // from_date: dayjs(newValue).format("YYYY-MM-DD"),
    // to_date: dayjs(newValue).format("YYYY-MM-DD"),
    date: dayjs(newValue).format("YYYY-MM-DD"),
  };
  operationalsStore.fetchDailyActiveStudents(data);
  datePickerVisible.value = false;
});
watch(numberAnnouncement, (newValue: any) => {
  const data = {
    from_date: numberAnnouncement.value[0],
    to_date: numberAnnouncement.value[1],
  };
  operationalsStore.fetchNumberAnnouncement(data);
  datePickerVisible9.value = false;
});
watch(activeStudentDaily2, (newValue: any) => {
  const data = {
    date: dayjs(newValue).format("YYYY-MM-DD"),
  };
  operationalsStore.fetchDailyStudentAttendance(data);
  datePickerVisible2.value = false;
});
watch(activeStudentDaily3, (newValue: any) => {
  const data = {
    // from_date: dayjs(newValue).format("YYYY-MM-DD"),
    // to_date: dayjs(newValue).format("YYYY-MM-DD"),
    date: dayjs(newValue).format("YYYY-MM-DD"),
  };
  operationalsStore.fetchDailyActiveTeacher(data);
  datePickerVisible3.value = false;
});
watch(activeStudentWeekly, (newValue: any) => {
  let nextDay = new Date(newValue);
  nextDay.setDate(newValue.getDate() + 1);
  const data = {
    from_date: dayjs(nextDay).format("YYYY-MM-DD"),
    to_date: dayjs(getWeekEndDate(nextDay)).format("YYYY-MM-DD"),
  };
  operationalsStore.fetchWeeklyActiveStudent(data);
  datePickerVisible4.value = false;
});
watch(activeStudentWeekly1, (newValue: any) => {
  let nextDay = new Date(newValue);
  nextDay.setDate(newValue.getDate() + 1);
  const data = {
    from_date: dayjs(nextDay).format("YYYY-MM-DD"),
    to_date: dayjs(getWeekEndDate(nextDay)).format("YYYY-MM-DD"),
  };
  operationalsStore.fetchWeeklyStudentAttendance(data);
  datePickerVisible5.value = false;
});
watch(activeStudentWeekly2, (newValue: any) => {
  let nextDay = new Date(newValue);
  nextDay.setDate(newValue.getDate() + 1);
  const data = {
    from_date: dayjs(nextDay).format("YYYY-MM-DD"),
    to_date: dayjs(getWeekEndDate(nextDay)).format("YYYY-MM-DD"),
  };
  operationalsStore.fetchMostHightRankedCourse(data);
  datePickerVisible6.value = false;
});
watch(activeStudentWeekly3, (newValue: any) => {
  let nextDay = new Date(newValue);
  nextDay.setDate(newValue.getDate() + 1);
  const data = {
    from_date: dayjs(nextDay).format("YYYY-MM-DD"),
    to_date: dayjs(getWeekEndDate(nextDay)).format("YYYY-MM-DD"),
  };
  operationalsStore.fetchWeeklyActiveTeacher(data);
  datePickerVisible7.value = false;
});
watch(activeStudentWeekly4, (newValue: any) => {
  const data = {
    from_date: activeStudentWeekly4.value[0],
    to_date: activeStudentWeekly4.value[1],
  };
  operationalsStore.fetchContentAvailability(data);
  datePickerVisible8.value = false;
});
watch(researchPaper, (newValue: any) => {
  researchPaperCount.value = datareseachJson[newValue];
  updateChartData(newValue);
  datePickerVisible10.value = false;
});
const updateLeaders = async (data: any) => {
  fetching.value = true;
  leadersforLevel.value = data;
  await statisticsStore.fetchPointLeaders(data);
  fetching.value = false;
};
watchEffect(() => {
  window.addEventListener("resize", () => {
    measurementsOptions.value.tooltip.textStyle.fontSize =
      window.innerWidth <= 768 ? 10 : 14;
  });
});
const updateEmployment = (params: any) => {
  employmentforLabel.value = params.label;
  operationalsStore.studentEmployment({
    program_id: params.value,
  });
};
const fetchingImployment = ref(false);
const updateImploymentRate = async (data: any) => {
  fetchingImployment.value = true;
  imploymentRateChartSchool.value = data;
  await operationalsStore.fetchImploymentRate(data);
  fetchingImployment.value = false;
};
const handleResize = () => {
  CardVisible.value = window.innerWidth <= 768;
  CardVisible.value = true; // Change 768 to your desired breakpoint
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
  // Check on mount in case the box should initially be visible
  // const date = dayjs(new Date()).format("YYYY");
  const date = "2024";
  researchPaperCount.value = datareseachJson[date];
  updateChartData(date);
});
const updateLegendForScreenSize = () => {
  const isMobile = window.innerWidth <= 768;

  measurementsOptions.value.legend = {
    orient: "horizontal",
    left: "left",
    bottom: "0",
    type: "plain", // Mobil uchun scroll, katta ekran uchun oddiy
    textStyle: {
      fontSize: isMobile ? 6 : 14,
    },
    itemWidth: isMobile ? 6 : 10,
    itemHeight: isMobile ? 6 : 10,
    width: isMobile ? "169px" : "290px",
    height: isMobile ? "30px" : "39px",
    pageIconSize: isMobile ? [10, 10] : [15, 15], // Scroll uchun sahifa tugmalari kattaligi
  };
};

// Ekran o'lchami o'zgarganda kuzatish uchun listener qo'shish
window.addEventListener("resize", () => {
  updateLegendForScreenSize();
});

// Dastlabki o'rnatish
updateLegendForScreenSize();
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
// let contentAvailability = computed(() => operationalsStore.contentAvailability);
</script>

<style scoped lang="scss">
.tab {
  .tag {
    background: rgba(214, 60, 49, 0.5);
  }
}

.charts {
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #c8c7c7;
  cursor: pointer;
}
</style>
