<template>
  <div>
    <el-input
      v-model="searchAll"
      placeholder="Find student"
      :prefix-icon="Search"
      size="large"
      @keyup.enter="fetchStudents"
    ></el-input>
    <el-empty v-if="!students.data.length" description="No result" />
    <div v-else class="h-96 mt-4 overflow-auto space-y-4">
      <div
        v-for="student of students.data"
        :key="student.id"
        @click="navigate(student.id)"
        class="header-card py-5 px-6 grid grid-cols-3 items-center gap-4 md:gap-16 cursor-pointer"
      >
        <div class="flex items-center gap-2 md:gap-4">
          <div class="flex flex-col md:gap-1">
            <h2>{{ student.first_name }} {{ student.last_name }}</h2>
            <h2>{{ student.email }}</h2>
          </div>
        </div>
        <div class="flex flex-col">
          <h2 class="pb-0.5">ID</h2>
          <span class="pt-0.5">{{ student.uid }}</span>
        </div>
        <div class="flex flex-col">
          <h2 class="pb-0.5">Departament</h2>
          <span class="pt-0.5">{{ student.program?.name || "-" }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { useStudentsStore } from "@/stores";
import { computed, reactive, ref } from "vue";
const emit = defineEmits(["navigate"]);

const studentsStore = useStudentsStore();
const students = computed(() => studentsStore.students);
const searchAll: any = ref("");
function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
const filter = reactive({
  page: 1,
  limit: 20,
  acceptance_year: undefined,
  program_id: undefined,
  phone: "",
  level: null,
  search: undefined as any,
  uid: null,
  email: null,
  is_archived: null as any,
});
const fetchStudents = async () => {
  if (isNumeric(searchAll.value)) {
    filter.uid = searchAll.value;
    filter.search = undefined;
  } else {
    filter.search = searchAll.value ? searchAll.value : undefined;
    filter.uid = null;
  }
  studentsStore.fetchStudents(filter);
};

const navigate = (id: string) => {
  emit("navigate", id);
  searchAll.value = "";
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
