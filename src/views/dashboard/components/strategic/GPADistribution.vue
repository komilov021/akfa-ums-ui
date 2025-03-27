<template>
  <div class="stat-card flex flex-col space-y-4">
    <div class="p-2 md:px-8 md:py-4">
      <div class="flex justify-between flex-wrap gap-4">
        <div>
          <p
            class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-base leading-6"
          >
            GPA Distribution for active students
            {{ currentSchool?.label ? "of " + currentSchool?.label : "" }}
          </p>
          <div class="flex items-center text-[#C8C7C7] text-[12.57px]">
            <div>
              <!-- <span class="lowercase">{{ from_semester }}</span> -->
              last
            </div>
            <div>&nbsp;&nbsp;</div>
            <div>
              <span>semester</span>
            </div>
          </div>
        </div>
        <p class="font-semibold sm:text-sm text-xs sm:leading-6">
          Students with GPA - {{ total }}
          <br />
          Students without GPA -
          {{ $n(props.activeStudents.count_total - total) }}
        </p>
      </div>
      <div class="relative">
        <v-chart class="h-[320px]" :option="chartOptions" autoresize />
      </div>
      <div class="flex items-center justify-center gap-1">
        <div class="flex items-center gap-1 text-xs">
          <div class="w-[10px] h-[10px] bg-[#2F2F2F] rounded-full"></div>
          <span>0-1.99</span>
        </div>
        <div class="flex items-center gap-1 text-xs">
          <div class="w-[10px] h-[10px] bg-[#8039FF] rounded-full"></div>
          <span>2-2.99</span>
        </div>
        <div class="flex items-center gap-1 text-xs">
          <div class="w-[10px] h-[10px] bg-[#AA6CFF] rounded-full"></div>
          <span>3-3.99</span>
        </div>
        <div class="flex items-center gap-1 text-xs">
          <div class="w-[10px] h-[10px] bg-[#959595] rounded-full"></div>
          <span>4</span>
        </div>
      </div>
    </div>
    <div class="h-[1px] mt-2 bg-[#EAECF0]" />
    <div class="flex justify-end gap-2 px-3 pb-4">
      <!-- <SemestrFilter @on-submit="updateSemester" /> -->
      <el-dropdown>
        <el-button class="stat-btn">Choose school</el-button>
        <template #dropdown>
          <el-dropdown-menu class="h-48 ms:h-full">
            <el-dropdown-item
              @click="(selectedSchool_id = school.value), update()"
              v-for="(school, i) in [{ label: 'All', value: null }, ...schools]"
              :key="i"
              ><span class="md:text-[14px] text-[12px] leading-0">{{
                school.label
              }}</span></el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <!-- <div class="h-[1px] mt-2 bg-[#EAECF0]" />
    <div class="flex justify-end px-3 py-3 gap-2">
      <SemestrFilter @on-submit="updateSemester" />
      <el-dropdown>
        <el-button class="stat-btn">Choose level</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              @click="(currentLevel = level.value), update()"
              v-for="(level, i) in levels"
                :key="i"
              >{{ level.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { computed, ref, reactive } from "vue";
import { IGpaDistribution } from "@/models/backend";
import SemestrFilter from "../filters/SemestrFilter.vue";
import { useAcademicStore, useSchoolStore, useStatisticsStore } from "@/stores";
import { useWindowSize } from "@vueuse/core"; // Optional: For better screen size management

const { width } = useWindowSize(); // Responsive screen width

const barWidth = computed(() => {
  return width.value <= 768 ? "12px" : "19px"; // Smaller width for mobile, larger for desktop
});
const schoolStore = useSchoolStore();
const statisticsStore = useStatisticsStore();
const schools = computed(() => schoolStore.getSchoolsSelct);
const emits = defineEmits(["update"]);
const examDatesStore = useAcademicStore();
const selectedSchool_id = ref();
const props = defineProps<{
  data?: IGpaDistribution[];
  gpaDistributionFilter: {
    from_semester: number;
    to_semester: number;
    school_id: string;
  };
  activeStudents: {
    count_total: number;
  };
}>();
const semestrs = reactive({
  from_semester: statisticsStore.getFilters.semestrs?.from,
  to_semester: statisticsStore.getFilters.semestrs?.to,
});
const currentSchool = computed(
  () =>
    schools.value.filter(
      (x: any) => x.value == props.gpaDistributionFilter.school_id
    )[0]
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
const total = computed(() =>
  props.data
    ? props.data?.reduce((sum, obj: any) => {
        return (
          sum +
          Object.keys(obj).reduce((acc, key) => {
            return key !== "level" ? acc + obj[key] : acc;
          }, 0)
        );
      }, 0)
    : 0
);
const currentSemesters = ref();
const currentLevel = ref();
const activeSemesters = ref();
const from_semester = computed(() => {
  const sem = examDatesStore.semestrs.find(
    (item) => item.row_number == props.gpaDistributionFilter?.from_semester
  );
  return `${sem?.name} ${sem?.year}`;
});
const to_semester = computed(() => {
  const sem = examDatesStore.semestrs.find(
    (item) => item.row_number == props.gpaDistributionFilter?.to_semester
  );
  return `${sem?.name} ${sem?.year}`;
});
const chartOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: "{c}",
  },
  xAxis: {
    data: props.data?.map((item) => `Level ${item.level}`),
    type: "category",
    axisLabel: {
      interval: 0,
      rotate: 0,
      fontSize: "9px",
      width: 90,
      overflow: "truncate",
      margin: 10,
    },
  },
  grid: {
    left: "12%",
    bottom: "10%",
    right: "5%",
    top: "10%",
  },
  yAxis: {},
  series: [
    {
      type: "bar",
      data: props.data?.map((item) => item["0-1.99"]),
      barWidth: barWidth.value,
      label: {
        show: true,
        position: "top",
        fontSize: 10,
      },
      itemStyle: {
        color: "#2F2F2F",
        shadowColor: "#91cc75",
        fontSize: "6px",
        borderType: "dashed",
        opacity: 1,
        borderRadius: 2,
      },
    },
    {
      type: "bar",
      data: props.data?.map((item) => item["2-2.99"]),
      barWidth: barWidth.value,
      label: {
        show: true,
        position: "top",
        fontSize: 10,
      },
      itemStyle: {
        color: "#8039FF",
        shadowColor: "#91cc75",
        fontSize: "6px",
        borderType: "dashed",
        opacity: 1,
        borderRadius: 2,
      },
    },
    {
      type: "bar",
      data: props.data?.map((item) => item["3-3.99"]),
      barWidth: barWidth.value,
      label: {
        show: true,
        position: "top",
        fontSize: 10,
      },
      itemStyle: {
        color: "#AA6CFF",
        shadowColor: "#91cc75",
        borderType: "dashed",
        fontSize: "6px",
        opacity: 1,
        borderRadius: 2,
      },
    },
    {
      type: "bar",
      data: props.data?.map((item) => item["4-4.3"]),
      barWidth: barWidth.value,
      label: {
        show: true,
        position: "top",
        fontSize: 10,
      },
      itemStyle: {
        color: "#959595",
        shadowColor: "#91cc75",
        fontSize: "6px",
        borderType: "dashed",
        opacity: 1,
        borderRadius: 2,
      },
    },
  ],
});

// const update = () => {
//   emits("update", {
//     level: currentLevel.value,
//     ...currentSemesters.value,
//   });
// };
const update = () => {
  const data2 = {
    ...activeSemesters.value,
    school_id: selectedSchool_id.value,
  };
  emits("update", data2);
};
const updateSemester = (data: any) => {
  console.log(currentLevel.value);
  activeSemesters.value = {
    from_semester: parseInt(data?.from_semester),
    to_semester: parseInt(data?.to_semester),
  };
  const data2 = {
    from_semester: parseInt(data?.from_semester),
    to_semester: parseInt(data?.to_semester),
    school_id: selectedSchool_id.value,
  };
  emits("update", data2);
};
</script>

<style scoped></style>
