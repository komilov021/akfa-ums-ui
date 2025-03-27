<template>
  <div class="flex flex-col gap-2">
    <div>
      <el-button type="primary" @click="openDrawer">
        <el-icon><Menu /></el-icon>
      </el-button>
    </div>

    <div>
      <el-button type="success" @click="openAddColumnModal">
        <el-icon><CirclePlus /></el-icon>
      </el-button>
    </div>
  </div>

  <el-drawer
    v-model="drawer"
    title="Kanban Menu"
    :with-header="true"
    direction="ltr"
    size="450px"
  >
    <div class="kanban-drawer-container">
      <div class="header">
        <el-button type="primary" size="small" @click="openAddKanbanModal">
          Add Kanban
        </el-button>
        <el-button type="primary" size="small" @click="openAddSectionModal">
          Add Section
        </el-button>
      </div>

      <div class="tree">
        <div v-for="kan in kanbans" :key="kan.section" class="tree-node">
          <div class="tree-node-header flex items-center justify-between">
            <div class="flex items-center">
              <span class="tree-node-icon">📂</span>
              <span class="tree-node-title">{{ kan.section }}</span>
            </div>
            <button
              v-if="kan.kanbans.length === 0"
              style="margin-right: 10px"
              class="h-6 w-5 bg-white text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-300"
              @click="deleteSection(kan.section_id)"
            >
              <el-icon class="flex-1 justify-center items-center"
                ><Delete
              /></el-icon>
            </button>
          </div>
          <div class="tree-node-content">
            <div
              v-for="item in kan.kanbans"
              :key="item.id"
              class="tree-leaf"
              :class="{ 'selected-kanban': selectedKanbanId === item.id }"
              @click="selectKanban(item.id, item.kanban_type)"
            >
              <div class="flex items-center justify-between">
                <div>{{ item.name }}</div>
                <div class="flex space-x-2">
                  <button
                    class="h-6 w-5 bg-white text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-300"
                    @click="openUpdateKanbanModal(item.id, item.name)"
                  >
                    <el-icon class="flex-1 justify-center items-center"
                      ><Edit
                    /></el-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>

  <el-dialog v-model="addSectionModalVisible" title="Add new section">
    <el-form ref="addSectionForm" :model="newSection" class="space-y-4">
      <el-form-item class="flex items-center">
        <label class="w-1/4 font-medium text-gray-700">Name</label>
        <el-input v-model="newSection.name" class="flex-1" />
      </el-form-item>
      <el-form-item class="flex items-center">
        <label class="w-1/4 font-medium text-gray-700">Description</label>
        <el-input v-model="newSection.description" class="flex-1" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="flex justify-end space-x-2">
        <el-button @click="addSectionModalVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addSection">Add</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="addKanbanModalVisible" title="Add new kanban">
    <el-form ref="addKanbanForm" :model="newKanban" class="space-y-4">
      <el-form-item class="flex items-center">
        <label class="w-1/4 font-medium text-gray-700">Name</label>
        <el-input v-model="newKanban.name" class="flex-1"></el-input>
      </el-form-item>
      <el-form-item class="flex items-center">
        <label class="w-1/4 font-medium text-gray-700">Section</label>
        <el-select
          v-model="newKanban.section_id"
          placeholder="Select a section"
          class="flex-1"
        >
          <el-option
            v-for="section in sections"
            :key="section.id"
            :label="section.name"
            :value="section.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="flex justify-end space-x-2">
        <el-button @click="addKanbanModalVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addKanban">Add</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    v-model="addColumnModalVisible"
    title="Manage Columns"
    :center="true"
    width="600px"
  >
    <div v-if="columns.length === 0" class="text-center">
      <p class="text-gray-500">No columns available. Add a new one!</p>
    </div>

    <div v-else class="space-y-4">
      <draggable
        v-model="columns"
        @end="(event) => onDragEnd(event)"
        class="space-y-4"
        item-key="id"
        group="columns"
        :animation="200"
        ghost-class="ghost-card"
      >
        <template #item="{ element }">
          <div
            class="p-4 border rounded-md shadow-sm flex items-center justify-between"
          >
            <div class="flex items-center">
              <i class="drag-handle cursor-move mr-4 el-icon-s-operation"></i>
              <el-input
                v-model="element.name"
                placeholder="Column Name"
                class="w-48"
                @blur="updateColumn(element)"
              />
            </div>
            <div>
              <el-button
                type="danger"
                icon="Delete"
                @click="deleteColumn(element.id)"
                circle
              />
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <div class="mt-6">
      <el-form :model="newColumn" label-position="top">
        <el-form-item label="Column Name" class="flex items-center">
          <el-input
            v-model="newColumn.name"
            placeholder="Enter column name"
            class="w-full"
          />
        </el-form-item>
      </el-form>
      <div class="flex justify-end mt-4 space-x-2">
        <el-button type="primary" @click="addColumn">Add Column</el-button>
        <el-button type="success" @click="saveChanges">Save Changes</el-button>
      </div>
    </div>
  </el-dialog>

  <el-dialog
    v-model="updateKanbanModalVisible"
    title="Manage Kanban"
    :center="true"
    width="500px"
    custom-class="custom-kanban-dialog"
  >
    <div class="space-y-6">
      <div class="rename-kanban">
        <label class="block text-sm font-semibold text-gray-800">
          Kanban Name
        </label>
        <input
          v-model="editableKanbanName"
          class="border rounded-lg p-2 w-full text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter Kanban Name"
        />
      </div>

      <div v-if="selectedKanbanType === 'applications'" class="dynamic-fields">
        <label class="block text-sm font-semibold text-gray-800">
          Dynamic Fields
        </label>
        <div v-if="dynamicFieldsKeys.length > 0" class="space-y-3 mt-2">
          <div
            v-for="key in dynamicFieldsKeys"
            :key="key"
            class="flex items-center justify-between bg-white shadow-sm p-2 rounded-lg border border-gray-200"
          >
            <input
              type="text"
              :value="key"
              class="border rounded-lg p-2 flex-1 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              @blur="(e) => updateField(key, (e.target as HTMLInputElement).value)"
              placeholder="Field Key"
            />
            <el-button
              type="danger"
              icon="Delete"
              size="small"
              @click="deleteField(key)"
              class="ml-2"
            />
          </div>
        </div>
        <div v-else class="text-gray-500 text-sm mt-2">
          No dynamic fields added yet.
        </div>
      </div>

      <div v-if="selectedKanbanType === 'applications'" class="add-new-field">
        <label class="block text-sm font-semibold text-gray-800">
          Add New Dynamic Field
        </label>
        <div class="flex items-center mt-2">
          <input
            v-model="newFieldKey"
            class="border rounded-lg p-2 flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="New Field Key"
          />
          <el-button type="primary" size="small" class="ml-2" @click="addField">
            Add
          </el-button>
        </div>
      </div>

      <div class="flex justify-end space-x-3 pt-4 border-t mt-4">
        <el-button
          @click="updateKanbanAndTasks"
          type="primary"
          size="small"
          class="px-6"
        >
          Save Changes
        </el-button>
        <el-button
          @click="closeUpdateKanbanModal"
          type="danger"
          size="small"
          class="px-6"
        >
          Cancel
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useKanbanStore } from "@/stores/kanban";
import { useSectionStore } from "@/stores/section";
import type { IColumn, Kanban } from "@/models/backend/kanban.model";
import { useColumnStore } from "@/stores/columns";
import { useTasksStore } from "@/stores/tasks";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import draggable from "vuedraggable";

