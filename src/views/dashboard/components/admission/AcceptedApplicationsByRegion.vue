<template>
  <div
    class="card p-2 md:p-6 flex flex-col !shadow-md w-full mx-auto md:w-full"
  >
    <p
      class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-lg 2xl:text-xl leading-6 h-12 text-center"
    >
      Accepted applications by region
    </p>
    <div class="flex flex-col space-y-4 grow">
      <div class="space-y-4">
        <v-chart class="h-56" :option="chartOptions" autoresize />
        <h1
          class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-lg 2xl:text-xl text-center"
        >
          Uzbekistan - {{ $n(props.application?.total || 0) }}
        </h1>
      </div>
      <div
        class="grid grid-cols-2 gap-4 font-medium grow md:text-sm 2xl:text-base md:p-0 p-3"
      >
        <div
          class="flex items-center space-x-2"
          v-for="(item, index) of props.application?.regions"
          :key="index"
        >
          <div
            class="w-4 h-4 shrink-0 rounded-full"
            :style="{ 'background-color': colors[index] || colors[0] }"
          ></div>
          <span class="leading-none text-xs">{{ item.name.en }}</span>
          <span class="text-xs">{{ item.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { ref } from "vue";
import type { IApplicationByRegion } from "@/models/backend";

const props = defineProps<{
  application?: IApplicationByRegion;
}>();

const colors = [
  "#2F2F2F",
  "#8039FF",
  "#AA6CFF",
  "#D6BBFB",
  "#E5E5E5",
  "#959595",
];

const chartOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: "{b} {c} %",
  },
  color: colors,
  series: [
    {
      name: "Applications",
      type: "pie",
      label: {
        formatter: "{c}%",
      },
      labelLine: {
        length: 0.2,
      },
      radius: ["40%", "70%"],
      data: props.application?.regions.map((item) => ({
        value: item.percentage,
        name: item.name,
      })),
    },
  ],
});
</script>

<style scoped></style>
