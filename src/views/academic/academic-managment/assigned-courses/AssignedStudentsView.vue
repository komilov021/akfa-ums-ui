<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col grow justify-between">
      <el-table
        :data="students.data"
        style="width: 100%"
        class="whiteStripe"
        row-class-name="cursor-pointer"
      >
        <el-table-column
          label="Full name"
          min-width="150"
          max-width="200"
          show-overflow-tooltip
          align="left"
        >
          <template #default="{ row }">
            <span>{{ row.first_name + " " + row.last_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Status"
          min-width="90"
          max-width="200"
          show-overflow-tooltip
          align="left"
        >
          <template #default="{ row }">
            {{ row.status ? "Active" : "Inactive" }}
          </template>
        </el-table-column>
        <el-table-column
          label="ID and email"
          min-width="150"
          max-width="200"
          show-overflow-tooltip
          align="left"
        >
          <template #default="{ row }">
            <p>{{ row.uid }}</p>
            <p>{{ row.email }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="Department"
          min-width="150"
          max-width="200"
          show-overflow-tooltip
          align="left"
        >
          <template #default="{ row }">
            <span>{{ row.program?.name || "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="acceptance_year"
          label="Enrolled year"
          min-width="100"
          show-overflow-tooltip
          align="left"
        />
        <el-table-column
          prop="phone"
          label="Phone"
          min-width="90"
          max-width="160"
          align="left"
        />
        <el-table-column width="120" align="center" prop="action">
          <template #default="{ row }">
            <div class="flex items-center">
              <el-button
                @click="
                  router.push({
                    name: 'academic-managment-student-view',
                    params: { student: row.id },
                  })
                "
                class="action-button"
              >
                <el-icon size="20">
                  <View />
                </el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="py-4">
        <el-divider />
        <el-pagination
          background
          @current-change="onPaginationChange"
          layout="prev, pager, next"
          next-text="Next ->"
          prev-text="<- Previous"
          :page-size="filter.limit"
          :total="students.total"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStudentsStore, useCurriculumStore } from "@/stores";
import { computed, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const studentsStore = useStudentsStore();
const curriculumStore = useCurriculumStore();

const currentCurriculum = computed(() => curriculumStore.currentCurriculum);
const students = computed(() => studentsStore.students);

const filter = reactive({
  page: 1,
  limit: 30,
  level: Number(currentCurriculum.value?.study_year || 0),
  program_id: route.params.program as string,
});

const fetchList = () => {
  filter.level = Number(currentCurriculum.value?.study_year || 0);
  studentsStore.fetchStudents(filter);
};

const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};

onMounted(async () => {
  fetchList();
});
</script>

<style scoped></style>
