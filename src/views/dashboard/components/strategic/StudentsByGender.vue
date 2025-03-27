<template>
  <div class="stat-card md:pt-4 flex flex-col w-full">
    <div class="px-4 flex-1">
      <p
        class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-base leading-6 mt-2 sm:mt-3"
      >
        Students by gender
      </p>
      <div class="flex items-center text-[#C8C7C7] text-[12.57px]">
        <div class="first-letter:uppercase">
          <span class="lowercase"
            >In all time / {{ level ? level : "All level" }}</span
          >
        </div>
      </div>
      <div class="grid md:grid-cols-2 grid-cols-1">
        <div>
          <v-chart
            v-if="props.data"
            class="h-60 mx-auto"
            :option="chartOptions"
            autoresize
          />
          <div v-else class="p-2">
            <el-skeleton :rows="4" animated />
          </div>
        </div>
        <div class="flex items-center justify-center md:px-2">
          <div class="flex flex-col items-start flex-wrap gap-4 font-semibold">
            <div class="flex items-center space-x-2">
              <div class="w-5 h-5 rounded-full bg-[#8039FF]"></div>
              <span class="text-xs 2xl:text-base">Male - {{ maleCount }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-5 h-5 rounded-full bg-[#2F2F2F]"></div>
              <span class="text-xs 2xl:text-base"
                >Female - {{ femaleCount }}</span
              >
            </div>
            <!-- <div class="flex items-center space-x-2">
              <div class="w-5 h-5 rounded-full bg-[#EAECF0]"></div>
              <span class="text-xs 2xl:text-base">Not set - {{ not_set }}</span>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="h-[1px] mt-2 bg-[#EAECF0]" />
      <div class="flex justify-end px-3 py-3">
        <el-dropdown>
          <el-button class="stat-btn">Choose level</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                @click="updateCurrentLevel(level)"
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
import { ref, computed, onMounted } from "vue";
import type { IStudentByGender } from "@/models/backend";

const props = defineProps<{
  data?: IStudentByGender | null;
  level?: any;
}>();
const emits = defineEmits(["update"]);
const maleCount = computed(() => props.data?.male.sum || 0);
const femaleCount = computed(() => props.data?.female.sum || 0);
const not_set = computed(() => props.data?.not_set.sum || 0);
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
const currentLevel = ref(null);
const maleTooltip = computed(() =>
  props?.data?.male.programs
    ?.map(
      (item) =>
        `<span class="leading-none font-base text-[12px] md:text-[14px]">${item.school_name} - ${item.total}</span><br>`
    )
    .join("")
);
const femaleTooltip = computed(() =>
  props?.data?.female?.programs
    ?.map(
      (item) =>
        `<span class="leading-none font-base text-[12px] md:text-[14px]">${item.school_name} - ${item.total}</span><br>`
    )
    .join("")
);
const not_setTooltip = computed(() =>
  props?.data?.not_set?.programs
    ?.map(
      (item) =>
        `<span class="leading-none font-base text-[5px] md:text-[14px]">${item.school_name} - ${item.total}</span><br>`
    )
    .join("")
);
const colors = ["#8039FF", "#2F2F2F", "#AA6CFF", "#E5E5E5"];

const chartOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: (params: any) => {
      // if (params.name === "Not set") {
      //   return not_setTooltip.value;
      // }
      // else {
      return params.name === "Male" ? maleTooltip.value : femaleTooltip.value;
      // }
    },
  },
  color: colors,
  series: [
    {
      name: "Applications",
      type: "pie",
      label: {
        formatter: "{c}%",
        position: "outside",
        fontSize: 14,
        color: "#000",
      },
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
      radius: ["40%", "70%"],
      data: [
        {
          name: "Male",
          value: Math.round(
            (maleCount?.value * 100) /
              (maleCount?.value + (not_set?.value + femaleCount.value))
          ),
          type: "male",
        },
        {
          name: "Female",
          value: Math.round(
            (femaleCount?.value * 100) /
              (femaleCount?.value + (not_set?.value + maleCount.value))
          ),
          type: "female",
        },
        // {
        //   name: "Not set",
        //   value: Math.round(
        //     (not_set?.value * 100) /
        //       (not_set?.value + (femaleCount?.value + maleCount.value))
        //   ),
        //   type: "not_set",
        // },
      ],
    },
  ],
});
const updateCurrentLevel = (level: any) => {
  emits("update", level);
};
onMounted(() => {});
</script>

<style scoped></style>