const props = defineProps<{
  kanbans: Kanban[];
}>();
const route = useRoute();
const router = useRouter();

const appSectionStore = useSectionStore();
const appKanbanStore = useKanbanStore();
const appColumnStore = useColumnStore();
const appTasksStore = useTasksStore();

const drawer = ref(false);
const addColumnModalVisible = ref(false);
const addSectionModalVisible = ref(false);
const addKanbanModalVisible = ref(false);
const updateKanbanModalVisible = ref(false);
const editableKanbanName = ref("");
const newFieldKey = ref("");
const selectedKanbanId = ref<string | null>(null);
const selectedKanbanType = ref<string | null>(null);

const sections = computed(() => appSectionStore.sections);
const columns = computed(() => appColumnStore.columns);
const dynamicFieldsKeys = computed(() => appTasksStore.dynamicFields);

const newSection = ref({
  name: "",
  description: "",
});

const newKanban = ref({
  section_id: "",
  name: "",
});

const newColumn = ref({
  name: "",
  kanban_id: selectedKanbanId.value || "",
  order_index: 0,
});

const openAddSectionModal = () => {
  addSectionModalVisible.value = true;
};

const openDrawer = () => {
  drawer.value = true;
};

const openAddColumnModal = () => {
  addColumnModalVisible.value = true;
};

