<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <div class="flex flex-col">
        <h1 class="text-text-900 font-semibold text-xl">Status information</h1>
      </div>
      <div>
        <el-button
          type="primary"
          size="large"
          v-if="!visible"
          @click="visible = true"
          >Edit</el-button
        >
        <div v-else>
          <el-button @click="visible = false">Cancel</el-button>
          <el-button type="primary" @click="showRequestModal = true"
            >Save</el-button
          >
        </div>
      </div>
    </div>
    <div class="grid gap-2">
      <el-form-item label="Academic student status" prop="student_status">
        <el-select
          v-model="ruleForm.academic_status"
          class="w-full"
          placeholder="Select"
          :disabled="!visible"
        >
          <el-option
            v-for="item in academicStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Student status" prop="student_status">
        <el-select
          v-if="ruleForm.student_status == 'restricted'"
          v-model="ruleForm.student_status"
          class="w-full"
          placeholder="Select"
          :disabled="true"
        >
          <el-option
            v-for="item in studentStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-else
          v-model="ruleForm.student_status"
          class="w-full"
          placeholder="Select"
          :disabled="!visible"
        >
          <el-option
            v-for="item in studentStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </div>
  </div>
  <div>
    <el-dialog v-model="showRequestModal" width="45vw">
      <UpdateRequestDialog @on-submit="submitForm($event)" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import UpdateRequestDialog from "@/components/common/UpdateRequestDialog.vue";
import { useStudentsStore } from "@/stores";
import { ElMessage } from "element-plus";
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
const i18n = useI18n();
const loading = ref(false);
const visible = ref(false);
const route = useRoute();
const showRequestModal = ref(false);
const studentStore = useStudentsStore();
const student = computed(() => studentStore.currentStudent);
const ruleForm = reactive({
  academic_status: undefined as any,
  student_status: undefined as any,
  student_id: route.params.id as string,
});

const studentStatus: { value: string; label: string }[] = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Graduated",
    value: "graduated",
  },
  {
    label: "ALA (Academic Leave of Absence)",
    value: "ala",
  },
  {
    label: "Withdrawn",
    value: "withdrawn",
  },
];

const academicStatus: { value: string; label: string }[] = [
  {
    label: "Progress",
    value: "progress",
  },
  {
    label: "Progress Trailing Credits",
    value: "progress_trailing_credits",
  },
  {
    label: "Module Retriever",
    value: "module_retriever",
  },
];

const submitForm = async (request: any) => {
  const data = {
    ...ruleForm,
    request,
  };
  try {
    loading.value = true;
    data.request["type"] = "student_status";
    await studentStore.fetchStudentStatus(data);
    ElMessage({
      message: i18n.t("shared.updated"),
      type: "success",
    });
    fetchStudent();
    loading.value = false;
    showRequestModal.value = false;
    visible.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
const fetchStudent = async () => {
  await studentStore.getStudentById(route.params.id as string);
};

onMounted(async () => {
  Object.assign(ruleForm, student.value);
  await studentStore.getStudentById(route.params.id as string);
});
</script>
