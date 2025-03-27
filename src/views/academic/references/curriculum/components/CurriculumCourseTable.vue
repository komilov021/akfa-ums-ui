<template>
  <div class="table-wrapper">
    <el-table
      :data="assignCourses.data"
      style="width: 100%"
      class="whiteStripe"
      row-class-name="noHover"
    >
      <el-table-column
        label="Course name and code"
        min-width="150"
        max-width="220"
        show-overflow-tooltip
        align="left"
      >
        <template #default="{ row }">
          <h1 class="leading-none flex flex-col space-y-0.5">
            <span class="text-text-900 underline">{{ row.title }}</span
            ><br /><span class="text-tertiary-600">{{ row.code }}</span>
          </h1>
        </template>
      </el-table-column>
      <el-table-column
        label="Credits"
        min-width="120"
        max-width="180"
        show-overflow-tooltip
        align="left"
      >
        <template #default="{ row }">
          <h1 class="leading-none">
            {{ row.credits }}
          </h1>
        </template>
      </el-table-column>
      <el-table-column
        label="Prerequisite courses"
        min-width="120"
        show-overflow-tooltip
        align="left"
      >
        <template #default="{ row }">
          {{ row.prerequisites?.join(", ") }}
        </template>
      </el-table-column>
      <el-table-column label="Elective course" min-width="90" align="left">
        <template #default="{ row }">
          {{ row.is_elective ? "YES" : "NO" }}
        </template>
      </el-table-column>
      <el-table-column
        label="Related course code"
        min-width="120"
        show-overflow-tooltip
        align="left"
      >
        <template #default="{ row }">
          {{ row.related_courses_codes?.join(", ") }}
        </template>
      </el-table-column>
      <el-table-column width="300" align="center" prop="action">
        <template #default="{ row }">
          <div class="flex items-center gap-2">
            <el-button link type="primary" @click="$emit('onUpdate', row)">
              Edit course
            </el-button>
            <el-button link type="primary" @click="$emit('onDelete', row)">
              Delete
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="py-4">
      <el-pagination
        background
        v-if="assignCourses.total > filter.limit"
        @current-change="onPaginationChange"
        layout="prev, pager, next"
        next-text="Next ->"
        prev-text="<- Previous"
        :page-size="filter.limit"
        :total="assignCourses.total"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurriculumStore } from "@/stores";
import { computed, onMounted, reactive } from "vue";

const curriculumStore = useCurriculumStore();

const assignCourses = computed(() => curriculumStore.assignCourses);

const props = defineProps<{
  curriculum_id: string;
  semester: string;
}>();

const emit = defineEmits(["onUpdate", "onDelete"]);

const filter = reactive({
  page: 1,
  limit: 30,
  curriculum_id: "",
  semester: "",
});

const fetchList = () => {
  curriculumStore.fetchAssignCourses(filter);
};

const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};

onMounted(() => {
  filter.curriculum_id = props.curriculum_id;
  filter.semester = props.semester;

  fetchList();
});
</script>

<style scoped></style>
