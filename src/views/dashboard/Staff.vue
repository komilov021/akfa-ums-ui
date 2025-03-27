<template>
  <div id="app-content" class="bg-white p-6 pb-[110px] sm:pb-0 rounded-3xl">
    <div class="w-full flex justify-between">
      <div class="flex gap-3">
        <el-input
          placeholder="Search"
          :prefix-icon="Search"
          v-model="filter.search"
          @keypress.enter="fetchList"
          class="!w-full lg:!min-w-[384px]"
        ></el-input>
        <el-select
          class="w-full lg:!min-w-[180px]"
          placeholder="All"
          v-model="filter.select"
          @change="fetchList"
          size="large"
        >
          <el-option :key="'all'" :label="'All'" :value="'none'" />
          <el-option
            v-for="(item, i) in schoolList"
            :key="i"
            :label="item"
            :value="item"
        /></el-select>
      </div>
      <!-- <el-button type="primary" @click="openFormDialog">
        <Plus class="w-4 h-4 mr-2" color="#fff"></Plus> Add staff
      </el-button> -->
    </div>
    <div
      class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
      v-if="staffList.data.length"
      v-loading="loading"
    >
      <div
        v-for="staff of staffList.data"
        :key="staff.id"
        @click="openProfessorForm(staff.id)"
        class="staffcard mt-6 p-3 space-y-2 w-full overflow-hidden"
      >
        <img
          v-if="staff.photo_url?.bucket_name"
          :src="`https://admin.eduplus.uz${staff.photo_url.bucket_name}`"
          class="w-full h-[300px] rounded-[8px] mb-4 object-cover"
          alt="Staff photo"
          mobile
          versiyada
        />
        <img
          v-else
          :src="Img"
          class="w-full h-[300px] rounded-[8px] mb-4 object-cover"
          alt="Default image"
        />

        <h1 class="text-[#111928] font-bold text-xl">{{ staff.full_name }}</h1>
        <p class="text-[#6B7280] font-medium line-clamp-2">
          {{ staff.position }}
        </p>
        <div class="flex flex-wrap gap-[5px] mb-4 overflow-hidden">
          <el-tag
            class="text-[#175CD3] text-wrap text-sm font-medium"
            round
            :style="{
              color: '#175CD3',
              backgroundColor: '#EFF8FF',
              border: 'none',
            }"
          >
            {{ staff.email }}
          </el-tag>
          <el-tag
            class="text-[#175CD3] text-wrap text-sm font-medium"
            round
            :style="{
              color: '#175CD3',
              backgroundColor: '#EFF8FF',
              border: 'none',
            }"
          >
            {{ staff.workload }}
          </el-tag>
          <el-tag
            class="text-[#175CD3] tracking-tight text-wrap text-sm font-medium"
            round
            :style="{
              color: '#175CD3',
              backgroundColor: '#EFF8FF',
              border: 'none',
            }"
          >
            {{ staff.department }}
          </el-tag>
        </div>
        <p class="font-normal text-base line-clamp-3 text-[#6B7280] mb-4">
          {{ staff.subjects_taught }}
        </p>
        <!-- <span class="font-semibold text-xl">4,000$</span> -->
      </div>
    </div>
    <div v-else class="flex items-center justify-center w-full">
      <el-empty :image-size="200" />
    </div>
    <div class="py-4 mb-4">
      <el-pagination
        v-if="filter.limit < staffList.pagination?.total"
        background
        @current-change="onPaginationChange"
        layout="prev, pager, next"
        :page-size="filter.limit"
        :total="staffList.pagination?.total"
      />
      <!-- prev-text="<- Previous" -->
      <!-- next-text="Next ->" -->
    </div>
  </div>
  <el-dialog
    v-model="openCurrentTeacher"
    :width="dialogWidth"
    title="Teacher"
    class="custom-dialog"
  >
    <div class="grid gap-4">
      <div class="bg-[#F8F8F9] rounded-2xl p-6 min-h-[222px]">
        <div
          class="flex gap-6 flex-wrap justify-center text-center md:text-start md:flex-nowrap"
        >
          <div class="h-[173px] min-w-[173px]">
            <img
              v-if="currentTeacher.photo_url?.bucket_name"
              class="w-full h-full object-cover rounded-lg"
              :src="`https://admin.eduplus.uz${currentTeacher.photo_url.bucket_name}`"
              alt=""
            />
            <img
              v-else
              class="w-full h-full object-cover rounded-lg"
              src="../../assets/images/avatar.png"
              alt=""
            />
          </div>
          <div>
            <h1 class="text-[#111928] font-bold md:text-xl text-[20px] mb-1">
              {{ currentTeacher.name }} {{ currentTeacher.surname }}
            </h1>
            <p class="text-[#6B7280] mb-5 md:text-base text-sm font-medium">
              {{ currentTeacher.position }}
            </p>
            <div class="flex flex-wrap gap-3 mb-4">
              <el-tag
                class="text-[#175CD3] px-[10px] py-[2px] text-sm font-medium"
                round
                :style="{
                  color: '#175CD3',
                  backgroundColor: '#EFF8FF',
                  border: 'none',
                }"
              >
                {{ currentTeacher.email }}
              </el-tag>
              <el-tag
                class="text-[#175CD3] px-[10px] py-[2px] text-sm font-medium"
                round
                :style="{
                  color: '#175CD3',
                  backgroundColor: '#EFF8FF',
                  border: 'none',
                }"
              >
                {{ currentTeacher.workload }}
              </el-tag>
              <el-tag
                class="text-[#175CD3] px-[10px] py-[2px] text-sm font-medium"
                round
                :style="{
                  color: '#175CD3',
                  backgroundColor: '#EFF8FF',
                  border: 'none',
                }"
              >
                {{ currentTeacher.department }}
              </el-tag>
            </div>
            <!-- <span class="font-semibold text-xl text-[#070811]">4,000$</span> -->
          </div>
          <!-- <div class="flex items-start gap-2">
            <div
              @click="openEditFormDialog(currentTeacher)"
              class="cursor-pointer"
            >
              <EditIcon />
            </div>
            <div @click="deleteStaff = true" class="cursor-pointer">
              <DeleteIcons />
            </div>
          </div> -->
        </div>
      </div>
      <div class="bg-[#F8F8F9] rounded-2xl grid p-6 gap-4">
        <div class="flex flex-col flex-wrap">
          <h1 class="md:text-base text-sm font-bold text-[#111928]">
            Subjects to teach
          </h1>
          <p
            class="md:text-base text-sm md:tracking-normal tracking-tighter font-normal text-[#6B7280]"
          >
            {{ currentTeacher.subjects_taught }}
          </p>
        </div>
        <div>
          <h1 class="md:text-base text-sm font-bold text-[#111928]">
            Educational background
          </h1>
          <p
            class="md:text-base text-sm md:tracking-normal tracking-tighter font-normal text-[#6B7280]"
          >
            {{ currentTeacher.educational_background }}
          </p>
        </div>
        <div>
          <h1 class="md:text-base text-sm font-bold text-[#111928]">
            Brief info
          </h1>
          <p
            class="md:text-base text-sm md:tracking-normal tracking-tighter font-normal text-[#6B7280]"
          >
            {{ currentTeacher.brief_bio }}
          </p>
        </div>
      </div>
    </div>
  </el-dialog>
  <el-dialog
    v-model="deleteStaff"
    :width="400"
    :show-close="false"
    class="custom-dialog"
  >
    <div>
      <WarningIcon class="relative bottom-3" />
      <h1 class="font-semibold text-lg leading-7 text-[#181D27]">
        Delete staff post
      </h1>
      <p class="font-normal text-sm leading-5 mt-2">
        Are you sure you want to delete this staff? This <br />
        action cannot be undone.
      </p>
      <div class="flex items-center mt-8">
        <el-button class="w-full" @click="deleteStaff = false"
          >Cancel</el-button
        >
        <el-button
          @click="deleteStaffInfo(currentTeacher.id)"
          class="w-full"
          type="danger"
          >Delete</el-button
        >
      </div>
    </div>
  </el-dialog>
  <el-dialog
    v-model="showModal"
    v-if="showModal"
    :title="modalType === 'create' ? 'Create new staff' : 'Edit staff'"
    :width="702"
    class="custom-dialog"
  >
    <StaffCreateForm
      :type="modalType"
      :schoolList="schoolList"
      :data="currentTeacher"
      @on-submit="submitForm($event)"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive, watch } from "vue";
