<template>
  <div class="flex justify-between flex-wrap items-center mb-4 gap-4">
    <div class="flex items-center space-x-4">
      <el-button type="primary" @click="router.back()" link
        ><ArrowLeft class="h-4 w-4" /> Back</el-button
      >
      <h1 class="font-medium text-base">
        {{ student?.first_name + " " + student?.last_name }} -
        {{ student?.email }}
      </h1>
    </div>
    <el-select
      @change="fetchList"
      class="w-60"
      :placeholder="`${$t('shared.select')} ${$t('app.department')}`"
      size="large"
      v-model="semestrId"
    >
      <el-option
        v-for="(item, i) in semestrs"
        :key="i"
        :label="item.semester"
        :value="item.id"
      />
    </el-select>
  </div>
  <div class="table-wrapper" v-loading="loading">
    <el-table
      :data="studentCourses"
      stripe
      style="width: 100%"
      row-class-name="cursor-pointer"
    >
      <el-table-column
        label="Title"
        min-width="150"
        max-width="200"
        show-overflow-tooltip
        align="left"
        prop="title"
      />
      <el-table-column
        prop="code"
        label="Code"
        min-width="90"
        max-width="160"
        align="left"
      />
      <el-table-column
        prop="credits"
        label="Credits"
        min-width="90"
        max-width="160"
        align="left"
      />
      <el-table-column
        prop="semester"
        label="Semester"
        min-width="90"
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
        prop="score"
        label="Score"
        min-width="90"
        max-width="160"
        align="left"
      />
      <el-table-column width="80" align="center" prop="action" fixed="right">
        <template #default="scope">
          <el-dropdown
            trigger="click"
            @command="(command: any) => handleActionClick(command, scope.row)"
            class="flex justify-center white-card"
          >
            <el-button text>
              <MoreFilled class="h-4 w-4 rotate-90 dot-icon cursor-pointer" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu class="!p-1 space-y-1">
                <el-dropdown-item
                  command="details"
                  class="danger-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded"
                >
                  <Memo class="h-4 w-4" />
                  <span>Details</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { useStudentsStore } from "@/stores";
import { onMounted, computed, ref } from "vue";
import { Memo, MoreFilled } from "@element-plus/icons-vue";
import type { IStudent, IStudentCourses } from "@/models/backend";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const studentsStore = useStudentsStore();
const loading = ref(false);

const semestrs = computed(() => studentsStore.semestrs);
const studentCourses = computed(() => studentsStore.studentCourses);

const student = computed(() => studentsStore.currentStudent);

const semestrId = ref<string>();

onMounted(async () => {
  await studentsStore.fetchStudentSemestrList(route.params.id as string);
  if (semestrs.value.length) {
    semestrId.value = semestrs.value[0].id;
    fetchList();
  }
});

const fetchList = () => {
  if (semestrId.value) {
    studentsStore.fetchStudentCourses({
      semester_id: semestrId.value,
      student_id: route.params.id as string,
    });
  }
};

const handleActionClick = async (command: string, row: IStudentCourses) => {
  if (command === "details") {
    router.push({
      name: "student-course-details",
      params: {
        course_id: row.course_id,
        student_id: route.params.id as string,
      },
    });
  }
};
</script>

<style scoped></style>
