<template>
  <div class="max-w-screen-lg 2xl:max-w-screen-2xl mx-auto">
    <div class="flex items-center justify-between mt-3">
      <h5 class="text-xl font-semibold">
        History of certificate & forms generated
      </h5>
    </div>
    <div class="mt-6" v-loading="loading">
      <el-table
        :data="certificates"
        style="width: 100%"
        v-on:row-click="onViewClick"
        class="whiteBordered nofirst"
      >
        <el-table-column
          prop="created_at"
          label="Date"
          min-width="150"
          align="left"
        >
          <template #default="{ row }">
            <p>
              {{ dayjs(row.created_at).format("MM/D/YYYY") }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="student_uid"
          label="Student ID"
          min-width="150"
          align="left"
        />
        <el-table-column
          prop="type"
          label="Type of document"
          min-width="150"
          align="left"
        />
        <el-table-column
          prop="type"
          label="Registration Number"
          min-width="150"
          align="left"
        >
          <template #default="{ row }">
            <p>{{ row.reg_serial }} - {{ row.reg_number }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="" min-width="150" align="right">
          <div class="flex justify-end">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 17L11 12L6 7M13 17L18 12L13 7"
                stroke="#44444F"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <div class="py-4">
      <el-pagination
        background
        @current-change="onPaginationChange"
        layout="prev, pager, next"
        :page-size="filter.limit"
        :total="certifateStore.certificates.total"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line vue/multi-word-component-names
import { useCertificateStore } from "@/stores";
import { onMounted, computed, ref, reactive } from "vue";
import { dayjs } from "element-plus";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { number } from "echarts";
const route = useRoute();
const router = useRouter();
const formType = ref<"create" | "edit">("create");
const i18n = useI18n();
const showModal = ref(false);
const loading = ref(false);
const certifateStore = useCertificateStore();
const certificates = computed(() => certifateStore.certificates.data);
const filter = reactive({
  page: 1,
  limit: 20,
});
const fetchList = () => {
  certifateStore.fetchList(filter);
};
const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};
const onViewClick = (row: any) => {
  router.push("/academic/certificates-history/" + row.pdf.id);
};
onMounted(() => {
  fetchList();
});
</script>

<style>
.hover-row > td {
  background-color: initial !important;
}
</style>
