<template>
  <div class="max-w-screen-2xl mx-auto mb-[90px] md:mb-0">
    <GeneralInformation
      :teachersMetrics="teachersMetrics"
      :gpaMetrics="gpaMetrics"
      :staffPerStudentRadio="staffPerStudentRadio"
      :teacherPerStudentRadio="teacherPerStudentRadio"
      :studentsMetrics="studentsMetrics"
      :teacherPerStudent="teacherPerStudent?.teacher_per_student"
      @update="updateStudentsPerTeacher"
      @updateTeacher="updateTeachersMetrics"
      @updateGpa="updateGpaMetrics"
      @updateStudent="updateStudentsMetrics"
      @updateStudentPerTeacher="updateStudentPerTeacher"
      @updateStudentPerStaffRadio="updateStaffPerStudentRadio"
      :isActive="activeStudentMet.is_active_student"
    />
    <div
      class="grid xl:grid-cols-2 grid-cols-1 gap-4 sm:gap-8 content-end md:p-0 px-5 mt-5 sm"
    >
      <GPAAvarageBySchool
        v-if="gpaAvarage"
        :data="gpaAvarage"
        :GPAAvarageBySchoolFilter="GPAAvarageBySchoolFilter"
        @update="gpaUpdate"
      />
      <div v-else>
        <el-skeleton :rows="6" animated />
      </div>
      <GPAAvarage
        v-if="gpaAvarageYearly"
        :data="gpaAvarageYearly"
        :is_active="GPAAvarageYearlyBySchoolFilter.is_active_student"
        :GPAAvarageYearlyBySchoolFilter="GPAAvarageYearlyBySchoolFilter"
        @update="gpaYearlyUpdate"
      />
      <div v-else>
        <el-skeleton :rows="6" animated />
      </div>
      <GPADistribution
        v-if="gpaDistribution"
        :data="gpaDistribution"
        :activeStudents="studentsMetrics"
        @update="gpaDistributionUpdate"
        :gpaDistributionFilter="gpaDistributionFilter"
      />
      <div v-else>
        <el-skeleton :rows="10" animated />
      </div>
      <TopTenStudents
        v-if="topStudentsByGpa"
        :data="topStudentsByGpa"
        @update="topTenStudentUpdate"
        :topTenStudentFilter="topTenStudentFilter"
      />
      <div v-else>
        <el-skeleton :rows="6" animated />
      </div>
      <QuantityStudentsBySchool
        v-if="studentQuantityBySchool"
        :level="quantityLevel"
        :data="studentQuantityBySchool"
        @update="studentQuantityUpdate"
      />
      <div v-else>
        <el-skeleton :rows="6" animated />
      </div>
      <StudentsByGender
        v-if="studentsByGender"
        :data="studentsByGender"
        @update="genderUpdate"
        :level="currentStudentGenderLevel"
      />
      <ExamFailRate
        v-if="passFailRate"
        :data="passFailRate"
        @update="ExamFailRateUpdate"
      />
      <div v-else>
        <el-skeleton :rows="6" animated />
      </div>
      <div>
        <div class="stat-card">
          <StudentStatutesPie
            v-if="studentStatuses"
            :data="studentStatuses"
            @update="updateStudentStatus"
          />
          <div v-else class="p-5">
            <el-skeleton :rows="16" animated />
          </div>
        </div>
      </div>
      <StudentRatekaRatio
        v-if="studentRetakeRatio"
        :data="studentRetakeRatio"
        :studentRatekRadio="studentRatekRadio"
        @update="retakeRatioUpdate"
      />
      <div v-else>
        <el-skeleton :rows="10" animated />
      </div>
      <TutionFeeStatuses
        v-if="financeMetrics"
        @update="paymentUpdate"
        :gpaPaymentFilter="gpaPaymentFilter"
        :financeMetrics="financeMetrics"
      />
      <div v-else>
        <el-skeleton :rows="6" animated />
      </div>
      <TutionFeeCost
        v-if="admission"
        :filter="admissionFilter"
        :admission="admission"
        @update="fetchAdmission"
      />
      <div v-else>
        <el-skeleton :rows="6" animated />
      </div>
    </div>

    <GeneralStatistics />
    <!-- <div
      class="grid xl:grid-cols-2 grid-cols-1 gap-4 sm:gap-8 content-end md:p-0 px-5 mt-5 sm"
    >
      <StudentTurnRate v-if="turnRate" :data="turnRate" />
      <div v-else>
        <el-skeleton :rows="3" animated />
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useSchoolStore, useStatisticsStore } from "@/stores";
import { computed, onMounted, ref } from "vue";
import { useGuideStore } from "../../stores/guide";
import {
  GeneralStatistics,
  GeneralInformation,
  TopTenStudents,
  StudentsByGender,
  StudentRatekaRatio,
  GPADistribution,
  GPAAvarage,
  QuantityStudentsBySchool,
  ExamFailRate,
  GPAAvarageBySchool,
  StudentTurnRate,
  EmploymentStatus,
  StudentStatutesPie,
  ProjectsBudget,
  TutionFeeStatuses,
  TutionFeeCost,
} from "./components";

