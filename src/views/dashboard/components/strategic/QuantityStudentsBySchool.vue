<template>
  <div class="stat-card md:pt-4 flex flex-col">
    <div class="p-2 md:px-8">
      <p
        class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-base leading-6"
      >
        Quantity of students by school and programs
      </p>
      <div class="flex items-center text-[#C8C7C7] text-[12.57px]">
        <div class="first-letter:uppercase">
          <span class="lowercase"
            >In all time
            {{ props.level ? "/ " + props.level : "All level" }}</span
          >
        </div>
      </div>
      <div class="relative">
        <v-chart class="h-[300px]" :option="chartOptions" autoresize />
      </div>
    </div>
    <div class="h-[1px] mt-2 bg-[#EAECF0]" />
    <div class="flex justify-end px-3 py-3">
      <el-dropdown>
        <el-button class="stat-btn">Choose level</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              @click="$emit('update', level), (currentlevel = level.label)"
              v-for="(level, i) in levels"
              :key="i"
            >
              <span class="md:text-[14px] text-[12px] leading-0">{{
                level.label
              }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { ref, computed } from "vue";
import { IStudentQuantityBySchool } from "@/models/backend";

const emits = defineEmits(["update"]);
const props = defineProps<{
  data?: IStudentQuantityBySchool[];
  level?: any;
}>();

const levels = [
  { value: null, label: "All level" },
  { value: 1, label: "Level 1" },
  { value: 2, label: "Level 2" },
  { value: 3, label: "Level 3" },
  { value: 4, label: "Level 4" },
  { value: 5, label: "Level 5" },
  { value: 6, label: "Level 6" },
];
const currentlevel = ref("");

const colors = [
  "#D3D3D3",
  "#2B1C5F",
  "#6A40C6",
  "#E9D7FF",
  "#44444E",
  "#B99CFF",
  "#D4C2FF",
  "#D6CBEF",
  "#E6E0F5",
  "#F0ECF7",
];
const totalStudents: any = computed(() => {
  return (
    props.data?.reduce((sum: any, item: any) => sum + item.student_count, 0) ||
    1
  );
});
// Define the chart options, updating label.formatter to show the correct percentage
const chartOptions = ref({
  tooltip: {
    trigger: "item",
    position: "center",
    extraCssText: "max-width: 300px; width: auto; white-space: wrap;",
    formatter: (params: any) => {
      const percentage = ((params.value / totalStudents.value) * 100).toFixed(
        2
      );
      const programs_list = params?.data?.programs
        ? params?.data?.programs
            ?.map(
              (item: any) =>
                `<li class="leading-none mb-1">
              <span class="font-normal">${item.program}</span> 
              <span class="text-gray-500 font-bold">(${item.count} students)</span>
            </li>`
            )
            .join("")
        : "<li class='text-gray-500'>No programs available</li>";

      return `
        <div style="font-size: 12px; line-height: 1.5;">
            ${params?.name} - ${percentage}% (${params.value} students)
          <ul style="padding-left: 15px; margin-top: 5px; list-style-type: disc;">
            ${programs_list}
          </ul>
        </div>
      `;
    },
  },
  legend: {
    type: "scroll",
    orient: "horizontal",
    bottom: "0%",
    textStyle: {
      fontSize: 8,
      color: "#333",
    },
    pageIconSize: 10,
    pageTextStyle: {
      fontSize: 8,
      color: "#666",
    },
    itemGap: 8,
  },
  series: [
    {
      type: "pie",
      radius: ["40%", "62%"],
      data: props.data?.map((item, index) => ({
        value: item.student_count,
        name: item.title,
        programs: item.programs,
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
        length2: 15,
        smooth: true,
        lineStyle: {
          color: "#ccc",
          width: 1,
        },
      },
      label: {
        formatter: (params: any) => {
          const percentage = (
            (params.value / totalStudents.value) *
            100
          ).toFixed(0);
          return `${percentage}%`;
        },
        position: "outside",
        fontSize: 14,
        color: "#000",
      },
    },
  ],
});
</script>

<style scoped></style>