const openAddKanbanModal = () => {
  newKanban.value.section_id = "";
  newKanban.value.name = "";
  addKanbanModalVisible.value = true;
};

const loadColumns = async (kanbanId: string) => {
  await appColumnStore.getColumns(kanbanId);
};

const deleteSection = async (section_id: string) => {
  await appSectionStore.deleteSection(section_id);
  await appKanbanStore.getSectionsWithKanban();
};

const openUpdateKanbanModal = (kanbanId: string, kanbanName: string) => {
  selectedKanbanId.value = kanbanId;
  editableKanbanName.value = kanbanName;
  newFieldKey.value = "";
  updateKanbanModalVisible.value = true;
};

const closeUpdateKanbanModal = () => {
  updateKanbanModalVisible.value = false;
};

const updateKanbanAndTasks = async () => {
  try {
    updateKanbanModalVisible.value = false;
    await appTasksStore.getColumnsWithTasks(selectedKanbanId.value || "");
  } catch (error) {
    console.error("Error updating kanban and tasks:", error);
  }
};

const addColumn = async () => {
  if (!newColumn.value.name.trim()) {
    ElMessage.warning("Column name cannot be empty");
    return;
  }

  newColumn.value.kanban_id = selectedKanbanId.value || "";

  await appColumnStore.createColumn(newColumn.value);
  await loadColumns(newColumn.value.kanban_id);

  newColumn.value.name = "";
  newColumn.value.order_index = 0;

  ElMessage.success("Column added successfully!");
};

const onDragEnd = async (event: { oldIndex: number; newIndex: number }) => {
  const movedColumn = columns.value[event.oldIndex];

  movedColumn.order_index = event.newIndex + 1;

  try {
    await updateColumn(movedColumn);
    ElMessage.success("Column order updated successfully!");
  } catch (error) {
    ElMessage.error("Failed to update column order");
    console.error("Error updating column order:", error);
  }
};

const updateColumn = async (column: IColumn) => {
  await appColumnStore.changeColumn(column.id, {
    name: column.name,
    order_index: column.order_index,
    kanban_id: column.kanban_id,
  });
  await loadColumns(column.kanban_id);
};

const deleteColumn = async (columnId: string) => {
  ElMessageBox.confirm(
    "Are you sure you want to delete this column?",
    "Warning",
    {
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      type: "warning",
    }
  )
    .then(async () => {
      await appColumnStore.deleteColumn(columnId);
      await loadColumns(selectedKanbanId.value || "");
      ElMessage.success("Column deleted successfully!");
    })
    .catch(() => {
      ElMessage.info("Deletion canceled");
    });
};

const saveChanges = async () => {
  addColumnModalVisible.value = false;
  await appTasksStore.getColumnsWithTasks(selectedKanbanId.value || "");
};

const addSection = async () => {
  if (!newSection.value.name.trim() || !newSection.value.description.trim()) {
    ElMessage.warning("Section name and description cannot be empty");
    return;
  }

  await appSectionStore.createSection({
    name: newSection.value.name.trim(),
    description: newSection.value.description.trim(),
  });

  addSectionModalVisible.value = false;
  newSection.value.name = "";
  newSection.value.description = "";

  ElMessage.success("Section added successfully!");
  await appKanbanStore.getSectionsWithKanban();
};

