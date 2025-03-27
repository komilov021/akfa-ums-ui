<template>
  <div>
    <div class="flex justify-between items-center">
      <h3 class="text-text-900 font-semibold text-xl">
        Student payment history
      </h3>
      <el-button
        type="primary"
        v-if="!showSelect"
        @click="showSelect = true"
        :disabled="!studentTutionFeePayments?.payments"
      >
        Generate a payment history certificate
      </el-button>
      <div class="flex items-center space-x-2" v-else>
        <el-select
          v-model="certificateYear"
          placeholder="Select an year"
          class="!w-[120px]"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          @click="DownloadCertificatePayment"
          :disabled="!certificateYear"
        >
          <template v-if="loading">
            <el-loading-spinner class="mr-2"></el-loading-spinner>
            Loading...
          </template>
          <template v-else> Download </template>
        </el-button>
      </div>
    </div>
    <div class="mt-9">
      <div class="table-wrapper mt-8" v-loading="loading">
        <el-table
          :data="studentTutionFeePayments?.payments"
          style="width: 100%"
          class="whiteStripe"
          :header-cell-style="{ verticalAlign: 'bottom' }"
        >
          <el-table-column
            prop="sum"
            label="Paid"
            min-width="250"
            align="center"
          >
            <template #default="{ row }">
              {{
                row.amount?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
              }}
              {{ row.currency }}
            </template>
          </el-table-column>
          <el-input prop="debt" label="Debt" min-width="250" align="center">
            <template #default="{ row }">
              {{
                row.dept?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
              }}
              {{ row.currency }}
            </template>
          </el-input>
          <el-table-column
            prop="deadline"
            label="Payment deadline"
            min-width="200"
            align="center"
          >
            <template #default="{ row }">
              <div class="flex items-center justify-center gap-2">
                {{ dayjs(row.payment_date).format("DD/MM/YYYY") }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="Record create time"
            min-width="200"
            align="center"
          >
            <template #default="{ row }">
              {{ dayjs(row.created_at).format("DD/MM/YYYY HH:MM") }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import {
  ElMessage,
  FormInstance,
  FormRules,
  dayjs,
  ElMessageBox,
  UploadUserFile,
  UploadInstance,
} from "element-plus";
import { useStudentsStore, useFileStore } from "@/stores";
import { options } from "@/utils/constants";
import { useRoute } from "vue-router";
import { saveFile } from "@/utils/common";

const certificateYear = ref("");
const route = useRoute();
const loading = ref(false);
const showSelect = ref(false);
const fileStore = useFileStore();
const studentsStore = useStudentsStore();

const studentTutionFeePayments = computed(
  () => studentsStore.paymentStudentFee
);

const DownloadCertificatePayment = async () => {
  try {
    loading.value = true;
    const certificate =
      (await studentsStore.StudentFinanceCertificateFileDownload({
        student_id: route.params.id as string,
        year: certificateYear.value as string,
      })) as any;
    showSelect.value = false;
    certificateYear.value = "";
    const data = await fileStore.downloadById(certificate?.id);
    saveFile(data, certificate.name || "FileName.pdf");
    loading.value = false;
  } catch (error: any) {
    console.log("error", error?.message);
    loading.value = false;
  }
};
</script>

<style scoped></style>
