<template>
  <div class="elective-courses-wrapper flex flex-row flex-wrap gap-8">
    <header-title
      title="Elective modules"
      subTitle="Please choose module which you need"
    />
    <template v-if="electiveModulesWithAttachedGroups.data.length">
      <div
        v-for="(
          electiveModule, index
        ) of electiveModulesWithAttachedGroups.data"
        :key="index"
        class="flex flex-wrap"
        @click="
          router.push({
            name: 'elective-course-lessons',
            params: {
              flow_group_id: electiveModule.flow_group_id,
            },
          })
        "
      >
        <div class="card flex items-center justify-center gap-6 px-6 py-7">
          <div class="flex flex-col gap-2 flex-1">
            <h1 class="card__title">{{ electiveModule.title }}</h1>
            <h2 class="card__subtitle">
              <template
                v-for="(group, index) of electiveModule.groups"
                :key="index"
                >{{ group.title }}
                <template v-if="electiveModule.groups?.length - 1 != index"
                  >,
                </template>
              </template>
            </h2>
          </div>
          <el-icon :size="20"><ArrowRight /></el-icon>
        </div>
      </div>
      <div class="py-4 w-full">
        <el-divider />
        <el-pagination
          background
          @current-change="onPaginationChange"
          layout="prev, pager, next"
          next-text="Next ->"
          prev-text="<- Previous"
          :page-size="filter.limit"
          :total="electiveModulesWithAttachedGroups.total"
        />
      </div>
    </template>
    <div v-else class="w-full my-14 text-center">
      No Elective courses are added yet.
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, reactive } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import { useCurriculumStore } from "@/stores";
import { useRouter } from "vue-router";
import HeaderTitle from "./components/HeaderTitle.vue";

const router = useRouter();
const curriculumStore = useCurriculumStore();

const filter = reactive({
  page: 1,
  limit: 30,
  semester: "SPRING 2025",
});

const electiveModulesWithAttachedGroups = computed(
  () => curriculumStore.electiveModulesWithAttachedGroups
);

const fetchElectiveModulesList = async () => {
  await curriculumStore.getElectiveModulesListWithAttachedGroups(filter);
};

const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchElectiveModulesList();
};

onMounted(async () => {
  await fetchElectiveModulesList();
});
</script>

<style scoped lang="scss">
.card {
  border-radius: 17.505px;
  background: #fff;
  box-shadow: 0.53488px 0.53488px 5.34882px 0.2334px rgba(0, 0, 0, 0.25);
  width: 350px;
  height: 139px;
  &__title {
    color: #1b1b1b;
    font-size: 22px;
    font-style: normal;
    font-weight: 500;
    display: -webkit-box;
    max-width: 400px;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }

  &__subtitle {
    color: #7c7c7c;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
  }
}
</style>
