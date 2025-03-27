<template>
  <div class="box h-screen flex flex-col">
    <div>
      <KanbanNavigation :kanbans="kanbans" />
    </div>

    <div class="border"></div>

    <div class="flex-1 overflow-x-auto overflow-y-hidden">
      <div class="flex space-x-6 min-w-max h-full">
        <KanbanContent
          v-if="
            selectedKanbanType &&
            selectedKanbanType === 'applications' &&
            selectedKanbanId
          "
          :kanban-id="selectedKanbanId"
          :kanbanType="selectedKanbanType"
        />

        <KanbanExamContent
          v-if="
            selectedKanbanType &&
            selectedKanbanType === 'exam' &&
            selectedKanbanId
          "
          :kanbanId="selectedKanbanId"
          :kanbanType="selectedKanbanType"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useKanbanStore } from "@/stores/kanban";
import KanbanNavigation from "./kanban/KanbanNavigation.vue";
import KanbanContent from "./kanban/KanbanContent.vue";
import KanbanExamContent from "./kanban/KanbanExamContent.vue";
import { useRoute } from "vue-router";

const appKanbanStore = useKanbanStore();
const route = useRoute();

const kanbans = computed(() => appKanbanStore.sections_with_kanban.data || []);
const selectedKanbanId = ref<string | null>(null);
const selectedKanbanType = ref<string | null>(null);

onMounted(async () => {
  await appKanbanStore.getSectionsWithKanban();
});

watch(
  () => route.query,
  (changeVal) => {
    if (changeVal.id && changeVal.type) {
      selectedKanbanId.value = changeVal.id as string;
      selectedKanbanType.value = changeVal.type as string;
    }
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>
.box {
  display: flex;
  flex-direction: row;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.box .overflow-x-auto {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}

.box .space-x-6 > * + * {
  margin-left: 1.5rem;
}

.box .min-w-max {
  min-width: 100%;
  height: 100%;
}
</style>
