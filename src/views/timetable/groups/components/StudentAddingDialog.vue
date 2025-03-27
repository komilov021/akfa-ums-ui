<template>
  <div class="">
    <div class="flex gap-4 mb-4">
      <el-input
        class="custom-color !w-[385px]"
        v-model="searchAll"
        type="text"
        autocomplete="off"
        @keypress.enter="fetchList"
        :prefix-icon="Search"
        placeholder="Search"
      >
        <template #suffix>
          <div
            v-if="searchAll"
            @click="
              searchAll = null;
              fetchList();
            "
          >
            <svg
              class="border-[1px] cursor-pointer rounded-xl size-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div> </template
      ></el-input>
      <el-select
        v-model="ruleForm.level"
        @change="fetchList"
        placeholder="Levels"
        class="!w-[180px]"
      >
        <el-option
          v-for="item of [
            { value: 'none', label: 'All' },
            { value: 1, label: 1 },
            { value: 2, label: 2 },
            { value: 3, label: 3 },
            { value: 4, label: 4 },
            { value: 5, label: 5 },
            { value: 6, label: 6 },
          ]"
          :key="item.value"
          :label="
            item.value == 'none' ? `${item.label}` : `Level ${item.label}`
          "
          :value="item.value"
        />
      </el-select>
    </div>
    <div v-if="selectedStudents.length">
      <el-scrollbar
        max-height="106px"
        class="bg-[#F9FAFB] flex mb-4 rounded-lg"
      >
        <div class="flex gap-2 flex-wrap p-3">
          <el-tag
            v-for="student in selectedStudents"
            :key="student.id"
            type="info"
            closable
            @close="removeStudent(student.id)"
          >
            {{ student.uid }}
          </el-tag>
        </div>
      </el-scrollbar>
    </div>
    <div class="grid grid-cols-2 xl:grid-cols-3 gap-2 mb-3">
      <el-checkbox
        v-for="student in props.studentinfo?.data"
        :key="student.id"
        :label="student"
        :model-value="isSelected(student.id)"
        @change="toggleStudentSelection(student)"
        class="custom-checkbox py-4"
        :class="{
          'custom-checkbox-selected': isSelected(student.id),
        }"
      >
        <div>
          <h1
            class="text-wrap text-[#374151] font-normal text-[14px] !leading-none"
          >
            {{ student.last_name }} {{ student.first_name }}
          </h1>
          <p class="leading-4 text-[12px] font-normal text-[#9ca3af]">
            <span :class="{ uid: isSelected(student.id) }">{{
              student.uid
            }}</span>
          </p>
        </div>
      </el-checkbox>
    </div>
    <div
      class="py-4 flex items-center justify-between gap-3"
      v-if="ruleForm.limit < students.total"
    >
      <div class="text-[#6B7280] text-sm font-normal">
        Showing
        <span class="font-semibold !text-[#000]">{{
          (ruleForm.page - 1) * ruleForm.limit + 1
        }}</span
        >-
        <span class="font-semibold !text-[#000]">{{
          Math.min(ruleForm.page * ruleForm.limit, students.total)
        }}</span>
        of
        <span class="font-semibold !text-[#000]">{{ students.total }}</span>
      </div>
      <el-pagination
        background
        @current-change="onPaginationChange"
        class="pag-timetable"
        layout="prev, pager, next"
        :page-size="ruleForm.limit"
        :total="students.total"
      />
    </div>
    <el-button class="w-full" type="primary" @click="addStudents"
      >Add</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useStudentsStore } from "@/stores";

const studentsStore = useStudentsStore();
const students = computed(() => studentsStore.students);
interface Student {
  id: string;
  uid: string;
  first_name: string;
  last_name: string;
}
interface StudentInfo {
  data: Student[];
}
const props = defineProps<{
  studentinfo: StudentInfo | null;
  selectedStudents: any[];
}>();

const ruleForm = reactive({
  page: 1,
  limit: 20,
  uid: null,
  // is_blocked: false,
  is_archived: false,
  search: undefined as any,
  level: undefined as any,
});
const searchAll: any = ref("");
function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
const fetchList = () => {
  if (event) event.preventDefault();
  if (isNumeric(searchAll.value)) {
    ruleForm.uid = searchAll.value;
    ruleForm.search = undefined;
  } else {
    ruleForm.search = searchAll.value ? searchAll.value : undefined;
    ruleForm.level = ruleForm.level === "none" ? undefined : ruleForm.level;
    ruleForm.uid = null;
  }
  studentsStore.fetchStudents(ruleForm);
};
const onPaginationChange = (event: number) => {
  ruleForm.page = event;
  fetchList();
};

const selectedStudents = ref(props.selectedStudents);
const toggleStudentSelection = (student: Student) => {
  const index = selectedStudents.value.findIndex(
    (item) => item.id === student.id
  );
  if (index === -1) {
    selectedStudents.value.push(student);
  } else {
    selectedStudents.value.splice(index, 1);
  }
};
const isSelected = (id: string): boolean => {
  return selectedStudents.value.some((student) => student.id === id);
};

const removeStudent = (id: string) => {
  const index = selectedStudents.value.findIndex((item) => item.id === id);
  if (index !== -1) {
    selectedStudents.value.splice(index, 1);
  }
};
const emit = defineEmits(["close", "add-students"]);
function addStudents() {
  emit("add-students", selectedStudents.value);
  emit("close");
}
</script>

<style lang="scss">
.custom-checkbox {
  display: flex;
  justify-content: space-between;
  min-height: 55px;
  border-radius: 8px;
  padding: 0 8px 0 0;
  margin: 0;

  .el-checkbox__label {
    order: -1 !important;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner {
    background: #7f56d9 !important;
    border-color: #7f56d9 !important;
  }
}

.custom-checkbox {
  background-color: #f9fafb;
}

.custom-checkbox .el-checkbox__label {
  color: #374151;
}

.custom-checkbox-selected {
  background-color: #f6f5ff;
}

.custom-checkbox-selected .el-checkbox__label {
  color: #7f56d9;
}

.custom-checkbox-selected .el-checkbox__label span.uid {
  color: #ac94fa;
}

.custom-checkbox .el-checkbox__label h1 {
  color: #374151;
}

.custom-checkbox-selected .el-checkbox__label h1 {
  color: #7f56d9;
}
</style>
