<template>
  <div class="stat-card md:pt-4 flex flex-col">
    <div class="p-2 md:px-8 flex-1">
      <p
        class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-base leading-6"
      >
        Average GPA by school
      </p>
      <div class="flex items-center text-[#C8C7C7] text-[12.57px]">
        <div class="first-letter:uppercase">
          {{ displaySemester }}
        </div>
        <!-- <div>&nbsp;-&nbsp;</div>
        <div class="first-letter:uppercase">
          <span class="lowercase">{{ to_semester }}</span>
        </div> -->
        <div>&nbsp;/&nbsp;</div>
        <div class="first-letter:uppercase">
          <span class="lowercase">
            {{ currentLevelType }}
          </span>
        </div>
      </div>
      <div class="relative">
        <v-chart class="h-[340px]" :option="chartOptions" autoresize />
      </div>
      <!-- <div class="flex flex-wrap items-center justify-center gap-1">
          <div
            v-for="(item, index) of data"
            :key="index"
            class="flex items-center gap-1 text-xs"
          >
            <div
              class="w-[10px] h-[10px] rounded-full"
              :class="[`bg-[${colors[index] || '#9E77ED'}]`]"
            ></div>
            <span>{{ item.title }}</span>
          </div>
        </div> -->
    </div>
    <div>
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { computed, onMounted, ref } from "vue";
import { IAvarageGpa } from "@/models/backend";
import SemestrFilter from "../filters/SemestrFilter.vue";
import { useAcademicStore } from "@/stores";
const emits = defineEmits(["update"]);
const props = defineProps<{
  data?: IAvarageGpa[];
  GPAAvarageBySchoolFilter: {
    from_semester: number | null;
    to_semester: number | null;
    level: number | null;
  };
}>();
const examDatesStore = useAcademicStore();
const screenWidth: any = ref(window.screen);
const currentSemesters = ref();
const currentLevel = ref();
const currentLevelType = computed(() =>
  props.GPAAvarageBySchoolFilter?.level
    ? "Level " + props.GPAAvarageBySchoolFilter?.level
    : "All Level"
);
const displaySemester = computed(() => {
  if (from_semester.value === to_semester.value) {
    return from_semester.value;
  }
  return `${from_semester.value} - ${to_semester.value}`;
});
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
const roundTeoDigit = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;
const colors = [
  "#D3D3D3",
  "#2B1C5F",
  "#6A40C6",
  "#E9D7FF",
  "#44444E",
  "#B99CFF",
  "#D4C2FF",
  "#D6CBEF",
  "#E6E0F5",
  "#F0ECF7",
];
const from_semester = computed(() => {
  const sem = examDatesStore.semestrs.find(
    (item) => item.row_number == props.GPAAvarageBySchoolFilter?.from_semester
  );
  return `${sem?.name} ${sem?.year}`;
});
const to_semester = computed(() => {
  const sem = examDatesStore.semestrs.find(
    (item) => item.row_number == props.GPAAvarageBySchoolFilter?.to_semester
  );
  return `${sem?.name} ${sem?.year}`;
});
const chartOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: "{b} - {c}",
  },
  xAxis: {
    data: props.data?.map((item) => item.title),
    type: "category",
    axisLabel: {
      interval: 0,
      rotate: 0,
      fontSize: 10,
      width: 130,
      margin: 10,
      formatter: function (value: any) {
        if (window.innerWidth < 768) {
          return value.length > 10 ? value.substring(0, 10) + "..." : value;
        }
        return value;
      },
      overflow: "truncate",
    },
  },
  grid: {
    left: "5%",
    bottom: "0%",
    right: "5%",
    top: "10%",
    containLabel: true,
  },
  yAxis: {},
  series: [
    {
      data: props?.data?.map((item, index) => ({
        value: item.average_gpa,
        itemStyle: {
          color: colors[index],
          shadowColor: "#91cc75",
          borderType: "dashed",
          opacity: 1,
          borderRadius: 2,
        },
      })),
      barWidth: "22px",
      label: {
        show: true,
        position: "top",
      },
      type: "bar",
    },
  ],
});
const update = () => {
  emits("update", {
    level: currentLevel.value,
    ...currentSemesters.value,
  });
};
const chartRef = ref(null);

onMounted(() => {});
const updateSemester = (data: any) => {
  console.log(currentLevel.value);

  currentSemesters.value = {
    level: currentLevel.value,
    from_semester: parseInt(data?.from_semester),
    to_semester: parseInt(data?.to_semester),
  };
  update();
};
</script>

<style scoped></style>
