<template>
  <div class="h-full flex flex-col grow">
    <div class="relative pb-4">
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
    label: "Assigned courses",
    value: "academic-managment-courses",
  },
  {
    label: "Schools and programs",
    value: "course-referance",
  },
  {
    label: "Assigned students",
    value: "reference-curriculum",
  },

  {
    label: "Transcript and grades",
    value: "reference-students",
  },
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
