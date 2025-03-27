<template>
  <div class="stat-card md:pt-4 flex flex-col w-full mb-8 md:mb-0">
    <div class="px-4 flex-1">
      <p
        class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-base leading-6 mt-2 sm:mt-0"
      >
        Students with retakes ratio
      </p>
      <div class="flex items-center text-[#C8C7C7] text-[12.57px]">
        <div class="first-letter:uppercase">
          <span
            >In all time

            <span class="!first-letter:!uppercase">{{
              studentRatekRadio?.level
                ? "/ Level " + studentRatekRadio?.level
                : "/ All level"
            }}</span>
            {{
              currentSchool?.label
                ? "/ " + currentSchool?.label
                : "/ All schools"
            }}
          </span>
        </div>
      </div>
      <div>
        <v-chart
          v-if="props.data"
          class="h-80 mx-auto"
          :option="chartOptions"
          autoresize
        />
        <div v-else class="p-2">
          <el-skeleton :rows="4" animated />
        </div>
        <!-- <div
          class="flex items-center gap-2 justify-center md:px-4 font-semibold"
        >
          <div class="flex items-center space-x-2">
            <div class="w-5 h-5 rounded-full bg-primary"></div>
            <span class="text-xs 2xl:text-base">1 retake</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-5 h-5 rounded-full bg-primary-300"></div>
            <span class="text-xs 2xl:text-base">2 retake</span>
          </div>
        </div> -->
      </div>
    </div>
    <div>
      <div class="h-[1px] mt-2 bg-[#EAECF0]" />
      <div class="flex justify-end px-3 py-3 gap-2">
        <el-dropdown>
          <el-button class="stat-btn">Choose school</el-button>
          <template #dropdown>
            <el-dropdown-menu class="h-48 md:h-full">
              <el-dropdown-item
                @click="(filterSchool = school.value), updateSchool()"
                v-for="(school, i) in [
                  { value: null, label: 'All' },
                  ...schools,
                ]"
                :key="i"
              >
                <span class="md:text-[14px] text-[12px] leading-0">{{
                  school.label
                }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown>
          <el-button class="stat-btn">Choose level</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                @click="(filterLevel = level.value), updateSchool()"
                v-for="(level, i) in levels"
                :key="i"
                ><span class="md:text-[14px] text-[12px] leading-0">{{
                  level.label
                }}</span></el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import type { IStudentRetakeRatio } from "@/models/backend";
import { useSchoolStore } from "@/stores";
const schoolStore = useSchoolStore();
const schools = computed(() => schoolStore.getSchoolsSelct);
const props = defineProps<{
  data?: IStudentRetakeRatio[] | null;
  studentRatekRadio?: any;
}>();
const filterLevel = ref<string | any>();
const filterSchool = ref<string | any>();
const currentSchool = computed(() =>
  schools.value.find(
    (school: any) => school.value == props?.studentRatekRadio?.school_id
  )
);
const levels = [
  {
    value: null,
    label: "All level",
  },
  {
    value: 1,
    label: "Level 1",
  },
  {
    value: 2,
    label: "Level 2",
  },
  {
    value: 3,
    label: "Level 3",
  },
  {
    value: 4,
    label: "Level 4",
  },
  {
    value: 5,
    label: "Level 5",
  },
  {
    value: 6,
    label: "Level 6",
  },
];
const barWidth = ref("14px");
const emits = defineEmits(["update"]);
const colors = [
  "#7F56D9",
  "#9E77ED",
  "#EAECF0",
  "#9E77ED",
  "#EAECF0",
  "#7F56D9",
  "#9E77ED",
  "#EAECF0",
  "#7F56D9",
  "#9E77ED",
  "#EAECF0",
  "#9E77ED",
  "#EAECF0",
  "#7F56D9",
  "#9E77ED",
  "#EAECF0",
];
// const Tooltip = (dataIndex: number) => {
//   return props?.data?.[dataIndex].programs
//     ?.map(
//       (item: any) =>
//         `<span class="font-base text-[8px] sm:text-[10px] md:text-[13px] whitespace-normal">${item.program} - ${item.count} </span><br>`
//     )
//     .join("");
// };
const chartOptions = ref({
  // tooltip: {
  //   position: "right",
  //   trigger: "item",
  //   formatter: (params: any) => {
  //     return Tooltip(params.dataIndex);
  //   },
  // },
  color: colors,
  xAxis: {
    data: props.data?.map((item) => item.fail_count_number),
    type: "category",
    name: "Retakes", // Add custom text here
    nameLocation: "middle", // Position the custom text
    nameGap: 30, // Adjust gap between custom text and axis labels
    axisLabel: {
      interval: 0,
      rotate: 0,
      fontSize: "12px",
      width: 90,
      overflow: "truncate",
    },
  },
  grid: {
    left: "13%",
    bottom: "10%",
    right: "7%",
    top: "10%",
  },
  yAxis: {},
  series: [
    {
      data: props?.data?.map((item: any, index) => ({
        value: item.total_fails_count,
        itemStyle: {
          color: colors[index],
          shadowColor: "#91cc75",
          borderType: "dashed",
          opacity: 1,
          borderRadius: 2,
        },
      })),
      barWidth: "14px",
      label: {
        show: true,
        formatter: "{c}",
        position: "top",
      },
      type: "bar",
    },
  ],
});

const updateSchool = () => {
  emits("update", {
    school_id: filterSchool.value,
    level: filterLevel.value,
  });
};

const updateBarWidth = () => {
  barWidth.value = window.innerWidth < 768 ? "8px" : "14px"; // Adjust as needed
};
watch(barWidth, (newWidth: string) => {
  chartOptions.value.series[0].barWidth = newWidth;
});
onMounted(() => {
  updateBarWidth();
  window.addEventListener("resize", updateBarWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateBarWidth);
});
</script>

<style scoped></style>
