<template>
  <div>
    <div>
      <h1 class="text-text-900 font-semibold text-3xl">Programs</h1>
      <h1 class="text-[#7C7C7C] font-semibold text-base">
        Please choose program which you need
      </h1>
      <el-divider></el-divider>
    </div>
    <div class="space-y-6" v-loading="loading">
      <div v-for="(school, i) of schoolStore.getSchoolsSelct" :key="i">
        <div
          class="school cursor-pointer px-6 py-3 flex items-center justify-between"
          @click="onSchoolClick(school)"
        >
          <h1>{{ school.label }}</h1>
          <el-icon v-if="!school.is_open"><ArrowDown /></el-icon>
          <el-icon v-else><ArrowUp /></el-icon>
        </div>
        <div v-if="school.is_open" class="flex flex-wrap gap-8 py-6">
          <div
            v-for="program of getProgramsBySchool(school.value)"
            :key="program.id"
            class="program flex items-center gap-4 px-6 py-7"
            @click="
              router.push({
                name: 'academic-pab-curriculum',
                params: { program: program.id },
              })
            "
          >
            <div class="flex flex-col justify-between h-full flex-1">
              <h1 class="program__title">
                {{ program.program }}
              </h1>
              <h2 class="program__subtitle">Available curriculums - {{}}</h2>
            </div>
            <el-icon :size="20"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Value } from "@/models/frontend";
import { useGuideStore, useSchoolStore } from "@/stores";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const schoolStore = useSchoolStore();
const guideStore = useGuideStore();
const loading = ref(false);
const router = useRouter();
const tuitions = computed(() => guideStore.tuitions);

onMounted(() => {
  schoolStore.fetchSchools({
    page: 1,
    limit: 30,
  });
  guideStore.fetchTuitions();
});

const onSchoolClick = (school: any) => {
  schoolStore.changeOpen(school.value);
};

const getProgramsBySchool = (schoolId: Value) => {
  return tuitions.value.filter(
    (tuition: any) => tuition.school?.id === schoolId
  );
};
</script>

<style scoped lang="scss">
.school {
  border-radius: 17.505px;
  background: #fff;
  box-shadow: 0.53488px 0.53488px 5.34882px 0.2334px rgba(0, 0, 0, 0.25);
}

.program {
  border-radius: 17.505px;
  background: #fff;
  box-shadow: 0.53488px 0.53488px 5.34882px 0.2334px rgba(0, 0, 0, 0.25);
  width: 350px;
  height: 139px;
  &__title {
    color: #1b1b1b;
    font-size: 20px;
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
