<template>
  <div class="p-2 md:p-6 flex flex-col w-full mx-auto md:w-full">
    <p
      class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-base leading-6"
    >
      Student statuses: {{ chooseSchool ? chooseSchool : "All school" }}
    </p>
    <div class="flex flex-col space-y-4 grow">
      <div class="space-y-4">
        <v-chart class="h-64" :option="chartOptions" autoresize />
        <h1
          class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-lg 2xl:text-xl"
        >
          Total - {{ total }}
        </h1>
      </div>
      <div class="h-[1px] mt-2 bg-[#EAECF0]" />
      <div class="flex justify-end gap-2 px-3 pb-4">
        <el-dropdown>
          <el-button class="stat-btn">Choose school</el-button>
          <template #dropdown>
            <el-dropdown-menu class="h-48 md:h-full">
              <el-dropdown-item
                @click="
                  $emit('update', school.value), (currentSchool = school.value)
                "
                v-for="(school, i) in [
                  { value: null, label: 'All' },
                  ...schools,
                ]"
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
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { computed, ref, onMounted, watch } from "vue";
import type { IApplicationBySchool } from "@/models/backend";
import { useSchoolStore } from "@/stores";
const emit = defineEmits(["update"]);
const schoolStore = useSchoolStore();
const studentStatusFilter = ref();
const currentSchool = ref<any>();
const checkData = {
  module_retriever: {},
};
const schools = computed(() => schoolStore.getSchoolsSelct);
const props = defineProps<{
  data?: any;
}>();

const fetched = ref(false);
const chooseSchool = computed(
  () =>
    schools.value?.filter(
      (school: any) => school?.value == currentSchool.value
    )[0]?.label
);
const statuses = ref([
  {
    name: "Progress",
    key: "progress",
    count: 0,
  },
  {
    name: "Progress trailing",
    key: "progress_trailing_credits",
    count: 633,
  },
  {
    name: "Module retriever",
    key: "module_retriever",
    count: 269,
  },
]);

const total = computed(() =>
  formattedVal.value.reduce((sum, item) => sum + item.count, 0)
);

const colors = [
  "#9E77ED",
  "#aa8ced",
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

const formattedVal = computed(() =>
  Object.keys(props.data)
    .map((item) => {
      return {
        count: props.data[item],
        title: item,
      };
    })
    .sort((a, b) => b.count - a.count)
);

const chartOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: "{a}",
  },
  xAxis: {
    type: "value",
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
  },
  series: [],
});
const check: any = {
  module_retriever: "Module Retriever",
  progress: "Progress",
  progress_trailing_credits: "Progress Trailing",
};
watch(
  formattedVal,
  (newVal) => {
    chartOptions.value.series = newVal.map((item, index) => ({
      type: "bar",
      name: `${check[item.title]} - ${item.count}`,
      data: [item.count],
      barWidth: "26px",
      barGap: "0%",
      label: labelOption,
      itemStyle: {
        color: colors[index % colors.length],
        borderRadius: 5,
        opacity: 1,
      },
    })) as any;
  },
  { immediate: true }
);
</script>

<style scoped></style>
