<template>
  <div class="p-2 flex flex-col">
    <div class="flex flex-col gap-1 h-16 md:p-6">
      <p class="font-semibold md:text-lg 2xl:text-xl !leading-none">
        Total quantity of active students
      </p>
    </div>
    <div class="flex flex-col space-y-4 grow pt-2">
      <v-chart class="h-[292px] mx-auto" :option="chartOptions" autoresize />
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { ref } from "vue";
const props = defineProps<{
  data?: any[] | null;
}>();
const colors = ["#D3D3D3", "#2C1C5F", "#6941C6", "#E9D7FE", "#44444F"];

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
      fontSize: 9,
      width: 90,
      margin: 10,

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
        value: item.total_students,
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
</script>

<style scoped></style>
