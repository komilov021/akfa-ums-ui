<template>
  <div class="flex justify-between items-center gap-3 mt-6 md:mt-0 mb-4">
    <h1 class="font-semibold text-xl">Rooms</h1>
    <el-button type="primary" @click="openFormDialog()">+ Add room </el-button>
  </div>
  <div class="table-wrapper" v-loading="loading">
    <el-table
      :data="rooms.data"
      style="width: 100%"
      class="whiteStripe"
      row-class-name="noHover"
      v-loading="loading"
    >
      <el-table-column
        label="Room"
        min-width="150"
        max-width="200"
        show-overflow-tooltip
        align="left"
        prop="code"
      />
      <el-table-column
        label="Additional name"
        min-width="150"
        show-overflow-tooltip
        align="left"
        prop="name"
      />
      <el-table-column
        label="Room size"
        min-width="120"
        max-width="180"
        prop="seats"
      />
      <el-table-column
        label="Allowed lesson types"
        min-width="150"
        show-overflow-tooltip
        align="left"
      >
        <template #default="{ row }">
          {{ row.lessons?.map((item: any) => item.name).join(", ") }}
        </template>
      </el-table-column>
      <el-table-column
        label="Limitation by course"
        min-width="150"
        show-overflow-tooltip
        align="left"
      >
        <template #default="{ row }">
          {{ row.limitations?.map((item: any) => item.name).join(", ") }}
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" prop="action">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-button @click="editRoom(row)" class="action-button">
              <SvgIcon name="local-pen-simple" size="23" />
            </el-button>
            <el-button @click="confirmDelete(row.id)" class="action-button">
              <SvgIcon name="local-trash" size="23" />
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="py-4">
      <el-pagination
        v-if="rooms.total > rooms.limit"
        background
        @current-change="onPaginationChange"
        layout="prev, pager, next"
        next-text="Next ->"
        prev-text="<- Previous"
        :page-size="rooms.limit"
        :total="rooms.total"
      />
    </div>
    <teleport to="#modal" v-if="showModal">
      <RoomsForm
        :lessons="lessonTypeStore.getLessonTypesSelect"
        :courses="courses"
        :value="currentRoom"
        :type="modalType"
        @on-submit="submitForm($event)"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, reactive } from "vue";
import { useModal } from "@/composables";
import {
  useCourseReferanceStore,
  useLessonTypeStore,
  useRoomReferenceStore,
} from "@/stores";
import RoomsForm from "./components/RoomsForm.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";

const i18n = useI18n();
const roomReferenceStore = useRoomReferenceStore();
const lessonTypeStore = useLessonTypeStore();
const courseReferanceStore = useCourseReferanceStore();
const modal = useModal();

const rooms = computed(() => roomReferenceStore.roomReference);
const currentRoom = ref<any>({});
const courses = computed(
  () => courseReferanceStore.getCourseReferanceCodeSelect
);
const showModal = computed(() => modal.show.value);
const modalType = ref<"create" | "edit">("create");
const loading = ref(false);

const filter = reactive({
  page: 1,
  limit: 30,
});

const onPaginationChange = (page: number) => {
  filter.page = page;
  fetchRooms();
};

const openFormDialog = () => {
  modal.setTitle("Add room");
  modal.setWidth("50%");
  modalType.value = "create";
  modal.show.value = true;
};

const submitForm = async (data: any) => {
  try {
    loading.value = true;
    if (modalType.value === "create") {
      await roomReferenceStore.createRoomReferences(data);
    } else {
      await roomReferenceStore.editRoomReferences(data);
    }
    fetchRooms();
    modal.show.value = false;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
};

const editRoom = (data: any) => {
  modal.setTitle("Edit room");
  modal.setWidth("50%");
  modalType.value = "edit";
  currentRoom.value = data;
  modal.show.value = true;
};

const confirmDelete = (id: string) => {
  ElMessageBox.confirm("This action cannot be undone. Continue?", "Warning", {
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    type: "warning",
    center: true,
  })
    .then(async () => {
      try {
        loading.value = true;
        let res = await roomReferenceStore.removeRoomReferences(id);
        if (res?.message?.length > 0) {
          let description = res?.message
            .map((message: any) => `${message.description}`)
            .join("<br/> <br/>");
          ElMessage({
            dangerouslyUseHTMLString: true,
            type: "error",
            message: description,
            duration: 5000,
          });
        } else {
          fetchRooms();
          ElMessage({
            type: "success",
            message: i18n.t("shared.deleteCompleted"),
          });
        }
        loading.value = false;
      } catch (error: any) {
        loading.value = false;
        console.log("error", error);
      }
    })
    .catch(() => {});
};

const fetchRooms = () => {
  roomReferenceStore.fetchRoomReferences(filter);
};

onMounted(() => {
  fetchRooms();

  if (!lessonTypeStore.getLessonTypesSelect.length) {
    lessonTypeStore.fetchLessonTypes({ limit: 100, page: 1 });
  }

  if (!courseReferanceStore.getCourseReferanceCodeSelect.length) {
    courseReferanceStore.fetchCourseReferances({ limit: 100, page: 1 });
  }
});
</script>

<style scoped lang="scss"></style>
