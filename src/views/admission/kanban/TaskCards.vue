<template>
  <div
    class="relative rounded-md bg-white shadow transition-shadow hover:shadow-md border-l-4 border-purple p-4"
  >
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-base font-semibold text-gray-800">
        {{ `${task.name || ""} ${task.surname || ""}` }}
      </h3>
    </div>

    <p v-if="task.email" class="text-sm text-gray-600 mb-2">
      {{ task.email }}
    </p>

    <div class="mt-1 flex items-center justify-between">
      <span class="text-xs font-medium text-gray-400">
        Passport: {{ task.passport_id }}
      </span>
      <el-button
        class="!p-0 !w-9 !h-6 flex items-center justify-center bg-white text-gray-600 rounded-lg shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300"
        @click="openTaskModal(task.id)"
      >
        <el-icon class="text-xl">
          <View />
        </el-icon>
      </el-button>
    </div>

    <el-dialog
      v-model="showModal"
      title="Task Details"
      width="50%"
      :close-on-click-modal="false"
    >
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="(value, key) in filteredEditableFields"
          :key="key"
          class="flex flex-col"
        >
          <label
            :for="String(key)"
            class="text-sm font-semibold text-gray-600 capitalize"
          >
            {{ String(key).replace(/_/g, " ") }}
          </label>
          <input
            v-model="editableFields[key]"
            :id="String(key)"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2"
            :type="typeof editableFields[key] === 'number' ? 'number' : 'text'"
          />
        </div>
      </div>

      <p class="mt-6 text-xl font-semibold text-gray-800">Extra Fields</p>
      <div class="grid grid-cols-2 gap-4 mt-2">
        <div
          v-for="(value, key) in dynamicFields"
          :key="key"
          class="flex flex-col"
        >
          <label
            :for="String(key)"
            class="text-sm font-semibold text-gray-600 capitalize"
          >
            {{ String(key).replace(/_/g, " ") }}
          </label>
          <input
            v-model="dynamicFields[key]"
            :id="String(key)"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2"
            type="text"
            :placeholder="'Enter ' + key"
          />
        </div>
      </div>

      <p class="mt-6 text-xl font-semibold text-gray-800">Documents</p>
      <div class="mt-4 grid grid-cols-2 gap-4">
        <div v-if="passportF" class="bg-white border p-4 rounded shadow">
          <h4 class="font-semibold mb-2">Passport Front</h4>
          <DocumentPreview :fileData="passportF" />
        </div>

        <div v-if="passportB" class="bg-white border p-4 rounded shadow">
          <h4 class="font-semibold mb-2">Passport Back</h4>
          <DocumentPreview :fileData="passportB" />
        </div>

        <div v-if="diploma" class="bg-white border p-4 rounded shadow">
          <h4 class="font-semibold mb-2">Diploma</h4>
          <DocumentPreview :fileData="diploma" />
        </div>

        <div v-if="extraDocument" class="bg-white border p-4 rounded shadow">
          <h4 class="font-semibold mb-2">Extra Document</h4>
          <DocumentPreview :fileData="extraDocument" />
        </div>
      </div>

      <div class="flex justify-end space-x-3 mt-6">
        <el-button type="primary" @click="saveChanges">Save Changes</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ElButton, ElIcon, ElDialog, ElMessage } from "element-plus";
import { View } from "@element-plus/icons-vue";
import { useTasksStore } from "@/stores/tasks";

import DocumentPreview from "./DocumentPreview.vue";

const props = defineProps<{
  task: {
    id: string;
    name?: string;
    surname?: string;
    email?: string;
    passport_id?: string;
    passport_f?: any;
    passport_b?: any;
    diploma?: any;
    extra_document?: any;
  };
  kanbanId: string;
}>();

const tasksStore = useTasksStore();

const showModal = ref(false);
const modalTask = ref<any>(null);

const editableFields = ref<Record<string, string | number>>({});
const dynamicFields = ref<Record<string, string>>({});

const passportF = ref<any>(null);
const passportB = ref<any>(null);
const diploma = ref<any>(null);
const extraDocument = ref<any>(null);

const filteredEditableFields = computed(() =>
  Object.entries(editableFields.value)
    .filter(
      ([key]) =>
        key !== "id" &&
        key !== "column_id" &&
        key !== "order_index" &&
        key !== "created_by" &&
        key !== "created_at" &&
        key !== "program_id" &&
        key !== "first_phone_number" &&
        key !== "email"
    )
    .reduce<Record<string, string | number>>((acc, [key, value]) => {
      if (typeof value === "string" || typeof value === "number") {
        acc[key] = value;
      }
      return acc;
    }, {})
);

const openTaskModal = async (id: string) => {
  await tasksStore.getOneTask(id);
  modalTask.value = tasksStore.task;

  if (modalTask.value) {
    editableFields.value = Object.entries(modalTask.value)
      .filter(([, val]) => typeof val === "string" || typeof val === "number")
      .reduce<Record<string, string | number>>((acc, [key, val]) => {
        acc[key] = val as string | number;
        return acc;
      }, {});

    dynamicFields.value = Object.entries(
      modalTask.value.dynamic_fields || {}
    ).reduce<Record<string, string>>((acc, [key, val]) => {
      acc[key] = val === null ? "" : String(val);
      return acc;
    }, {});

    passportF.value = modalTask.value.passport_f || null;
    passportB.value = modalTask.value.passport_b || null;
    diploma.value = modalTask.value.diploma || null;
    extraDocument.value = modalTask.value.extra_document || null;

    showModal.value = true;
  }
};

const saveChanges = async () => {
  if (modalTask.value) {
    const sanitizedDynamicFields = Object.entries(dynamicFields.value).reduce<
      Record<string, string>
    >((acc, [k, v]) => {
      acc[k] = v || "";
      return acc;
    }, {});

    const updatedTask = {
      ...editableFields.value,
      dynamic_fields: sanitizedDynamicFields,
      passport_f: passportF.value,
      passport_b: passportB.value,
      diploma: diploma.value,
      extra_document: extraDocument.value,
    };

    await tasksStore.changeTask(modalTask.value.id, updatedTask);

    await tasksStore.getColumnsWithTasks(props.kanbanId);

    ElMessage.success("Task updated successfully!");
    showModal.value = false;
  }
};
</script>

<style scoped></style>
