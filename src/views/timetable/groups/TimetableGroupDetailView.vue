<template>
  <div class="bg-[#fff] py-4 px-6 rounded-3xl">
    <div class="flex justify-between">
      <div class="flex items-center gap-3">
        <div
          class="flex items-center justify-center bg-[#F3F4F6] w-[40px] h-[40px] rounded-lg cursor-pointer"
          @click="goBack()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="14"
            viewBox="0 0 28 21"
            fill="none"
          >
            <path
              d="M25.5715 8.42412H7.08529L11.5073 3.60978C11.6914 3.4161 11.8384 3.18443 11.9394 2.92827C12.0405 2.67211 12.0937 2.39661 12.0959 2.11782C12.0981 1.83904 12.0494 1.56257 11.9524 1.30454C11.8554 1.04651 11.7122 0.812088 11.5312 0.614952C11.3501 0.417817 11.1348 0.261917 10.8978 0.156348C10.6608 0.0507793 10.4068 -0.00234326 10.1508 7.9274e-05C9.89471 0.0025018 9.64166 0.0604214 9.40638 0.170458C9.1711 0.280495 8.95831 0.440446 8.78041 0.640977L1.06656 9.0393C0.886968 9.23433 0.744482 9.46602 0.647262 9.7211C0.550043 9.97618 0.5 10.2496 0.5 10.5258C0.5 10.802 0.550043 11.0754 0.647262 11.3305C0.744482 11.5856 0.886968 11.8173 1.06656 12.0123L8.78041 20.4106C9.14412 20.7931 9.63126 21.0047 10.1369 20.9999C10.6425 20.9951 11.1262 20.7743 11.4838 20.385C11.8413 19.9958 12.0441 19.4692 12.0485 18.9187C12.0529 18.3682 11.8585 17.8378 11.5073 17.4418L7.08529 12.6233H25.5715C26.083 12.6233 26.5735 12.4021 26.9352 12.0083C27.2968 11.6146 27.5 11.0805 27.5 10.5237C27.5 9.96686 27.2968 9.43282 26.9352 9.03907C26.5735 8.64533 26.083 8.42412 25.5715 8.42412Z"
              fill="#1F2A37"
            />
          </svg>
        </div>
        <h2 class="font-bold text-xl">{{ groupGetOne?.name }}</h2>
      </div>
      <el-button class="flex gap-4 w-[94px]" @click="openToModal">
        <el-icon>
          <Edit />
        </el-icon>
        <span>Edit</span>
      </el-button>
    </div>
    <div class="grid grid-cols-3 w-[940px] gap-3 my-6" v-if="groupGetOne">
      <div class="w-[305px] text-sm border-b-[1px] pb-2">
        <h1 class="font-semibold">Name</h1>
        <h2 class="text-[#6B7280] leading-4">{{ groupGetOne?.name }}</h2>
      </div>
      <div class="w-[305px] text-sm border-b-[1px] pb-2">
        <h1 class="font-semibold">Abbreviation</h1>
        <h2 class="text-[#6B7280] leading-4">
          {{ groupGetOne?.abbreviation }}
        </h2>
      </div>
      <div class="w-[305px] text-sm border-b-[1px] pb-2">
        <h1 class="font-semibold">Program</h1>
        <h2 class="text-[#6B7280] leading-4">
          {{ groupGetOne?.program_info?.title.en }}
        </h2>
      </div>
      <div class="w-[305px] text-sm border-b-[1px] pb-2">
        <h1 class="font-semibold">Class teacher</h1>
        <h2 class="text-[#6B7280] leading-4">
          {{ groupGetOne?.leader_info?.first_name }}
          {{ groupGetOne?.leader_info?.last_name }}
        </h2>
      </div>
      <div class="w-[305px] text-sm border-b-[1px] pb-2">
        <h1 class="font-semibold">Color</h1>
        <h2 class="text-[#6B7280] leading-4">
          {{ groupGetOne?.color_info?.name }}
        </h2>
      </div>
    </div>
    <div class="flex justify-between items-center">
      <el-input
        class="!w-[384px]"
        size="large"
        v-model="filter.search"
        @keypress.enter="fetchList"
        placeholder="Search"
        :prefix-icon="Search"
      >
        <template #suffix>
          <div
            class="cursor-pointer"
            v-if="filter.search"
            @click="
              filter.search = null;
              fetchList();
            "
          >
            <svg
              class="border-[1px] cursor-pointer rounded-xl size-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div> </template
      ></el-input>
      <el-dropdown placement="bottom" trigger="click" @command="handleCommand">
        <el-button type="primary" :icon="Plus">Add student</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="main">Main group</el-dropdown-item>
            <el-dropdown-item command="additional"
              >Additional group</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-table
      :data="groupOneStudentList.data"
      style="width: 100%"
      stripe
      class="whiteStripe mt-7"
      @row-dblclick="copyUid"
      v-if="groupOneStudentList.data"
    >
      <el-table-column
        label="NAME"
        min-width="270"
        show-overflow-tooltip
        align="left"
        prop="full_name"
      ></el-table-column>
      <el-table-column
        label="ID"
        min-width="180"
        show-overflow-tooltip
        align="left"
        prop="uid"
      ></el-table-column>
      <el-table-column
        label="GROUPS"
        min-width="224.8"
        show-overflow-tooltip
        align="left"
      >
        <template #default="scope">
          {{ scope.row?.group_info?.short_name }}
        </template>
      </el-table-column>
      <el-table-column
        label="PROGRAMS"
        min-width="224.8"
        show-overflow-tooltip
        align="left"
        prop="program"
      >
        <template #default="scope">
          {{ scope.row.program_info?.name }}
        </template>
      </el-table-column>
      <el-table-column
        label="E-MAIL"
        min-width="214.8"
        show-overflow-tooltip
        align="left"
        prop="email"
      />
      <el-table-column
        label="Type of group"
        min-width="214.8"
        show-overflow-tooltip
        align="left"
        prop="type"
      >
        <template #default="scope">
          <span class="capitalize">{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width=""
        show-overflow-tooltip
        align="left"
        fixed="right"
      >
        <template #default="scope">
          <el-button
            class="!px-2 cursor-pointer"
            @click="confirmDelete(scope.row.group_of_student_id)"
          >
            <Delete class="h-5 w-5" color="#" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div
      class="py-4 flex items-center justify-between gap-3"
      v-if="filter.limit < groupOneStudentList.pagination.total_items"
    >
      <div class="text-[#6B7280] text-sm font-normal">
        Showing
        <span class="font-semibold !text-[#000]">{{
          (filter.page - 1) * filter.limit + 1
        }}</span
        >-
        <span class="font-semibold !text-[#000]">{{
          Math.min(
            filter.page * filter.limit,
            groupOneStudentList.pagination.total_items
          )
        }}</span>
        of
        <span class="font-semibold !text-[#000]">{{
          groupOneStudentList.pagination.total_items
        }}</span>
      </div>
      <el-pagination
        background
        @current-change="onPaginationChange"
        class="pag-timetable"
        layout="prev, pager, next"
        :page-size="filter.limit"
        :total="groupOneStudentList.pagination.total_items"
      />
    </div>
  </div>
  <el-dialog
    v-model="openModal"
    title="Edit group"
    class="custom-dialog"
    width="702"
  >
    <EditGroupDialog
      :type="type"
      :groupGetOne="groupGetOne"
      :staffStore="staffStore.getTeacherSelect"
      :program_id="routerId"
      :programStore="programStore"
      @on-submit="onSubmit($event)"
    />
  </el-dialog>
  <el-dialog
    v-model="openAddStudent"
    class="custom-dialog"
    title="Add student"
    max-width="700"
  >
    <StudentAddingDialog
      v-if="openAddStudent"
      :studentinfo="studentinfo"
      :selectedStudents="selectedStudents"
      @add-students="addStudents($event)"
      @close="closeStudentAdddialog"
    />
  </el-dialog>
  <el-dialog v-model="showRequestModal" width="45vw">
    <UpdateRequestDialog @on-submit="handleUpdateRequestSubmit" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import EditGroupDialog from "./components/EditGroupDialog.vue";
import StudentAddingDialog from "./components/StudentAddingDialog.vue";
import { Delete, Search, Plus } from "@element-plus/icons-vue";
import {
  useStudentsStore,
  useTimeTableGroups,
  useStaffStore,
  useGuideStore,
} from "@/stores";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import UpdateRequestDialog from "@/components/common/UpdateRequestDialog.vue";

const type = ref<"edit">();
const loading = ref(false);
const openModal = ref(false);
const openAddStudent = ref(false);
const showRequestModal = ref(false);
const selectedStudents = ref<any[]>([]);
const modalType = ref<"main" | "additional">();
const i18n = useI18n();
const route = useRoute();
const router = useRouter();
const staffStore = useStaffStore();
const programStore = useGuideStore();
const studentStore = useStudentsStore();
const groupStore = useTimeTableGroups();
const studentinfo = computed(() => studentStore.students);
const groupGetOne = computed(() => groupStore.groupOne.data);
const groupOneStudentList = computed(() => groupStore.groupOneStudentList);

const copyUid = (data: any) => {
  navigator.clipboard
    .writeText(data.id)
    .then(() => {
      ElMessage({
        message: `Copy the (ID) of ${data.full_name}`,
        type: "success",
        duration: 1500,
      });
    })
    .catch((err) => {
      ElMessage({
        message: "An error occurred while copying.",
        type: "error",
        duration: 1000,
      });
    });
};
const filter = reactive({
  page: 1,
  program_id: undefined,
  limit: 20,
  search: null as any,
});

const routerId = ref(route.params.id as string);
const goBack = () => {
  router.push("/timetable/groups");
};

const openToModal = () => {
  type.value = "edit";
  openModal.value = true;
};

const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};

