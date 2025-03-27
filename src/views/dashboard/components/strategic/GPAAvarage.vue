<template>
  <div class="stat-card flex flex-col">
    <div class="p-2 md:px-4 md:py-4 flex-1 w-full">
      <p class="font-semibold text-sm sm:text-base leading-6">
        Average GPA by semester
      </p>
      <div class="flex items-center text-[#C8C7C7] text-[12.57px]">
        <div class="first-letter:uppercase">
          <span class="lowercase">{{ from_semester }}</span>
        </div>
        <div>&nbsp;-&nbsp;</div>
        <div class="first-letter:uppercase">
          <span class="lowercase">{{ to_semester }}</span>
        </div>
        <div>&nbsp;/&nbsp;</div>
        <div class="first-letter:uppercase">
          <span class="lowercase">{{ currentLevelType }}</span>
        </div>
      </div>
      <v-chart class="h-72" :option="chartOptions" autoresize />
    </div>
    <div class="h-[1px] mt-2 bg-[#EAECF0]" />
    <div class="flex justify-end px-3 py-3 gap-2">
      <SemestrFilter @on-submit="updateSemester" />
      <el-dropdown>
        <el-button class="stat-btn">Choose level</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              @click="(currentLevel = level.value), update()"
              v-for="(level, i) in levels"
              :key="i"
              ><span class="md:text-[14px] text-[12px] leading-0">{{
                level.label
              }}</span></el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- <div class="flex items-center">
        <el-checkbox v-model="active" label="Active students"  @change="update" size="small" />
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { IAvarageGpa } from "@/models/backend";
import { graphic } from "echarts";
import SemestrFilter from "../filters/SemestrFilter.vue";
import { useAcademicStore, useStatisticsStore } from "@/stores";
import { semesterSorting } from "@/utils/common";
const emits = defineEmits(["update"]);
const props = defineProps<{
  data?: IAvarageGpa[];
  GPAAvarageYearlyBySchoolFilter: any;
  is_active: any;
}>();

const active = ref(props.is_active);
const currentLevelType = computed(() =>
  props.GPAAvarageYearlyBySchoolFilter.level
    ? "Level " + props.GPAAvarageYearlyBySchoolFilter.level
    : "All level"
);
const levels = [
  {
    value: null,
    label: "All level",
  },
  {
    value: 1,
    label: "Level 1",
  },
  {
    value: 2,
    label: "Level 2",
  },
  {
    value: 3,
    label: "Level 3",
  },
  {
    value: 4,
    label: "Level 4",
  },
  {
    value: 5,
    label: "Level 5",
  },
  {
    value: 6,
    label: "Level 6",
  },
];
const statisticsStore = useStatisticsStore();
const getSemesterList = ref(props.data);
const examDatesStore = useAcademicStore();

const currentSemesters = ref();
const currentLevel = ref();
const semestrs = reactive({
  from_semester: statisticsStore.getFilters.semestrs?.from,
  to_semester: statisticsStore.getFilters.semestrs?.to,
});

const roundTeoDigit = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;
const from_semester = computed(() => {
  const sem = examDatesStore.semestrs.find(
    (item) =>
      item.row_number == props.GPAAvarageYearlyBySchoolFilter.from_semester
  );
  return `${sem?.name} ${sem?.year}`;
});
const to_semester = computed(() => {
  const sem = examDatesStore.semestrs.find(
    (item) =>
      item.row_number == props.GPAAvarageYearlyBySchoolFilter?.to_semester
  );
  return `${sem?.name} ${sem?.year}`;
});
const chartOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: "{b} - {c}",
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: getSemesterList.value
      ?.sort(semesterSorting)
      .map((item: any) => item.semester)
      .slice(0, -1),
    axisLabel: {
      interval: 0,
      rotate: 0,
      fontSize: 6,
      width: 80,
      overflow: "truncate",
    },
  },
  grid: {
    left: "4.5%",
    bottom: "5%",
    right: "5.5%",
    top: "10%",
  },
  yAxis: {},
  series: [
    {
      data: props.data?.map((item) => roundTeoDigit(item.average)),
      type: "line",
      itemStyle: {
        color: "#7F56D9",
        opacity: 1,
      },
      label: {
        show: true,
        position: "top",
        size: "10px",
      },
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "#7F56D9",
          },
          {
            offset: 1,
            color: "rgba(105, 65, 198, 0.30)",
          },
        ]),
      },
    },
  ],
});
const update = () => {
  emits("update", {
    level: currentLevel.value,
    ...currentSemesters.value,
    is_active_student: active.value,
  });
};
const onChange = (level: any) => {
  level == "All" ? (currentLevel.value = null) : (currentLevel.value = level),
    update();
};
const updateSemester = (data: any) => {
  currentSemesters.value = {
    level: currentLevel.value,
    from_semester: parseInt(data?.from_semester),
    to_semester: parseInt(data?.to_semester),
  };
  update();
};
</script>

<style scoped></style>
