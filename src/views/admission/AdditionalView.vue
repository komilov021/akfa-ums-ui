<template>
  <el-row :gutter="20">
    <el-col :sm="24" :md="12" :lg="6" :xl="8" class="my-4">
      <ExamDatePie v-if="examDate" :examDate="examDate" />
    </el-col>
    <el-col :sm="24" :md="12" :lg="18" :xl="16" class="my-4">
      <ProgressLine
        v-if="applicantsPerDay"
        :applicantsPerDay="applicantsPerDay"
      />
    </el-col>
    <el-col :sm="24" :md="12" :lg="8" :xl="8">
      <ProgressTable
        v-if="applicantsPerDay"
        :applicantsPerDay="applicantsPerDay"
      />
    </el-col>
    <el-col :sm="24" :md="12" :lg="16" :xl="16">
      <DepartmentTable
        v-if="programsAvarageFee"
        :programsAvarageFee="programsAvarageFee"
      />
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { onMounted, computed, ref, watch } from "vue";
import ProgressTable from "./components/ProgressTable.vue";
import ProgressLine from "./components/ProgressLine.vue";
import { useStatisticsStore } from "@/stores";
import DepartmentTable from "./components/DepartmentTable.vue";
import ExamDatePie from "./components/ExamDatePie.vue";
const loading = ref(false);
const statisticsStore = useStatisticsStore();
const examDate = computed(() => statisticsStore.examDate);
const applicantsPerDay = computed(() => statisticsStore.applicantsCountByDay);
const programsAvarageFee = computed(() => statisticsStore.programsAvarageFee);
onMounted(() => {
  statisticsStore.fetchAdditionalExamDate();
  statisticsStore.fetchApplicantsPerDate();
  statisticsStore.fetchProgramAvgFee();
});
</script>

<style lang="scss" scoped></style>
