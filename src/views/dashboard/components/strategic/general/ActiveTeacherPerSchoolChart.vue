<template>
  <div class="card p-2 flex flex-col">
    <div class="flex flex-col gap-1 h-16 md:p-6">
      <p class="font-semibold md:text-lg 2xl:text-xl !leading-none">
        Teacher per student
      </p>
      <!-- <div class="w-10/12">
            <SemestrArrow @on-change="getData($event)" />
          </div> -->
    </div>
    <div class="flex flex-col space-y-4 grow pt-2">
      <v-chart
        v-if="props.data"
        class="h-[292px] mx-auto"
        :option="chartOptions"
        autoresize
      />
      <div v-else class="p-2">
        <el-skeleton :rows="4" animated />
      </div>
      <!-- <h1 class="font-medium md:text-lg 2xl:text-xl text-center mb-4">
            Total - {{ $n(props.data?.total_count || 0) }}
          </h1> -->
      <div class="flex flex-col space-y-4 md:p-6">
        <div class="grid grid-cols-3 text-sm gap-4 font-medium grow">
          <div
            class="flex items-center space-x-2"
            v-for="(school, i) in chartData[0].schools"
            :key="school.name"
          >
            <div
              class="min-w-[20px] w-5 h-5 rounded-full"
              :style="{ 'background-color': colors[i] || colors[0] }"
            ></div>
            <p class="truncate text-xs 2xl:text-base">{{ school.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { computed, onMounted, ref } from "vue";
import type { IStudentBySchool } from "@/models/backend";
import { useStatisticsStore } from "@/stores";
import SemestrArrow from "../../filters/SemestrArrow.vue";
const statisticsStore = useStatisticsStore();
const props = defineProps<{
  data?: IStudentBySchool[] | null;
}>();
const chartData: any = computed(() => props.data);
const colors = ["#D3D3D3", "#2C1C5F", "#6941C6", "#E9D7FE", "#44444F"];

const chartOptions = ref({
  tooltip: {
    trigger: "item",
    axisPointer: {
      type: "shadow",
    },
    formatter: (params: any) => {
      const list: any = props.data;
      const current = list[params.dataIndex].schools[params.seriesIndex];
      const content = current.programs.map((program: any) => {
        return `<p style="font-size: 12px; font-weight: 500;">${program.name} - ${program.count}</p>`;
      });

      return `<p style="font-size: 14px; font-weight: 700;">${
        params.data.label
      } - ${params.value}</p>
          ${content.join("")}`;
    },
  },
  legend: {},
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  yAxis: {
    type: "value",
  },
  xAxis: {
    type: "category",
    data: props.data?.map((item) => item.name),
  },
  series: props.data?.map((item, index) => {
    return {
      type: "bar",
      stack: "total",
      barWidth: "38px",
      label: {
        show: true,
        fontSize: "10px",
      },
      itemStyle: {
        color: colors[index],
        shadowColor: "#91cc75",
        borderType: "dashed",
        opacity: 1,
        borderRadius: 4,
      },
      data: [
        {
          label: item.schools[index].name,
          value: item.schools[index].count,
        },
        {
          label: item.schools[index].name,
          value: item.schools[index].count,
        },
        {
          label: item.schools[index].name,
          value: item.schools[index].count,
        },
        {
          label: item.schools[index].name,
          value: item.schools[index].count,
        },
      ],
    };
  }),
});
onMounted(() => {
  console.log(chartOptions.value.series);
});
const getData = (row: number) => {
  // statisticsStore.fetchStudentsBySchool(row);
};
</script>

<style scoped></style>
