<template>
  <template
    class="app-navigation gap-x-4 md:gap-x-16 py-2 px-4 md:py-5 md:px-20"
  >
    <div
      v-for="item of navigationItems.dashboard"
      :key="item.title"
      class="leading-none"
    >
      <RouterLink
        :to="item.route"
        v-slot="{ isActive }"
        active-class="active-route"
        class="flex items-center space-x-2 navigation-item"
        v-if="!item.childrens"
      >
        <div class="flex items-center space-x-2">
          <component
            v-if="isActive"
            :is="item.icon"
            classes="h-4 w-4 fill-purple"
          ></component>
          <span>{{ item.shortName }}</span>
        </div>
      </RouterLink>

      <el-dropdown v-else trigger="click" placement="bottom">
        <div
          class="flex items-center justify-center space-x-2 navigation-item"
          :class="{
            'active-route': checkToActive(item.route),
          }"
        >
          <component :is="item.icon" classes="h-4 w-4 left-icon"></component>
          <span>{{
            checkToActive(item.route)
              ? $t(`app.${route.name as any}`)
              : item.shortName
          }}</span>
          <el-icon>
            <arrow-down />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="purple-dropdown">
            <el-dropdown-item
              v-for="child of item.childrens"
              :key="child.title"
              class="flex items-center space-x-3 !py-2 w-44"
              @click="router.push(child.route)"
            >
              <span class="text-purple">{{ child.shortName }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </template>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { navigationItems } from "@/utils/constants";

const route = useRoute();
const router = useRouter();
const checkToActive = (url: string) => {
  return route.matched.some((item) => {
    return item.path.includes(url);
  });
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/colors.scss";
.app-navigation {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: scroll;
  border-radius: 0px 0px 30px 30px;
  .navigation-item {
    font-weight: 700;
    font-size: 14px;
    line-height: 19px;
    color: #8992a9;
    &:hover {
      color: $purple;
    }
    .left-icon {
      display: none;
    }
  }
  .active-route {
    background-color: $bg-purple;
    padding: 16px 17px;
    border-radius: 10px;
    color: $purple;

    .navigation-item {
      color: $purple;
    }
    .left-icon {
      fill: $purple;
      display: block;
    }
  }
}
</style>
