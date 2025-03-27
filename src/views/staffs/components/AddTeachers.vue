<template>
  <div class="">
    <div class="mb-4 flex items-center gap-4">
      <el-input
        class="custom-color !w-[325px] h-[42px]"
        v-model="searchAll"
        type="text"
        autocomplete="off"
        @keyup.enter="fetchList"
        clearable
        @clear="onClearSearch"
        :prefix-icon="Search"
        placeholder="Search"
      >
      </el-input>
      <el-select
        @change="onFilterChange"
        class="!w-60"
        :placeholder="`${$t('shared.select')} school`"
        size="large"
        v-model="filter.school_id"
      >
        <el-option
          v-for="(item, i) in [{ value: 'none', label: 'All' }, ...schools]"
          :key="i"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div
      class="grid grid-cols-2 xl:grid-cols-3 gap-3 mb-3"
      v-if="teachersToDean?.data?.length"
    >
      <el-checkbox
        v-for="teacher in teachersToDean?.data"
        :key="teacher.id"
        :label="teacher"
        :model-value="teacher.is_dean_teacher || isSelected(teacher.id)"
        @change="toggleStudentSelection(teacher)"
        class="custom-checkbox py-4"
        :class="{
          'custom-checkbox-selected':
            isSelected(teacher.id) || teacher.is_dean_teacher,
        }"
      >
        <div>
          <h1
            class="text-wrap text-[#374151] font-normal text-[14px] !leading-none"
          >
            {{ teacher.last_name }} {{ teacher.first_name }}
          </h1>
          <p
            class="text-[#9CA3AF] font-normal text-xs capitalize"
            :class="{ info: isSelected(teacher.id) }"
          >
            Teacher / {{ teacher.school_info?.title }}
          </p>
        </div>
      </el-checkbox>
    </div>
    <div
      v-else
      class="text-center text-gray-500 h-[400px] flex items-center justify-center"
    >
      No data available
    </div>
    <div
      class="py-4 flex items-center justify-between gap-3"
      v-if="filter.limit < teachersToDean?.total"
    >
      <div class="text-[#6B7280] text-sm font-normal">
        Showing
        <span class="font-semibold !text-[#000]">{{
          (filter.page - 1) * filter.limit + 1
        }}</span
        >-
        <span class="font-semibold !text-[#000]">{{
          Math.min(filter.page * filter.limit, teachersToDean?.total)
        }}</span>
        of
        <span class="font-semibold !text-[#000]">{{
          teachersToDean.total
        }}</span>
      </div>
      <el-pagination
        background
        @current-change="onPaginationChange"
        class="pag-timetable"
        layout="prev, pager, next"
        :page-size="filter.limit"
        :total="teachersToDean?.total"
      />
    </div>
    <el-button
      class="w-full h-[42px]"
      type="primary"
      :disabled="teachersToDean?.data?.length === 0"
      @click="onSubmit"
      >Save</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { IUser } from "@/models/backend";
import { useSchoolStore, useStaffStore } from "@/stores";
import { Search } from "@element-plus/icons-vue";
import EmptyDataIcon from "@/assets/svgs/empty.svg";
import { computed, onMounted, reactive, ref } from "vue";
const loading = ref(false);
const stafsStore = useStaffStore();
const schoolStore = useSchoolStore();
const schools = computed(() => schoolStore.getSchoolsSelct);
const teachersToDean = computed(() => stafsStore.deanToteacher);
const emit = defineEmits(["add-teachers"]);
const searchAll: any = ref("");
const props = defineProps<{
  selectedTeachers: any[];
  currentDeanId: any;
}>();
const selectedTeachersList = ref(props.selectedTeachers || []);
const buttonType = computed(() =>
  selectedTeachersList.value?.length > 0 ? "primary" : "gray"
);
const filter = reactive({
  page: 1,
  limit: 20,
  search: undefined,
  school_id: undefined,
  dean_teacher_id: props.currentDeanId,
});
const toggleStudentSelection = (teacher: any) => {
  const index = selectedTeachersList.value?.findIndex(
    (item) => item === teacher.id
  );
  if (index === -1) {
    teacher.is_dean_teacher = true;
    selectedTeachersList.value?.push(teacher.id);
  } else {
    teacher.is_dean_teacher = false;
    selectedTeachersList.value?.splice(index, 1);
  }
  console.log(selectedTeachersList.value);
};

const onClearSearch = () => {
  filter.search = undefined;
  filter.page = 1;
  fetchList();
};
const isSelected = (id: string): boolean => {
  return selectedTeachersList.value?.some((teacher) => teacher === id);
};
const fetchList = async () => {
  loading.value = true;
  const searchQuery =
    searchAll.value?.length >= 2 ? searchAll.value : undefined;
  const schoolId = filter.school_id === "none" ? undefined : filter.school_id;
  try {
    await stafsStore.getTeacherDeanList({
      page: filter.page,
      limit: filter.limit,
      search: searchQuery,
      school_id: schoolId,
      dean_teacher_id: props.currentDeanId,
    });
  } catch (error) {
    console.error("Error fetching teacher list:", error);
  } finally {
    loading.value = false;
  }
};

const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};
const onFilterChange = () => {
  filter.page = 1;
  fetchList();
};
function onSubmit() {
  console.log(selectedTeachersList.value);

  emit("add-teachers", selectedTeachersList.value);
}
onMounted(() => {
  fetchList();
  if (!schoolStore.getSchoolsSelct.length) {
    schoolStore.fetchSchools();
  }
});
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

.custom-checkbox-selected .el-checkbox__label p.info {
  color: #ac94fa;
}

.custom-checkbox .el-checkbox__label h1 {
  color: #374151;
}

.custom-checkbox-selected .el-checkbox__label h1 {
  color: #7f56d9;
}
</style>