const statisticsStore = useStatisticsStore();
const GuideStore = useGuideStore();
// const general = computed(() => statisticsStore.general);
// const studentsBySchool = computed(() => statisticsStore.students_by_school);
const teachersMetrics = computed(() => statisticsStore.teacherMetrics);
const gpaMetrics = computed(() => statisticsStore.gpaMetrics);
const studentsMetrics = computed(() => statisticsStore.studentMetrics);
const teacherPerStudent = computed(
  () => statisticsStore.teacherPerStudentRadio
);
const staffPerStudentRadio = computed(
  () => statisticsStore.staffPerStudentRadio
);
const financeMetrics = computed(() => statisticsStore.financeMetrics);
const admission = computed(() => statisticsStore.admission);
const currentStudentGenderLevel = ref();
const teacherPerStudentRadio = computed(
  () => statisticsStore.teacherPerStudentRadio
);
let studentStatuses = computed(() => statisticsStore.studentStatuses);
const topStudentsByGpa = computed(() => statisticsStore.topStudentsByGpa);
const studentsByGender = computed(() => statisticsStore.studentsByGender);
const studentRetakeRatio = computed(() => statisticsStore.studentRetakeRatio);
const gpaDistribution = computed(() => statisticsStore.gpaDistribution);
const passFailRate = computed(() => statisticsStore.passFailRate);
const turnRate = computed(() => statisticsStore.turnRate);
const schools = computed(() => GuideStore.tuitions);
const quantityLevel = ref();
const avarageAttendanceBySchool = computed(
  () => statisticsStore.avarageAttendanceBySchool
);
const studentQuantityBySchool = computed(() =>
  statisticsStore.studentQuantityBySchool?.filter(
    (x: any) => x.student_count > 1
  )
);

const gpaAvarage = computed(() =>
  statisticsStore.gpaAvarage?.filter((x: any) => x.average_gpa)
);
const program = ref();
// const studentRadioRatek = ref();
const studentRatekRadio = ref({
  from_semester: 1,
  level: undefined as any,
  school_id: undefined as any,
  to_semester: 13,
});
const gpaAvarageYearly = computed(() => statisticsStore.gpaAvarageYearly);
const loading = computed(() => statisticsStore.loading);
const GPAAvarageBySchoolFilter = ref({
  level: undefined as any,
  to_semester: 9,
  from_semester: 9,
});
const ExamFailRateFilter = ref({
  level: undefined,
  to_semester: undefined,
  from_semester: undefined,
});
const activeStudentMet = ref({
  school_id: undefined,
  is_active_student: true,
});
const gpaDistributionFilter = ref({
  level: undefined,
  to_semester: 9,
  from_semester: 9,
  school_id: null as any,
});
const gpaPaymentFilter = ref({
  level: undefined,
  custom_rate: null as any,
  school_id: null as any,
});
const GPAAvarageYearlyBySchoolFilter = ref({
  level: undefined,
  to_semester: 9,
  from_semester: 1,
  is_active_student: true,
});
const topTenStudentFilter = ref({
  school_id: undefined,
  to_semester: 9,
  from_semester: 9,
});
const admissionFilter = ref({
  school_id: undefined,
  level: undefined,
  // custom_rate: null as any,
  // to_semester: undefined,
  // from_semester: undefined,
});
function calculateAverageFeeForActive(programs: any) {
  // Variable to store the sum of fees and count of active programs
  let totalFee = 0;
  let activeCount = 0;

  // Iterate through each program
  programs.forEach((program: any) => {
    // Check if the program is active
    if (program.is_active) {
      totalFee += program.fee_foreign_student;
      activeCount++;
    }
  });
  // Calculate the average fee for active programs
  const averageFee = totalFee / activeCount;

  return averageFee;
}

const topTenStudentUpdate = (params: any) => {
  if (params.school_id != undefined) {
    topTenStudentFilter.value.school_id = params.school_id as any;
  }
  if (params.to_semester && params.from_semester) {
    topTenStudentFilter.value.from_semester = params.from_semester;
    topTenStudentFilter.value.to_semester = params.to_semester;
  }
  statisticsStore.fetchTopTenStudents(topTenStudentFilter.value);
};
const gpaUpdate = (params: any) => {
  if (params.level !== undefined) {
    GPAAvarageBySchoolFilter.value.level = params.level as any;
  }
  if (params.to_semester && params.from_semester) {
    GPAAvarageBySchoolFilter.value.from_semester = params.from_semester;
    GPAAvarageBySchoolFilter.value.to_semester = params.to_semester;
  }
  statisticsStore.fetchGpaAvarage(GPAAvarageBySchoolFilter.value);
};
const gpaYearlyUpdate = (params: any) => {
  if (params.level !== undefined) {
    GPAAvarageYearlyBySchoolFilter.value.level = params.level as any;
  }
  GPAAvarageYearlyBySchoolFilter.value.is_active_student =
    params.is_active_student;

  if (params.to_semester && params.from_semester) {
    GPAAvarageYearlyBySchoolFilter.value.from_semester = params.from_semester;
    GPAAvarageYearlyBySchoolFilter.value.to_semester = params.to_semester;
  }
  statisticsStore.fetchGpaAvarageYearly(GPAAvarageYearlyBySchoolFilter.value);
};
const genderUpdate = (level: any) => {
  currentStudentGenderLevel.value = level.label;
  statisticsStore.fetchStudentsByGender(level?.value);
};
const retakeRatioUpdate = (data: any) => {
  if (data.level !== undefined) {
    studentRatekRadio.value.level = data.level;
  }
  if (data.school_id !== undefined) {
    studentRatekRadio.value.school_id = data.school_id;
  }

  if (data.to_semester && data.from_semester) {
    studentRatekRadio.value.from_semester = data.from_semester;
    studentRatekRadio.value.to_semester = data.to_semester;
  }
  statisticsStore.fetchStudentsRetakeRatio(studentRatekRadio.value);
};
const gpaDistributionUpdate = (params: any) => {
  if (params.school_id != undefined) {
    gpaDistributionFilter.value.school_id = params.school_id as any;
  }
  if (params.to_semester && params.from_semester) {
    gpaDistributionFilter.value.from_semester = params.from_semester;
    gpaDistributionFilter.value.to_semester = params.to_semester;
  }
  statisticsStore.fetchGpaDistrbution(gpaDistributionFilter.value);
};

