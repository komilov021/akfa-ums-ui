<template>
  <div class="stat-card md:pt-4 flex flex-col">
    <div class="p-2 md:px-8">
      <p
        class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-base leading-6"
      >
        Project's budget
      </p>
      <p class="text-[#C8C7C7] text-[12.57px]">
        Total Expences - ${{
          props.data[0]?.total_amount.toLocaleString("en-US", {
            minimumFractionDigits: 0,
          })
        }}
      </p>
      <div class="relative">
        <v-chart
          class="sm:h-[450px] h-[360px]"
          :option="chartOptions"
          autoresize
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  data: any;
}>();

const filteredAndSortedData = computed(() =>
  [...(props.data || [])].sort((a: any, b: any) => b?.parentage - a?.parentage)
);

const totalStudents = computed(() => {
  return (
    props.data?.reduce((sum: number, item: any) => sum + item?.parentage, 0) ||
    1
  );
});

const colors = [
  "#6941C6",
  "#9E77ED",
  "#EAECF0",
  "#8A6AD5",
  "#9A75F2",
  "#B99CFF",
  "#D4C2FF",
  "#D6CBEF",
  "#E6E0F5",
  "#F0ECF7",
];

const chartOptions = ref({
  tooltip: {
    trigger: "item",
    extraCssText: "max-width: 200px; width: auto; white-space: wrap;",
    formatter: (params: any) => {
      const totalAmount = props.data?.reduce(
        (sum: any, item: any) => sum + item?.project_by_amount,
        0
      );

      const projectData = props.data?.find(
        (item: any) => item.project_name === params.name
      );
      const projectAmount = projectData?.project_by_amount || 0;
      const percentage = ((projectAmount / totalAmount) * 100 || 0).toFixed(2);

      return `
      <span class="font-base text-[10px] md:text-[13px] leading-none">
        ${params.name} - ${percentage}% ( $ ${projectAmount.toLocaleString(
        "en-US",
        { minimumFractionDigits: 0 }
      )} )
  </span>
    `;
    },
  },
  legend: {
    right: "right",
    bottom: "center",
    itemWidth: 4,
    itemHeight: 4,
    textStyle: {
      fontSize: 12,
      color: "#666",
    },
    type: "scroll",
    orient: "vertical",
    height: 300,
  },
  series: [
    {
      type: "pie",
      radius: ["40%", "60%"],
      center: ["30%", "50%"],
      data: filteredAndSortedData.value?.map((item: any, index: any) => ({
        value: item?.parentage,
        name: item?.project_name,
        itemStyle: {
          color: colors[index],
          shadowColor: "#91cc75",
          borderType: "dashed",
          opacity: 1,
          borderRadius: 2,
        },
      })),
      barWidth: "22px",
      labelLine: {
        show: true,
        length: 10,
        length2: 10,
      },
      label: {
        formatter: (params: any) => {
          const percentage = (
            (params.value / totalStudents.value) *
            100
          ).toFixed(0);
          return `${percentage}% `;
        },
        position: "outside",
        fontSize: 12,
        color: "#666",
      },
    },
  ],
});

function updateLegendPosition() {
  if (window.innerWidth < 580) {
    chartOptions.value.legend.textStyle.fontSize = 8;
    chartOptions.value.series[0].label.fontSize = 9;
    chartOptions.value.legend = {
      left: "center",
      bottom: 0,
      itemWidth: 4,
      itemHeight: 4,
      textStyle: {
        fontSize: 8,
        color: "#666",
      },
      type: "scroll",
      orient: "horizontal",
      height: 30,
    } as any;
    chartOptions.value.series[0].center = ["50%", "50%"];
  } else {
    chartOptions.value.legend.textStyle.fontSize = 8;
    chartOptions.value.series[0].label.fontSize = 12;
    chartOptions.value.legend = {
      right: "right",
      bottom: "center",
      itemWidth: 4,
      itemHeight: 4,
      textStyle: {
        fontSize: 12,
        color: "#666",
      },
      type: "scroll",
      orient: "vertical",
      height: 390,
    } as any;
  }
}

onMounted(() => {
  updateLegendPosition();
  window.addEventListener("resize", updateLegendPosition);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateLegendPosition);
});
</script>

<style scoped></style>
