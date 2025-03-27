<template>
  <div class="flex justify-between mb-4">
    <div class="flex flex-col items-start space-y-2">
      <div class="flex items-center space-x-2">
        <el-input
          type="text"
          class="!w-96"
          v-model="search"
          autocomplete="off"
          placeholder="Enter name surname or phone number"
          size="large"
        />
        <el-button type="success" @click="searchApplicants">Search</el-button>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 items-center gap-2">
        <el-select
          v-model="filter.program_id"
          placeholder="Program"
          size="large"
          class="!w-[300px]"
        >
          <el-option
            v-for="region of guideStore.getTuitions"
            :key="region.value"
            :label="region.label"
            :value="region.value"
          />
        </el-select>
        <el-select
          v-model="filter.exam_date_id"
          placeholder="Exam date"
          size="large"
          class="!w-[300px]"
        >
          <el-option
            v-for="date of guideStore.getExamDates"
            :key="date.value"
            :label="date.label"
            :value="date.value"
          />
        </el-select>
        <el-select
          v-model="filter.status"
          placeholder="Status"
          size="large"
          class="!w-[300px]"
        >
          <el-option label="Pending" value="pending" />
          <el-option label="Accept" value="accept" />
          <el-option label="Reject" value="reject" />
        </el-select>
        <el-select
          v-model="filter.is_scholarship"
          placeholder="Scholarship"
          size="large"
          class="!w-[300px]"
        >
          <el-option label="Yes" :value="true" />
          <el-option label="No" :value="false" />
        </el-select>
        <el-select
          v-model="year"
          placeholder="Academic year"
          size="large"
          class="!w-[300px]"
        >
          <el-option
            :label="val.id"
            v-show="val.is_active"
            v-for="val in examYears"
            :key="val.id"
            :value="val.id"
          />
        </el-select>
        <el-select
          v-model="month"
          placeholder="Month"
          size="large"
          class="!w-[300px]"
          @change="filter.month = `${year.split('-')[0]}-${month}`"
        >
          <el-option
            :label="val.name"
            v-for="val in months"
            :value="val.id"
            :key="val.id"
          />
        </el-select>
      </div>
      <div class="flex items-center space-x-2">
        <el-button type="success" @click="fetchApplications()"
          >Submit</el-button
        >
        <el-button type="success" plain @click="resetFilterAndFetch()"
          >Reset</el-button
        >
      </div>
      <h1 class="font-semibold text-sm text-[#282e36]">
        Total Applicants: {{ applications?.total }}
      </h1>
    </div>
    <div class="flex items-center">
      <el-button
        type="primary"
        size="large"
        :loading="loading"
        @click="exportToExcel"
        >Export excel</el-button
      >
      <el-button
        type="success"
        size="large"
        :loading="loading"
        @click="router.push({ name: 'create-applicants' })"
        >Add Applicant</el-button
      >
    </div>
  </div>
  <div class="table-wrapper" v-loading="loading">
    <el-table
      :data="applications.data"
      stripe
      v-on:row-click="onViewClick"
      style="width: 100%"
      row-class-name="cursor-pointer"
    >
      <el-table-column
        prop="first_name"
        label="Full Name"
        min-width="220"
        align="left"
        fixed
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ row.first_name }} {{ row.last_name }}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="email"
        label="Email"
        min-width="220"
        align="left"
      >
        <template #default="{ row }">
          {{ row.creator.email }}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="Country"
        min-width="220"
        align="left"
      >
        <template #default="{ row }">
          {{ row.country_name ? row.country_name : "Uzbekistan" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="program"
        label="Program"
        min-width="200"
        align="center"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ row.program.name }}
        </template>
      </el-table-column>
      <el-table-column
        prop="program"
        label="Language of education"
        min-width="200"
        align="center"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <span class="uppercase">
            {{ row.language }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="Created At"
        min-width="180"
        align="center"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ dayjs(row.created_at).format("DD MMMM, YYYY") }}
        </template>
      </el-table-column>
      <el-table-column
        prop="exam_date"
        label="Exam Date"
        min-width="180"
        align="center"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ row.exam_date.name }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="Status"
        min-width="100"
        align="center"
      >
        <template #default="{ row }">
          <el-tag v-if="row.status === 'pending'" type="warning"
            >Pending</el-tag
          >
          <el-tag v-if="row.status === 'accept'" type="success">Accept</el-tag>
          <el-tag v-if="row.status === 'reject'" type="danger">Reject</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="responder"
        label="Admin"
        min-width="180"
        align="center"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <div v-if="row.responder">
            {{ row.responder.first_name }} {{ row.responder.last_name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_verified"
        label="Verified"
        min-width="100"
        align="center"
      >
        <template #default="{ row }">
          <el-tag v-if="row.is_verified === true" type="success">Yes</el-tag>
          <el-tag v-if="row.is_verified === false" type="danger">No</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column type="index" align="left" label="Number" min-width="100" /> -->
      <!-- <el-table-column
        fixed="right"
        label="Operations"
        align="center"
        min-width="100"
      >
        <template #default="scope">
          <div class="flex justify-center space-x-3">
            <View
              class="h-4 w-4 text-blue-500"
              @click="onViewClick(scope.row)"
            />
          </div>
        </template>
      </el-table-column> -->
    </el-table>
    <div class="py-4">
      <el-pagination
        background
        @current-change="onPaginationChange"
        layout="prev, pager, next"
        :page-size="filter.limit"
        :total="applications.total"
      />
    </div>
    <teleport to="#modal" v-if="showModal">
      <ApplicantDialog :application="application" @on-close="closeDialog" />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import {
  useApplicationStore,
  useFileStore,
  useGuideStore,
  useExamDatesStore,
} from "@/stores";
import { onMounted, computed, ref, reactive } from "vue";
import { View } from "@element-plus/icons-vue";
import { useModal } from "@/composables";
import ApplicantDialog from "./components/ApplicantDialog.vue";
import { useI18n } from "vue-i18n";
import { dayjs } from "element-plus";
import { useRoute, useRouter } from "vue-router";
const guideStore = useGuideStore();

const modal = useModal();
const route = useRoute();
const router = useRouter();
const formType = ref<"create" | "edit">("create");
const i18n = useI18n();
const appStore = useApplicationStore();
const fileStore = useFileStore();
const examYearStore = useExamDatesStore();
const showModal = computed(() => modal.show.value);
const loading = ref(false);
const applications = computed(() => appStore.applications);
const application = ref();
const examYears = computed(() => examYearStore.examYears);
const year = ref("");
const search = ref("");
const month = ref(route.query.date?.toLocaleString().split("-")[1] || "");
const months = ref([
  { name: "January", id: "01" },
  { name: "February", id: "02" },
  { name: "March", id: "03" },
  { name: "April", id: "04" },
  { name: "May", id: "05" },
  { name: "June", id: "06" },
  { name: "July", id: "07" },
  { name: "August", id: "08" },
  { name: "September", id: "09" },
  { name: "October", id: "10" },
  { name: "November", id: "11" },
  { name: "December", id: "12" },
]);
const filter = reactive({
  page: 1,
  limit: 20,
  program_id: route.query.program_id || "",
  is_scholarship: "",
  status: "",
  exam_date_id: "",
  month: route.query.date || "",
  // city_id: "6391db1ffbe74506a2842c95",
  // gender: "female"
});
onMounted(async () => {
  fetchApplications();
  examYearStore.fetchExamYears();
  setTimeout(() => {
    year.value = examYears.value[examYears.value.length - 1].id;
  }, 1000);
  if (!guideStore.getExamDates.length) {
    guideStore.fetchExamDates();
  }
  if (!guideStore.getRegions.length) {
    guideStore.fetchRegions({});
  }
  if (!guideStore.getTuitions.length) {
    guideStore.fetchTuitions();
  }
});

const searchApplicants = () => {
  resetOnlyFields();
  const filterVal = {
    phone: "",
    search: "",
    page: filter.page,
    limit: filter.limit,
  };
  if (search.value.includes("998") || search.value.includes("+998")) {
    filterVal.phone = search.value;
  } else {
    filterVal.search = search.value;
  }
  const data = {} as any;
  Object.keys(filterVal).forEach((key: any) => {
    if ((filterVal as any)[key]) {
      data[key] = (filterVal as any)[key];
    }
  });
  appStore.getApplications(data);
};
const onViewClick = async (row: any) => {
  try {
    application.value = row;
    formType.value = "edit";
    modal.setTitle(i18n.t("View applicant"));
    modal.setWidth("50%");
    modal.showModal();
  } catch (error: any) {
    console.log("error", error.message);
  }
};

const exportToExcel = async () => {
  try {
    loading.value = true;
    const { id } = await appStore.getApplicationFileId();
    const data = await fileStore.downloadById(id);
    window.open(URL.createObjectURL(data));
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error.message);
  }
};

const fetchApplications = () => {
  search.value = "";
  const data = {} as any;
  Object.keys(filter).forEach((key: any) => {
    if ((filter as any)[key]) {
      data[key] = (filter as any)[key];
    }
  });
  appStore.getApplications(data);
};
const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchApplications();
};
const resetOnlyFields = () => {
  filter.program_id = "";
  filter.exam_date_id = "";
  filter.is_scholarship = "";
  filter.status = "";
  filter.month = "";
  month.value = "";
};
const resetFilterAndFetch = () => {
  resetOnlyFields();
  router.push({ path: "", query: {} });
  fetchApplications();
};

const closeDialog = () => {
  modal.hideModal();
  fetchApplications();
};
</script>

<style scoped></style>