const studentQuantityUpdate = (level: any) => {
  quantityLevel.value = level.label;
  statisticsStore.fetchStudentQuantitybySchool(level.value);
};
const ExamFailRateUpdate = (params: any) => {
  if (params.level !== undefined) {
    ExamFailRateFilter.value.level = params.level;
  }
  if (params.to_semester && params.from_semester) {
    ExamFailRateFilter.value.from_semester = params.from_semester;
    ExamFailRateFilter.value.to_semester = params.to_semester;
  }
  statisticsStore.fetchPassFailRate(ExamFailRateFilter.value);
};
const AvarageAttendanceStudentsUpdate = (level: number) => {
  statisticsStore.fetchAverageAttendanceByGpa(level);
};
const paymentUpdate = (params: any) => {
  if (params.range !== undefined || params.range.length !== 0) {
    gpaPaymentFilter.value.custom_rate = parseInt(params.range);
  }
  if (params.level !== undefined) {
    gpaPaymentFilter.value.level = params.level;
  }
  if (params.school_id !== undefined) {
    gpaPaymentFilter.value.school_id = params.school_id;
  }
  statisticsStore.fetchFinance(gpaPaymentFilter.value);
};
const updateStudentsPerTeacher = (school_id: string) => {
  statisticsStore.fetchTeacherPerStudentRadio({ school_id });
};
const updateStudentsMetrics = (school_id: any) => {
  statisticsStore.fetchStudentsMetrics({ school_id });
};
const updateStudentPerTeacher = (school_id: any) => {
  statisticsStore.fetchTeacherPerStudentRadio({ school_id });
};
const updateStaffPerStudentRadio = (school_id: any) => {
  statisticsStore.fetchStaffPerStudentRadio({ school_id });
};
const updateTeachersMetrics = (school_id: string) => {
  statisticsStore.fetchTeachersMetrics(school_id);
};
const updateGpaMetrics = (params: any) => {
  // activeStudentMet.value.is_active_student = params.is_active_student;
  activeStudentMet.value.school_id = params;
  statisticsStore.fetchGpaMetrics(activeStudentMet.value);
};

const updateStudentStatus = (school_id: string) => {
  statisticsStore.fetchStudentStatuses({ school_id });
};
const fetchAdmission = (params: any) => {
  // if (params.range !== undefined) {
  //   admissionFilter.value.custom_rate = parseInt(params.range);
  // }
  admissionFilter.value.level = params.level;
  admissionFilter.value.school_id = params.school_id;

  // if (params.to_semester && params.from_semester) {
  //   admissionFilter.value.from_semester = params.from_semester;
  //   admissionFilter.value.to_semester = params.to_semester;
  // }
  statisticsStore.fetchAdmission(admissionFilter.value);
};
onMounted(async () => {
  if (schools.value.length === 0) await GuideStore.fetchTuitions();
});

// const mockData = [
//   {
//     acceptance_year: 2024,
//     percent: "1%",
//     study: 431,
//     total: 2213,
//     withdraw: 1,
//   },
//   {
//     acceptance_year: 2023,
//     percent: "27%",
//     study: 775,
//     total: 1054,
//     withdraw: 1,
//   },
//   {
//     acceptance_year: 2022,
//     percent: "43%",
//     study: 816,
//     total: 1426,
//     withdraw: 1,
//   },
//   {
//     acceptance_year: 2021,
//     percent: "64%",
//     study: 273,
//     total: 745,
//     withdraw: 1,
//   },
//   {
//     acceptance_year: 2020,
//     percent: "51%",
//     study: 76,
//     total: 154,
//     withdraw: 1,
//   },
//   {
//     acceptance_year: 2019,
//     percent: "30%",
//     study: 111,
//     total: 158,
//     withdraw: 1,
//   },
// ];
</script>

<style lang="scss" scoped>
.card {
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
</style>
