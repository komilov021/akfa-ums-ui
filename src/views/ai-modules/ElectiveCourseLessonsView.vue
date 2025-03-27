<template>
  <div class="elective-course-lessons-wrapper flex flex-row flex-wrap gap-8">
    <header-title
      title="Lessons"
      subTitle="Please choose a lesson which you need"
    />
    <template v-if="lessons.length">
      <div
        v-for="(lesson, index) of lessons"
        :key="index"
        class="flex flex-wrap"
        @click="
          router.push({
            name: 'elective-course-lesson-detail',
            params: {
              lesson_id: lesson.lesson_id,
            },
          })
        "
      >
        <div class="card flex items-center justify-center gap-6 px-6 py-7">
          <div class="flex flex-col gap-2 flex-1">
            <h1 class="card__title">Lesson - {{ index + 1 }}</h1>
            <h2 class="card__subtitle">
              {{ lesson.event_start }} - {{ lesson.event_end }}
            </h2>
          </div>
          <el-icon :size="20"><ArrowRight /></el-icon>
        </div>
      </div>
    </template>
    <div v-else class="w-full my-14 text-center">
      No Elective module lessons are added yet.
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import { useTimetableStore } from "@/stores";
import { useRouter, useRoute } from "vue-router";
import { format, sub } from "date-fns";
import { TIME_FORMAT } from "@/utils/constants";
import HeaderTitle from "./components/HeaderTitle.vue";

const router = useRouter();
const route = useRoute();

const timetableStore = useTimetableStore();

const dateWithTime = (date: string) => {
  const subtructedFiveHours = sub(new Date(date), { hours: 5 });
  return format(new Date(subtructedFiveHours), TIME_FORMAT);
};

const lessons = computed(() =>
  timetableStore.lessonsByFlowGroupId.map((lesson) => ({
    ...lesson,
    event_start: dateWithTime(lesson.event_start),
    event_end: dateWithTime(lesson.event_end),
  }))
);

onMounted(async () => {
  await timetableStore.fetchLessonsByFlowGroupId(
    route?.params.flow_group_id as string
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
