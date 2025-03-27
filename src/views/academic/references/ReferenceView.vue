<template>
  <div class="mx-auto mt-6 md:mt-0">
    <h1 class="text-main font-bold text-lg">Reference tables</h1>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <RouterLink
        v-for="item of cardItems"
        :key="item.title"
        class="flex items-center gap-4 card px-4 py-6"
        :to="item.route"
      >
        <SvgIcon :name="item.icon" color="transparent" size="28" />
        <div class="flex items-center justify-between gap-2 w-full">
          <h1 class="text-gray700 card__title">
            {{ item.title }}
          </h1>
          <el-icon><ArrowRightBold /></el-icon>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ICardItem } from "@/models/frontend";
import { RouterLink } from "vue-router";

const cardItems: ICardItem[] = [
  {
    title: "Employee degrees, roles and positions",
    route: "/academic/reference/roles-positions",
    icon: "local-user-right",
  },
  {
    title: "Program degree types",
    route: "/academic/reference/degree-types",
    icon: "local-filter-line",
  },
  {
    title: "School and programs management",
    route: "/academic/reference/schools-programs",
    icon: "local-graduation",
  },
  {
    title: "Prerequisite tests",
    route: "/academic/reference/prequisite-tests",
    icon: "local-bar-chart",
  },
  {
    title: "Grade components",
    route: "/academic/reference/grade-components",
    icon: "local-awward",
  },
  {
    title: "Lesson types",
    route: "/academic/reference/lesson-types",
    icon: "local-list",
  },
  {
    title: "All courses",
    route: "/academic/reference/course-referance",
    icon: "local-file",
  },
  {
    title: "Academic years and semesters",
    route: "",
    icon: "local-callendar-date",
  },
  {
    title: "Curriculum & student progression",
    route: "",
    icon: "local-file-download",
  },
];
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
