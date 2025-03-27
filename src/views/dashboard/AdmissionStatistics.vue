<template>
  <div
    class="grid md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8 2xl:gap-x-14 2xl:gap-y-8 max-w-screen-2xl mx-auto px-8 mt-4"
    v-if="application"
  >
    <ApplicationsNumberChart
      :application="application?.application_by_number"
    />
    <AcceptedApplicationsSchool
      :application="application?.accepted_applications_by_school"
    />
    <AcceptedApplicationsAge :application="application.applications_by_age" />
    <ForeignToLocal :application="application.foreign_to_local_applicants" />
    <AcceptedApplicationsByRegion
      :application="application.accepted_applications_by_regions"
    />
    <IeltsAndInternal :application="application.ielts_and_internal_exam" />
    <ExamDatePie :examDate="examDate" />
    <ProgressLine :applicantsPerDay="applicantsPerDay" />
    <ProgressTable
      v-if="applicantsPerDay"
      :applicantsPerDay="applicantsPerDay"
    />
  </div>
  <div class="max-w-screen-2xl mx-auto px-8 mt-8 mb-32">
    <DepartmentTable :programsAvarageFee="programsAvarageFee" />
  </div>
</template>

<script setup lang="ts">
import { useStatisticsStore } from "@/stores";
import {
  ApplicationsNumberChart,
  AcceptedApplicationsSchool,
  AcceptedApplicationsAge,
  ForeignToLocal,
  AcceptedApplicationsByRegion,
  IeltsAndInternal,
} from "./components";
import { computed, onMounted } from "vue";
import ExamDatePie from "../admission/components/ExamDatePie.vue";
import ProgressLine from "../admission/components/ProgressLine.vue";
import ProgressTable from "../admission/components/ProgressTable.vue";
import DepartmentTable from "../admission/components/DepartmentTable.vue";
const statisticsStore = useStatisticsStore();
const examDate = computed(() => statisticsStore.examDate);
const application = computed(() => statisticsStore.application);
const applicantsPerDay = computed(() => statisticsStore.applicantsCountByDay);
const programsAvarageFee = computed(() => statisticsStore.programsAvarageFee);
onMounted(() => {
  if (application.value == null) {
    statisticsStore.fetchApplicationAnalytic();
  }
  statisticsStore.fetchAdditionalExamDate();
  statisticsStore.fetchApplicantsPerDate();
  statisticsStore.fetchProgramAvgFee();
});
</script>

<style scoped></style>
