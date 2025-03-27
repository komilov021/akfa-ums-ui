<template>
  <div class="p-2 flex flex-col">
    <div class="flex flex-col gap-1 h-16 md:p-6 mt-1">
      <p class="font-semibold md:text-lg 2xl:text-xl !leading-none">
        Teaching time of professors by school
      </p>
      <div class="flex items-center text-[#C8C7C7] text-[12.57px]">
        <div class="first-letter:uppercase">
          <span class="lowercase">{{ from_date }}</span>
        </div>
        <div>&nbsp;-&nbsp;</div>
        <div class="first-letter:uppercase">
          <span class="lowercase">{{ to_date }}</span>
        </div>
      </div>
    </div>
    <div class="flex flex-col space-y-4 grow pt-2">
      <v-chart class="h-[292px] mx-auto" :option="chartOptions" autoresize />
      <div class="flex items-center flex-wrap justify-center gap-1 sm:gap-5">
        <h1 class="font-medium md:text-lg text-center">
          Avg time spend fact - {{ formatterTime(totalFact) }} hrs
        </h1>
        <h1 class="font-medium md:text-lg text-center">
          Avg time spend plan - {{ formatterTime(totalPlan) }} hrs
        </h1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { computed, ref } from "vue";
import { dayjs } from "element-plus";
const props = defineProps<{
  data?: any[] | null;
  currentdate?: any[] | null;
}>();
const from_date = computed(() => props.currentdate?.[0]);
const to_date = computed(() => props.currentdate?.[1]);
const colors = ["#D3D3D3", "#2B1C5F", "#6A40C6", "#E9D7FF", "#44444E"];
const factColors = ["#E8E4E4", "#5C3EB7", "#A383E8", "#F0E8F9", "#8C8C9C"];
const convertToDecimalHours = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours + minutes / 60;
};

const formatterTime = (val: number): string => {
  const hour = Math.floor(val);
  const minutes = Math.round((val - hour) * 60);
  return `${String(hour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};
// const total = computed(() => {
//   const hours: any = props.data
//     ?.map((x) => convertToDecimalHours(x.fact))
//     .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
//   const count = props.data?.length || 0;
//   return count ? hours / count : 0;
// });

// const totalPlan = computed(() => {
//   const hours: any = props.data
//     ?.map((x) => convertToDecimalHours(x.plan))
//     .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
//   const count = props.data?.length || 0;
//   return count ? hours / count : 0;
// });

const totalFact = computed(() => {
  if (!props.data || props.data.length === 0) return 0; // Null yoki bo‘sh bo‘lsa
  const sum = props.data.reduce(
    (acc, item) => acc + convertToDecimalHours(item.fact),
    0
  );
  return sum / 132; // Yig‘indini 132 ga bo‘lish
});

const totalPlan = computed(() => {
  if (!props.data || props.data.length === 0) return 0; // Null yoki bo‘sh bo‘lsa
  const sum = props.data.reduce(
    (acc, item) => acc + convertToDecimalHours(item.plan),
    0
  );
  return sum / 132; // Yig‘indini 132 ga bo‘lish
});

const chartOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: (params: any) => {
      return `<span class="font-base text-[10px] md:text-[14px] leading-none">${
        params.data.title
      }: ${formatterTime(params.value)}</span>`;
    },
  },
  legend: {
    orient: "horizontal",
    right: "5%",
    itemGap: 10,
    textStyle: {
      fontSize: 10,
      color: "#333",
    },
  },
  xAxis: {
    data: props.data?.map((item) => item.title),
    type: "category",
    axisLabel: {
      interval: 0,
      rotate: 0,
      fontSize: 9,
      width: 100,
      margin: 10,
      overflow: "truncate",
      formatter: function (value: any) {
        if (window.innerWidth < 768) {
          return value.length > 10 ? value.substring(0, 10) + "..." : value;
        }
        return value;
      },
    },
  },
  grid: {
    left: "5%",
    bottom: "10%",
    right: "5%",
    top: "20%",
    containLabel: true,
  },
  yAxis: {
    axisLabel: {
      formatter: (value: any) => {
        return `${value} hrs`; // Bu yerda 'units' o'rniga kerakli matnni yozishingiz mumkin
      },
    },
  },
  series: [
    {
      name: "Fact",
      data: props.data?.map((item) => ({
        value: convertToDecimalHours(item.fact),
        title: "Fact",
      })),
      barWidth: "22px",
      label: {
        show: true,
        position: "top",
        fontSize: 10,
        formatter: (d: any) => formatterTime(d.value),
      },
      itemStyle: {
        color: "#6941C6",
      },
      type: "bar",
    },
    {
      name: "Plan",
      data: props.data?.map((item) => ({
        value: convertToDecimalHours(item.plan),
        title: "Plan",
      })),
      barWidth: "22px",
      label: {
        show: true,
        position: "top",
        fontSize: 10,
        formatter: (d: any) => formatterTime(d.value),
      },
      itemStyle: {
        color: "#9E77ED",
        opacity: 0.7,
      },
      type: "bar",
    },
  ],
});
</script>

<style scoped></style>
