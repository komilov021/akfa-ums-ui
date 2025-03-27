<template>
  <div
    class="relative rounded-md bg-white shadow transition-shadow hover:shadow-md border-l-4 border-purple p-4"
  >
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-base font-semibold text-gray-800">
        <span v-if="task?.subjects?.length">
          {{ task.subjects[0].name }}
        </span>
        <span v-else>No subject available</span>
      </h3>
    </div>

    <p class="text-sm text-gray-600 mb-2">
      {{ `${task.name || "N/A"} ${task.surname || "N/A"}` }}
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

      <div class="mt-4">
        <div v-if="certificate?.type === 'application/pdf'">
          <a
            :href="`${baseUrl.origin}/public/static/${certificate.id}.pdf`"
            target="_blank"
            rel="noopener noreferrer"
          >
            <el-button type="primary">Open PDF</el-button>
          </a>
        </div>
        <div
          v-else-if="
            certificate?.type && certificate.type?.startsWith('image/')
          "
        >
          <el-image
            style="width: 100px; height: 100px; cursor: pointer"
            :src="
              getProofImageUrl(baseUrl.origin, certificate.id, certificate.name)
            "
            :preview-src-list="[
              getProofImageUrl(
                baseUrl.origin,
                certificate.id,
                certificate.name
              ),
            ]"
          >
          </el-image>
        </div>
      </div>

      <div class="mt-4" v-if="proof && proof.type?.startsWith('image/')">
        <el-image
          style="width: 100px; height: 100px; cursor: pointer"
          :src="getProofImageUrl(baseUrl.origin, proof.id, proof.name)"
          :preview-src-list="[
            getProofImageUrl(baseUrl.origin, proof.id, proof.name),
          ]"
        >
        </el-image>
      </div>

      <div class="mt-4">
        <label class="text-sm font-semibold text-gray-600">
          Upload Verified Certificate
        </label>
        <AppUpload accept="image/*" :isFilePublic="true" @upload="onUpload" />
      </div>

      <div class="mt-4">
        <label
          for="rejectionReason"
          class="text-sm font-semibold text-gray-600"
        >
          Reason for rejection
        </label>
        <div class="flex gap-3">
          <input
            id="rejectionReason"
            v-model="rejectionReason"
            type="text"
            placeholder="Enter the reason..."
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <el-button
            type="danger"
            class="mt-1 w-40 h-10 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition-all"
            @click="handleRejectCertificate"
          >
            Reject certificate
          </el-button>
        </div>
        <p v-if="errorMessage" class="text-red-500 text-sm mt-1">
          {{ errorMessage }}
        </p>
      </div>

      <div class="mt-4">
        <label for="grade" class="text-sm font-semibold text-gray-600">
          Grade
        </label>
        <div class="flex gap-3">
          <input
            id="grade"
            v-model="editableFields.grade"
            type="number"
            placeholder="Enter grade"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <el-button
            class="mt-1 w-40 h-10 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all"
            type="primary"
            @click="enterGrade"
          >
            Enter Grade
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ElButton, ElIcon, ElDialog, ElMessage } from "element-plus";
import { View } from "@element-plus/icons-vue";
import { ITask } from "@/models/backend";
import AppUpload from "@/components/common/AppUpload.vue";
import { useTasksStore } from "@/stores/tasks";
import { baseUrl } from "@/utils/common";

const tasksStore = useTasksStore();
const showModal = ref(false);
const modalTask = ref<ITask | null>(null);
const certificate = ref<any>(null);
const proof = ref<any>(null);
const rejectionReason = ref("");
const errorMessage = ref("");

const editableFields = ref<Record<string, any>>({});

function getProofImageUrl(baseUrl: string, id: string, name: string): string {
  const fileExtension = name.split(".").pop();
  return `${baseUrl}/public/static/${id}.${fileExtension}`;
}

const filteredEditableFields = computed(() =>
  Object.entries(editableFields.value)
    .filter(
      ([key]) =>
        key !== "id" &&
        key !== "column_id" &&
        key !== "order_index" &&
        key !== "created_by" &&
        key !== "created_at" &&
        key !== "grade"
    )
    .reduce<Record<string, any>>((acc, [key, value]) => {
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        value === null
      ) {
        acc[key] = value !== null ? value : "N/A";
      }
      return acc;
    }, {})
);

const onUpload = async (file: any) => {
  if (modalTask.value) {
    await tasksStore.updateSubjectProof(modalTask.value.id, { proof: file });
    ElMessage.success("Successfully verified certificate!");
  }
};

const openTaskModal = async (id: string) => {
  await tasksStore.getOneApplicationSubject(id);
  modalTask.value = tasksStore.task;

  if (modalTask.value) {
    editableFields.value = Object.entries(modalTask.value)
      .filter(
        ([, value]) => typeof value === "string" || typeof value === "number"
      )
      .reduce<Record<string, any>>((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    if (
      modalTask.value.certificate &&
      typeof modalTask.value.certificate === "object"
    ) {
      certificate.value = modalTask.value.certificate;
    }

    if (modalTask.value.proof && typeof modalTask.value.proof === "object") {
      proof.value = modalTask.value.proof;
    }

    showModal.value = true;
  }
};

const enterGrade = async () => {
  if (modalTask.value) {
    await tasksStore.changeApplicationTask(modalTask.value.id, {
      grade: editableFields.value.grade,
    });
    ElMessage.success("Grade entered successfully!");
  }
};

const rejectCertificate = async (reason: string) => {
  if (modalTask.value) {
    await tasksStore.rejectCertificateSubject(modalTask.value.id, {
      reject_reason: reason,
    });
    ElMessage.success(`Certificate rejected: ${reason}`);
  }
};

const handleRejectCertificate = async () => {
  if (!rejectionReason.value.trim()) {
    errorMessage.value = "Please provide a reason for rejection.";
    return;
  }
  errorMessage.value = "";
  await rejectCertificate(rejectionReason.value);
  rejectionReason.value = "";
};

defineProps<{
  task: Omit<any, "dynamic_fields">;
  kanbanId: string;
}>();
</script>
