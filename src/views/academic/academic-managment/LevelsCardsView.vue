<template>
  <div class="mt-2">
    <el-breadcrumb :separator-icon="ArrowRight" class="mb-2">
      <el-breadcrumb-item :to="{ path: '/academic/managment/programs' }"
        ><span class="font-semibold text-base">
          {{ currentProgram?.program }}
        </span></el-breadcrumb-item
      >
      <el-breadcrumb-item class="underline"
        ><span class="!text-primary font-semibold text-base">
          {{ curriculumYear?.name }}
        </span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <div>
      <h1 class="text-text-900 font-semibold text-3xl">Levels</h1>
      <h1 class="text-[#7C7C7C] font-semibold text-base">
        Please choose level which you need
      </h1>
      <el-divider></el-divider>
    </div>
    <div class="flex flex-wrap gap-8 mt-10" v-loading="loading">
      <div
        v-for="level of curriculumLevels"
        :key="level.study_year"
        class="card flex items-center justify-center gap-6 px-6 py-7"
        @click="
          router.push({
            name: 'academic-managment-courses',
            params: {
              curriculum: level?.curriculum_id,
            },
          })
        "
      >
        <div class="flex flex-col gap-2 flex-1">
          <h1 class="card__title">{{ level.title }}</h1>
          <h2 class="card__subtitle">
            Not published courses - {{ level.not_published_course }}
          </h2>
        </div>
        <el-icon :size="20"><ArrowRight /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from "@element-plus/icons-vue";
import { useCurriculumStore, useGuideStore } from "@/stores";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const curriculumStore = useCurriculumStore();
const guideStore = useGuideStore();

const curriculumLevels = computed(() => curriculumStore.curriculumLevels);
const curriculumYears = computed(() => curriculumStore.curriculumYear);
const tuitions = computed(() => guideStore.tuitions);
const currentProgram = ref();
const curriculumYear = ref();
const loading = computed(() => curriculumStore.loading);

onMounted(async () => {
  curriculumStore.fetchCurriculumLevels({
    curriculum_year_id: route.params.year,
    program_id: route.params.program,
  });
  if (tuitions.value.length === 0) await guideStore.fetchTuitions();
  if (curriculumYears.value.length === 0)
    await curriculumStore.fetchCurriculumYear(route.params.program as string);

  currentProgram.value = tuitions.value.find(
    (tuition: any) => tuition.id === route.params.program
  );

  curriculumYear.value = curriculumYears.value.find(
    (item: any) => item.id === route.params.year
  );
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
