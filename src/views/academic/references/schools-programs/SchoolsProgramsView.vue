<template>
  <div class="mx-auto mt-6 md:mt-0">
    <h1 class="text-main font-bold text-lg">
      Employee degrees, roles, positions
    </h1>
    <div class="grid md:grid-cols-3 mt-6">
      <div class="flex flex-col gap-6">
        <RouterLink
          v-for="item of cardItems"
          :key="item.title"
          class="flex items-center gap-4 card px-4 py-6"
          :to="item.route"
        >
          <SvgIcon :name="item.icon" color="transparent" size="28" />
          <div class="flex items-center justify-between w-full gap-2">
            <h1 class="text-gray700 card__title">
              {{ item.title }}
            </h1>
            <el-icon><ArrowRightBold /></el-icon>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ICardItem } from "@/models/frontend";
import { RouterLink } from "vue-router";

const cardItems: ICardItem[] = [
  {
    title: "Programs managment",
    route: "/academic/schools",
    icon: "local-user-business",
  },
  // {
  //   title: "Employee teams and positions",
  //   route: "",
  //   icon: "local-users",
  // },
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
