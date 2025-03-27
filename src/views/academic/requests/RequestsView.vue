<template>
  <div class="mx-auto space-y-6">
    <div class="relative pb-6">
      <h1 class="text-text-900 font-semibold text-3xl mb-4">Changelog</h1>
      <div class="flex items-center gap-2">
        <router-link to="/academic/requests/all" v-slot="{ isActive }">
          <el-button
            :color="isActive ? '#895AF5' : ''"
            size="large"
            :text="!isActive"
            >Requests</el-button
          >
        </router-link>
        <router-link to="/academic/requests/approved" v-slot="{ isActive }">
          <el-button
            :color="isActive ? '#895AF5' : ''"
            size="large"
            :text="!isActive"
            >Approved</el-button
          >
        </router-link>
        <router-link to="/academic/requests/declined" v-slot="{ isActive }">
          <el-button
            :color="isActive ? '#895AF5' : ''"
            size="large"
            :text="!isActive"
            >Declined</el-button
          >
        </router-link>
      </div>
      <div
        class="h-px absolute -left-full bottom-0 -right-full bg-[#EBEBEB]"
      ></div>
    </div>
    <div class="flex justify-between">
      <div class="md:w-96">
        <el-input
          :prefix-icon="Search"
          type="text"
          autocomplete="off"
          size="large"
          placeholder="Search for requests from user"
        />
      </div>
      <el-select
        @change="fetchList"
        class="!w-60"
        placeholder="Select type"
        size="large"
        v-model="filter.list"
      >
        <el-option
          v-for="(item, i) in listTypes"
          :key="i"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <el-table
      :data="requests.data"
      style="width: 100%"
      class="whiteStripe"
      row-class-name="noHover"
    >
      <el-table-column prop="type" label="Type" min-width="180">
        <template #default="{ row }">
          {{ $t(`request.${row.type}`) }}
        </template>
      </el-table-column>
      <el-table-column label="Date" min-width="120">
        <template #default="{ row }">
          {{ dayjs(row.created_at).format("DD/MM/YYYY") }}
        </template>
      </el-table-column>
      <el-table-column label="From" min-width="150">
        <template #default="{ row }">
          {{ row.sender_json.last_name }} {{ row.sender_json.first_name }}
        </template>
      </el-table-column>
      <el-table-column label="Operations" align="center">
        <template #default="{ row }">
          <el-button type="primary" link @click="openRequestDialog(row)"
            >View request</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pb-2 px-4">
      <el-divider />
      <el-pagination
        background
        @current-change="onPaginationChange"
        layout="prev, pager, next"
        next-text="Next ->"
        prev-text="<- Previous"
        :page-size="filter.limit"
        :total="requests.total"
      />
    </div>
    <teleport to="#modal" v-if="showModal">
      <RequestViewDialog :request="currentRequest" @on-submit="updateRequest" />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { useModal } from "@/composables";
import { useRequestStore } from "@/stores/requests";
import { Search } from "@element-plus/icons-vue";
import { ElMessage, dayjs } from "element-plus";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import RequestViewDialog from "./RequestViewDialog.vue";
import { useI18n } from "vue-i18n";

const modal = useModal();
const requestStore = useRequestStore();
const route = useRoute();
const { t } = useI18n();

const showModal = computed(() => modal.show.value);
const loading = ref(false);

const filter = reactive({
  page: 1,
  limit: 20,
  list: "all",
});

const statuses = {
  all: 0,
  approved: 2,
  declined: 1,
} as any;

const listTypes = [
  { value: "all", label: "All" },
  { value: "to_me", label: "To me" },
  { value: "from_me", label: "From me" },
];

const requests = computed(() => requestStore.requests);
const currentRequest = ref();
const fetchList = () => {
  requestStore.fetchRequests({
    ...filter,
    status: statuses[route.params?.status as any] || 0,
  });
};

const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};

const openRequestDialog = (request: any) => {
  currentRequest.value = request;
  modal.setTitle(t("request." + request?.type));
  modal.setWidth("45vw");
  modal.showModal();
};

const updateRequest = async (data: any) => {
  try {
    loading.value = true;
    await requestStore.editRequest(data);
    ElMessage({
      message: t("shared.updated"),
      type: "success",
    });
    modal.hideModal();
    fetchList();
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};

watch(
  () => route.params?.status,
  () => {
    fetchList();
  }
);

onMounted(() => {
  fetchList();
});
</script>

<style scoped></style>
