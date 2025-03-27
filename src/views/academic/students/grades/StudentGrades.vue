<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <div class="flex flex-col">
        <h1 class="text-900 font-semibold text-xl">Grades</h1>
        <p class="text-tertiary-600">Track student grades by course</p>
      </div>
    </div>
    <div class="flex gap-[39px]">
      <el-select
        v-model="filter.semester"
        class="w-full"
        @change="fetchFilterList"
        placeholder="Select"
        style="width: 240px"
      >
        <el-option
          v-for="item in [...semesterYear.getSemestrs]"
          :key="item.value"
          :label="item.label"
          :value="item.label"
        />
      </el-select>
      <el-select
        label="Select"
        v-model="filter.course_id"
        @change="fetchFilterList"
        placeholder="Select"
        style="width: 240px"
      >
        <el-option
          v-for="item in [
            { id: 'none', module_name: 'All' },
            ...studentStore.studentModuleName,
          ]"
          :key="item.id"
          :label="item?.module_name"
          :value="item.id"
        />
      </el-select>
    </div>
    <el-table
      :data="getstudentGrade"
      style="width: 100%"
      class="whiteStripe mt-[27px]"
      :header-cell-style="{ verticalAlign: 'bottom' }"
      v-loading="loading"
    >
      <el-table-column
        prop="module_name"
        label="Course name"
        min-width="190"
        align="center"
      />
      <el-table-column
        prop="status"
        label="Status"
        min-width="190"
        align="center"
      />
      <el-table-column
        prop="grade"
        label="Grade"
        min-width="190"
        align="center"
      />
      <el-table-column
        prop="total"
        label="Total"
        min-width="190"
        align="center"
      >
        <template #default="{ row }">
          <div>
            <span> {{ Math.floor(row.total) }} </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Course components" min-width="190" align="center">
        <template #default="{ row }">
          <div
            v-for="item of row.components"
            :key="item.id"
            class="leading-[18px]"
          >
            <p class="tracking-tight">{{ item.name }}:{{ item.weight }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="chief_first_name"
        label="Course leader"
        min-width="190"
        align="center"
      >
        <template #default="{ row }">
          <div>
            <span> {{ row.chief_first_name }} {{ row.chief_last_name }} </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="credits"
        label="Credits"
        min-width="190"
        align="center"
      />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useStudentsStore, useGroupStore } from "@/stores";
import { useRoute } from "vue-router";

const loading = ref(false);
const route = useRoute();
const studentStore = useStudentsStore();
const semesterYear = useGroupStore();
const getstudentGrade = computed(() => studentStore.studentGradeFilter);

let filter = reactive({
  semester: "",
  course_id: "",
});

onMounted(() => {
  fetchFilterList();
});
const fetchFilterList = async () => {
  filter.semester =
    filter.semester == "" ? semesterYear.getSemestrs[0].label : filter.semester;
  if (!semesterYear.getSemestrs.length) {
    semesterYear.fetchSemestrs();
  }
  filter.course_id = filter.course_id == "none" ? "" : filter.course_id;

  await studentStore.fetchFilterStudentGrade({
    student_id: route.params.id as string,
    ...filter,
  });
  await studentStore.fetchGradeModuleList({
    student_id: route.params.id as string,
    semester: filter.semester,
  });
};
</script>

<style scoped></style>
