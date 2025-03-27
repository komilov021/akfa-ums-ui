<template>
  <div class="bg-[#fff] rounded-xl h-[390px] border border-[#c8c7c7]">
    <div class="p-2 md:px-8 md:py-4">
      <p
        class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-base leading-6"
      >
        Average attended students by school
      </p>
      <div class="flex items-center text-[#C8C7C7] text-[12.57px]">
        <div class="first-letter:uppercase">
          <span class="lowercase">{{ dateRange }}</span> /
          <span class="lowercase">
            {{ props.level ? "level " + props.level : "all level" }}
          </span>
        </div>
      </div>
      <div class="relative">
        <v-chart class="h-72" :option="chartOptions" autoresize />
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
    <!-- <div class="h-[1px] mt-2 bg-[#EAECF0]" />
    <div class="flex justify-end px-3 py-3">
      <el-dropdown>
        <el-button class="stat-btn">Choose level</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              @click="$emit('update', level.value)"
              v-for="(level, i) in levels"
              :key="i"
              ><span class="md:text-[14px] text-[12px] leading-0">{{
                level.label
              }}</span></el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { graphic } from "echarts";
import { computed, ref } from "vue";
import { IAvarageAttendanceBySchool } from "@/models/backend";
import { dayjs } from "element-plus";

const props = defineProps<{
  data?: IAvarageAttendanceBySchool[];
  level?: any;
}>();

const startDate = "2025-01-27";
const currentDate = dayjs().format("YYYY-MM-DD");
const dateRange = `${startDate} - ${currentDate}`;
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
const colors = [
  "#6941C6",
  "#9E77ED",
  "#EAECF0",
  "#8A6AD5",
  "#9A75F2",
  "#B99CFF",
  "#D4C2FF",
  "#D6CBEF",
  "#E6E0F5",
  "#F0ECF7",
];
const totalSum = computed(() =>
  props?.data?.reduce(
    (acc: any, curr: any) => (acc = acc + curr.all_student_count),
    0
  )
);
const percentages = computed(() =>
  props?.data?.map((item: any) =>
    ((item.all_student_count / totalSum.value) * 100).toFixed(2)
  )
);
const Tooltip = (params: any) => {
  console.log(params);
  return props?.data?.[params.dataIndex].programs
    ?.map(
      (item: any) =>
        // `<span class="font-semibold leading-none">${item.program} - ${ ((item.all_student_count / totalSum.value) * 100).toFixed(2)}% </span><br>`
        `<span class="font-base text-[10px] md:text-[14px] leading-none">${
          item.title
        } - ${item.program_average.toFixed(2)}% </span><br>`
    )
    .join("");
};
// const chartOptions = ref({
//   tooltip: {
//     trigger: "item",
//     formatter: (params: any) => {
//       //       return `<span class="font-base text-[10px] md:text-[14px] leading-none">${
//       //         params.name
//       //       }
//       //  - ${
//       //    params.value
//       //  }%</span><br> <span class="font-base text-[10px] md:text-[14px] leading-none">${Tooltip(
//       //         params
//       //       )}</span>`;
//       return `<span class="font-base text-[10px] md:text-[14px] leading-none">${params.name}
//  - ${params.value}%</span><br> <span class="font-base text-[10px] md:text-[14px] leading-none"></span>`;
//     },
//   },
//   // ${Tooltip(
//   //       params
//   //     )}
//   xAxis: {
//     data: props.data?.map((item) => item.title),
//     type: "category",
//     axisLabel: {
//       interval: 0,
//       rotate: 0,
//       fontSize: 9,
//       width: 100,
//       overflow: "truncate",
//       formatter: function (value: any) {
//         if (window.innerWidth < 768) {
//           return value.length > 10 ? value.substring(0, 10) + "..." : value;
//         }
//         return value;
//       },
//     },
//   },
//   grid: {
//     left: "10%",
//     bottom: "10%",
//     right: "5%",
//     top: "10%",
//   },
//   yAxis: {
//     type: "value",
//     axisLabel: {
//       formatter: "{value}%",
//     },
//   },
//   series: [
//     {
//       data: props.data?.map((item: any, index) => ({
//         value: item.attendance_percentage,
//       })),
//       barWidth: "22px",
//       areaStyle: {
//         color: new graphic.LinearGradient(0, 0, 0, 1, [
//           {
//             offset: 0,
//             color: "#7F56D9",
//           },
//           {
//             offset: 1,
//             color: "rgba(105, 65, 198, 0.30)",
//           },
//         ]),
//       },
//       itemStyle: {
//         color: "#7F56D9",
//         opacity: 1,
//       },
//       label: {
//         show: true,
//         position: "top",
//         size: "10px",
//         formatter: (params: any) => `${params.value}%`, // Add percentage
//       },
//       type: "line",
//     },
//   ],
// });
const chartOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: "{b} - {c}%",
  },
  xAxis: {
    data: props.data?.map((item) => item.title),
    type: "category",
    axisLabel: {
      interval: 0,
      rotate: 0,
      fontSize: 8,
      width: 90,
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
    left: "0%",
    bottom: "0%",
    right: "0%",
    top: "10%",
    containLabel: true,
  },
  yAxis: {},
  series: [
    {
      data: props?.data?.map((item: any, index: any) => ({
        value: item.attendance_percentage,
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
        formatter: "{c}%",
      },
      type: "bar",
    },
  ],
});
</script>

<style scoped>
@media (max-width: 768px) {
  .chart-label {
    font-size: 7px !important;
  }
}

@media (min-width: 769px) {
  .chart-label {
    font-size: 10px !important;
  }
}
</style>
