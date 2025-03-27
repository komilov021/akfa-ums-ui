<template>
  <div class="bg-[#fff] py-4 px-6 rounded-3xl">
    <div class="flex justify-between mt-2">
      <el-radio-group v-model="routervalue" size="large">
        <el-radio-button label="Groups" value="group" />
        <el-radio-button label="Student" value="student" />
      </el-radio-group>
    </div>
    <TimetableGroupView v-if="routervalue === 'group'" />
    <TimetableStudent v-if="routervalue === 'student'" />
  </div>
</template>

<script setup lang="ts">
import { useGuideStore, useStaffStore, useStudentsStore } from "@/stores";
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import TimetableGroupView from "./TimetableGroupView.vue";
import TimetableStudent from "./TimetableStudent.vue";

const route = useRoute();
const staffStore = useStaffStore();
const programStore = useGuideStore();
const studentStore = useStudentsStore();
const routervalue = ref(route.path.includes("student") ? "student" : "group");

const filter = reactive({
  page: 1,
  program_id: undefined,
  limit: 20,
  search: null as any,
  is_archived: false,
});

onMounted(async () => {
  if (!staffStore.staffs.data.length) {
    await staffStore.getStaffs({ ...filter, limit: 200, type: "teacher" });
  }
  if (!studentStore.students.data.length) {
    await studentStore.fetchStudents(filter);
  }
  if (!programStore.tuitions.length) {
    await programStore.fetchTuitions();
  }
});

watch(
  () => route.path,
  (currentRoute) => {
    routervalue.value = currentRoute.includes("student") ? "student" : "group";
  }
);
</script>

<style lang="scss">
.custom-dialog {
  background: #fff !important;

  .el-dialog__close {
    background: white !important;
    color: var(--gray-400, #9ca3af) !important;
    font-size: 21px !important;
  }

  .el-input__wrapper {
    background-color: #f9fafb !important;
  }

  .el-select__wrapper {
    background-color: #f9fafb !important;
  }

  .el-select__caret {
    color: #6b7280;
  }
}
</style>
