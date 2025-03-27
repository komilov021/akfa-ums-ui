<template>
  <div
    class="card p-2 md:p-6 flex flex-col !shadow-md w-full mx-auto md:w-full"
  >
    <p
      class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-lg 2xl:text-xl leading-6 h-12 text-center"
    >
      Accepted applications by age
    </p>
    <div class="flex flex-col space-y-4 grow">
      <div class="space-y-4">
        <v-chart class="h-56" :option="measurementsOptions" autoresize />
        <h1
          class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-lg 2xl:text-xl text-center"
        >
          Average - {{ $n(props.application?.total_applicants || 0) }}
        </h1>
      </div>
      <div
        class="grid grid-cols-2 p-4 gap-4 font-medium md:text-sm 2xl:text-base content-center grow md:p-0"
      >
        <div class="flex items-center space-x-2">
          <div
            class="w-5 h-5 rounded-full"
            :style="{ 'background-color': colors[0] }"
          ></div>
          <span class="text-xs"
            >&lt; 18:
            {{ $n(props.application?.applicants_under_18.total || 0) }}</span
          >
        </div>
        <div class="flex items-center space-x-2 font-medium">
          <div
            class="w-5 h-5 rounded-full"
            :style="{ 'background-color': colors[1] }"
          ></div>
          <span class="text-xs"
            >18-20:
            {{ $n(props.application?.applicants_18_to_20.total || 0) }}</span
          >
        </div>
        <div class="flex items-center space-x-2 font-medium">
          <div
            class="w-5 h-5 rounded-full"
            :style="{ 'background-color': colors[2] }"
          ></div>
          <span class="text-xs"
            >20-22:
            {{ $n(props.application?.applicants_20_to_22.total || 0) }}</span
          >
        </div>
        <div class="flex items-center space-x-2 font-medium">
          <div
            class="w-5 h-5 rounded-full"
            :style="{ 'background-color': colors[3] }"
          ></div>
          <span class="text-xs"
            >22+:
            {{ $n(props.application?.applicants_over_22.total || 0) }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { ref } from "vue";
import type { IApplicationByAge } from "@/models/backend";

const props = defineProps<{
  application?: IApplicationByAge;
}>();
const colors = ["#2F2F2F", "#8039FF", "#AA6CFF", "#959595"];
const measurementsOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: "{b} - {c} %",
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
      data: [
        {
          value: props.application?.applicants_under_18.percentage,
          name: "< 18",
        },
        {
          value: props.application?.applicants_18_to_20.percentage,
          name: "18-20",
        },
        {
          value: props.application?.applicants_20_to_22.percentage,
          name: "20-22",
        },
        {
          value: props.application?.applicants_over_22.percentage,
          name: "22+",
        },
      ],
    },
  ],
});
</script>

<style scoped></style>
