<template>
  <div class="flex items-center justify-between mb-10">
    <h3 class="font-medium text-3xl">
      {{ $t(breadcrumbItems[breadcrumbItems.length - 1].name) }}
    </h3>
    <el-breadcrumb separator=">" class="app-breadcrumb">
      <el-breadcrumb-item
        v-for="item of breadcrumbItems"
        :key="item.name"
        :to="item.path ?? ''"
        >{{ $t(item.name) }}</el-breadcrumb-item
      >
    </el-breadcrumb>
  </div>
</template>

<script lang="ts">
import { watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { IBreadcrumb } from "@/models/frontend";
import { breadCrumbNames } from "@/utils/constants";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const applicationRoutes = router.getRoutes();
    const mainBreadcrumbItem: IBreadcrumb = {
      name: breadCrumbNames.dashboard,
      path: "/",
    };
    const currentRoute = ref();
    let breadcrumbItems = ref<IBreadcrumb[]>([]);

    watch(
      () => route.name,
      () => {
        breadcrumbItems.value = [mainBreadcrumbItem];
        const currentRoutes = route.matched
          .map((x) => x.name)
          .filter((x) => x !== "dashboard");
        currentRoutes.forEach((item, index) => {
          currentRoute.value = applicationRoutes.find((i) => i.name === item);
          if (item !== undefined) {
            if (item in breadCrumbNames && currentRoute.value) {
              const breadcrumbItem: IBreadcrumb = {
                name: breadCrumbNames[
                  item as unknown as keyof typeof breadCrumbNames
                ],
              };

              if (index + 1 !== currentRoutes.length) {
                breadcrumbItem["path"] = currentRoute.value.path;
              }
              breadcrumbItems.value.push(breadcrumbItem);
            }
          }
        });
      },
      { immediate: true }
    );

    return {
      breadcrumbItems,
      currentRoute,
    };
  },
};
</script>

<style lang="scss" scoped></style>
