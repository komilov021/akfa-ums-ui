<template>
  <div>
    <h1 class="text-[#323232] text-[22px] font-bold mb-7">
      Academic managment
    </h1>
    <div class="grid grid-cols-3 gap-10">
      <div
        class="card relative flex items-center justify-between gap-2 cursor-pointer"
        v-for="card in cardItems"
        :key="card.icon"
        @click="router.push(card.route)"
      >
        <div class="flex items-center gap-4">
          <SvgIcon :name="card.icon" :size="card.size || '48'" />
          <div class="space-y-2">
            <h1 class="font-medium text-[#1B1B1B] text-lg leading-none">
              {{ card.title }}
            </h1>
            <h2 class="text-[#7C7C7C]">{{ card.description }}</h2>
          </div>
        </div>
        <div>
          <el-icon :size="20"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICardItem } from "@/models/frontend";
import { useRouter } from "vue-router";
const router = useRouter();
const cardItems: ICardItem[] = [
  {
    title: "Assigned courses",
    description: "Manage your asigned course",
    icon: "local-book-closed",
    route: "/academic/managment/courses",
  },
  {
    title: "Assigned students",
    description: "Manage all information of asigned students",
    icon: "local-student",
    route: "",
    size: "60",
  },
  {
    title: "Schools and programs",
    description: "Manage your schools and programms",
    icon: "local-backpack",
    route: "",
  },
  {
    title: "Transcript and grades",
    description: "Manage student’s transcript and grades",
    icon: "local-exam",
    route: "",
  },
];
</script>

<style scoped lang="scss">
.card {
  border-radius: 17.505px;
  background: #fff;
  box-shadow: 0.53488px 0.53488px 5.34882px 0.2334px rgba(0, 0, 0, 0.25);
  padding: 25px;
  height: 120px;
}
</style>
