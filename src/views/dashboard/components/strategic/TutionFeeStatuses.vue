<template>
  <div class="stat-card p-2 md:px-8 md:pt-4 md:pb-1 flex flex-col space-y-4">
    <div class="flex flex-col space-y-1">
      <div class="flex items-center justify-between gap-2">
        <p
          class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-base leading-none"
        >
          Payments & debts of students
        </p>
        <!-- <el-input
            v-model="value"
            size="small"
            :formatter="(val: any) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            "
            round
            :parser="(val: any) => val.replace(/\$\s?|(,*)/g, '')"
            placeholder="Exchange rate"
            v-mask="'########'"
            class="!w-40 custom"
            maxlength="6"
            @keyup.enter="update()"
            clearable
            @clear="update()"
          /> -->
      </div>
      <div class="flex items-center text-[#C8C7C7] text-[12.57px]">
        <div class="first-letter:uppercase">
          <span class=""
            >Fall 2024 /
            {{ gpaPaymentFilter.level ? gpaPaymentFilter.level : "All" }}
            level /
            {{ gpaPaymentFilter.school_id ? currentSchool : "All schools" }}
          </span>
        </div>
      </div>
    </div>
    <div class="relative w-full">
      <v-chart
        :option="chartOptions"
        autoresize
        class="h-[120px] sm:h-[130px]"
      />
    </div>
    <div class="flex justify-end p-1 gap-2 sm:pt-4">
      <el-dropdown>
        <el-button class="stat-btn">Choose school</el-button>
        <template #dropdown>
          <el-dropdown-menu class="h-48 md:h-full">
            <el-dropdown-item
              @click="(activeSchool = school.value), update()"
              v-for="(school, i) in [{ label: 'All', value: null }, ...schools]"
              :key="i"
              ><span class="md:text-[14px] text-[12px] leading-0">{{
                school.label
              }}</span></el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown>
        <el-button class="stat-btn">Choose level</el-button>
        <template #dropdown>
          <el-dropdown-menu class="">
            <el-dropdown-item
              @click="(activeLevel = level.value), update()"
              v-for="(level, i) in levels"
              :key="i"
            >
              <span class="md:text-[14px] text-[12px] leading-0">{{
                level.label
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
import { useSchoolStore } from "@/stores";
import { computed, onMounted, ref } from "vue";
const schoolStore = useSchoolStore();
const schools = computed(() => schoolStore.getSchoolsSelct);
const props = defineProps<{
  financeMetrics?: any;
  gpaPaymentFilter: any;
}>();
const emit = defineEmits(["update"]);
const colors = ["#6941c6", "#6c6c6c", "red", "#44444E"];
const value = ref();
const activeSchool = ref();
const currentSchool = computed(
  () =>
    schools.value.filter(
      (x: any) => x.value === props.gpaPaymentFilter.school_id
    )[0].label
);
const fontSizeLabel = computed(() => (window.innerWidth > 640 ? 12 : 10));
const activeLevel = ref();
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
const chartOptions = {
  tooltip: {
    trigger: "item",
    axisPointer: {
      type: "shadow",
    },
    position: "bottom",
    formatter: (params: any) =>
      //   console.log(props.financeMetrics[params.seriesName.toLowerCase()]),

      `<div class="font-base text-[10px] md:text-[14px] leading-none">
      ${params.seriesName} - ${formatter(params.value)}
      `,
    // <br />
    // <br />
    // Student count - ${props.financeMetrics[params.seriesName.toLowerCase()]?.[0]?.total_count | 0}</div>
  },
  //   <br />
  //       <br />
  //         Student ratio - ${
  //           props.financeMetrics[params.seriesName.toLowerCase()]?.[0]
  //             ?.student_ratio | 0
  //         }
  legend: {
    orient: "horizontal",
    right: "5%",
    itemGap: 10,
    textStyle: {
      fontSize: 10,
      color: "#333",
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "value",
    show: window.innerWidth > 640 ? true : false,
  },
  yAxis: {
    type: "category",
    show: false,
    // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  series: [
    {
      name: "Paid",
      type: "bar",
      stack: "total",
      label: {
        position: "top",
        fontSize: fontSizeLabel.value,
        show: true,
        formatter: (d: any) => formatter(d.value),
      },
      emphasis: {
        focus: "series",
      },
      itemStyle: {
        color: colors[0],
        borderRadius: [15, 0, 0, 15],
        opacity: 1,
      },
      data: props.financeMetrics?.paid?.map((item: any) => item.paid),
      other: props.financeMetrics?.paid,
    },
    {
      name: "Dept",
      type: "bar",
      stack: "total",
      label: {
        position: "top",
        fontSize: fontSizeLabel.value,
        show: true,
        formatter: (d: any) => formatter(d.value),
      },
      itemStyle: {
        color: colors[1],
        // borderRadius: [15, 15],
        opacity: 1,
      },
      emphasis: {
        focus: "series",
      },
      data: props.financeMetrics?.dept?.map((item: any) => item.dept),
      other: props.financeMetrics?.dept,
    },
    {
      name: "Overpaid",
      type: "bar",
      stack: "total",
      label: {
        // position: "top",
        fontSize: fontSizeLabel.value,
        show: true,
        formatter: (d: any) => formatter(d.value),
      },
      itemStyle: {
        color: colors[2],
        borderRadius: [0, 15, 15, 0],
        opacity: 1,
      },
      emphasis: {
        focus: "series",
      },
      data: props.financeMetrics?.overpaid?.map((item: any) => item.overpaid),
      other: props.financeMetrics?.overpaid,
    },
    {
      //   name: "Revenue",
      type: "bar",
      stack: "total",
      label: {
        position: "top",
        fontSize: fontSizeLabel.value,
        show: true,
        fontWeight: 900,
        formatter: (d: any) =>
          formatter(props.financeMetrics?.revenue[0].revenue),
      },
      tooltip: {
        show: false,
      },
      itemStyle: {
        color: colors[3],
        borderRadius: [0, 15, 15, 0],
        opacity: 1,
      },
      emphasis: {
        focus: "series",
      },
      data: [0],
      other: props.financeMetrics?.revenue,
    },
  ],
};

const formatter = (val: any) => {
  const data = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: Math.trunc(Math.abs(val)).toFixed().length,
  }).format(val);
  return data;
};
const update = () => {
  emit("update", {
    range: value.value.replace(/\$\s?|(,*)/g, ""),
    level: activeLevel.value,
    school_id: activeSchool.value,
  });
};
onMounted(() => {
  const val = 12700;
  value.value = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});
</script>

<style lang="scss" scoped>
.stat-card {
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #c8c7c7;
  cursor: pointer;

  &-active {
    border: 3px solid #787878;
  }
}

.stat-btn {
  border: 1px solid #d0d5dd;
  color: #344054;
  font-size: 9.27px;
  font-weight: 600;
  border-radius: 5.3px;
  height: 27.25px;
  padding: 6.62px 9.27px;
}
</style>
<style>
.custom-progress .el-progress-bar__outer {
  border-radius: 8px !important;
}

.custom-progress .el-progress-bar__inner {
  border-radius: 8px !important;
}

.custom .el-input__wrapper {
  border-radius: 5.3px;
  /* Adjust the border radius as needed */
}

.progress-bar {
  width: 100%;
  height: 32px;
  background-color: #ccc;
  border-radius: 8px;
  overflow: hidden;
}

.progress-bar-inner {
  height: 100%;
  display: flex;
}

.progress-segment {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  overflow: hidden;
}
</style>
