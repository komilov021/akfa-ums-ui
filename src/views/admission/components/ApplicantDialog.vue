<template>
  <div class="bg-white px-4 py-8 rounded" v-loading="loading">
    <div class="px-4 py-5 sm:px-6">
      <div class="flex space-x-8">
        <!-- <img :src="file_url" alt="File" srcset="" class="w-36 h-48" /> -->
        <dl class="w-full grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Full Name</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ application.first_name + " " + application.last_name }}
            </dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">
              Passport Information
            </dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{
                (application.passport_serial
                  ? application.passport_serial
                  : "") +
                " " +
                (application.passport_number
                  ? application.passport_number
                  : "-")
              }}
            </dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Email address</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{
                application.creator?.email ? application.creator?.email : "-"
              }}
            </dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Date of Birth</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{
                formatDate(application.birth_date)
                  ? formatDate(application.birth_date)
                  : "-"
              }}
            </dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Phone Number</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ application.phone ? application.phone : "-" }}
            </dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Gender</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ application.gender ? application.gender : "-" }}
            </dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">
              Adress Information
            </dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ application.region.name ? application.region.name : "-" }}
              {{ application.address ? application.address : "" }}
            </dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Graduation place</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{
                application.graduation_place
                  ? application.graduation_place
                  : "-"
              }}
            </dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">Graduation</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ application.graduation_id ? application.graduation_id : "-" }}
            </dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">
              English Certificate
            </dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{
                application.certificate_number
                  ? application.certificate_number
                  : "-"
              }}
            </dd>
          </div>
        </dl>
      </div>
      <div class="app-divider my-2 md:my-4" />
      <h1 class="font-medium text-base text-center mb-4 md:mb-8">
        Exam Preferences
      </h1>
      <dl
        class="w-full grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 md:grid-cols-4"
      >
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">Department</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ application.program?.name ? application.program?.name : "-" }}
          </dd>
        </div>
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">Exam Mode</dt>
          <dd class="mt-1 text-sm text-gray-900 capitalize">
            {{ application?.exam_type ? application?.exam_type : "-" }}
          </dd>
        </div>
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">Exam Date</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{
              application.exam_date?.name ? application.exam_date?.name : "-"
            }}
          </dd>
        </div>
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">Scholarship</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ application.is_scholarship ? "Yes" : "No" }}
          </dd>
        </div>
      </dl>
      <div class="app-divider my-2 md:my-4" />
      <h1 class="font-medium text-base text-center mb-4 md:mb-8">Files</h1>
      <dl
        class="w-full grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 md:grid-cols-3"
      >
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">Passport</dt>
          <dd class="mt-1 text-sm text-gray-900">
            <a
              @click="downloadFile(application.passport.id)"
              class="underline truncate text-blue-500 leading-normal cursor-pointer"
              >Download</a
            >
          </dd>
        </div>
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">Photo</dt>
          <dd class="mt-1 text-sm text-gray-900">
            <a
              @click="downloadFile(application.photo.id)"
              class="underline truncate text-blue-500 leading-normal cursor-pointer"
              >Download</a
            >
          </dd>
        </div>
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">Diploma</dt>
          <dd class="mt-1 text-sm text-gray-900">
            <a
              @click="downloadFile(application.diploma.id)"
              class="underline truncate text-blue-500 leading-normal cursor-pointer"
              >Download</a
            >
          </dd>
        </div>
        <div class="sm:col-span-1" v-if="application.certificate">
          <dt class="text-sm font-medium text-gray-500">Certificate</dt>
          <dd class="mt-1 text-sm text-gray-900">
            <a
              @click="downloadFile(application.certificate?.id || '')"
              class="underline truncate text-blue-500 leading-normal cursor-pointer"
              >Download</a
            >
          </dd>
        </div>
      </dl>
      <div class="app-divider my-2 md:my-4" />
      <div class="flex items-center space-x-4">
        <p class="font-medium text-xl">Status:</p>
        <el-tag
          size="large"
          v-if="application.status === 'pending'"
          type="warning"
          >Pending</el-tag
        >
        <el-tag
          size="large"
          v-if="application.status === 'accept'"
          type="success"
          >Accept</el-tag
        >
        <el-tag
          size="large"
          v-if="application.status === 'reject'"
          type="danger"
          >Reject</el-tag
        >
      </div>
    </div>
    <div class="flex" v-if="application.status === 'pending'">
      <el-popconfirm
        title="Are you sure to accept this?"
        @confirm="confirmApplication"
      >
        <template #reference>
          <el-button type="success" size="large" @click="submitForm()">
            Approve
          </el-button>
        </template>
      </el-popconfirm>

      <el-button type="primary" plain size="large" @click="openRejectConfirm()">
        Reject
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IAplication } from "@/models/backend/application.model";
import { useFileStore, useApplicationStore } from "@/stores";
import { format } from "date-fns";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
const i18n = useI18n();
const fileStore = useFileStore();
const appStore = useApplicationStore();
const formatDate = (date: string) => format(new Date(date), "yyyy-MM-dd");
const props = defineProps<{
  application: IAplication;
}>();
const application = computed(() => props.application);
const submitForm = async () => {};
console.log(application, "application");
const loading = ref(false);
const emit = defineEmits(["onClose"]);
const downloadFile = async (id: string) => {
  try {
    loading.value = true;
    const data = await fileStore.downloadById(id);
    window.open(URL.createObjectURL(data));
    loading.value = false;
  } catch (error: any) {
    console.log("error", error.message);
    loading.value = false;
  }
};

const openRejectConfirm = () => {
  ElMessageBox.prompt("Please input reason", "Reject", {
    confirmButtonText: i18n.t("shared.save"),
    cancelButtonText: i18n.t("shared.cancel"),
    inputPattern: /./,
    inputErrorMessage: i18n.t("validation.fillField"),
  })
    .then(async ({ value }) => {
      await appStore.changeApplicationStatus({
        id: application.value.id,
        status: "reject",
        reject_comment: value,
      });
      ElMessage({
        message: i18n.t("shared.updated"),
        type: "success",
      });
      emit("onClose");
    })
    .catch(() => {});
};

const confirmApplication = async () => {
  try {
    loading.value = true;
    await appStore.changeApplicationStatus({
      id: application.value.id,
      status: "accept",
    });
    ElMessage({
      message: i18n.t("shared.updated"),
      type: "success",
    });
    emit("onClose");
  } catch (error: any) {
    console.log("error", error.message);
    loading.value = false;
  }
};
</script>

<style scoped>
.title {
  font-weight: 700;
  font-size: 18px;
  line-height: 25px;
  color: #1f1f1f;
}
</style>
