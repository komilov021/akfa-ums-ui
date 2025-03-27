<template>
  <div>
    <v-chart :option="chartOptions" autoresize class="h-[320px]" />
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { useOperationalsStore } from "@/stores";
import { ref, computed, onMounted } from "vue";
const operationalsStore = useOperationalsStore();
const props = defineProps<{
  data?: any[];
}>();
const colors = ["#D3D3D3", "#2B1C5F", "#6A40C6", "#E9D7FF", "#44444E"];
const totalSum = computed(() =>
  props?.data?.reduce((acc: any, curr: any) => (acc = acc + curr.all), 0)
);
const percentages = computed(() =>
  props?.data?.map((item: any) =>
    ((item.all / totalSum.value) * 100).toFixed(2)
  )
);
const Tooltip = (dataIndex: number) => {
  const sum: any = props?.data?.[dataIndex].all;
  return props?.data?.[dataIndex].courses
    ?.map(
      (item: any) =>
        `<p class="font-semibold text-[6px] leading-none overflow-hidden">${
          item.title
        } - ${item.course_average.toFixed(2)}% </p>`
      // `<span class="font-semibold leading-none">${item.title} - ${(
      //   (item.is_exist_count / sum) *
      //   100
      // ).toFixed(2)}% </span><br>`
    )
    .join("");
};
const chartOptions = ref({
  tooltip: {
    position: "center",
    trigger: "item",
    formatter: (params: any) => {
      var tooltipContent = '<div style="width: 700px">';
      return (
        tooltipContent +
        `<span class="font-semibold leading-none">${params.name} - ${
          params.value
        }%</span><br> <div class="grid grid-cols-5 gap-2 mt-2"> ${Tooltip(
          params.dataIndex
        )} </div>`
      );
    },
  },
  xAxis: {
    data: props.data?.map((item: any) => item.title),
    type: "category",
    axisLabel: {
      interval: 0,
      rotate: 0,
      fontSize: 9,
      width: 120,
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
    left: "10%",
    bottom: "10%",
    right: "0%",
    top: "10%",
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value}%",
    },
  },
  series: [
    {
      data: props.data?.map((item: any, index: any) => ({
        value: item.school_average.toFixed(2),
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
        formatter: "{c}%",
        show: true,
        position: "top",
      },
      type: "bar",
    },
  ],
});
</script>

<style scoped></style>
