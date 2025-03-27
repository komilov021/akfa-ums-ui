<template>
  <div class="flex justify-end flex-wrap items-center mb-4 gap-4">
    <el-select
      @change="fetchList"
      class="!w-60"
      :placeholder="`${$t('shared.select')} ${$t('app.department')}`"
      size="large"
      v-model="filter.program_id"
    >
      <el-option
        v-for="(item, i) in [
          { value: 'none', label: 'All' },
          ...guideStore.getProgramsSelct,
        ]"
        :key="i"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <div class="!w-20">
      <el-select
        v-model="filter.limit"
        @change="fetchList"
        class="w-full"
        :placeholder="$t('shared.select')"
        size="large"
      >
        <el-option
          v-for="item in [20, 40, 50, 70, 100]"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <el-button type="primary" size="large" @click="openFormDialog"
      >Add Ranking</el-button
    >
  </div>
  <div class="table-wrapper" v-loading="loading">
    <el-table
      :data="students.data"
      class="whiteStripe"
      style="width: 100%"
      row-class-name="noHover"
    >
      <el-table-column
        label="Title"
        prop="title"
        min-width="150"
        max-width="200"
        show-overflow-tooltip
        align="left"
      />
      <el-table-column
        label="Courses"
        min-width="150"
        max-width="200"
        show-overflow-tooltip
        align="left"
      >
        <template #default="{ row }">
          <p v-for="course in row.courses" :key="course.code">
            {{ course.semester }} {{ course.title }} ({{ course.code }})
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="Department"
        min-width="150"
        max-width="200"
        show-overflow-tooltip
        align="left"
      >
        <template #default="{ row }">
          <span>{{ row.program?.name || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="semester.title"
        label="Semester"
        min-width="100"
        show-overflow-tooltip
        align="left"
      />
      <el-table-column
        prop="created_at"
        label="Created at"
        min-width="90"
        max-width="160"
        align="left"
      >
        <template #default="{ row }">
          <span>{{ dayjs(row.created_at).format("YYYY-MM-DD") }}</span>
        </template>
      </el-table-column>
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
                  command="view"
                  class="danger-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded"
                >
                  <View class="h-4 w-4" />
                  <span>View</span>
                </el-dropdown-item>
                <!-- <el-dropdown-item command="edit"
                  class="simple-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded">
                  <EditPen class="h-4 w-4 icon" />
                  <span>Update</span>
                </el-dropdown-item>
                <el-dropdown-item command="delete"
                  class="danger-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded">
                  <Delete class="h-4 w-4" />
                  <span>Delete</span>
                </el-dropdown-item> -->
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div class="py-4">
      <el-pagination
        background
        @current-change="onPaginationChange"
        layout="prev, pager, next"
        :page-size="filter.limit"
        :total="students.total"
      />
    </div>
    <teleport to="#modal" v-if="showModal">
      <CoursesForm
        :type="formType"
        :rank="rank"
        :programs="guideStore.getProgramsSelct"
        :semester="ExamDatesStore.getSemestrsSelct"
        @on-submit="submitForm($event)"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import {
  useGuideStore,
  useRankingStore,
  useCoursesStore,
  useAcademicStore,
} from "@/stores";
import { onMounted, computed, ref, reactive } from "vue";
import { Delete, EditPen, MoreFilled, View } from "@element-plus/icons-vue";
import { useModal } from "@/composables";
import { ElMessage, ElMessageBox, dayjs } from "element-plus";
import { useI18n } from "vue-i18n";
import CoursesForm from "./components/RankingForm.vue";
import type { IStudent } from "@/models/backend";
import { useRouter } from "vue-router";

const router = useRouter();
const modal = useModal();
const formType = ref<"create" | "edit">("create");
const i18n = useI18n();
const guideStore = useGuideStore();
const CoursesStore = useCoursesStore();
const RankingStore = useRankingStore();
const ExamDatesStore = useAcademicStore();
const showModal = computed(() => modal.show.value);
const loading = ref(false);
const students = computed(() => RankingStore.rankings);
const rank = computed(() => RankingStore.currentRank);
const filter = reactive({
  page: 1,
  limit: 30,
  program_id: undefined,
});
onMounted(() => {
  if (!guideStore.getProgramsSelct.length) {
    guideStore.fetchPrograms();
  }
  if (!ExamDatesStore.getSemestrsSelct.length) {
    ExamDatesStore.fetchSemestr();
  }
  fetchList();
});
const fetchList = () => {
  filter.program_id =
    filter.program_id === "none" ? undefined : filter.program_id;
  RankingStore.fetchRanking(filter);
};

const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};

const openFormDialog = () => {
  formType.value = "create";
  modal.setTitle("Add Ranking");
  modal.setWidth("50%");
  modal.showModal();
};
const openEditFormDialog = async (id: string) => {
  await RankingStore.getRankingById(id);
  formType.value = "edit";
  modal.setTitle("Update Ranking");
  modal.setWidth("50%");
  modal.showModal();
};

const confirmDelete = (id: string) => {
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
        await RankingStore.removeRanking({ id: id });
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
type RankingRow = IStudent & {
  semester: {
    id: string;
    title: string;
  };
};
const handleActionClick = async (command: string, row: RankingRow) => {
  if (command === "edit") {
    await openEditFormDialog(row.id);
  }
  if (command === "delete") {
    confirmDelete(row.id);
  }
  if (command === "view") {
    router.push({
      name: "ranking-detail",
      params: { id: row.id },
      query: { semester: row.semester.id },
    });
  }
};

const submitForm = async (data: any) => {
  try {
    loading.value = true;
    data.semester_id = data.semester_id.value;
    if (formType.value === "edit" && rank.value) {
      await RankingStore.editRanking(data);
      ElMessage({
        message: i18n.t("shared.updated"),
        type: "success",
      });
    } else {
      await RankingStore.createRanking(data);
      ElMessage({
        message: i18n.t("shared.created"),
        type: "success",
      });
    }
    fetchList();
    loading.value = false;
    modal.hideModal();
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
</script>

<style scoped></style>
