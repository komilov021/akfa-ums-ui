<template>
  <div class="p-2 flex flex-col">
    <div class="flex flex-col gap-1 h-16 md:p-6">
      <p class="font-semibold md:text-lg 2xl:text-xl !leading-none">
        Avg time-spent of students by school
      </p>
    </div>
    <div class="flex flex-col space-y-4 grow pt-2">
      <v-chart class="h-[292px] mx-auto" :option="chartOptions" autoresize />
      <h1 class="font-medium md:text-lg text-center mb-4" v-if="total">
        Avg time spend - {{ formatterTime(total) }}
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { computed, ref } from "vue";
import { dayjs } from "element-plus";
const props = defineProps<{
  data?: any[] | null;
}>();
const colors = ["#D3D3D3", "#2C1C5F", "#6941C6", "#E9D7FE", "#44444F"];
const total = computed(() => {
  let hours = props.data
    ?.map((x) => x.average_spent_hours)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const count = props.data?.length || 0;
  return count ? hours / count : 0;
});
const formatterTime = (val: number): string => {
  const hour = Math.floor(val);
  const minutes = Math.round((val - hour) * 60);
  return dayjs().hour(hour).minute(minutes).format("hh:mm");
};

const chartOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: (params: any) => {
      return ` <span class="font-base text-[10px] md:text-[14px] leading-none">${formatterTime(
        params.value
      )}</span>`;
    },
  },
  xAxis: {
    data: props.data?.map((item) => item.title),
    type: "category",
    axisLabel: {
      interval: 0,
      rotate: 0,
      fontSize: 9,
      width: 80,
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
        value: item?.average_spent_hours,
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
        formatter: function (d: any) {
          return formatterTime(d.value);
        },
      },
      type: "bar",
    },
  ],
});
</script>

<style scoped></style>
