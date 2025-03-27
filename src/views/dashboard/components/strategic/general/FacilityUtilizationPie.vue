<template>
  <div>
    <div class="flex relative">
      <div class="absolute top-[-10px] sm:right-10 sm:h-full">
        <div
          class="flex justify-center flex-wrap gap-1 sm:gap-0.5 sm:flex-col sm:h-full"
        >
          <div
            class="flex items-center gap-1"
            v-for="(data, i) in reverseData"
            :key="i"
          >
            <span
              class="w-2 h-2 rounded-full"
              :style="`background: ${colors[reverseData.length - 1 - i]};`"
            ></span>
            <p class="font-medium text-[10px] sm:text-xs">{{ data.name }}</p>
          </div>
        </div>
      </div>
      <v-chart
        class="h-[370px] mx-auto"
        :option="chartOptions"
        autoresize
        @click="onBarClick"
      />
    </div>
    <el-dialog
      v-model="isModalVisible"
      title="Room Details"
      :width="innerWidth > 640 ? '450px' : '90%'"
    >
      <div v-if="selectedRoom">
        <p><strong>Name:</strong> {{ selectedRoom.name }}</p>
        <p>
          <strong>Average Occupancy:</strong>
          {{ selectedRoom.average_occupied_percentage_per_room_type }}%
        </p>
        <el-table
          :data="selectedRoom.rooms"
          :default-sort="{
            prop: 'occupied_room_percentage',
            order: 'descending',
          }"
          class="w-full mt-5"
        >
          <el-table-column
            prop="code"
            label="Room code"
            align="center"
            min-width="80"
          />
          <el-table-column
            prop="occupied_room_percentage"
            label="Percentage"
            sortable
            align="center"
            min-width="100"
          >
            <template #default="{ row }">
              {{ row.occupied_room_percentage }}%
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import { ref, computed, onMounted } from "vue";
import { ElDialog } from "element-plus";
const innerWidth = computed(() => window.innerWidth);
const props = defineProps<{
  data?: {
    name: string;
    average_occupied_percentage_per_room_type: number;
    rooms: any[];
  }[];
}>();

const showChart = ref(false);
const isModalVisible = ref(false);
const selectedRoom = ref<any>(null);

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
].reverse();

const sortedData = computed(() => {
  return props.data
    ? [...props.data]
        .filter((x) => x.average_occupied_percentage_per_room_type)
        .sort(
          (a, b) =>
            a.average_occupied_percentage_per_room_type -
            b.average_occupied_percentage_per_room_type
        )
    : [];
});
const reverseData = computed(() => {
  if (!sortedData?.value) return [];
  return [...sortedData.value].reverse();
});
const chartOptions = ref({
  polar: {
    radius: [0, "70%"],
  },
  legend: {
    show: true,
    orient: "horizontal",
    right: "10%",
    itemGap: 10,
    textStyle: {
      fontSize: 10,
      color: "#333",
    },
    data: sortedData.value.map((item) => item.name), // Ensure this matches room names
  },
  angleAxis: {
    max: 100,
    startAngle: 90,
    fontSize: 10,
  },
  radiusAxis: {
    show: false,
    type: "category",
    data: sortedData.value.map((item) => item.name),
  },
  series: [
    {
      type: "bar",
      data: sortedData.value.map((item, index) => ({
        value: item.average_occupied_percentage_per_room_type,
        name: item.name, // Room name is now part of the series data
        itemStyle: {
          color: colors[index], // Color for each room
        },
      })),
      coordinateSystem: "polar",
      barCategoryGap: "25%",
      barGap: "10%",
      label: {
        show: true,
        position: "start",
        formatter: (params: any) => Math.round(params.value) + "%",
        fontWeight: 900,
        fontSize: 7,
      },
    },
  ],
});

onMounted(() => {
  setTimeout(() => {
    showChart.value = true;
  }, 3000);
});

const onBarClick = (params: any) => {
  const clickedData = sortedData.value[params.dataIndex];
  if (clickedData) {
    selectedRoom.value = clickedData;
    isModalVisible.value = true;
  }
};
</script>

<style scoped></style>
