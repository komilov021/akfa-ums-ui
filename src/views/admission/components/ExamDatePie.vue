<template>
  <div class="card p-2 md:p-6 flex flex-col !shadow-md mx-auto w-full h-full">
    <p
      class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-lg 2xl:text-xl h-12 inline-block text-center"
    >
      Exam Date
    </p>
    <div class="flex flex-col space-y-4 grow">
      <div class="space-y-4">
        <v-chart class="h-56" :option="chartOptions" autoresize />
      </div>
      <div
        class="grid grid-cols-2 gap-4 md:p-0 p-3 font-medium grow md:text-sm 2xl:text-base"
      >
        <div
          class="flex items-center space-x-2"
          v-for="(item, index) of props.examDate"
          :key="item.duration"
        >
          <div
            class="w-4 h-4 shrink-0 rounded-full"
            :style="{ 'background-color': colors[index] || colors[0] }"
          ></div>
          <span class="text-xs leading-none">{{ item.duration }}:</span>
          <span class="text-xs">{{ item.count }} applicants</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import VChart from "vue-echarts";
interface IExamDate {
  duration: string;
  count: string;
  exam_date_id: string;
}
const props = defineProps<{
  examDate: IExamDate[];
}>();

const totalCount = props.examDate.reduce(
  (acc, examDate) => acc + parseInt(examDate.count),
  0
);
console.log(props.examDate, "data");

const colors = [
  "#8039FF",
  "#2F2F2F",
  "#AA6CFF",
  "#959595",
  "#D6BBFB",
  "#E5E5E5",
];

const chartOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: "{c} %",
  },
  color: colors,
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
      data: props.examDate?.map((item) => ({
        value: ((parseInt(item.count) / totalCount) * 100).toFixed(1),
        name: item.duration,
      })),
    },
  ],
});
</script>
