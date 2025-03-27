<template>
  <div class="stat-card flex flex-col space-y-4">
    <div class="p-2 md:px-8 md:py-4">
      <div class="flex flex-col gap-1">
        <p class="font-semibold text-sm sm:text-base sm:leading-6">
          Top 10 students in GPA for
          {{ currentSchool?.label ? currentSchool?.label : "all schools" }}
        </p>
        <div class="flex items-center text-[#C8C7C7] text-[12.57px]">
          <div class="">
            <!-- first-letter:uppercase -->
            <!-- <span class="lowercase">{{ from_semester }}</span> -->
            <span class="">last </span>
          </div>
          <div>&nbsp;&nbsp;</div>
          <div class="">
            <!-- <span class="lowercase">{{ to_semester }}</span> -->
            <span class=""> semester</span>
          </div>
        </div>
      </div>
      <v-chart :option="chartOptions" autoresize class="h-[330px]" />
    </div>
    <div class="h-[1px] mt-2 bg-[#EAECF0]" />
    <div class="flex justify-end gap-2 px-3 pb-4">
      <!-- <SemestrFilter @on-submit="updateSemester" :semesters="semestrs" /> -->
      <el-dropdown>
        <el-button class="stat-btn">Choose school</el-button>
        <template #dropdown>
          <el-dropdown-menu class="h-48 md:h-full">
            <el-dropdown-item
              @click="(selectedSchool = school.value), update()"
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
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { computed, ref, reactive } from "vue";
import { ITopStudentByGpa } from "@/models/backend";
import { useI18n } from "vue-i18n";
import { useAcademicStore, useSchoolStore, useStatisticsStore } from "@/stores";
import { Setting } from "@element-plus/icons-vue";
import SemestrFilter from "../filters/SemestrFilter.vue";

const emit = defineEmits(["update"]);
const schoolStore = useSchoolStore();
const statisticsStore = useStatisticsStore();
const { n } = useI18n();
const examDatesStore = useAcademicStore();
const selectedSchool = ref();
const schools = computed(() => schoolStore.getSchoolsSelct);
const semestrs = reactive({
  from_semester: statisticsStore.getFilters.semestrs?.from,
  to_semester: statisticsStore.getFilters.semestrs?.to,
});
const currentSchool = computed(
  () =>
    schools.value.filter(
      (x: any) => x.value == props.topTenStudentFilter.school_id
    )[0]
);
const activeSemesters = ref();
const from_semester = computed(() => {
  const sem = examDatesStore.semestrs.find(
    (item) => item.row_number == props.topTenStudentFilter?.from_semester
  );
  return `${sem?.name} ${sem?.year}`;
});
const to_semester = computed(() => {
  const sem = examDatesStore.semestrs.find(
    (item) => item.row_number == props.topTenStudentFilter?.to_semester
  );
  return `${sem?.name} ${sem?.year}`;
});

const props = defineProps<{
  data?: ITopStudentByGpa[];
  topTenStudentFilter: {
    from_semester: number;
    to_semester: number;
    school_id: string | undefined;
  };
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
  distance: 15,
  formatter: "{name|{a}}",
  fontSize: 16,
  rich: {
    name: {},
  },
};

const chartOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: (params: any) => n(Number(params.data || 0)) + " GPA",
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
    name: `${item.first_name} ${item.last_name} - ${item.avg_gpa} ${item.school_info?.name}`,
    // label: {
    //   show: false,
    // },
    data: [item.avg_gpa],
    barWidth: "24px",
    barGap: "0%",
    label: labelOption,
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
    ...activeSemesters.value,
    school_id: selectedSchool.value,
  };
  emit("update", data2);
};
const updateSemester = (data: any) => {
  activeSemesters.value = {
    from_semester: parseInt(data?.from_semester),
    to_semester: parseInt(data?.to_semester),
  };
  const data2 = {
    from_semester: parseInt(data?.from_semester),
    to_semester: parseInt(data?.to_semester),
    school_id: selectedSchool.value,
  };
  emit("update", data2);
};
</script>

<style></style>
