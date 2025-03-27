<template>
  <div id="app">
    <div class="flex justify-center bg-gray-50 min-h-screen">
      <div class="flex flex-nowrap space-x-6 overflow-x-auto p-4 h-full">
        <div
          v-for="task in tasks"
          :key="task.column_id"
          :data-column-id="task.column_id"
          ref="columnRefs"
          class="w-80 bg-white rounded-lg shadow p-4 flex-shrink-0"
        >
          <div class="flex justify-between items-center border-b pb-2 mb-3">
            <h2 class="text-gray-800 font-bold text-lg">{{ task.column }}</h2>
          </div>

          <div class="overflow-y-auto max-h-[600px] pr-2">
            <draggable
              :list="task.tasks"
              group="tasks"
              :animation="200"
              ghost-class="ghost-card"
              item-key="id"
              @end="(event) => onTaskMoved(event)"
            >
              <template #item="{ element }">
                <div :data-task-id="element.id">
                  <TaskCards
                    :task="element"
                    :kanbanId="kanbanId"
                    class="mt-3 cursor-move"
                  />
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, nextTick, onMounted, ref, watch } from "vue";
import draggable from "vuedraggable";
import { useTasksStore } from "@/stores/tasks";
import TaskCards from "../kanban/TaskCards.vue";

const props = defineProps({
  kanbanId: {
    type: String,
    required: true,
  },
  kanbanType: {
    type: String,
    required: true,
  },
});
const columnRefs = ref<HTMLElement[]>([]);
const appTasksStore = useTasksStore();
const tasks = computed(() => appTasksStore.boardData?.data ?? []);

const onTaskMoved = async (event: any) => {
  const { from, to } = event;

  const oldColumnId = from.closest("[data-column-id]")?.dataset?.columnId;
  const newColumnId = to.closest("[data-column-id]")?.dataset?.columnId;

  if (!oldColumnId || !newColumnId) {
    console.error("Column IDs not found. Check your HTML structure.");
    return;
  }
  const taskId = event.item?.dataset?.taskId;

  if (!taskId) {
    console.error("Task ID not found in event.item");
    return;
  }

  const movedTask = tasks.value
    .flatMap((col) => col.tasks)
    .find((task) => task.id === taskId);

  if (!movedTask) {
    console.error("Task not found in local state");
    return;
  }

  const oldColumn = tasks.value.find((col) => col.column_id === oldColumnId);
  const newColumn = tasks.value.find((col) => col.column_id === newColumnId);

  if (!oldColumn || !newColumn) {
    console.error("Column not found");
    return;
  }

  if (oldColumnId === newColumnId) {
    newColumn.tasks.forEach((task, index) => {
      task.order_index = index + 1;
    });

    await updateTask(movedTask.id, newColumnId, movedTask.order_index);
  } else {
    movedTask.column_id = newColumnId;
    oldColumn.tasks.forEach((task, index) => {
      task.order_index = index + 1;
    });

    newColumn.tasks.forEach((task, index) => {
      task.order_index = index + 1;
    });

    await updateTask(movedTask.id, newColumnId, movedTask.order_index);
  }
  await nextTick();
  const newColumnIndex = tasks.value.findIndex(
    (col) => col.column_id === newColumnId
  );

  if (newColumnIndex !== -1) {
    const targetColumn = columnRefs.value[newColumnIndex];

    if (targetColumn && targetColumn instanceof HTMLElement) {
      targetColumn.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center",
      });
    }
  }
};

const updateTask = async (
  taskId: string,
  columnId: string,
  order_index: number
) => {
  try {
    await appTasksStore.changeTask(taskId, {
      column_id: columnId,
      order_index,
    });

    await appTasksStore.updateGlobal({
      task_id: taskId,
      column_id: columnId,
    });
  } catch (error) {
    console.error("Error in updateTask:", error);
  }
};

onMounted(async () => {
  await appTasksStore.getColumnsWithTasks(props.kanbanId);
  await appTasksStore.getAllDynamicFields(props.kanbanId);
  await appTasksStore.checkTuitionFee();
});

watch(
  () => props.kanbanId,
  async (newVal) => {
    await appTasksStore.getColumnsWithTasks(newVal);
    await appTasksStore.getAllDynamicFields(newVal);
    await appTasksStore.checkTuitionFee();
  }
);
</script>

<style scoped>
.ghost-card {
  opacity: 0.5;
  background: #f7fafc;
  border: 1px solid #b4a0e3;
}

/* Стили для скроллов */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: #a0aec0;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #718096;
}
</style>
