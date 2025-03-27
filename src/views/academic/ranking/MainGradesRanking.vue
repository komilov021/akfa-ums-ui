<template>
  <div class="flex justify-between flex-wrap items-center mb-4 gap-4">
    <div class="flex items-center space-x-4">
      <el-button type="primary" @click="router.back()" link>
        <ArrowLeft class="h-4 w-4" /> Back
      </el-button>
      <!-- <h1 class="font-medium text-base">
            {{ student?.first_name + " " + student?.last_name }} -
            {{ student?.email }}
          </h1> -->
    </div>
  </div>
  <div class="table-wrapper" v-loading="loading">
    <el-table
      class="whiteStripe"
      :data="students"
      stripe
      style="width: 100%"
      row-class-name="noHover"
    >
      <el-table-column
        label="Course title"
        min-width="200"
        max-width="300"
        show-overflow-tooltip
        align="left"
        prop="title"
      />
      <el-table-column
        prop="gpa"
        label="Gpa"
        min-width="120"
        max-width="160"
        align="left"
      />
      <el-table-column
        prop="grade"
        label="Grade"
        min-width="90"
        max-width="160"
        align="left"
      />
      <el-table-column
        prop="total"
        label="Total"
        min-width="90"
        max-width="160"
        align="left"
      />
      <el-table-column
        prop="is_retake"
        label="Is retake"
        min-width="200"
        max-width="360"
        align="left"
      >
        <template #default="{ row }">
          {{ row.is_retake ? "Yes" : "No" }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { useRankingStore } from "@/stores";
import { onMounted, computed, ref } from "vue";
import { EditPen, MoreFilled } from "@element-plus/icons-vue";
import type { IStudent, IStudentCourses } from "@/models/backend";
import { useModal } from "@/composables";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, dayjs } from "element-plus";
import { useI18n } from "vue-i18n";

const router = useRouter();
const route = useRoute();
const modal = useModal();
const i18n = useI18n();
const rankingStore = useRankingStore();
const loading = ref(false);
const students = computed(() => rankingStore.gradeRanking);
const filter = {
  rank_id: route.params.id as string,
  student_id: route.params.student as string,
};

onMounted(async () => {
  fetchList();
});
const fetchList = () => {
  rankingStore.getRankingGrade(filter);
};
</script>

<style scoped></style>
