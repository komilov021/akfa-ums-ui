<template>
  <div class="h-full flex flex-col mt-4 gap-4" v-loading="loading">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item
        :to="{ path: `/academic/groups/${route.params.semester as string}` }"
        ><span class="font-semibold text-base">
          {{ decodeURIComponent(route.params.semester as string) }}
        </span></el-breadcrumb-item
      >
      <el-breadcrumb-item
        :to="{ path: `/academic/groups/${route.params.semester as string}/${route.params.level as string}` }"
        ><span class="font-semibold text-base">
          Level {{ route.params.level }}
        </span></el-breadcrumb-item
      >
      <el-breadcrumb-item class="underline"
        ><span class="!text-primary font-semibold text-base">
          {{ currentCourse?.title }}
        </span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <div class="flex items-center justify-end">
      <el-button @click="openGroupDialog()" type="primary">
        <Plus class="w-5 h-5 mr-2"></Plus>
        Add new group
      </el-button>
    </div>
    <div class="flex flex-col grow justify-between">
      <el-table
        :data="groups.data"
        style="width: 100%"
        class="whiteStripe"
        row-class-name="noHover"
      >
        <el-table-column
          label="Group name"
          min-width="150"
          max-width="220"
          show-overflow-tooltip
          align="left"
          prop="title"
        />
        <el-table-column
          label="Student count"
          min-width="90"
          max-width="160"
          show-overflow-tooltip
          align="left"
          prop="student_count"
        />
        <el-table-column
          label="Teacher name"
          min-width="150"
          max-width="220"
          show-overflow-tooltip
          align="left"
        >
          <template #default="{ row }">
            {{
              row?.teacher?.id
                ? row?.teacher.first_name + " " + row?.teacher.last_name
                : ""
            }}
          </template>
        </el-table-column>

        <el-table-column
          width="300"
          align="center"
          prop="action"
          label="Actions"
        >
          <template #default="{ row }">
            <div class="flex items-center justify-center gap-2">
              <el-button
                class="action-button"
                @click="
                  router.push({
                    name: 'group-students-view',
                    params: { group: row.id },
                  })
                "
              >
                <el-icon size="20">
                  <View />
                </el-icon>
              </el-button>
              <el-dropdown
                trigger="click"
                class="flex justify-center white-card"
                @command="(command: any) => handleCommand(command, row)"
              >
                <el-button text>
                  <MoreFilled
                    class="h-4 w-4 rotate-90 dot-icon cursor-pointer"
                  />
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu class="!p-1 space-y-1">
                    <el-dropdown-item
                      command="attach"
                      class="simple-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded"
                    >
                      <User class="h-4 w-4 icon" />
                      <span>Attach teacher</span>
                    </el-dropdown-item>
                    <el-dropdown-item
                      command="edit"
                      class="simple-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded"
                    >
                      <EditPen class="h-4 w-4 icon" />
                      <span>Update</span>
                    </el-dropdown-item>
                    <el-dropdown-item
                      command="delete"
                      class="danger-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded"
                    >
                      <Delete class="h-4 w-4" />
                      <span>Delete</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="py-4">
        <el-divider />
        <el-pagination
          background
          @current-change="onPaginationChange"
          layout="prev, pager, next"
          next-text="Next ->"
          prev-text="<- Previous"
          :page-size="filter.limit"
          :total="groups.total"
        />
      </div>
    </div>
    <teleport to="#modal" v-if="showModal">
      <CreateGroupDialog
        v-if="formType === 'create'"
        :loading="loading"
        @on-submit="createGroup($event)"
      />
    </teleport>
    <el-dialog v-model="dialogTableVisible" title="Select teacher" width="400">
      <el-select
        class="w-full mt-5"
        filterable
        v-model="selectedProf"
        :placeholder="`${$t('shared.select')}`"
      >
        <el-option
          v-for="(item, i) in curriculumStore.professors.data"
          :key="i"
          :label="`${item.first_name} ${item.last_name}`"
          :value="item.teacher_id"
        />
      </el-select>
      <div class="flex items-center justify-end mt-10">
        <el-button
          type="primary"
          :disabled="!selectedProf"
          @click="attachTeacher"
        >
          Next
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useModal } from "@/composables";
import { useCurriculumStore, useGroupStore } from "@/stores";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import CreateGroupDialog from "./components/CreateGroupDialog.vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { ArrowRight, Delete, EditPen, User } from "@element-plus/icons-vue";

const i18n = useI18n();
const modal = useModal();
const route = useRoute();
const groupStore = useGroupStore();
const curriculumStore = useCurriculumStore();
const dialogTableVisible = ref(false);
const formType = ref<"edit" | "create" | "attach">("create");
const group = ref();
const router = useRouter();
const showModal = computed(() => modal.show.value);
const groups = computed(() => groupStore.groups);
const courses = computed(() => groupStore.courses);
const loading = computed(() => groupStore.loading);
const currentCourse = computed(() =>
  courses.value.data.find((c) => c.course_reference_id === route.params.course)
);
const selectedProf = ref();
const currentGroup = ref();
const filter = reactive({
  page: 1,
  limit: 30,
  study_year: Number(route.params.level),
  semester: decodeURIComponent(route.params.semester as string),
  course_reference_id: route.params.course as string,
});
const attachTeacher = async () => {
  await groupStore.fetchGroupTeachers({
    teacher_id: selectedProf.value as string,
    group_id: currentGroup.value as string,
  });
  ElMessage({
    message: i18n.t("shared.updated"),
    type: "success",
  });
  fetchList();
  dialogTableVisible.value = false;
};
const fetchList = () => {
  groupStore.fetchGroups(filter);
};

const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};

const openGroupDialog = () => {
  formType.value = "create";
  modal.setTitle("Add new group");
  modal.setWidth("30%");
  modal.showModal();
};

const openEditGroupDialog = () => {
  formType.value = "edit";
  modal.setTitle("Edit group");
  modal.setWidth("30%");
  modal.showModal();
};

const createGroup = async (form: { title: string }) => {
  await groupStore.createGroup({
    ...form,
    study_year: Number(route.params.level),
    semester: decodeURIComponent(route.params.semester as string),
    course_reference_id: route.params.course as string,
  });
  ElMessage({
    message: i18n.t("shared.created"),
    type: "success",
  });
  fetchList();
  modal.hideModal();
};

onMounted(() => {
  fetchList();
  if (!courses.value.data.length) {
    groupStore.fetchCourses({
      ...filter,
      limit: 100,
    });
  }
});

const handleCommand = (command: "edit" | "create" | "attach", row?: any) => {
  if (command === "edit") {
    openEditGroupDialog();
  }
  if (command === "attach") {
    dialogTableVisible.value = true;
    currentGroup.value = row.id;
    curriculumStore.fetchProfessors({ page: 1, limit: 300 });
  }
};
</script>

<style scoped lang="scss"></style>
