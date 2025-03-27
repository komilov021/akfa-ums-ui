<template>
  <div class="bg-[#FFFFFF] rounded-3xl p-6 mt-4">
    <div class="flex justify-between mb-6 gap-3">
      <div class="md:w-96">
        <el-input
          :prefix-icon="Search"
          @clear="(searchAll = null), fetchStaffs()"
          clearable
          type="text"
          autocomplete="off"
          v-model="searchAll"
          @keyup.enter="fetchStaffs"
          size="large"
          placeholder="Search"
          class="!h-[42px]"
        />
      </div>
      <el-button
        type="primary"
        size="large"
        class="!h-[42px]"
        @click="openDepartmentFormDialog"
      >
        <Plus class="w-5 h-5 mr-2" color="#FFFFFF"></Plus>Add Staff
      </el-button>
    </div>
    <div class="table-wrapper" v-loading="loading">
      <el-table
        :data="stafs.data"
        class="whiteStripe"
        stripe
        style="width: 100%"
        row-class-name="cursor-pointer"
        @row-dblclick="onRowDblClick"
      >
        <el-table-column
          prop="first_name"
          label="First Name"
          min-width="180"
          align="left"
        />
        <el-table-column
          prop="last_name"
          label="Last Name"
          min-width="180"
          align="left"
        />
        <el-table-column
          prop="email"
          label="Email"
          min-width="180"
          align="left"
        />
        <el-table-column label="Role" min-width="180" align="left">
          <template #default="{ row }">
            <span>{{ row.is_dean ? "Dean" : row.role }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operations" align="center">
          <template #default="{ row }">
            <div
              class="flex justify-center space-x-3"
              v-if="row.role !== 'super_admin' || row.role !== 'admin'"
            >
              <EditPen
                class="h-4 w-4 text-[#7F56D9]"
                @click="onEditClick(row)"
              />
              <Delete
                class="h-4 w-4 text-[#FF4444]"
                @click="confirmDelete(row.id)"
              />
              <AddTeachersIcon
                class="!h-4 !w-4"
                v-if="row.is_dean"
                @click="openAddTeacherDialog(row.teacher_id)"
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
          :page-size="pagination.limit"
          :total="stafs.total"
        />
      </div>
      <el-dialog
        @click.stop
        :close-on-click-modal="false"
        :before-close="beforeClose"
        v-model="addTeacherModal"
        class="custom-dialog"
        title="Connect teachers"
        max-width="745"
      >
        <AddTeachers
          v-if="addTeacherModal"
          :selectedTeachers="selectedTeachers"
          :currentDeanId="currentDeanId"
          @add-teachers="addTeachers($event)"
          @close="closeDialog"
        />
      </el-dialog>
    </div>
    <teleport to="#modal" v-if="showModal">
      <UserForm
        :type="formType"
        :user="currentStaff"
        :roles="stafsStore.getRolesSelect"
        @on-submit="submitForm($event)"
        :userData="userData"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { useStaffStore, useUsersStore } from "@/stores";
import { onMounted, computed, ref, reactive } from "vue";
import { Delete, EditPen, Plus, Search } from "@element-plus/icons-vue";
import { useModal } from "@/composables";
import UserForm from "./components/UserForm.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import AddTeachersIcon from "@/components/icons/AddTeachersIcon.vue";
import AddTeachers from "./components/AddTeachers.vue";
import { IUser } from "@/models/backend";
const modal = useModal();
const formType = ref<"create" | "edit">("create");
const i18n = useI18n();
const addTeacherModal = ref(false);
const showModal = computed(() => modal.show.value);
const loading = ref(false);
const stafsStore = useStaffStore();
const userInfo = useUsersStore();
const stafs = computed(() => stafsStore.staffs);
const userData = computed(() => userInfo.user);
const currentStaff = computed(() => stafsStore.currentStaff);
const selectedTeachers = computed(() => stafsStore.selectedTeachers);
const staf = ref();
const searchAll: any = ref();
const currentDeanId = ref<string | null>(null);
const teacherSelections = ref<Record<string, any[]>>({});
let originalSelections: IUser[] = [];
const pagination = reactive({
  page: 1,
  limit: 100,
});

const fetchStaffs = async () => {
  if (searchAll.value?.length >= 2) {
    loading.value = true;
    await stafsStore.getStaffs({
      page: 1,
      limit: 20,
      search: searchAll.value ? searchAll.value : undefined,
    });
    loading.value = false;
  } else {
    await stafsStore.getStaffs(pagination);
  }
};

const onPaginationChange = (event: number) => {
  pagination.page = event;
  fetchStaffs();
};
const beforeClose = (done: Function) => {
  done();
};

onMounted(() => {
  fetchStaffs();
  stafsStore.fetchRoles();
});

const openDepartmentFormDialog = () => {
  formType.value = "create";
  modal.setTitle("Add employee");
  modal.setWidth("60%");
  modal.showModal();
};

const onEditClick = async (row: any) => {
  try {
    staf.value = row;
    formType.value = "edit";
    await stafsStore.getStaffById(row.id);
    modal.setTitle(i18n.t("Edit employee"));
    modal.setWidth("60%");
    modal.showModal();
  } catch (error: any) {
    console.log("error", error.message);
  }
};
const onRowDblClick = (row: any) => {
  navigator.clipboard
    .writeText(row.id)
    .then(() => {
      ElMessage({
        message: "Copied ID!",
        type: "success",
        duration: 2000,
      });
    })
    .catch((err) => {
      ElMessage({
        message: "An error occurred while copying.",
        type: "error",
        duration: 2000,
      });
    });
};

const confirmDelete = (id: string) => {
  ElMessageBox.confirm(
    "This action cannot be undone. Continue?",
    i18n.t("shared.warning"),
    {
      confirmButtonText: "Yes",
      cancelButtonText: "Cencel",
      type: "warning",
      center: true,
    }
  )
    .then(async () => {
      try {
        loading.value = true;
        await stafsStore.removeStaff(id);
        fetchStaffs();
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
const openAddTeacherDialog = async (id: string) => {
  await stafsStore.getAssignedDeanTeachers({ dean_teacher_id: id });
  currentDeanId.value = id;
  addTeacherModal.value = true;
};
const addTeachers = async (selected: IUser[]) => {
  if (currentDeanId.value) {
    console.log(selected);

    const deanTeachersIds = selected;
    try {
      await stafsStore.assignDeanTeacher({
        dean_teacher_id: currentDeanId.value,
        dean_teachers_ids: deanTeachersIds,
      });
      fetchStaffs();
      ElMessage({
        message: "Teachers successfully assigned!",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      ElMessage({
        message: "Failed to assign teachers. Please try again.",
        type: "error",
        duration: 3000,
      });
      console.error("Failed to assign teachers:", error);
    }
  }
  addTeacherModal.value = false;
};
const closeDialog = (): void => {
  addTeacherModal.value = false;
};

const submitForm = async (data: any) => {
  try {
    loading.value = true;
    if (formType.value === "edit" && staf.value) {
      data["id"] = staf.value.id;
      await stafsStore.editStaff(data);
      ElMessage({
        message: i18n.t("shared.updated"),
        type: "success",
      });
    } else {
      await stafsStore.createStaff(data);
      ElMessage({
        message: i18n.t("shared.created"),
        type: "success",
      });
    }
    fetchStaffs();
    loading.value = false;
    modal.hideModal();
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
</script>

<style lang="scss">
.custom-dialog {
  background: #fff !important;

  .el-dialog__close {
    background: white !important;
    color: var(--gray-400, #9ca3af) !important;
    font-size: 21px !important;
  }

  .el-input__wrapper {
    background-color: #f9fafb !important;
  }

  .el-select__wrapper {
    background-color: #f9fafb !important;
  }
}
</style>
