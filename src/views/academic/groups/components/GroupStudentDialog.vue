<template>
  <div v-loading="loading">
    <el-input
      v-model="search"
      placeholder="Find student"
      :prefix-icon="Search"
      size="large"
      @keyup.enter="fetchStudents"
    ></el-input>
    <el-empty v-if="!students.data.length" description="No result" />
    <div v-else class="h-96 mt-4 overflow-auto space-y-4">
      <div
        v-for="(student, i) of students.data"
        :key="i"
        class="header-card py-5 px-6 grid grid-cols-5 items-center gap-4 md:gap-16 cursor-pointer"
      >
        <div class="flex items-center gap-2 md:gap-4 col-span-2">
          <div class="flex flex-col md:gap-1">
            <h2>{{ student.first_name }} {{ student.last_name }}</h2>
            <h2>{{ student.email }}</h2>
          </div>
        </div>
        <div class="flex flex-col">
          <h2 class="pb-0.5">Departament</h2>
          <span class="pt-0.5">{{ student.program?.name || "-" }}</span>
        </div>
        <div class="flex flex-col">
          <h2 class="pb-0.5">Study year</h2>
          <span class="pt-0.5">{{ student.study_year || "-" }}</span>
        </div>
        <div class="flex items-start">
          <el-button
            v-if="!(student as any)?.in_group"
            @click="addStudent(student)"
          >
            <Plus class="w-5 h-5"></Plus>
          </el-button>
          <el-icon v-else color="#67C23A" :size="20">
            <Check></Check>
          </el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, Search } from "@element-plus/icons-vue";
import { useGroupStore, useStudentsStore } from "@/stores";
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";

const props = defineProps<{
  course_reference_id?: string;
  group_id?: string;
  semester?: string;
  study_year?: number;
}>();
const emit = defineEmits(["updateList"]);

const studentsStore = useStudentsStore();
const groupStore = useGroupStore();

const loading = computed(() => groupStore.loading);
const students = computed(() => {
  studentsStore.students.data.map((s) => ({ ...s, in_group: false }));
  return studentsStore.students;
});
const search = ref("");

const fetchStudents = async () => {
  await studentsStore.fetchStudents({
    search: search.value,
    page: 1,
    limit: 30,
  } as any);
};

const addStudent = async (student: any) => {
  try {
    await groupStore.addStudent({
      study_year: props.study_year,
      semester: props.semester,
      group_id: props.group_id,
      course_reference_id: props.course_reference_id,
      student_id: student.id,
    });
    student.in_group = true;
    ElMessage({
      message: "Student added",
      type: "success",
    });
    emit("updateList");
  } catch (error: any) {
    console.log("error", error.message);
  }
};
</script>

<style scoped lang="scss">
.header-card {
  border-radius: 16px;
  border: 1px solid #d8d8d8;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  background-color: #fff;

  h2 {
    color: #6c737f;
  }
  span {
    color: #000;
  }
}
</style>
