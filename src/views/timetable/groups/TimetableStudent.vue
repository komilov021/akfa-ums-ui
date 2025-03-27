<template>
  <div class="">
    <div class="flex gap-3 my-7">
      <el-input
        v-model="filter.search"
        type="text"
        autocomplete="off"
        :prefix-icon="Search"
        @keypress.enter="fetchList"
        placeholder="Search"
        class="!w-[384px]"
      >
        <template #suffix>
          <div
            @click="
              filter.search = '';
              fetchList();
            "
          >
            <svg
              class="border-[1px] cursor-pointer rounded-xl size-3"
              v-if="filter.search"
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
          </div>
        </template>
      </el-input>
      <el-select
        v-model="filter.program_id"
        @change="fetchList"
        placeholder="Programs"
        class="!w-[180px]"
      >
        <el-option
          v-for="item of [
            { value: 'none', label: 'All' },
            ...programStore.getTuitions,
          ]"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="filter.level"
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
    <div>
      <el-table
        :data="dataStudentListWithGroups.data"
        style="width: 100%"
        stripe
        v-on:row-click="onViewClick"
        class="whiteStripe"
        row-class-name="cursor-pointer"
      >
        <el-table-column
          label="Name"
          min-width="270"
          show-overflow-tooltip
          align="left"
          label-class-name="uppercase"
        >
          <template #default="{ row }">
            <div>{{ row.last_name }} {{ row.first_name }}</div>
          </template></el-table-column
        >
        <el-table-column
          label="Id"
          min-width="214"
          show-overflow-tooltip
          align="left"
          prop="uid"
          label-class-name="uppercase"
        ></el-table-column>
        <el-table-column
          label="Groups"
          min-width="214.8"
          show-overflow-tooltip
          align="left"
          label-class-name="uppercase"
        >
          <template #default="{ row }">
            <div>
              {{ row.group_info?.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="Programs"
          min-width="214.8"
          show-overflow-tooltip
          align="left"
          prop="program"
          label-class-name="uppercase"
        >
          <template #default="{ row }">
            <div>
              {{ row.program_info?.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="E-MAIL"
          min-width="214.8"
          show-overflow-tooltip
          align="left"
          prop="email"
          label-class-name="uppercase"
        />
        <el-table-column
          label="LEVEL"
          min-width="214.8"
          show-overflow-tooltip
          align="left"
          prop="study_year"
          label-class-name="uppercase"
        />
      </el-table>
    </div>
    <div
      class="py-4 flex items-center justify-between gap-3"
      v-if="filter.limit < dataStudentListWithGroups.pagination.total_items"
    >
      <div class="text-[#6B7280] text-sm font-normal">
        Showing
        <span class="font-semibold !text-[#000]">{{
          (filter.page - 1) * filter.limit + 1
        }}</span
        >-
        <span class="font-semibold !text-[#000]">{{
          Math.min(
            filter.page * filter.limit,
            dataStudentListWithGroups.pagination.total_items
          )
        }}</span>
        of
        <span class="font-semibold !text-[#000]">{{
          dataStudentListWithGroups.pagination.total_items
        }}</span>
      </div>
      <el-pagination
        background
        @current-change="onPaginationChange"
        class="pag-timetable"
        layout="prev, pager, next"
        :page-size="filter.limit"
        :total="dataStudentListWithGroups.pagination.total_items"
      />
    </div>
  </div>
  <el-dialog
    v-model="show"
    title="Student details"
    class="custom-dialog"
    width="702"
  >
    <StudentDetailsDialog :studentInfo="studentInfo" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useGuideStore, useTimeTableGroups } from "@/stores";
import { Search } from "@element-plus/icons-vue";
import StudentDetailsDialog from "./components/StudentDetailsDialog.vue";

const show = ref(false);
const studentInfo = ref();
const loading = ref(false);
const programStore = useGuideStore();
const timetableStore = useTimeTableGroups();
const dataStudentListWithGroups = computed(
  () => timetableStore?.tstudentListWithGroups
);

const filter = reactive({
  page: 1,
  limit: 20,
  program_id: undefined as any,
  search: undefined as any,
  level: undefined as any,
});

onMounted(() => {
  fetchList();
});

const fetchList = () => {
  try {
    loading.value = true;
    let filterURL = new URLSearchParams({
      page: filter?.page.toString(),
      limit: filter?.limit.toString(),
    });
    filter.level && filter.level !== "none"
      ? filterURL.append("level", filter.level)
      : undefined;
    filter.search && filter.search !== "none"
      ? filterURL.append("search", filter.search.toString())
      : "none";
    filter.program_id && filter.program_id !== "none"
      ? filterURL.append("program_id", filter.program_id.toString())
      : "none";
    timetableStore.fetchTStudentListWithGroups(filterURL as any);
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error.message);
  }
};
const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};
const onViewClick = (row: any) => {
  show.value = true;
  studentInfo.value = row;
};
</script>

<style lang="scss">
.custom-dialog {
  background: #fff !important;
  .el-dialog__close {
    background: white !important;
    color: var(--gray-400, #9ca3af) !important;
    font-size: 21px !important;
  }
}
</style>
