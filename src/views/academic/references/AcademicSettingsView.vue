<template>
  <div class="mx-auto">
    <div class="relative pb-4">
      <h1 class="text-text-900 font-semibold text-3xl mb-2">
        Academic Settings
      </h1>
      <el-tabs v-model="activeTab" @tab-change="handleClick">
        <el-tab-pane
          v-for="item of academicItems"
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
const academicItems: ControlItem[] = [
  {
    label: "Schools and Programs",
    value: "schools-view",
  },
  {
    label: "Curriculum and student progression",
    value: "reference-curriculum",
  },
  {
    label: "Course catalogue",
    value: "course-referance",
  },
  {
    label: "Student catalogue",
    value: "reference-students",
  },

  // {
  //   label: "Published transcript & Total grades",
  //   value: "masterdata-lesson-types",
  // },
];

const activeTab = ref("all");

const handleClick = (value: any) => {
  activeTab.value = value;
  router.push({ name: value });
};

onMounted(() => {
  const childRoute = academicItems.find(
    (item) => item.value === router.currentRoute.value.name
  );
  if (childRoute) {
    activeTab.value = childRoute.value as string;
  } else {
    router.push({ name: academicItems[0].value as string });
  }
});
</script>

<style scoped></style>
