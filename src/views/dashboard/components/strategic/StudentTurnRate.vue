<template>
  <div class="stat-card p-2 md:px-8 md:py-4 flex flex-col">
    <div class="flex flex-col">
      <p
        class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-base md:text-start leading-none"
      >
        Student turn rate by entrance year (proxy for satisfaction)
      </p>
      <div class="flex items-center text-[#C8C7C7] text-[12.57px]">
        <div class="first-letter:uppercase">
          <span class="lowercase">In all time</span>
        </div>
      </div>
    </div>
    <div
      class="flex items-center justify-between sm:ml-[4%] relative top-16 mx-auto w-[90%]"
    >
      <p class="text-[#475467] text-xs">Years</p>
      <p class="text-[#475467] text-xs">Turn rate %</p>
    </div>
    <v-chart class="h-[320px]" :option="chartOptions" autoresize />
    <!-- <div
      class="flex items-center flex-wrap gap-4 mt-3 sm:mt-5 justify-center md:px-2 font-semibold"
    >
      <div class="flex items-center space-x-2">
        <div class="w-4 h-4 rounded-full bg-[#9E77ED]"></div>
        <span class="text-xs 2xl:text-base"> Accepted</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-4 h-4 rounded-full bg-[#6941C6]"></div>
        <span class="text-xs 2xl:text-base">Studying now</span>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { computed, onMounted, ref } from "vue";
import { IStrategicMetrics } from "@/models/backend";
import { useAcademicStore, useStatisticsStore } from "@/stores";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  data?: {
    acceptance_year: number;
    percent: string;
    study: number;
    total: number;
    withdraw: number;
  }[];
}>();
const { n } = useI18n();

const colors = ["#6941C6", "#9E77ED", "#E9D7FE", "#42307D", "#6941C6"];

const labelOption = {
  show: true,
  align: "left",
  verticalAlign: "middle",
  position: "insideLeft",
  distance: 15,
  formatter: "{name|{a}}",
  fontSize: 16,
  rich: {
    name: {},
  },
};

const chartOptions = ref({
  tooltip: {
    trigger: "item",
    position: "bottom",
    formatter: (params: any) =>
      `<div class="font-base text-[10px] md:text-[14px] leading-none">${
        params.data?.name
      } - ${n(Math.abs(Number(params.data?.value || 0)))}</div>`,
  },
  xAxis: [
    {
      type: "value",
      position: "bottom",
      axisLabel: {
        // formatter: (value: number) => Math.abs(value),
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
        },
      },
    },
  ],
  grid: {
    top: 80,
    bottom: 0,
    left: 50, // Adjust grid for the left Y-axis
    right: 50, // Adjust grid for the right Y-axis
  },
  legend: {
    orient: "horizontal",
    right: "0%",
    itemGap: 10,
    textStyle: {
      fontSize: 10,
      color: "#333",
    },
  },
  yAxis: [
    {
      type: "category",
      data: props.data?.map((item) => item.acceptance_year),
      axisLabel: {
        interval: 0,
        fontSize: 10,
        color: "#000",
        margin: 10,
      },
      axisLine: {
        // show: true,
        lineStyle: {
          type: "dashed",
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
        },
      },
    },
    {
      type: "category", // Right Y-axis for additional data
      data: props.data?.map((item) => {
        const studyPercent = (item.study / item.total) * 100;
        const total = Math.round(100 - studyPercent);
        return `${total}%`; // Ensure total adds to 100%
      }),
      position: "right",
      axisLabel: {
        interval: 0,
        fontSize: 10,
        color: "#000",
        margin: 10,
      },
      axisLine: {
        lineStyle: {
          type: "dashed",
        },
      },
      splitLine: {
        show: false, // You can toggle split lines for the right Y-axis
      },
    },
  ],
  series: [
    {
      name: "Accepted",
      type: "bar",
      stack: "total",
      data: props.data?.map((item) => ({
        value: -item.total,
        name: item.acceptance_year,
      })),
      itemStyle: {
        color: colors[1],

        // borderRadius: 5,
        opacity: 1,
      },
      barWidth: "25px",
      label: {
        show: true,
        position: "right",
        offset: [-50, 2],
        formatter: (params: any) => n(Math.abs(params.value)),
        textStyle: {
          fontSize: 10,
          color: "#000",
        },
      },
    },
    {
      name: "Studying",
      type: "bar",
      stack: "total",
      data: props.data?.map((item) => ({
        value: item.study,
        name: item.acceptance_year,
      })),
      itemStyle: {
        color: colors[0],
        // borderRadius: 15,
        opacity: 1,
      },
      barWidth: "25px",
      label: {
        show: true,
        position: "center",
        offset: [10, 8],
        formatter: (params: any) => n(params.value),
        textStyle: {
          fontSize: 10,
          color: "#000",
        },
      },
    },
  ],
});
</script>

<style scoped></style>
