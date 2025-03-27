<template>
  <div class="bg-white rounded-3xl py-[26.5px] px-6">
    <div class="flex items-center justify-between">
      <h2 class="text-[#111928] text-2xl font-bold">Calendars</h2>
      <el-button type="primary" @click="openFormDialog">
        <Plus class="w-5 h-5 mr-2" color="#FFFFFF"></Plus>Create calendar
      </el-button>
    </div>
    <div class="flex gap-3 mt-7">
      <div class="md:w-[384px]">
        <el-input
          :prefix-icon="Search"
          type="text"
          autocomplete="off"
          v-model="filter.search"
          @keypress.enter="fetchList"
          size="large"
          placeholder="Search"
        >
          <template #suffix>
            <div>
              <svg
                class="border-[1px] cursor-pointer rounded-xl size-3"
                v-if="filter.search"
                @click="clearSearch"
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
      </div>
      <div class="md:w-[244px]">
        <el-select
          v-model="filter.semester_id"
          class="w-full"
          @change="fetchList"
          :placeholder="`${$t('app.semestrs')}`"
          size="large"
        >
          <el-option
            v-for="(item, i) in [
              { value: 'none', label: 'All' },
              ...ExamDatesStore.getSemestrsSelct,
            ]"
            :key="i"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="md:w-[224px]">
        <el-select
          v-model="filter.status"
          class="w-full"
          @change="fetchList"
          placeholder="Status"
        >
          <el-option
            v-for="(item, p) in [
              { value: 'none', label: 'All' },
              ...statusData,
            ]"
            :key="p"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <el-table
      :data="calendar.data"
      class="whiteStripe mt-4"
      stripe
      row-class-name="cursor-pointer"
      v-on:row-click="viewCalendar"
    >
      <el-table-column
        label="Calendar Name"
        min-width="220"
        label-class-name="uppercase"
      >
        <template #default="{ row }">
          <span class="text-[#000] text-sm font-semibold">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="semester"
        label="Semester"
        min-width="180"
        label-class-name="uppercase"
      >
        <template #default="{ row }">
          {{ row.semester_info.name }}
        </template>
      </el-table-column>
      <el-table-column
        prop="durationCalendar"
        label="Duration of Calendar"
        min-width="180"
        label-class-name="uppercase"
      >
        <template #default="{ row }">
          {{ dayjs(row.start_date).format("DD.MM.YY") }} -
          {{ dayjs(row.end_date).format("DD.MM.YY") }}
        </template>
      </el-table-column>
      <el-table-column
        prop="duration_in_minutes"
        label="Duration of Periods"
        min-width="180"
        label-class-name="uppercase"
      >
        <template #default="{ row }">
          {{ row.duration_in_minutes }} min
        </template>
      </el-table-column>
      <el-table-column
        prop="durationDay"
        label="Duration of Day"
        min-width="180"
        label-class-name="uppercase"
      >
        <template #default="{ row }">
          {{ row.start_time }} - {{ row.end_time }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="Status"
        min-width="180"
        label-class-name="uppercase"
      />
      <el-table-column
        label="Action"
        min-width="120"
        label-class-name="uppercase"
      >
        <template #default="{ row }">
          <div class="flex items-center gap-1">
            <el-button
              class="action-button"
              @click="
                stopEvent($event);
                openEditFormDialog(row);
              "
            >
              <SvgIcon name="local-pen-simple" size="23" />
            </el-button>
            <el-button
              @click="
                stopEvent($event);
                confirmDelete(row.id);
              "
              class="action-button"
            >
              <SvgIcon name="local-trash" size="23" />
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div
      v-if="filter.limit < calendar?.pagination.total_items"
      class="py-4 flex items-center justify-between gap-3"
    >
      cvdcv
      <div class="text-[#6B7280] text-sm font-normal">
        Showing
        <span class="fontvdvd-semibold !text-[#000]">{{
          (filter.page - 1) * filter.limit + 1
        }}</span
        >-vd
        <span class="font-semibold !text-[#000]">{{
          Math.min(filter.page * filter.limit, calendar.pagination.total_items)
        }}</span
        >dvd of
        <span class="font-semibold !text-[#000]">{{
          calendar.pagination.total_items
        }}</span>
      </div>
      <el-pagination
        background
        @current-change="onPaginationChange"
        class="pag-timetable"
        layout="prev, pager, next"
        :page-size="filter.limit"
        :total="calendar.pagination.total_items"
      />dvdcv
    </div>
    <teleport to="#modal" v-if="showModal">
      <TimetableForm
        :type="modalType"
        :data="currentFormData"
        @on-submit="submitForm($event)"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, Filter, Plus, Search } from "@element-plus/icons-vue";
