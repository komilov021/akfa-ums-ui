<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col grow justify-between">
      <el-table
        :data="progressionResults.data"
        style="width: 100%"
        class="whiteStripe"
        row-class-name="cursor-pointer"
      >
        <el-table-column
          label="Full name"
          min-width="180"
          max-width="220"
          show-overflow-tooltip
          align="left"
          prop="student_name"
        />
        <el-table-column
          label="ID and email"
          min-width="120"
          max-width="200"
          show-overflow-tooltip
          align="left"
        >
          <template #default="{ row }">
            <p>{{ row.student_uid }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="#Number of fails"
          min-width="90"
          max-width="160"
          show-overflow-tooltip
          align="left"
        >
          <template #default="{ row }">
            <span>{{ row?.fail_count }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Status"
          min-width="120"
          max-width="200"
          show-overflow-tooltip
          align="center"
        >
          <template #default="{ row }">
            <div class="flex justify-center">
              <div
                v-if="row?.status === 'Failed'"
                class="flex items-center gap-1 rounded-xl border border-[#FECDCA] px-2 py-0.5"
              >
                <el-icon size="12" color="#F04438"><Close /></el-icon>
                <span class="text-[#B42318] text-xs">{{ row?.status }}</span>
              </div>
              <div
                v-else
                class="flex items-center gap-1 rounded-xl border border-[#ABEFC6] px-2 py-0.5"
              >
                <el-icon size="12" color="#17B26A"><Check /></el-icon>
                <span class="text-[#067647] text-xs">{{ row?.status }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="Courses failed or missed"
          min-width="150"
          max-width="200"
          show-overflow-tooltip
          align="center"
        >
          <template #default="{ row }">
            <div class="flex justify-center flex-wrap gap-1">
              <div
                v-for="fail of row?.fails"
                :key="fail.id"
                class="after:content-[','] last:after:content-['']"
              >
                {{ fail.code }}
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="Required course"
                  placement="top-start"
                >
                  <sup class="text-red-500">*</sup>
                </el-tooltip>
              </div>
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
          :total="progressionResults.total"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProgressionResultStore, useCurriculumStore } from "@/stores";
import { computed, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const progressionResultStore = useProgressionResultStore();

const progressionResults = computed(
  () => progressionResultStore.progressionResults
);

const filter = reactive({
  page: 1,
  limit: 30,
  curriculum_id: route.params.curriculum as string,
});

const fetchList = () => {
  progressionResultStore.fetchProgressionResult(filter);
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
