<template>
  <div class="">
    <div class="float-right relative bottom-16">
      <el-button
        type="primary"
        :icon="Plus"
        @click="showDialog"
        class="w-[156px]"
      >
        Create Group
      </el-button>
    </div>
    <div class="flex gap-3 my-7">
      <el-input
        v-model="filter.search"
        type="text"
        class="!w-[384px]"
        autocomplete="off"
        :prefix-icon="Search"
        :placeholder="$t('shared.search')"
        @keypress.enter="fetchList"
      >
        <template #suffix>
          <div @click="clearSearch">
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
        placeholder="Programs"
        @change="fetchList"
        class="!w-[304px]"
      >
        <el-option
          v-for="(item, index) in [
            { value: 'none', label: 'All' },
            ...programStore.getTuitions,
          ]"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div>
      <el-table
        :data="groupsTimetableList.data"
        style="width: 100%"
        v-on:row-click="onViewClick"
        stripe
        class="whiteStripe"
        row-class-name="cursor-pointer"
      >
        <el-table-column
          label="Group Name"
          max-width="228"
          show-overflow-tooltip
          align="left"
          label-class-name="uppercase"
        >
          <template #default="{ row }">
            <span class="text-[#000] text-sm font-semibold">{{
              row.name
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Abbreviation"
          max-width="356"
          show-overflow-tooltip
          label-class-name="uppercase"
          align="left"
        >
          <template #default="{ row }">
            {{ row.abbreviation }}
          </template>
        </el-table-column>
        <el-table-column
          label="Group leader"
          max-width="358"
          show-overflow-tooltip
          label-class-name="uppercase"
          align="left"
        >
          <template #default="{ row }">
            {{ row.leader_info.first_name }} {{ row.leader_info.last_name }}
          </template>
        </el-table-column>
        <el-table-column
          label="Color"
          width="358"
          label-class-name="uppercase"
          align="left"
          prop="color"
        >
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <div
                :style="{
                  backgroundColor: `rgba(${parseInt(
                    row.color_info.hex_code.slice(1, 3),
                    16
                  )}, ${parseInt(
                    row.color_info.hex_code.slice(3, 5),
                    16
                  )}, ${parseInt(
                    row.color_info.hex_code.slice(5, 7),
                    16
                  )}, 0.15)`,
                  borderColor: row.color_info.hex_code,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                }"
                class="w-4 h-4 border rounded-full"
              ></div>
              <h1 class="text-gray-500">{{ row.color_info.name }}</h1>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div
      class="py-4 flex items-center justify-between gap-3"
      v-if="filter.limit < groupsTimetableList.pagination.total_items"
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
            groupsTimetableList.pagination.total_items
          )
        }}</span>
        of
        <span class="font-semibold !text-[#000]">{{
          groupsTimetableList.pagination.total_items
        }}</span>
      </div>
      <el-pagination
        background
        @current-change="onPaginationChange"
        class="pag-timetable"
        layout="prev, pager, next"
        :page-size="filter.limit"
        :total="groupsTimetableList.pagination.total_items"
      />
    </div>
  </div>
  <el-dialog
    v-model="show"
    title="Create group"
    width="702"
    style="background: #fff !important"
    class="custom-dialog"
  >
    <GroupStudentDialog
      v-if="show"
      :filter="filter"
      :icon="Plus"
      @closeModal="closeModal"
      @goToAddStudentDialog="goToAddStudentDialog"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { useGuideStore, useTimeTableGroups } from "@/stores";
import { ref, reactive, onMounted, computed } from "vue";
import { Search, Plus } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import GroupStudentDialog from "./components/GroupStudentDialog.vue";

const showaddStudentdialog = ref(false);
const loading = ref(false);
const show = ref(false);
const timetableGroupsStore = useTimeTableGroups();
const programStore = useGuideStore();
const router = useRouter();
const groupsTimetableList = computed(() => timetableGroupsStore.groups);
const filter = reactive({
  page: 1,
  limit: 20,
  program_id: undefined as any,
  search: undefined as any,
});

const showDialog = () => {
  show.value = true;
};

const fetchList = async () => {
  try {
    loading.value = true;
    const params: any = {
      search: filter.search || undefined,
      program_id: filter.program_id === "none" ? undefined : filter.program_id,
      page: filter.page,
      limit: filter.limit,
    };
    filter.program_id =
      filter.program_id === "none" ? undefined : filter.program_id;
    await timetableGroupsStore.fetchTimetableGroupList(params);
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error?.message);
  }
};
const onPaginationChange = (page: number) => {
  filter.page = page;
  fetchList();
};
const closeModal = () => {
  fetchList();
  show.value = false;
};
const clearSearch = () => {
  filter.search = "";
  fetchList();
};
const goToAddStudentDialog = () => {
  showaddStudentdialog.value = true;
};
const onViewClick = (row: any) => {
  router.push({
    name: "timetable-group-detail",
    params: { id: row.id },
  });
};

onMounted(() => {
  fetchList();
});
</script>
<style scoped>
.colorcircle {
  border: 0.5px solid;
  width: 20px;
  height: 20px;
  border: 0.5px 0px 0px 0px;
  border-radius: 50%;
}
</style>
