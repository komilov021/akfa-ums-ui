<template>
  <div class="mx-auto mt-2">
    <div class="relative pb-4">
      <h1 class="text-text-900 font-semibold text-3xl mb-2">
        Master data Settings
      </h1>
      <el-tabs v-model="activeTab" @tab-change="handleClick">
        <el-tab-pane
          v-for="item of masterdataItems"
          :key="item.value"
          :label="item.label"
          :name="(item.value as any)"
        />
      </el-tabs>
    </div>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { ControlItem } from "@/models/frontend";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const masterdataItems: ControlItem[] = [
  {
    label: "Program degree types",
    value: "masterdata-degree-types",
  },
  {
    label: "Academic years & semesters",
    value: "masterdata-years-semesters",
  },
  {
    label: "Prerequisite tests",
    value: "masterdata-prequisite-tests",
  },
  {
    label: "Grade components",
    value: "masterdata-grade-components",
  },
  {
    label: "Lesson types",
    value: "masterdata-lesson-types",
  },
  {
    label: "Rooms",
    value: "masterdata-rooms",
  },
  {
    label: "Scholarships",
    value: "scholarships",
  },
];

const activeTab = ref<any>("all");

const handleClick = (value: any) => {
  activeTab.value = value;
  router.push({ name: value });
};

onMounted(() => {
  const childRoute = masterdataItems.find(
    (item) => item.value === router.currentRoute.value.name
  );
  if (childRoute) {
    activeTab.value = childRoute.value as string;
  } else {
    router.push({ name: masterdataItems[0].value as string });
  }
});
</script>

<style scoped></style>
