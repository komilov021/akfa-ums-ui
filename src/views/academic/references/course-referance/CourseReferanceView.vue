<template>
  <div class="mx-auto mt-6 md:mt-0 space-y-4">
    <div class="flex justify-between flex-wrap items-center mb-4 gap-4">
      <div class="md:!w-72">
        <el-input
          :prefix-icon="Search"
          type="text"
          autocomplete="off"
          v-model="filter.search"
          @keypress.enter="fetchList"
          size="large"
          placeholder="Search for courses"
        />
      </div>
      <div class="flex items-center gap-4">
        <el-select
          @change="fetchList"
          class="!w-60"
          :placeholder="`${$t('shared.select')} school`"
          size="large"
          clearable
          v-model="filter.school_id"
        >
          <el-option
            v-for="(item, i) in schoolStore.getSchoolsSelct"
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
        <el-button
          type="primary"
          @click="router.push({ name: 'course-referance-create' })"
          >+ Add new course</el-button
        >
      </div>
    </div>
    <el-table
      :data="courses.data"
      class="whiteStripe"
      row-class-name="noHover"
      style="width: 100%"
    >
      <el-table-column prop="title" label="Title" min-width="250" align="left">
        <template #default="{ row }">
          <h1
            class="leading-none relative cursor-pointer"
            @click="
              router.push({
                name: 'course-referance-edit',
                params: { id: row.id },
              })
            "
          >
            <span class="text-text-900 underline">{{ row.title }}</span>
            <el-icon>
              <TopRight />
            </el-icon>
          </h1>
          <span class="text-tertiary-600">{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="credits"
        label="Credit"
        min-width="100"
        align="center"
      />
      <el-table-column
        prop="school_name"
        label="School"
        min-width="200"
        align="center"
      />
      <el-table-column
        prop="grading_type"
        label="Grading"
        min-width="120"
        align="center"
      />

      <el-table-column width="140" align="end" label="Operations">
        <template #default="{ row }">
          <el-button
            @click="
              router.push({
                name: 'course-referance-edit',
                params: { id: row.id },
              })
            "
            link
            type="primary"
          >
            Edit course
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="py-4">
      <el-pagination
        background
        v-if="filter.limit < courses.total"
        @current-change="onPaginationChange"
        layout="prev, pager, next"
        next-text="Next ->"
        prev-text="<- Previous"
        :page-size="filter.limit"
        :total="courses.total"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCourseReferanceStore, useSchoolStore } from "@/stores";
import { Search } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const router = useRouter();
const i18n = useI18n();
const filter = reactive({
  page: 1,
  limit: 30,
  school_id: null as any,
  search: null,
});
const loading = ref(false);
const schoolStore = useSchoolStore();
const courseReferanceStore = useCourseReferanceStore();

const courses = computed(() => courseReferanceStore.courseReferances);

const fetchList = () => {
  if (!filter.school_id) {
    filter.school_id = null;
  }
  if (!filter.search) {
    filter.search = null;
  }
  courseReferanceStore.fetchCourseReferances(filter);
};
const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
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
        await courseReferanceStore.removeCourseReferance(id);
        fetchList();
        loading.value = false;
        ElMessage({
          type: "success",
          message: i18n.t("shared.deleteCompleted"),
        });
      } catch (error: any) {
        loading.value = false;
        console.log("error", error?.message);
      }
    })
    .catch(() => {});
};

onMounted(() => {
  fetchList();
  if (!schoolStore.getSchoolsSelct.length) {
    schoolStore.fetchSchools();
  }
});

const editCourse = (row: any) => {};
</script>

<style scoped lang="scss">
.card {
  border-radius: 11.789px;
  background: #fff;
  box-shadow: 0px 1.17892px 5.89461px 1.17892px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #e9d7fe;
  }

  &__title {
    font-size: 16.699px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
}
</style>
