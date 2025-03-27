<template>
  <div class="flex justify-end mb-4">
    <div class="flex items-center gap-4">
      <el-select
        v-model="filter.program_id"
        @change="fetchList"
        class="w-full"
        :placeholder="`${$t('shared.select')} ${$t('app.department')}`"
        size="large"
      >
        <el-option
          v-for="(item, i) in [
            { value: 'none', label: 'All' },
            ...guideStore.getProgramsSelct,
          ]"
          :key="i"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        type="text"
        autocomplete="off"
        v-model="filter.title"
        @keypress.enter="fetchList"
        size="large"
        placeholder="Search by title"
      />
      <el-button type="success" size="large" @click="fetchList"
        >Search</el-button
      >
      <el-select
        v-model="filter.limit"
        @change="fetchList"
        class="w-44"
        :placeholder="$t('shared.select')"
        size="large"
      >
        <el-option
          v-for="item in [20, 40, 50, 70, 100]"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <el-button type="primary" size="large" class="ml-4" @click="openFormDialog"
      >Add Subject</el-button
    >
  </div>
  <div class="table-wrapper" v-loading="loading">
    <el-table
      :data="subjects.data"
      stripe
      style="width: 100%"
      row-class-name="noHover"
    >
      <el-table-column
        type="index"
        label="№"
        min-width="50"
        max-width="100"
        align="left"
      />
      <el-table-column
        prop="title"
        label="Title"
        min-width="150"
        align="center"
      />
      <el-table-column
        prop="code"
        label="Code"
        min-width="150"
        align="center"
      />
      <el-table-column
        prop="credits"
        label="Credits"
        min-width="80"
        max-width="100"
        align="center"
      />
      <el-table-column
        prop="program_name"
        label="Program"
        min-width="150"
        align="center"
      />
      <el-table-column
        prop="grading"
        label="Grading"
        min-width="80"
        max-width="100"
        align="center"
      />
      <el-table-column label="Operations" align="center">
        <template #default="scope">
          <div class="flex justify-center space-x-3">
            <Edit
              class="h-4 w-4 text-green-500 cursor-pointer"
              @click="openEditFormDialog(scope.row)"
            />
            <Delete
              v-if="!scope.row.is_active"
              class="h-4 w-4 text-primary cursor-pointer"
              @click="confirmDelete(scope.row.id)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="py-4">
      <el-pagination
        background
        @current-change="onPaginationChange"
        layout="prev, pager, next"
        :page-size="filter.limit"
        :total="subjects.total"
      />
    </div>
    <teleport to="#modal" v-if="showModal">
      <CoursesForm
        :type="formType"
        :subject="subject"
        :programs="guideStore.getProgramsSelct"
        @on-submit="submitForm($event)"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { useGuideStore, useSubjectStore } from "@/stores";
import { onMounted, computed, ref, reactive } from "vue";
import { Delete, Edit } from "@element-plus/icons-vue";
import { useModal } from "@/composables";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import CoursesForm from "./components/SubjectsForm.vue";

const modal = useModal();
const formType = ref<"create" | "edit">("create");
const i18n = useI18n();
const subjectStore = useSubjectStore();
const guideStore = useGuideStore();

const showModal = computed(() => modal.show.value);
const loading = ref(false);

const subjects = computed(() => subjectStore.subjects);
const subject = ref();

const filter = reactive({
  title: undefined,
  page: 1,
  limit: 20,
  program_id: undefined,
});

onMounted(() => {
  guideStore.fetchPrograms();
  fetchList();
});

const fetchList = () => {
  filter.program_id =
    filter.program_id === "none" ? undefined : filter.program_id;
  subjectStore.fetchSubjects(filter);
};

const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};

const openFormDialog = () => {
  formType.value = "create";
  modal.setTitle("Add Subject");
  modal.setWidth("50%");
  modal.showModal();
};

const openEditFormDialog = (row: any) => {
  subject.value = row;
  formType.value = "edit";
  modal.setTitle("Update subject");
  modal.setWidth("50%");
  modal.showModal();
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
  )
    .then(async () => {
      try {
        loading.value = true;
        await subjectStore.removeSubjects(id);
        fetchList();
        loading.value = false;
        ElMessage({
          type: "success",
          message: i18n.t("shared.deleteCompleted"),
        });
      } catch (error: any) {
        loading.value = false;
        console.log("error", error);
      }
    })
    .catch(() => {});
};

const submitForm = async (data: any) => {
  try {
    loading.value = true;
    if (formType.value === "edit" && subject.value) {
      data["id"] = subject.value.id;
      await subjectStore.editSubjects(data);
      ElMessage({
        message: i18n.t("shared.updated"),
        type: "success",
      });
    } else {
      await subjectStore.createSubjects(data);
      ElMessage({
        message: i18n.t("shared.created"),
        type: "success",
      });
    }
    fetchList();
    loading.value = false;
    modal.hideModal();
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
</script>

<style scoped></style>
