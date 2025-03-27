<template>
  <div
    class="card p-2 md:p-6 flex flex-col !shadow-md w-full mx-auto md:w-full"
  >
    <p
      class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-lg 2xl:text-xl h-12 inline-block text-center"
    >
      Number of applications
    </p>
    <div class="flex flex-col space-y-8">
      <div class="space-y-4">
        <v-chart class="h-56" :option="measurementsOptions" autoresize />
        <h1
          class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-lg 2xl:text-xl text-center"
        >
          Total - {{ $n(props.application?.total_applications || 0) }}
        </h1>
      </div>
      <div
        class="flex items-center gap-4 flex-wrap md:text-sm 2xl:text-base font-medium md:p-0 p-3"
      >
        <div class="flex items-center space-x-2">
          <div class="w-5 h-5 rounded-full bg-[#2F2F2F]"></div>
          <span class="text-xs"
            >Accepted:
            {{ $n(props.application?.percentage?.accepts?.total || 0) }}</span
          >
        </div>
        <div class="flex items-center space-x-2 font-medium">
          <div class="w-5 h-5 rounded-full bg-[#8039FF]"></div>
          <span class="text-xs"
            >Rejected:
            {{ $n(props.application?.percentage?.rejects?.total || 0) }}</span
          >
        </div>
        <div class="flex items-center space-x-2 font-medium">
          <div class="w-5 h-5 rounded-full bg-[#AA6CFF]"></div>
          <span class="text-xs"
            >Not reviewed:
            {{ $n(props.application?.percentage?.pendings?.total || 0) }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { ref } from "vue";
import type { IApplicationByNumber } from "@/models/backend";

const props = defineProps<{
  application?: IApplicationByNumber;
}>();

const measurementsOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: "{b} {c} %",
  },
  color: ["#2F2F2F", "#8039FF", "#AA6CFF"],

  series: [
    {
      name: "Applications",
      type: "pie",
      label: {
        formatter: "{c} %",
      },
      labelLine: {
        length: 0.2,
      },
      radius: ["40%", "70%"],
      data: [
        {
          value: props.application?.percentage?.accepts?.percentage,
          name: "Accepted",
        },
        {
          value: props.application?.percentage?.rejects?.percentage,
          name: "Rejected",
        },
        {
          value: props.application?.percentage?.pendings?.percentage,
          name: "Not reviewed",
        },
      ],
    },
  ],
});
</script>

<style scoped></style>