const handleCommand = (command: string) => {
  if (command === "main") {
    modalType.value = "main";
    openAddStudent.value = true;
    selectedStudents.value = [];
  } else {
    modalType.value = "additional";
    openAddStudent.value = true;
    selectedStudents.value = [];
  }
};
const fetchList = async () => {
  await groupStore.fetchgetOneGroupStudent(routerId.value, filter);
};
onMounted(async () => {
  fetchList();
  await groupStore.fetchgetOneGroup(routerId.value);
  if (!studentStore.students.data.length) {
    await studentStore.fetchStudents(filter);
  }
  if (!staffStore.staffs.data.length) {
    await staffStore.getStaffs({
      page: 1,
      limit: 200,
    });
  }
  if (!programStore.tuitions.length) {
    await programStore.fetchTuitions();
  }
});

const onSubmit = async (data: any) => {
  try {
    loading.value = true;
    await groupStore.fetchGroupUpdateId(routerId.value, data);
    await groupStore.fetchgetOneGroup(routerId.value);
    openModal.value = false;
    loading.value = false;
    ElMessage({
      message: i18n.t("shared.updated"),
      type: "success",
    });
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
const closeStudentAdddialog = () => {
  openAddStudent.value = false;
};
const addStudents = async (data: any) => {
  try {
    loading.value = true;
    const studentGetList = data.map((student: any) => ({
      student_id: student.id,
      participation: modalType.value == "main" ? "main" : "additional",
    }));

    await groupStore.fetchTGroupAddStudent({
      group_id: route.params.id as string,
      student_participation: studentGetList as any,
    });

    ElMessage({
      message: i18n.t("shared.addedstudent"),
      type: "success",
    });
    await groupStore.fetchgetOneGroupStudent(routerId.value, filter);
    loading.value = false;
    openModal.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
const deleteStudentId = ref<string | null>(null);
const confirmDelete = (id: string) => {
  deleteStudentId.value = id;
  showRequestModal.value = true;
};
const handleUpdateRequestSubmit = (data: {
  explanation: string;
  files: File | null;
}) => {
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
        const finalData = {
          group_of_student_id: deleteStudentId.value,
          request: {
            explanation: data?.explanation,
            files: data?.files,
            type: "student_from_group_remove",
          },
        };
        await groupStore.removeGroupStudent(finalData);
        await groupStore.fetchgetOneGroupStudent(routerId.value, filter);
        loading.value = false;
        ElMessage({
          type: "success",
          message: i18n.t("shared.deleteCompleted"),
        });
        router.push("");
      } catch (error: any) {
        loading.value = false;
        console.log("error", error);
      }
    })
    .catch(() => {
      console.log("Delete cancelled");
    })
    .finally(() => {
      showRequestModal.value = false;
      deleteStudentId.value = null;
    });
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