const addKanban = async () => {
  if (!newKanban.value.section_id || !newKanban.value.name.trim()) {
    ElMessage.warning("Section and Kanban name cannot be empty");
    return;
  }

  await appKanbanStore.createKanban({
    section_id: newKanban.value.section_id,
    name: newKanban.value.name.trim(),
  });

  addKanbanModalVisible.value = false;
  newKanban.value.section_id = "";
  newKanban.value.name = "";

  ElMessage.success("Kanban added successfully!");
  await appKanbanStore.getSectionsWithKanban();
};

const selectKanban = (id: string, type: any) => {
  selectedKanbanId.value = id;
  selectedKanbanType.value = type;
  router.replace({ name: "", query: { id, type } });
  drawer.value = false;
};

const loadDynamicFields = async (kanbanId: string) => {
  try {
    await appTasksStore.getAllDynamicFields(kanbanId);
  } catch (error) {
    console.error("Error loading dynamic fields:", error);
  }
};

const addField = async () => {
  if (!newFieldKey.value.trim()) {
    alert("Field key cannot be empty");
    return;
  }
  try {
    await appTasksStore.createNewDynamicField(selectedKanbanId.value || "", {
      newKey: newFieldKey.value.trim(),
    });
    newFieldKey.value = "";
    await loadDynamicFields(selectedKanbanId.value || "");
  } catch (error) {
    console.error("Error adding dynamic field:", error);
  }
};

const updateField = async (key: string, newKey: string) => {
  try {
    await appTasksStore.updateDynamicField(selectedKanbanId.value || "", {
      oldKey: key,
      newKey: newKey.trim(),
    });
    await loadDynamicFields(selectedKanbanId.value || "");
  } catch (error) {
    console.error("Error updating field:", error);
  }
};

const deleteField = async (key: string) => {
  ElMessageBox.confirm(
    "Are you sure you want to delete this field?",
    "Warning",
    {
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      type: "warning",
    }
  )
    .then(async () => {
      await appTasksStore.deleteDynamicField(selectedKanbanId.value || "", {
        key,
      });
      await loadDynamicFields(selectedKanbanId.value || "");
      ElMessage.success("Field deleted successfully!");
    })
    .catch(() => {
      ElMessage.info("Deletion canceled");
    });
};

onMounted(async () => {
  await appSectionStore.getSections();
});

watch(selectedKanbanId, async (kanbanId) => {
  if (kanbanId) {
    await loadColumns(kanbanId);
    await loadDynamicFields(kanbanId);
  }
});

watch(
  () => props.kanbans,
  (newKanbans) => {
    if (newKanbans.length > 0 && newKanbans[0].kanbans.length > 0) {
      const firstKanbanId = route.query?.id
        ? (route.query.id as string)
        : newKanbans[0].kanbans[0].id;
      const firstKanbanType = route.query?.type
        ? (route.query.type as string)
        : newKanbans[0].kanbans[0].kanban_type;
      selectKanban(firstKanbanId, firstKanbanType);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.kanban-drawer-container {
  padding: 0;
}

.header {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.tree {
  padding: 10px;
}

.tree-node {
  margin-bottom: 10px;
  padding-left: 10px;
  border-left: 2px solid #dcdcdc;
}

.tree-node-header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.tree-node-icon {
  font-size: 18px;
  margin-right: 8px;
}

.tree-node-title {
  font-weight: bold;
  font-size: 14px;
  color: #333;
}

.tree-node-content {
  padding-left: 20px;
  margin-top: 5px;
}

.tree-leaf {
  background-color: #fff;
  border: 1px solid #dcdcdc;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tree-leaf:hover {
  background-color: #f5f5f5;
}

.selected-kanban {
  color: white;
  font-weight: bold;
  background-color: #7d5fc3;
  border-color: white;
}

.selected-kanban:hover {
  background-color: #7d5fc3;
}

.el-button {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.el-button:hover {
  transform: scale(1.1);
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.15);
}

.ghost-card {
  opacity: 0.5;
  background: #f7fafc;
  border: 1px solid #b4a0e3;
}
</style>
