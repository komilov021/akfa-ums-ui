<template>
  <div class="card p-2 md:p-6 flex flex-col !shadow-md">
    <p class="font-semibold text-xl leading-6 h-12">Applications per person</p>
    <div class="flex flex-col space-y-4 grow">
      <div class="p-4">
        <v-chart class="h-56" :option="measurementsOptions" autoresize />
        <h1 class="font-medium text-xl text-center">
          Average - {{ $n(application?.total_applications || 0) }}
        </h1>
      </div>
      <div class="grid md:grid-cols-2 gap-4 place-items-center font-medium">
        <div class="flex items-center space-x-2">
          <div class="w-5 h-5 rounded-md bg-main"></div>
          <span>1</span>
        </div>
        <div class="flex items-center space-x-2 font-medium">
          <div class="w-5 h-5 rounded-md bg-mainLight"></div>
          <span>2</span>
        </div>
        <div class="flex items-center space-x-2 font-medium">
          <div class="w-5 h-5 rounded-md bg-black"></div>
          <span>3</span>
        </div>
        <div class="flex items-center space-x-2 font-medium">
          <div class="w-5 h-5 rounded-md bg-darkGray"></div>
          <span>4</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { ref } from "vue";
import type { IApplicationByPerson } from "@/models/backend";

const props = defineProps<{
  application?: IApplicationByPerson;
}>();

const measurementsOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: "{b} {c}",
  },
  color: ["#C02221", "#FF6969", "#111111", "#787878"],
  series: [
    {
      name: "Applications",
      type: "pie",
      label: {
        show: false,
        position: "center",
      },
      radius: "80%",
      center: ["50%", "50%"],
      data: [
        {
          value: props.application?.one_application.total,
          name: "1",
        },
        { value: props.application?.two_applications.total, name: "2" },
        { value: props.application?.three_applications.total, name: "3" },
        { value: props.application?.four_applications.total, name: "4" },
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
