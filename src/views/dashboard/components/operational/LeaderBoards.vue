<template>
  <div class="stat-card flex flex-col space-y-4">
    <div class="p-2 md:px-8 md:py-4">
      <div class="flex flex-col gap-1">
        <p class="font-semibold text-sm md:text-lg 2xl:text-xl !leading-sm">
          Leaderboard by Edupoints (Top-20 students and their amount of
          EduPoints)
        </p>
        <div class="flex items-center text-[#C8C7C7] text-[12.57px]">
          <div class="first-letter:uppercase">
            <span class="lowercase">
              {{ level?.school_type ? level?.school_type : "All School" }}
            </span>
          </div>
        </div>
      </div>
      <v-chart :option="chartOptions" autoresize class="h-[540px]" />
    </div>
    <div class="h-[1px] mt-2 bg-[#EAECF0]" />
    <div class="flex justify-end gap-2 px-3 pb-4">
      <el-dropdown>
        <el-button class="stat-btn">Choose school</el-button>
        <template #dropdown>
          <el-dropdown-menu class="h-48 md:h-full">
            <el-dropdown-item
              @click="(selectedSchool_id = school.label), update()"
              v-for="(school, i) in schools"
              :key="i"
              ><span class="md:text-[14px] text-[12px] leading-0">{{
                school.label
              }}</span></el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { computed, ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useAcademicStore, useSchoolStore, useStatisticsStore } from "@/stores";
import { color } from "echarts/core";

const emit = defineEmits(["update"]);
const schoolStore = useSchoolStore();
const statisticsStore = useStatisticsStore();
const { n } = useI18n();
const examDatesStore = useAcademicStore();
const selectedSchool_id = ref();
const schools = computed(() => schoolStore.getSchoolsSelct);

const props = defineProps<{
  data?: any[];
  level?: any;
}>();

const colors = [
  "#3D00CB",
  "#5D2FC6",
  "#7959C3",
  "#8A6AD5",
  "#9A75F2",
  "#B99CFF",
  "#D4C2FF",
  "#D6CBEF",
  "#E6E0F5",
  "#F0ECF7",
];

const labelOption = {
  show: true,
  align: "left",
  verticalAlign: "middle",
  position: "insideLeft",
  distance: 20,
  formatter: "{name|{a}}",
  fontSize: 16,
  color: "#000",
  rich: {
    name: {},
  },
};

const chartOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: (params: any) => n(Number(params.data || 0)) + " Point",
  },
  xAxis: {
    type: "value",
    // boundaryGap: [0, 0.1],
  },
  grid: {
    left: "2%",
    bottom: "7%",
    right: "5%",
    top: "5%",
    containLabel: false,
  },
  yAxis: {
    show: false,
    type: "category",
    data: ["Students"],
  },
  series: props.data?.map((item, index) => ({
    type: "bar",
    name: `${item.first_name} ${item.last_name} - ${parseFloat(
      item.gem
    )} Points`,
    data: [parseFloat(item.gem)],
    barWidth: "24px",
    barGap: "0%",
    label: {
      ...labelOption,
      show: true,
      // color: "black",
      fontWeight: 900,
      fontSize: 12,
      formatter: (params: any) => `${params.seriesName}`,
    },
    itemStyle: {
      color: colors[index],
      borderRadius: 5,
      borderType: "dashed",
      opacity: 1,
    },
  })),
});

const update = () => {
  const data2 = {
    school_type: selectedSchool_id.value,
  };
  emit("update", data2);
};
</script>

<style></style>