import StaffCreateForm from "./components/professor/StaffCreateForm.vue";
import WarningIcon from "@/components/icons/Danger.vue";
import DeleteIcons from "@/components/icons/DeleteIcons.vue";
import EditIcon from "@/components/icons/EditIcon.vue";
import EmptyListIcon from "@/components/icons/NotFound.vue";
import User from "@/assets/images/card-header.jpg";
import Img from "../../assets/images/avatar.png";
import { Search, Plus } from "@element-plus/icons-vue";
import { useProfessorStore } from "@/stores";
import { ElMessage } from "element-plus";

const storeProfessor = useProfessorStore();

const currentTeacher = computed(() => storeProfessor.professor);
const schoolList = computed(() => storeProfessor.school_list);
const staffList = computed(() => storeProfessor.professors);

const openCurrentTeacher = ref(false);
const showModal = ref(false);
const currentFormData = ref<any | null>(null);
const deleteStaff = ref(false);
const modalType = ref<"create" | "edit">("create");
const dialogWidth = ref("702px");
const loading = ref(false);

const filter = reactive({
  page: 1,
  limit: 12,
  total: 40,
  search: "" as any,
  select: "" as any,
});

const fetchList = async () => {
  loading.value = true;
  if (!storeProfessor?.school_list.length) {
    await storeProfessor.getProfessorSchoolList();
  }
  if (filter?.search) {
    filter.page = 1;
  }
  filter.select = filter.select === "none" ? undefined : filter.select;
  await storeProfessor.fetchProfessor(filter);
  loading.value = false;
};
const updateDialogWidth = () => {
  dialogWidth.value = window.innerWidth <= 768 ? "380px" : "702px";
};
const openProfessorForm = async (id: string) => {
  await storeProfessor.getProfessorId(id);
  updateDialogWidth();
  openCurrentTeacher.value = true;
};
window.addEventListener("resize", updateDialogWidth);

