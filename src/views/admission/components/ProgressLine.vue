<template>
  <div
    class="card p-2 md:p-6 flex flex-col !shadow-md w-full mx-auto md:w-full"
  >
    <p
      class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-lg 2xl:text-xl h-12 inline-block text-center"
    >
      Applicants Count Per Day
    </p>
    <div class="flex flex-col space-y-4 grow pb-4">
      <div class="space-y-4 px-0">
        <v-chart class="h-72" :option="chartOptions" autoresize />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VChart from "vue-echarts";
import { graphic } from "echarts";
interface IType {
  apply_date: string;
  total_registered_student: number | null;
}
const props = defineProps<{
  applicantsPerDay: IType[] | null;
}>();

const roundTeoDigit = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;
const chartOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: "{b} - {c}",
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: props.applicantsPerDay?.map((item) => item.apply_date),
    axisLabel: {
      interval: 0,
      rotate: 0,
      fontSize: 7,
      width: 45,
      overflow: "truncate",
    },
  },
  grid: {
    left: "6.5%",
    bottom: "5%",
    right: "7.5%",
    top: "10%",
  },
  dataZoom: [
    {
      type: "slider", // Slider qisqichlari
      xAxisIndex: [0], // X o'qiga tegishli
      start: 85, // Boshlanish punkti
      end: 100, // Oxirgi punkti
      bottom: 50, // Quyidagi joylashuvi
    },
  ],
  yAxis: {},
  series: [
    {
      data: props.applicantsPerDay?.map(
        (item) => item.total_registered_student
      ),
      type: "line",
      itemStyle: {
        color: "#7F56D9",
        opacity: 1,
      },
      label: {
        show: true,
        position: "top",
        size: "14px",
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
</script>