import { computed, onMounted, reactive, ref } from "vue";
import TimetableForm from "./components/TimetableForm.vue";
import { dayjs, ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { useAcademicStore } from "@/stores";
import { useModal } from "@/composables";
import { useTimetableStore } from "@/stores/timetable";
import { useI18n } from "vue-i18n";
const modal = useModal();
const showModal = computed(() => modal.show.value);
const ExamDatesStore = useAcademicStore();
const calendarStore = useTimetableStore();
const router = useRouter();
const modalType = ref<"create" | "edit">("create");
const loading = ref(false);
const calendar = computed(() => calendarStore.calendar);
const currentFormData = ref<any | null>(null);
const i18n = useI18n();
const filter = reactive({
  page: 1,
  limit: 20,
  total: 40,
  search: undefined as any,
  status: undefined as any,
  semester_id: undefined as any,
});

const fetchList = async () => {
  try {
    loading.value = true;
    const params: any = {
      search: filter.search || undefined,
      status: filter.status === "none" ? undefined : filter.status,
      semester_id:
        filter.semester_id === "none" ? undefined : filter.semester_id,
      page: filter.page,
      limit: filter.limit,
    };

    filter.semester_id =
      filter.semester_id === "none" ? undefined : filter.semester_id;
    filter.status = filter.status === "none" ? undefined : filter.status;

    await calendarStore.fetchCalendar(params);
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error?.message);
  }
};

onMounted(() => {
  fetchList();
});
const clearSearch = () => {
  filter.search = "";
  fetchList();
};
const statusData = ref<any[]>([
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
]);

const viewCalendar = (data: any) => {
  router.push({ name: "calendar-detail", params: { id: data?.id } });
};
const stopEvent = (event: any) => {
  event.stopPropagation();
};
const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};

const confirmDelete = (id: string) => {
  router.push("");
  ElMessageBox.confirm(
    "This action cannot be undone. Continue?",
    i18n.t("shared.warning"),
    {
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      type: "warning",
      center: true,
    }
  )
    .then(async () => {
      try {
        loading.value = true;
        await calendarStore.deleteCalendar(id);
        fetchList();
        loading.value = false;
        ElMessage({
          type: "success",
          message: i18n.t("shared.deleteCompleted"),
        });
      } catch (error: any) {
        loading.value = false;
        console.log("error", error);
      }
    })
    .catch(() => {});
};

const submitForm = async (data: any) => {
  try {
    loading.value = true;
    if (modalType.value === "edit") {
      await calendarStore.updateCalendar(data.id, {
        ...data,
        start_date: dayjs(data.start_date).format("YYYY-MM-DD"),
        end_date: dayjs(data.end_date).format("YYYY-MM-DD"),
        status: data.status,
      });
      ElMessage({
        message: "Updated",
        type: "success",
      });
    } else if (modalType.value === "create") {
      await calendarStore.createCalendar({
        ...data,
      });
      ElMessage({
        message: "Create",
        type: "success",
      });
    }
    fetchList();
    loading.value = false;
    modal.show.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};

const openFormDialog = () => {
  modal.show.value = true;
  modalType.value = "create";
  modal.title.value = "Add calendar";
  currentFormData.value = {};
};

const openEditFormDialog = (data: any) => {
  currentFormData.value = data;
  modalType.value = "edit";
  modal.show.value = true;
  modal.title.value = "Edit calendar";
};
onMounted(() => {
  if (!ExamDatesStore.getSemestrsSelct.length) {
    ExamDatesStore.fetchSemestr();
  }
});
</script>

<style lang="scss" scoped>
.pag-timetable img {
  width: 16px;
  height: 16px;
}
</style>