updateDialogWidth();

const submitForm = async (data: any) => {
  try {
    loading.value = true;
    if (modalType.value === "edit") {
      const { start_time, completion_time, ...filteredData } = data || {};
      await storeProfessor.updateProfessor(data?.id, {
        ...filteredData,
      });
      ElMessage({
        message: "Updated",
        type: "success",
      });
    } else if (modalType.value === "create") {
      await storeProfessor.createProfessor(data);
      ElMessage({
        message: "Create",
        type: "success",
      });
    }
    fetchList();
    loading.value = false;
    showModal.value = false;
    openCurrentTeacher.value = false;
  } catch (error) {
    console.log(error);
  }
};
const deleteStaffInfo = async (id: string) => {
  try {
    await storeProfessor.deleteProfessor(id);
    openCurrentTeacher.value = false;
    deleteStaff.value = false;
    storeProfessor.fetchProfessor(filter);
    ElMessage({
      message: "Successfully Deleted",
      type: "success",
    });
  } catch (error) {
    console.log(error);
  }
};
const openFormDialog = () => {
  showModal.value = true;
  modalType.value = "create";
  currentFormData.value = {};
};

const openEditFormDialog = (data: any) => {
  currentFormData.value = data;
  modalType.value = "edit";
  showModal.value = true;
};
const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};

onMounted(() => {
  fetchList();
});
</script>

<style lang="scss">
.staffcard {
  box-shadow: 0px 1px 2px -1px #0000001a;
  box-shadow: 0px 1px 3px 0px #0000001a;
  width: 100%;
  border-radius: 17.485px;
  border: 0.66px solid #eaecf0;
  background: #fff;
  cursor: pointer;
}

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

  .el-select__caret {
    color: #6b7280;
  }
}
</style>
