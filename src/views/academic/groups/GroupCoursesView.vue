<template>
  <div class="h-full flex flex-col gap-4 mt-2" v-loading="loading">
    <el-breadcrumb :separator-icon="ArrowRight" class="mb-2">
      <el-breadcrumb-item
        :to="{ path: `/academic/groups/${route.params.semester as string}` }"
        ><span class="font-semibold text-base">
          {{ decodeURIComponent(route.params.semester as string) }}
        </span></el-breadcrumb-item
      >
      <el-breadcrumb-item class="underline"
        ><span class="!text-primary font-semibold text-base">
          Level {{ route.params.level }}
        </span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <div class="flex flex-col grow justify-between">
      <el-table
        :data="courses.data"
        style="width: 100%"
        class="whiteStripe"
        row-class-name="noHover"
      >
        <el-table-column
          label="Course name"
          min-width="150"
          max-width="220"
          show-overflow-tooltip
          align="left"
          prop="title"
        />
        <el-table-column
          label="Course code"
          min-width="150"
          max-width="220"
          show-overflow-tooltip
          align="left"
          prop="course_codes"
        />

        <el-table-column
          width="300"
          align="center"
          prop="action"
          label="Actions"
        >
          <template #default="{ row }">
            <el-button
              class="action-button"
              @click="
                router.push({
                  name: 'group-list-view',
                  params: { course: row.course_reference_id },
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
        <el-divider />
        <el-pagination
          background
          @current-change="onPaginationChange"
          layout="prev, pager, next"
          next-text="Next ->"
          prev-text="<- Previous"
          :page-size="filter.limit"
          :total="courses.total"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGroupStore } from "@/stores";
import { ArrowRight } from "@element-plus/icons-vue";
import { computed, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
const groupStore = useGroupStore();

const courses = computed(() => groupStore.courses);
const loading = computed(() => groupStore.loading);

const filter = reactive({
  page: 1,
  limit: 30,
  study_year: Number(route.params.level),
  semester: decodeURIComponent(route.params.semester as string),
});

const fetchList = () => {
  groupStore.fetchCourses(filter);
};

const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};

onMounted(() => {
  fetchList();
});
</script>

<style scoped lang="scss"></style>
