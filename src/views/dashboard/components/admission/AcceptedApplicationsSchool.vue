<template>
  <div
    class="card p-2 md:p-6 flex flex-col !shadow-md w-full mx-auto md:w-full"
  >
    <p
      class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-lg 2xl:text-xl leading-6 h-12 text-center"
    >
      Accepted applications by school & program
    </p>
    <div class="flex flex-col space-y-4 grow">
      <div class="space-y-4">
        <v-chart class="h-56" :option="measurementsOptions" autoresize />
        <h1
          class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-lg 2xl:text-xl text-center"
        >
          Accepted - {{ $n(props.application?.total_count || 0) }}
        </h1>
      </div>
      <div
        class="grid grid-cols-2 gap-4 md:p-0 p-3 font-medium grow md:text-sm 2xl:text-base"
      >
        <div
          class="flex items-center space-x-2"
          v-for="(item, index) of props.application?.schools"
          :key="item.name"
        >
          <div
            class="w-4 h-4 shrink-0 rounded-full"
            :style="{ 'background-color': colors[index] || colors[0] }"
          ></div>
          <span class="text-xs leading-none">{{ item.name }}</span>
          <span class="text-xs">{{ item.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { ref } from "vue";
import type { IApplicationBySchool } from "@/models/backend";

const props = defineProps<{
  application?: IApplicationBySchool;
}>();

const colors = ["#2F2F2F ", "#8039FF", "#AA6CFF ", "#959595", "#E5E5E5"];
const measurementsOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: (params: any) => {
      return (
        `<h1 class="text-[8px] sm:text-[10px] md:text-[12px] font-base">${params.name} - ${params.value}%</h1>` +
        params.data?.data
          ?.map(
            (item: any) =>
              `<h1 class="text-[8px] sm:text-[10px] md:text-[12px] font-base tracking-tighter">${item.name} - ${item.count}</h1>`
          )
          .join("")
      );
    },
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
      data: props.application?.schools.map((item) => ({
        value: item.percentage,
        name: item.name,
        data: item.programs,
      })),
    },
  ],
});
</script>

<style scoped></style>
