<template>
  <div
    class="card p-2 md:p-6 flex flex-col !shadow-md w-full mx-auto md:w-full md:mb-0"
  >
    <p
      class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-lg 2xl:text-xl leading-6 h-12 text-center"
    >
      Accepted IELTS and internal examination
    </p>
    <div class="flex flex-col space-y-4 grow">
      <div class="space-y-4">
        <v-chart class="h-56" :option="cahrtOptions" autoresize />
        <h1
          class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-lg 2xl:text-xl text-center"
        >
          Total - {{ $n(props.application?.total_certificates || 0) }}
        </h1>
      </div>
      <div
        class="grid grid-cols-2 gap-4 font-medium grow md:text-sm 2xl:text-base md:p-0 p-3"
      >
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 rounded-full bg-[#2F2F2F]"></div>
          <span class="text-xs"
            >Ielts: {{ $n(props.application?.ielts.total || 0) }}</span
          >
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 rounded-full bg-[#AA6CFF]"></div>
          <span class="text-xs"
            >Toefl: {{ $n(props.application?.toefl.total || 0) }}</span
          >
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 rounded-full bg-[#8039FF]"></div>
          <span class="text-xs"
            >Duolingo: {{ $n(props.application?.duolingo.total || 0) }}</span
          >
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 rounded-full bg-[#E5E5E5]"></div>
          <span class="text-xs"
            >Not Entered: {{ $n(props.application?.unknowns.total || 0) }}</span
          >
        </div>
        <div class="flex items-center space-x-2 font-medium">
          <div class="w-4 h-4 rounded-full bg-[#959595]"></div>
          <span class="text-xs"
            >Internal exam: {{ $n(props.application?.iepte.total || 0) }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { ref } from "vue";
import type { IApplicationByIelts } from "@/models/backend";

const props = defineProps<{
  application?: IApplicationByIelts;
}>();

const cahrtOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: "{b} {c} %",
  },
  color: ["#2F2F2F", "#AA6CFF", "#E5E5E5", "#8039FF", "#959595"],
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
          value: props.application?.ielts.percentage,
          name: "Ielts",
        },
        {
          value: props.application?.toefl.percentage,
          name: "Toefl",
        },
        {
          value: props.application?.toefl.percentage,
          name: "Duolingo",
        },
        {
          value: props.application?.unknowns.percentage,
          name: "Not Entered",
        },
        { value: props.application?.iepte.percentage, name: "Internal exam" },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
});
</script>

<style scoped></style>
