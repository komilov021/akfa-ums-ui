<template>
  <div class="mt-2">
    <el-breadcrumb :separator-icon="ArrowRight" class="mb-2">
      <el-breadcrumb-item
        class="underline"
        :to="{ path: '/academic/managment/programs' }"
        ><span class="!text-primary font-semibold text-base">
          {{ currentProgram?.program }}
        </span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <div>
      <h1 class="text-text-900 font-semibold text-3xl">Curriculum</h1>
      <h1 class="text-[#7C7C7C] font-semibold text-base">
        Please choose curriculum which you need
      </h1>
      <el-divider></el-divider>
    </div>
    <div class="space-y-6 mt-10" v-loading="loading">
      <div class="flex flex-wrap gap-8">
        <div
          v-for="year of filteredAndSortedYears"
          :key="year.id"
          class="card flex flex-col justify-center gap-6 px-4 py-7"
        >
          <h1 class="card__title">
            {{ year.name }}
          </h1>
          <div class="grid grid-cols-2 gap-2">
            <el-button color="#393939" @click="openCurriculumDialog(year)"
              ><SvgIcon name="local-book-open-text" color="white" size="16" />
              <span class="text-xs ml-1">Show curriculum</span></el-button
            >
            <el-button
              color="#895AF5"
              @click="
                router.push({
                  name: 'academic-managment-levels',
                  params: {
                    program: currentProgram.id,
                    year: year.id,
                  },
                })
              "
              ><SvgIcon name="local-go-in" color="white" size="16" />
              <span class="text-xs ml-1">Go in</span></el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <teleport to="#modal" v-if="showModal">
    <ViewCurriculumCoursesDialog :curriculum="currentCurriculum" />
  </teleport>
</template>

<script setup lang="ts">
import { ArrowRight } from "@element-plus/icons-vue";
import { useCurriculumStore, useGuideStore } from "@/stores";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useModal } from "@/composables";

import ViewCurriculumCoursesDialog from "./components/ViewCurriculumCoursesDialog.vue";

const route = useRoute();
const router = useRouter();
const curriculumStore = useCurriculumStore();
const guideStore = useGuideStore();
const modal = useModal();

const curriculumYears = computed(() => curriculumStore.curriculumYear);
const tuitions = computed(() => guideStore.tuitions);
const currentCurriculum = ref();
const currentProgram = ref();
const loading = computed(() => curriculumStore.loading);
const showModal = computed(() => modal.show.value);

onMounted(async () => {
  curriculumStore.fetchCurriculumYear(route.params.program as string);
  if (tuitions.value.length === 0) await guideStore.fetchTuitions();

  currentProgram.value = tuitions.value.find(
    (tuition: any) => tuition.id === route.params.program
  );
});
// Curriculum List Year
let filteredAndSortedYears = computed(() => {
  const sortedYears = [...curriculumYears.value].sort((a: any, b: any) => {
    const startYearA = parseInt(a.name.match(/\d{4}/)[0]);
    const startYearB = parseInt(b.name.match(/\d{4}/)[0]);
    return startYearA - startYearB;
  });
  return sortedYears;
});

const openCurriculumDialog = (curriculum: any) => {
  currentCurriculum.value = curriculum;
  modal.setTitle(currentProgram.value?.program);
  modal.setWidth("65vw");
  modal.showModal();
};
</script>

<style scoped lang="scss">
.card {
  border-radius: 17.505px;
  background: #fff;
  box-shadow: 0.53488px 0.53488px 5.34882px 0.2334px rgba(0, 0, 0, 0.25);
  width: 350px;
  height: 159px;
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
