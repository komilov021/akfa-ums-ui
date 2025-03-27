<template>
  <div>
    <h1 class="relative -top-4 text-lg text-tertiary-600">
      {{ curriculum.semester1 }} - {{ curriculum.semester2 }}
    </h1>
    <div class="flex items-center justify-center gap-12 mb-6">
      <div
        class="flex flex-col gap-2 items-center cursor-pointer"
        @click="semestrChange(curriculum.semester1)"
      >
        <div
          class="h-4 w-4 rounded-full flex justify-center items-center text-sm p-3 bg-[#BABABA]"
          :class="{
            '!bg-primary-600 text-white':
              currentSemestr === curriculum.semester1,
          }"
        >
          1
        </div>
        <h2>{{ curriculum.semester1 }}</h2>
      </div>
      <div
        class="flex flex-col gap-2 items-center cursor-pointer"
        @click="semestrChange(curriculum.semester2)"
      >
        <div
          class="h-4 w-4 rounded-full flex justify-center items-center text-sm p-3 bg-[#BABABA]"
          :class="{
            '!bg-primary-600 text-white':
              currentSemestr === curriculum.semester2,
          }"
        >
          2
        </div>
        <h2>{{ curriculum.semester2 }}</h2>
      </div>
    </div>
    <el-table
      :data="assignCourses.data"
      style="width: 100%"
      class="whiteStripe"
      row-class-name="noHover"
      v-loading="loading"
    >
      <el-table-column
        label="Course name and code"
        min-width="150"
        max-width="220"
        show-overflow-tooltip
        align="left"
      >
        <template #default="{ row }">
          <h1 class="leading-none">
            <span class="text-text-900">{{ row.title }}</span
            ><br /><span class="text-tertiary-600">{{ row.code }}</span>
          </h1>
        </template>
      </el-table-column>
      <el-table-column
        label="Prerequisite courses"
        min-width="120"
        show-overflow-tooltip
        align="center"
      >
        <template #default="{ row }">
          {{ row.prerequisites?.join(", ") }}
        </template>
      </el-table-column>
      <el-table-column label="Elective course" min-width="90" align="center">
        <template #default="{ row }">
          {{ row.is_elective ? "YES" : "NO" }}
        </template>
      </el-table-column>
      <el-table-column
        label="Related course code"
        min-width="120"
        show-overflow-tooltip
        align="center"
      >
        <template #default="{ row }">
          {{ row.related_courses_codes?.join(", ") }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ICurriculum } from "@/models/backend";
import { useCurriculumStore } from "@/stores";

import { computed, ref, onMounted } from "vue";

const props = defineProps<{
  curriculum: ICurriculum;
}>();

const curriculumStore = useCurriculumStore();
const currentSemestr = ref(props.curriculum.semester1);
const assignCourses = computed(() => curriculumStore.assignCourses);
const loading = ref(false);

const fetchList = async () => {
  try {
    loading.value = true;
    await curriculumStore.fetchAssignCourses({
      page: 1,
      limit: 30,
      curriculum_id: props.curriculum.id,
      semester: currentSemestr.value,
    });
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log(error?.message);
  }
};

const semestrChange = (semestr: string) => {
  currentSemestr.value = semestr;
  fetchList();
};

onMounted(() => {
  fetchList();
});
</script>

<style scoped></style>
