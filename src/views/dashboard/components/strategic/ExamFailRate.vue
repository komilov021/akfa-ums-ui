<template>
  <div class="stat-card md:pt-4 flex-col hidden">
    <div class="p-2 md:px-8">
      <p
        class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-base leading-6"
      >
        Exams fail rate
      </p>
      <div class="relative">
        <v-chart class="h-72" :option="chartOptions" autoresize />
      </div>
      <div
        class="flex items-center justify-center md:text-sm 2xl:text-base gap-4 font-medium"
      >
        <div class="flex items-center space-x-2">
          <div class="w-5 h-5 rounded-full bg-primary-600"></div>
          <span class="text-xs 2xl:text-base">Pass</span>
        </div>
        <div class="flex items-center space-x-2 font-medium">
          <div class="w-5 h-5 rounded-full bg-[#EAECF0]"></div>
          <span class="text-xs 2xl:text-base">Fail</span>
        </div>
      </div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { ref } from "vue";
import { IPassFailRate } from "@/models/backend";
import { useI18n } from "vue-i18n";
import SemestrFilter from "../filters/SemestrFilter.vue";
const emits = defineEmits(["update"]);
const { n } = useI18n();

const levels = [
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

const props = defineProps<{
  data?: IPassFailRate[];
}>();
const currentSemesters = ref();
const currentLevel = ref();
const tooltip = (dataIndex: number) => {
  return props?.data?.[dataIndex].programs
    ?.map(
      (item: any) =>
        `<span class="font-base text-[10px]  md:text-[13px] whitespace-normal leading-none">${item.program} - Fail ${item.fail}  Pass ${item.pass}</span><br>`
    )
    .join("");
};
const chartOptions = ref({
  // tooltip: {
  //   trigger: "item",
  //   formatter: (params: any) => n(params.value || 0),
  // },
  tooltip: {
    trigger: "item",
    position: "center",
    formatter: (params: any) => {
      return `<span class="font-base text-[10px]  md:text-[13px] whitespace-normal leading-none">${
        params.name
      } - ${params.value}</span><br> ${tooltip(params.dataIndex)}`;
    },
  },
  xAxis: {
    data: props.data?.map((item) => item.title),
    type: "category",
    axisLabel: {
      interval: 0,
      rotate: 0,
      fontSize: "9px",
      width: 65,
      overflow: "truncate",
    },
  },
  grid: {
    position: "center",
    left: "14.9%",
    bottom: "10%",
    right: "5%",
    top: "10%",
  },
  yAxis: {},
  series: [
    {
      type: "bar",
      name: "bar",
      stack: "one",
      label: {
        show: true,
        position: "right",
      },
      data: props.data?.map((item) =>
        item.programs.reduce((acc, curr) => (acc = acc + curr.pass), 0)
      ),
      barWidth: "17px",
      itemStyle: {
        color: "#6941C6",
        shadowColor: "#91cc75",
        borderType: "dashed",
        opacity: 1,
      },
    },
    {
      type: "bar",
      name: "bar2",
      stack: "one",
      data: props.data?.map((item) =>
        item.programs.reduce((acc, curr) => (acc = acc + curr.fail), 0)
      ),
      label: {
        show: true,
        position: "left",
      },
      barWidth: "10%",
      itemStyle: {
        color: "#EAECF0",
        shadowColor: "#91cc75",
        borderType: "dashed",
        opacity: 1,
      },
    },
  ],
});
const update = () => {
  emits("update", {
    level: currentLevel.value,
    ...currentSemesters.value,
  });
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

<style></style>
