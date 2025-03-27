<template>
  <div class="flex items-center space-x-4 mb-4">
    <el-button type="primary" @click="router.back()" link
      ><ArrowLeft class="h-4 w-4" /> Back</el-button
    >
    <h1 class="font-medium text-base">
      {{ student?.first_name + " " + student?.last_name }} -
      {{ student?.email }}
    </h1>
  </div>
  <div class="table-wrapper" v-loading="loading">
    <el-table
      :data="studentCourseDetails"
      stripe
      style="width: 100%"
      row-class-name="noHover"
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
        prop="weight"
        label="Weight"
        min-width="90"
        max-width="160"
        align="center"
      />
      <el-table-column
        prop="score"
        label="Grade"
        min-width="90"
        max-width="160"
        align="center"
      />
      <el-table-column
        prop="actual"
        label="Actualgrade"
        min-width="90"
        max-width="160"
        align="center"
      />
    </el-table>
    <div
      class="flex flex-col space-y-1 mt-4"
      v-if="studentCourseDetails.length"
    >
      <div class="flex items-center space-x-2">
        <span class="text-lg font-semibold">TOTAL:</span>
        <span class="text-lg">{{ studentCourseDetails[0].total?.total }}</span>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-lg font-semibold">GRADE:</span>
        <span class="text-lg">{{ studentCourseDetails[0].total?.grade }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStudentsStore } from "@/stores";
import { onMounted, computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const studentsStore = useStudentsStore();
const loading = ref(false);

const studentCourseDetails = computed(() => studentsStore.studentCourseDetails);

const student = computed(() => studentsStore.currentStudent);

onMounted(async () => {
  await studentsStore.fetchStudentCourseDetails({
    student_id: route.params.student_id as string,
    course_id: route.params.course_id as string,
  });
  studentsStore.getStudentById(route.params.student_id as string);
});
</script>

<style scoped></style>
