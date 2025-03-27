<template>
  <div class="stat-card flex flex-col justify-between">
    <div class="py-2 px-4 text-black">
      <div class="flex items-center justify-between gap-2">
        <div>
          <p
            class="font-semibold sm:text-[16.24px] text-[14.24px] md:text-base leading-none"
          >
            Tuition fee cost
          </p>
          <p class="flex items-center text-[#C8C7C7] text-[12.57px]">
            Fall 2024 - Spring 2025
            <!-- {{ props.filter.level ? props.filter.level : "All" }} level /
            {{ props.filter?.school_id ? currentSchool : "All schools" }} -->
          </p>
        </div>
      </div>
      <div class="flex items-center gap-4 mt-5">
        <h1
          class="text-2xl md:text-[53px] sm:text-[40px] font-bold mt-1 md:mt-8"
        >
          3,416
          <!-- {{ formatter(props.admission?.avg_spent) }} -->
        </h1>
        <span
          class="text-2xl md:text-[53px] sm:text-[36px] font-bold mt-1 md:mt-6 ml-[-10px]"
        >
          {{ props.filter?.school_id ? "" : "avg" }}
        </span>
      </div>
    </div>
    <div>
      <!-- <div class="h-[1px] mt-4 sm:mt-10 md:mt-2 bg-[#EAECF0]" /> -->
      <div class="flex justify-end px-3 gap-2 py-2">
        <!-- <SemestrFilter @on-submit="updateSemester" /> -->
        <!-- <el-dropdown trigger="click">
          <el-button class="stat-btn">Choose school</el-button>
          <template #dropdown>
            <el-dropdown-menu class="el-dropdown-menu">
              <template v-for="(school, i) in [
                { label: 'All schools', value: null },
                ...schools,
              ]" :key="i">
                <el-dropdown-item @click="(program = school.value), updateRequest()"><span
                    class="text-[10px] md:text-[14px] font-base leading-none tracking-tight">{{ school.label }}</span>
                </el-dropdown-item>
              </template>
</el-dropdown-menu>
</template>
</el-dropdown>
<el-dropdown>
  <el-button class="stat-btn">Choose level</el-button>
  <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="onChange(level.value)" v-for="(level, i) in levels" :key="i"><span
                  class="md:text-[14px] text-[12px] leading-0">{{
                    level.label
                  }}</span></el-dropdown-item>
            </el-dropdown-menu>
          </template>
</el-dropdown> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAcademicStore, useSchoolStore, useStatisticsStore } from "@/stores";
import { computed, onMounted, reactive, ref } from "vue";
const props = defineProps<{
  admission?: any;
  filter: any;
}>();
const schoolStore = useSchoolStore();
const schools = computed(() => schoolStore.getSchoolsSelct);
const program = ref();
const activeLevel = ref();
const currentSchool = computed(
  () =>
    schools.value.filter((x: any) => x.value === props.filter?.school_id)[0]
      .label
);
const currentSemesters = ref();

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
const formatter = (val: any) => {
  const data = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: Math.trunc(Math.abs(val)).toFixed().length,
  }).format(val);
  return data;
};
const emits = defineEmits(["update"]);
const updateRequest = () => {
  emits("update", {
    level: activeLevel.value,
    // ...currentSemesters.value,
    school_id: program.value,
  });
};
const onChange = (level: any) => {
  level == "All" ? (activeLevel.value = null) : (activeLevel.value = level),
    console.log(activeLevel);
  updateRequest();
};
</script>

<style lang="scss" scoped></style>
