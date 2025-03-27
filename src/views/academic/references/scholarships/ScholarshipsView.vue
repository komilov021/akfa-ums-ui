<template>
  <div class="flex justify-between items-center mt-6 md:mt-0 mb-4">
    <div>
      <h1 class="font-semibold text-xl">Scholarships</h1>
    </div>
    <el-button type="primary" @click="openFormDialog">+ Add</el-button>
  </div>
  <el-table
    :data="store.getScholarships"
    class="whiteStripe"
    style="width: 100%"
    stripe
    v-loading="loading"
  >
    <el-table-column label="Name" min-width="200" align="left" prop="title" />
    <el-table-column
      label="Description"
      min-width="200"
      align="left"
      prop="description"
    />
    <el-table-column
      label="Percentage %"
      min-width="200"
      align="center"
      prop="percentage"
    >
      <template #default="{ row }">
        <span>{{ row.percentage }} %</span>
      </template></el-table-column
    >
    <el-table-column min-width="200" align="right" margin="center">
      <template #default="scope">
        <div class="flex items-center justify-end mr-4">
          <el-button
            @click="openEditFormDialog(scope.row)"
            class="action-button"
          >
            <SvgIcon name="local-pen-simple" size="23" />
          </el-button>
          <el-button @click="confirmDelete(scope.row.id)" class="action-button">
            <SvgIcon name="local-trash" size="23" />
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <div class="py-4">
    <el-pagination
      v-if="criteriaStore.total > criteriaStore.limit"
      background
      @current-change="onPaginationChange"
      layout="prev, pager, next"
      next-text="Next ->"
      prev-text="<- Previous"
      :page-size="criteriaStore.limit"
      :total="criteriaStore.total"
    />
  </div>
  <teleport to="#modal" v-if="showModal">
    <ScholarshipsForm
      :type="modalType"
      :data="currentScholarships"
      @onSubmit="submitForm($event)"
    />
  </teleport>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, computed, ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useModal } from "@/composables";
import { useScholarshipStore } from "@/stores";
import ScholarshipsForm from "./components/ScholarshipsMasterdataForm.vue";

const i18n = useI18n();
const modal = useModal();
const store = useScholarshipStore();
const showModal = computed(() => modal.show.value);
const modalType = ref<"create" | "edit">("create");
const loading = ref(false);
const currentScholarships = ref();
const criteriaStore = computed(() => store.scholarships);
const filter = {
  page: 1,
  limit: 20,
};

const fetchList = () => {
  store.fetchScholarshipList(filter);
};
fetchList();

onMounted(() => {
  fetchList();
});

const onPaginationChange = (page: number) => {
  filter.page = page;
  fetchList();
};

const openFormDialog = () => {
  modal.show.value = true;
  modalType.value = "create";
  modal.title.value = "Add Scholarship";
};

const openEditFormDialog = (data: any) => {
  currentScholarships.value = data;
  modalType.value = "edit";
  modal.show.value = true;
  modal.title.value = "Edit Scholarship";
};

const confirmDelete = (id: string) => {
  ElMessageBox.confirm(
    "This action cannot be undone. Continue?",
    i18n.t("shared.warning"),
    {
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      type: "warning",
      center: true,
    }
  ).then(async () => {
    try {
      await store.deleteScholarship(id);
      ElMessage({
        message: i18n.t("shared.deleted"),
        type: "success",
      });
      fetchList();
    } catch (error) {
      console.log(error);
    }
  });
};

const submitForm = async (data: any) => {
  try {
    loading.value = true;
    if (modalType.value === "edit") {
      await store.updateScholarship({
        ...data,
        id: data.id,
      });
      ElMessage({
        message: i18n.t("shared.updated"),
        type: "success",
      });
    } else {
      if (modalType.value === "create") {
        await store.createScholarship(data);
        ElMessage({
          message: i18n.t("shared.created"),
          type: "success",
        });
      }
    }
    fetchList();
    loading.value = false;
    modal.show.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
</script>

<style scoped></style>
