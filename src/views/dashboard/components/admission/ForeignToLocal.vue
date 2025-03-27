<template>
  <div
    class="card p-2 md:p-6 flex flex-col !shadow-md w-full mx-auto md:w-full"
  >
    <p
      class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-lg 2xl:text-xl leading-6 h-12 text-center"
    >
      Accepted foreign to local applicants
    </p>
    <div class="flex flex-col space-y-4 grow">
      <div class="space-y-4">
        <v-chart class="h-56" :option="cahrtOptions" autoresize />
        <h1
          class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-lg 2xl:text-xl text-center"
        >
          Total - {{ $n(props.application?.total_applications || 0) }}
        </h1>
      </div>
      <div
        class="grid grid-cols-2 md:text-sm gap-4 md:p-0 p-3 font-medium place-items-center grow"
      >
        <div class="flex items-center space-x-2">
          <div
            class="w-5 h-5 rounded-full bg-[#AA6CFF]"
            :class="{ '': MIN_MAX.max }"
          ></div>
          <span class="text-xs"
            >Foreign: {{ $n(props.application?.foreigns.total || 0) }}</span
          >
        </div>
        <div class="flex items-center space-x-2 font-medium">
          <div class="w-5 h-5 rounded-full bg-[#2F2F2F]"></div>
          <span class="text-xs"
            >Local: {{ $n(props.application?.locals.total || 0) }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { reactive, ref } from "vue";
import type { IApplicationForeignToLocal } from "@/models/backend";
const MIN_MAX = reactive({
  max: "",
  min: "",
});
const props = defineProps<{
  application?: IApplicationForeignToLocal;
}>();
const MaxItem = (props: any) => {
  if (props.application?.foreigns.total > props.application?.locals.total) {
    MIN_MAX.max = "#2F2F2F";
  } else if (
    props.application?.foreigns.total < props.application?.locals.total
  ) {
    MIN_MAX.min = "#AA6CFF";
  }
};
console.log(MaxItem(props));

const cahrtOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: "{b} {c} %",
  },
  color: ["#AA6CFF", "#2F2F2F"],
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
          value: props.application?.foreigns.percentage,
          name: "Foreign",
        },
        { value: props.application?.locals.percentage, name: "Local" },
      ],
    },
  ],
});
</script>

<style scoped></style>
