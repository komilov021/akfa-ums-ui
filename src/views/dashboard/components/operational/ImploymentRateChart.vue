<template>
  <div class="stat-card flex flex-col space-y-4">
    <div class="p-2 md:px-8 md:py-4 relative">
      <div class="flex flex-col gap-1">
        <p class="font-semibold text-sm md:text-lg 2xl:text-xl !leading-sm">
          Employment Rate
        </p>
        <div class="flex items-center text-[#C8C7C7] text-[12.57px]">
          <div class="first-letter:uppercase">
            <span class="lowercase">
              {{ getcurrentSchool ? getcurrentSchool : "All" }}
            </span>
          </div>
        </div>
      </div>
      <div
        class="flex items-center justify-between relative top-12 sm:ml-[0%] w-[95%]"
      >
        <p class="text-[#666] text-xs md:ml-[30%] ml-[19%] font-semibold">
          Students
        </p>
        <p class="text-[#666] text-xs font-semibold">Avg.salary</p>
      </div>
      <v-chart :option="chartOptions" autoresize class="h-[400px]" />
    </div>
    <div class="h-[1px] mt-2 bg-[#EAECF0]" />
    <div class="flex justify-end gap-2 px-3 pb-4">
      <el-dropdown>
        <el-button class="stat-btn">Choose school</el-button>
        <template #dropdown>
          <el-dropdown-menu class="h-48 md:h-full">
            <el-dropdown-item
              v-for="(school, i) in [{ label: 'All', value: null }, ...schools]"
              :key="i"
              :value="school.value"
              ><span
                class="md:text-[14px] text-[12px] leading-0"
                @click="
                  (selectedSchool_id = school.value),
                    (currentschool = school),
                    update()
                "
                >{{ school.label }}</span
              ></el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { computed, reactive, ref } from "vue";
import { useSchoolStore } from "@/stores";
const emit = defineEmits(["update"]);
const schoolStore = useSchoolStore();
const selectedSchool_id = ref();
const schools = computed(() => schoolStore.getSchoolsSelct);
const props = defineProps<{
  data: Array<{
    project_name: string;
    student_count: number;
    avg_salary: number;
  }>;
  school?: any;
}>();
const getcurrentSchool = computed(
  () =>
    schools.value.find((school: any) => school.value == props.school?.school_id)
      ?.label
);
const departments = computed(() =>
  props?.data.map((item) => item.project_name)
);
const currentschool = ref();
const counts = computed(() => props?.data.map((item) => item.student_count));
const values1 = computed(() => props?.data.map((item) => item.avg_salary));
const chartOptions = reactive({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "value",
      name: "",
      position: "bottom",
      min: 0,
      max: 15,
      interval: 3,
      axisLabel: {
        formatter: "{value}",
        // color: "#475467"
      },
      boundaryGap: [0, 0.01],
    },
  ],
  yAxis: [
    {
      type: "category",
      data: departments.value,
      axisLabel: {
        interval: 0,
        fontSize: 9,
      },
    },
    {
      type: "category",
      data: values1.value,
      axisLabel: {
        interval: 0,
        fontSize: 9,
      },
    },
  ],
  series: [
    {
      name: "Student",
      type: "bar",
      data: counts.value,

      stack: "one",
      itemStyle: {
        color: "#6326B7",
      },
      label: {
        show: true,
        position: "insideLeft",
        fontSize: 10,
        formatter: function (params: any) {
          return `${params.value}`;
        },
        rich: {
          count: {
            color: "#ffffff",
            borderColor: "transparent",
            borderWidth: 0,
          },
        },
      },
      xAxisIndex: 0,
      yAxisIndex: 0,
    },
  ],
});

const update = () => {
  const data2 = {
    school_id: selectedSchool_id.value,
  };
  emit("update", data2);
};
</script>

<style scoped></style>
