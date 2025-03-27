<template>
  <div class="flex justify-end mb-4"></div>
  <div class="flex justify-end flex-wrap items-center mb-4 gap-4">
    <el-select
      @change="fetchList"
      class="!w-60"
      placeholder="Select year"
      size="large"
      v-model="filter.academic_year_id"
    >
      <el-option
        v-for="(item, i) in [
          { value: 'none', label: 'All' },
          ...curriculumStore.academicYearWithIds,
        ]"
        :key="i"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      @change="fetchList"
      class="!w-60"
      filterable
      placeholder="Select program"
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
      >+ Add new curriculum</el-button
    >
  </div>
  <div class="table-wrapper" v-loading="loading">
    <el-table
      :data="curriculums.data"
      style="width: 100%"
      class="whiteStripe"
      size="small"
      row-class-name="noHover"
    >
      <el-table-column
        label="Program name"
        min-width="150"
        max-width="200"
        show-overflow-tooltip
        align="left"
      >
        <template #default="{ row }">
          <span>{{ row.program?.en }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="study_year"
        label="School year"
        min-width="100"
        show-overflow-tooltip
        align="left"
      />
      <el-table-column
        label="Academic year"
        min-width="150"
        max-width="200"
        show-overflow-tooltip
        align="left"
      >
        <template #default="{ row }">
          {{ row.academic_year?.name }}
        </template>
      </el-table-column>
      <el-table-column
        prop="max_fails"
        label="Max. number of fails"
        min-width="100"
        show-overflow-tooltip
        align="left"
      />
      <el-table-column width="80" align="center" prop="action" fixed="right">
        <template #default="{ row }">
          <el-button
            class="action-button"
            @click="
              router.push({
                name: 'reference-curriculum-view',
                params: { id: row.id },
              })
            "
          >
            <el-icon size="20">
              <View />
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="py-4">
      <el-pagination
        background
        v-if="filter.limit < curriculums.total"
        @current-change="onPaginationChange"
        layout="prev, pager, next"
        next-text="Next ->"
        prev-text="<- Previous"
        :page-size="filter.limit"
        :total="curriculums.total"
      />
    </div>
    <teleport to="#modal" v-if="showModal">
      <CurriculumCreateForm
        :programs="guideStore.getProgramsSelct"
        :academicYears="academicYears"
        @on-submit="submitForm($event)"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import CurriculumCreateForm from "./components/CurriculumCreateForm.vue";
import { useGuideStore, useCurriculumStore } from "@/stores";
import { onMounted, computed, ref, reactive } from "vue";
import { View } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { useModal } from "@/composables";
import { useRouter } from "vue-router";

const modal = useModal();
const i18n = useI18n();

const guideStore = useGuideStore();
const curriculumStore = useCurriculumStore();
const router = useRouter();
const showModal = computed(() => modal.show.value);
const loading = ref(false);

const curriculums = computed(() => curriculumStore.curriculums);
const academicYears = computed(() => curriculumStore.getAcademicYearSelect);

const filter = reactive({
  page: 1,
  limit: 30,
  program_id: null as any,
  academic_year_id: null as any,
});

onMounted(() => {
  if (!guideStore.getProgramsSelct.length) {
    guideStore.fetchPrograms();
  }
  if (!academicYears.value.length) {
    curriculumStore.fetchAcademicYears();
  }
  fetchList();
});

const fetchList = () => {
  filter.program_id = filter.program_id === "none" ? null : filter.program_id;
  filter.academic_year_id =
    filter.academic_year_id === "none" ? null : filter.academic_year_id;
  curriculumStore.fetchCurriculums(filter);
};

const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};

const openFormDialog = () => {
  modal.setTitle("Add new curriculum");
  modal.setWidth("40vw");
  modal.showModal();
};

const submitForm = async (data: any) => {
  try {
    loading.value = true;
    const res = await curriculumStore.createCurriculum(data);
    ElMessage({
      message: i18n.t("shared.created"),
      type: "success",
    });
    modal.hideModal();
    router.push({
      name: "reference-curriculum-view",
      params: { id: res.id },
      query: { action: "create" },
    });
    fetchList();
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
</script>

<style scoped></style>
