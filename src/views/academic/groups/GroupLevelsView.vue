<template>
  <div class="mt-2">
    <el-breadcrumb :separator-icon="ArrowRight" class="mb-2">
      <el-breadcrumb-item
        :to="{ path: `/academic/groups` }"
        class="underline cursor-pointer"
        ><span class="!text-primary font-semibold text-base">
          {{ decodeURIComponent(route.params.semester as string) }}
        </span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <div class="space-y-6 mt-6">
      <div class="flex flex-wrap gap-8">
        <div
          v-for="level of [1, 2, 3, 4, 5, 6]"
          :key="level"
          class="card flex flex-col justify-center gap-6 px-4 py-7"
          @click="
            router.push({
              name: 'group-courses-view',
              params: {
                level: level,
              },
            })
          "
        >
          <h1 class="card__title">Level {{ level }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
</script>

<style scoped lang="scss">
.card {
  border-radius: 17.505px;
  background: #fff;
  box-shadow: 0.53488px 0.53488px 5.34882px 0.2334px rgba(0, 0, 0, 0.25);
  width: 350px;
  text-align: center;
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
