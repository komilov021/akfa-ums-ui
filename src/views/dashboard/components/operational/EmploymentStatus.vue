<template>
  <div class="stat-card md:pt-4 flex flex-col">
    <div class="p-2 md:px-8">
      <p
        class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-base leading-6"
      >
        Overall Alumni Employment Status
      </p>
      <div class="flex items-center text-[#C8C7C7] text-[12.57px]">
        <div class="first-letter:uppercase">
          <span class="lowercase">
            {{ props.label ? props.label : "All" }}
          </span>
        </div>
      </div>
      <div class="relative">
        <v-chart
          class="h-[350px]"
          @click="handleChartClick"
          :option="chartOptions"
          autoresize
        />
      </div>
    </div>
    <div class="h-[1px] mt-2 bg-[#EAECF0]" />
    <div class="flex justify-end px-3 py-3">
      <el-dropdown>
        <el-button class="stat-btn">Choose program</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              class="!w-[300px] whitespace-normal break-words"
              @click="$emit('update', program)"
              v-for="program in programList"
              :key="program.value"
            >
              <span class="md:text-[14px] text-[12px] leading-0">{{
                program?.label
              }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <el-dialog
    v-model="showmodal"
    title="Employment Status"
    :width="dialogWidth"
    class="reset"
  >
    <div style="">
      <el-table
        :data="filteredStudents"
        row-class-name="noHover"
        style="width: 100%; height: 400px"
        class="whiteStripe"
      >
        <el-table-column label="Name" min-width="100" align="left">
          <template #default="{ row }">
            <div class="text-[10px] font-medium sm:font-normal sm:text-sm">
              {{ row?.first_name }} {{ row?.last_name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Employment" min-width="90" align="left">
          <template #default="{ row }">
            <div class="text-[10px] font-medium sm:font-normal sm:text-sm">
              {{ row.is_employed ? "Employed" : "Not Employed" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="workplace"
          label="Workplace"
          min-width="100"
          align="left"
        >
          <template #default="{ row }">
            <div class="text-[10px] font-medium sm:font-normal sm:text-sm">
              {{ row.workplace }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { ref, computed, onMounted } from "vue";
import { useGuideStore, useStatisticsStore } from "@/stores";

const program = useGuideStore();
const showmodal = ref(false);
const emits = defineEmits(["update"]);
// const colors = ["#6941C6", "#9E77ED", "#E9D7FE", "#42307D", "#6941C6"];
const props = defineProps<{
  data: any;
  label?: any;
}>();
const filteredStudents = ref<any[]>([]);
const programList = computed(() => program?.getTuitions);
const dialogWidth = ref(window.innerWidth > 580 ? "750px" : "95%");

const chartOptions = ref({
  legend: {
    orient: "horizontal",
    bottom: "5%",
    textStyle: { fontSize: 10, color: "#333" },
  },
  series: [
    {
      type: "pie",
      radius: "55%",
      data: [
        {
          value: props.data?.employed_percentage,
          name: "Employed",
          itemStyle: { color: "#9E77ED" },
        },
        {
          value: props.data?.not_employed_percentage,
          name: "Not Employed",
          itemStyle: { color: "#6941C6" },
        },
      ],
      labelLine: { show: true },
      label: { formatter: "{d}%", fontSize: 12, color: "#000" },
    },
  ],
});
const handleChartClick = (params: any) => {
  if (params.componentType === "series") {
    if (params.name === "Employed") {
      filteredStudents.value = props.data.employed_student_list.filter(
        (student: any) => student.is_employed
      );
    } else {
      filteredStudents.value = props.data.employed_student_list.filter(
        (student: any) => !student.is_employed
      );
    }
    showmodal.value = true;
  }
};
const updateDialogWidth = () => {
  dialogWidth.value = window.innerWidth > 580 ? "550px" : "370px";
};
onMounted(() => {
  if (!program.tuitions.length) {
    program.fetchTuitions();
  }
  window.addEventListener("resize", updateDialogWidth);
});
</script>

<style scoped></style>
