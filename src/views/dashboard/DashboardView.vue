<template>
  <div
    class="flex flex-col mx-auto md:px-0"
    v-if="
      userStore.getUser?.role === 'super_admin' ||
      userStore.getUser?.role === 'admin' ||
      userStore.getUser?.role === 'teacher'
    "
  >
    <div
      v-if="routeName === 'strategic-dashboard'"
      class="flex justify-between items-center mb-4 pt-2"
    ></div>
    <div class="py-4">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { use } from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, BarChart, LineChart } from "echarts/charts";
import { useRouter } from "vue-router";
import {
  useStatisticsStore,
  useOperationalsStore,
  useUsersStore,
  useGuideStore,
  useAcademicStore,
  useSchoolStore,
} from "@/stores";

import { computed, onMounted, ref, watch } from "vue";
import { dayjs } from "element-plus";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  BarChart,
  LineChart,
]);

const router = useRouter();

const examDatesStore = useAcademicStore();
const statisticsStore = useStatisticsStore();
const operationalsStore = useOperationalsStore();
const schoolStore = useSchoolStore();
const userStore = useUsersStore();
const guideStore = useGuideStore();
const schools = computed(() => schoolStore.getSchoolsSelct);

const routeName = computed(() => router.currentRoute.value.meta?.breadcrumb);

watch(
  () => router.currentRoute.value.meta?.breadcrumb,
  () => {
    fetchData();
  }
);
onMounted(async () => {
  guideStore.fetchPrograms();
  examDatesStore.fetchExamYears();
  await examDatesStore.fetchSemestr();
  // if (!schools.value.length) {
  schoolStore.fetchSchools();
  // }
  const semestrLength = examDatesStore.semestrs.length;
  if (semestrLength > 1) {
    statisticsStore.updateSemestr({
      from: examDatesStore.semestrs[semestrLength - 2].row_number,
      to: examDatesStore.semestrs[semestrLength - 1].row_number,
    });
  }

  fetchData();
});
function getWeekStartDate(dateStart: any) {
  const day = dayjs(dateStart);
  return day.startOf("week").add(1, "day").toDate();
}
function getWeekEndDate(dateWeekEnd: any) {
  const day = dayjs(dateWeekEnd);
  return day.startOf("week").add(6, "day").toDate();
}
const fetchData = () => {
  const currentdate = new Date();
  if (routeName.value === "operational-dashboard") {
    const currentDate = {
      // from_date: dayjs(currentdate).format("YYYY-MM-DD"),
      // to_date: dayjs(currentdate).format("YYYY-MM-DD"),
      date: dayjs(currentdate).format("YYYY-MM-DD"),
    };
    const weekData = {
      from_date: dayjs(getWeekStartDate(currentdate)).format("YYYY-MM-DD"),
      to_date: dayjs(getWeekEndDate(currentdate)).format("YYYY-MM-DD"),
    };
    operationalsStore.fetchDailyActiveStudents(currentDate);
    operationalsStore.fetchWeeklyActiveStudent(weekData);
    operationalsStore.fetchDailyActiveTeacher(currentDate);
    statisticsStore.fetchAverageAttendanceByGpa();
    statisticsStore.fetchPointLeaders({ school_type: "Dental school" });
    operationalsStore.fetchOnlineStudents();
    operationalsStore.projectBudget();
    operationalsStore.studentEmployment();
    operationalsStore.fetchOnlineTeachers();
    operationalsStore.fetchWeeklyActiveTeacher(weekData);
    operationalsStore.fetchImploymentRate();
    operationalsStore.fetchNumberAnnouncement({
      from_date: "2024-09-14",
      to_date: dayjs(new Date()).format("YYYY-MM-DD"),
    });
    // operationalsStore.fetchWeeklyStudentAttendance();
    // operationalsStore.fetchDailyStudentAttendance();
    // operationalsStore.fetchMostHightRankedCourse();
    operationalsStore.fetchContentAvailability({
      from_date: "2025-01-27",
      to_date: dayjs(new Date()).format("YYYY-MM-DD"),
    });
  } else if (routeName.value === "strategic-dashboard") {
    const data = { date: dayjs(currentdate).format("YYYY-MM-DD") };
    const teacherData = {
      from_date: dayjs(getWeekStartDate(currentdate)).format("YYYY-MM-DD"),
      to_date: dayjs(currentdate).format("YYYY-MM-DD"),
    };
    statisticsStore.fetchStudentStatuses();
    statisticsStore.projectBudget();
    statisticsStore.studentEmployment();
    statisticsStore.fetchActiveStudentCount();
    // statisticsStore.fetchActiveStudentCount();
    statisticsStore.fetchStaffPerStudentRadio();
    statisticsStore.fetchTeacherPerStudentRadio();
    // statisticsStore.fetchAvgSpendStudent(data);
    statisticsStore.fetchFacilityUtilization(teacherData);
    statisticsStore.fetchAvgSpendTeacher(teacherData);
    statisticsStore.fetchGpaMetrics();
    statisticsStore.fetchStudentsMetrics();

    statisticsStore.fetchTeachersMetrics();
    // statisticsStore.fetchTeacherPerStudent();
    statisticsStore.fetchTopTenStudents();
    statisticsStore.fetchStudentsByGender();
    statisticsStore.fetchStudentsRetakeRatio();
    statisticsStore.fetchGpaDistrbution();
    statisticsStore.fetchGpaAvarage();
    statisticsStore.fetchGpaAvarageYearly();
    statisticsStore.fetchStudentQuantitybySchool();
    statisticsStore.fetchPassFailRate();
    statisticsStore.fetchPaymentsDebts();
    statisticsStore.fetchFinance();
    statisticsStore.fetchTurnRate();
    statisticsStore.fetchAdmission();
  } else {
    /// add some logic shoshiy
  }
};
</script>

<style scoped lang="scss">
.tab {
  .tag {
    background: rgba(214, 60, 49, 0.5);
  }
}
</style>
<style lang="scss">
.stat-blur {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}

.stat-blur::after {
  content: "The data will be updated at the beginning of the semester.";
  position: absolute;
  text-align: center;
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  font-weight: 600;
  justify-content: center;
  font-size: 16px;
  z-index: 99;
}
.stat-card {
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #c8c7c7;
  cursor: pointer;

  &-active {
    border: 3px solid #787878;
  }
}

.stat-btn {
  border: 1px solid #d0d5dd;
  color: #344054;
  font-size: 9.27px;
  font-weight: 600;
  border-radius: 5.3px;
  height: 27.25px !important;
  padding: 6.62px 6.27px;
}

.miniCard {
  width: 100%;
  height: 183.29px;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #c8c7c7;
  cursor: pointer;

  &-active {
    border: 3px solid #787878;
  }
}

@media (max-width: 531px) {
  .miniCard {
    height: 127.42px;

    .space {
      margin-top: 0px !important;
    }
  }
  .stat-blur::after {
    font-size: 14px;
    padding: 18px;
    font-weight: 700;
  }
}
</style>
