<template>
  <div
    v-if="importedData && typeof importedData === 'object'"
    class="grid space-y-8"
  >
    <div
      v-for="[key, data] of Object.entries(importedData)"
      :key="key"
      class="space-y-2"
    >
      <h1 class="font-medium text-lg">{{ tableTitle[key] }}</h1>
      <el-table :data="(data as any)" style="width: 100%" :row-class-name="key">
        <el-table-column
          prop="order"
          label="Order"
          min-width="80"
          max-width="140"
          align="left"
        />
        <el-table-column
          prop="email"
          label="Email"
          min-width="100"
          max-width="200"
          show-overflow-tooltip
          align="left"
        />
        <el-table-column
          prop="message"
          label="Message"
          min-width="150"
          show-overflow-tooltip
          align="left"
        />
      </el-table>
    </div>
  </div>
  <div v-else class="flex flex-col items-start space-y-4">
    <AppUpload @upload="(data) => (file = data)" @remove="file = null" />
    <el-button type="success" size="large" @click="importTemplate"
      >Submit</el-button
    >
  </div>
</template>

<script setup lang="ts">
import AppUpload from "@/components/common/AppUpload.vue";
import { useCourseGradesStore } from "@/stores";
import { ElMessage } from "element-plus";
import { ref } from "vue";

const coursesGradeStore = useCourseGradesStore();
const file = ref();
const importedData = ref<any>(null);

const tableTitle = {
  not_exist_data: "Not Exist Data",
  exist_data: "Exist Data",
  new_data: "New Data",
} as any;

const props = defineProps<{
  course_id: string;
  function_id: string;
}>();

const importTemplate = async () => {
  if (!file.value) {
    ElMessage({
      message: "Upload file",
      type: "error",
    });
  }
  try {
    importedData.value = await coursesGradeStore.importTemplate({
      file_id: file.value.id,
      course_id: props.course_id as string,
      function_id: props.function_id as string,
    });
    emit("fetchList");
    ElMessage({
      message: "Data imported",
      type: "success",
    });
  } catch (error: any) {
    console.log("error", error.message);
  }
};
const emit = defineEmits(["fetchList"]);
</script>

<style>
.el-table .not_exist_data {
  --el-table-tr-bg-color: rgba(209, 5, 12, 0.4);
}
.el-table .exist_data {
  --el-table-tr-bg-color: rgba(255, 213, 1, 0.4);
}
.el-table .new_data {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
