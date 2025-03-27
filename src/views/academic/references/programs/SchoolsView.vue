<template>
  <div class="mx-auto">
    <div class="flex justify-end gap-2 mb-4">
      <el-button type="primary" @click="openFormDialog"
        >+ Add new school</el-button
      >
    </div>
    <div class="grid grid-cols-3 gap-10">
      <div
        class="school relative flex flex-col gap-2 items-start justify-between cursor-pointer"
        v-for="school in SchoolStore.schools"
        :key="school.id"
        @click="onSchoolClick(school.id, $event)"
      >
        <div>
          <h1 class="font-medium text-[#1B1B1B] text-lg leading-none">
            {{ school.title }}
          </h1>
          <h2 class="text-[#7C7C7C]">Dean: {{ school.chief?.full_name }}</h2>
        </div>
        <div class="absolute right-2 bottom-2/4 translate-y-2/4">
          <el-icon :size="20"><ArrowRight /></el-icon>
        </div>
        <el-button size="small" class="!h-9 !w-9" id="edit">
          <SvgIcon name="local-pen" size="23" id="edit" />
        </el-button>
      </div>
    </div>
    <div class="pb-2 px-4">
      <el-divider />
      <el-pagination
        background
        @current-change="onPaginationChange"
        layout="prev, pager, next"
        next-text="Next ->"
        prev-text="<- Previous"
        :page-size="filter.limit"
        :total="30"
      />
    </div>
    <el-dialog v-model="showModal" :width="500" class="reset">
      <SchoolForm
        :type="formType"
        @delete="confirmDelete"
        v-if="showModal"
        :school="school"
        @on-submit="submitForm($event)"
      />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { useSchoolStore, useStaffStore } from "@/stores";
import { onMounted, computed, ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import SchoolForm from "./components/SchoolForm.vue";
import { useRouter } from "vue-router";
import { EditPenIcon } from "@/components/icons";

const router = useRouter();
const formType = ref<"create" | "edit">("create");
const i18n = useI18n();
const SchoolStore = useSchoolStore();
const staffStore = useStaffStore();
const showModal = ref(false);
const loading = ref(false);
const isEditable = ref(false);
const school = computed(() => SchoolStore.school);
const filter = reactive({
  page: 1,
  limit: 30,
});

onMounted(() => {
  fetchList();
});

const fetchList = () => {
  SchoolStore.fetchSchools(filter);
  staffStore.getStaffs({
    page: 1,
    limit: 100,
    type: "dean",
  });
};

const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};

const openFormDialog = () => {
  formType.value = "create";
  showModal.value = true;
};
const openEditFormDialog = async (id: string) => {
  await SchoolStore.getSchoolById(id);
  formType.value = "edit";
  showModal.value = true;
};

const onSchoolClick = (id: string, event: any) => {
  if (event?.target.id === "edit") {
    openEditFormDialog(id);
  } else {
    router.push({ name: "schools-detail", params: { id } });
  }
};

const confirmDelete = () => {
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
        await SchoolStore.removeSchool(school.value?.id as string);
        fetchList();
        loading.value = false;
        showModal.value = false;
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
    if (formType.value === "edit" && school.value) {
      await SchoolStore.editSchool(data);
      ElMessage({
        message: i18n.t("shared.updated"),
        type: "success",
      });
    } else {
      await SchoolStore.createSchool(data);
      ElMessage({
        message: i18n.t("shared.created"),
        type: "success",
      });
    }
    fetchList();
    loading.value = false;
    showModal.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
</script>
<style lang="scss" scoped>
.school {
  border-radius: 17.505px;
  background: #fff;
  box-shadow: 0.53488px 0.53488px 5.34882px 0.2334px rgba(0, 0, 0, 0.25);
  padding: 25px 17px 17px 19px;
  height: 140px;
}
</style>
