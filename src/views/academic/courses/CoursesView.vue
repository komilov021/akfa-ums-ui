<template>
  <div class="flex justify-end flex-wrap items-center mb-4 gap-4">
    <el-select
      v-model="filter.retake"
      @change="fetchList"
      class="w-60"
      placeholder="Retake"
      size="large"
    >
      <el-option
        v-for="(item, i) in [
          { value: 'none', label: 'All' },
          { value: 1, label: 'Yes' },
          { value: 0, label: 'No' },
        ]"
        :key="i"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="filter.program_id"
      @change="fetchList"
      class="w-60"
      :placeholder="`${$t('shared.select')} program`"
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

    <el-select
      v-model="filter.semester_id"
      @change="fetchList"
      class="w-60"
      :placeholder="`${$t('shared.select')} ${$t('app.semestrs')}`"
      size="large"
    >
      <el-option
        v-for="(item, i) in [
          { value: 'none', label: 'All' },
          ...examYearStore.getSemestrsSelct,
        ]"
        :key="i"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <div class="w-40">
      <el-input
        type="text"
        v-model="filter.search_title"
        @keyup.enter="fetchList"
        autocomplete="off"
        size="large"
        class="w-full"
        placeholder="Search by title"
      />
    </div>
    <el-button type="success" size="large" @click="fetchList">Search</el-button>
    <div class="w-20">
      <el-select
        v-model="filter.limit"
        @change="fetchList"
        class="w-full"
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
    <el-button type="primary" size="large" @click="openFormDialog"
      >Add Course</el-button
    >
  </div>
  <div class="table-wrapper" v-loading="loading">
    <el-table
      :data="coursesStore.getCourses"
      stripe
      style="width: 100%"
      row-class-name="noHover"
    >
      <el-table-column
        prop="subject"
        label="Subject"
        min-width="150"
        max-width="200"
        show-overflow-tooltip
        align="left"
      />
      <el-table-column prop="code" label="Code" min-width="150" align="left" />
      <el-table-column
        prop="programs"
        label="Program"
        min-width="150"
        show-overflow-tooltip
        align="left"
      />
      <el-table-column
        prop="retake"
        label="Retake"
        min-width="150"
        align="left"
      >
        <template #default="{ row }">
          <span>
            {{ row.retake === 1 ? "Yes" : "No" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="semester"
        label="Semester"
        min-width="90"
        max-width="160"
        align="left"
      />
      <el-table-column
        prop="fails"
        label="Fails"
        min-width="80"
        max-width="100"
        align="center"
      />
      <el-table-column width="80" align="center" prop="action" fixed="right">
        <template #default="scope">
          <el-dropdown
            trigger="click"
            @command="(command: any) => handleActionClick(command, scope.row)"
            class="flex justify-center white-card"
          >
            <el-button text>
              <MoreFilled class="h-4 w-4 rotate-90 dot-icon cursor-pointer" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu class="!p-1 space-y-1">
                <el-dropdown-item
                  command="students"
                  class="danger-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded"
                >
                  <User class="h-4 w-4" />
                  <span>Students</span>
                </el-dropdown-item>
                <el-dropdown-item
                  command="functions"
                  class="danger-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded"
                >
                  <Operation class="h-4 w-4" />
                  <span>Functions</span>
                </el-dropdown-item>
                <el-dropdown-item
                  command="grades"
                  class="danger-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded"
                >
                  <Finished class="h-4 w-4" />
                  <span>Grades</span>
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
        </template>
      </el-table-column>
    </el-table>
    <div class="py-4">
      <el-pagination
        background
        @current-change="onPaginationChange"
        layout="prev, pager, next"
        :page-size="filter.limit"
        :total="courses.total"
      />
    </div>
    <teleport to="#modal" v-if="showModal">
      <CoursesForm
        :type="formType"
        :course="course"
        :semestrs="examYearStore.getSemestrsSelct"
        :subjects="subjectStore.getSubjectsSelct"
        :programs="guideStore.getProgramsSelct"
        @on-submit="submitForm($event)"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import {
  useGuideStore,
  useSubjectStore,
  useCoursesStore,
  useAcademicStore,
} from "@/stores";
import { onMounted, computed, ref, reactive } from "vue";
import {
  Delete,
  EditPen,
  MoreFilled,
  Operation,
  User,
} from "@element-plus/icons-vue";
import { useModal } from "@/composables";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import CoursesForm from "./components/CoursesForm.vue";
import type { ICourse } from "@/models/backend";
import { useRouter } from "vue-router";

const router = useRouter();
const modal = useModal();
const formType = ref<"create" | "edit">("create");
const i18n = useI18n();

const subjectStore = useSubjectStore();
const guideStore = useGuideStore();
const coursesStore = useCoursesStore();
const examYearStore = useAcademicStore();

const showModal = computed(() => modal.show.value);
const loading = ref(false);

const courses = computed(() => coursesStore.courses);
const course = computed(() => coursesStore.currentCourse);
const courseFilter = computed(() => coursesStore.filter);

const filter = reactive({
  page: 1,
  limit: 100,
  program_id: courseFilter.value.program_id,
  semester_id: courseFilter.value.semester_id,
  retake: courseFilter.value.retake,
  search_title: courseFilter.value.search_title,
});

onMounted(() => {
  if (!guideStore.getProgramsSelct.length) {
    guideStore.fetchPrograms();
  }
  if (!examYearStore.getSemestrsSelct.length) {
    examYearStore.fetchSemestr();
  }
  if (
    !subjectStore.getSubjectsSelct.length ||
    subjectStore.getSubjectsSelct.length < 40
  ) {
    subjectStore.fetchSubjects({ page: 1, limit: 100 });
  }

  fetchList();
});

const fetchList = () => {
  filter.program_id =
    filter.program_id === "none" ? undefined : filter.program_id;
  filter.semester_id =
    filter.semester_id === "none" ? undefined : filter.semester_id;
  filter.retake = filter.retake === "none" ? undefined : filter.retake;
  filter.search_title =
    filter.search_title === "" ? undefined : filter.search_title;

  coursesStore.fetchCoursess(filter);
};

const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};

const openFormDialog = () => {
  formType.value = "create";
  modal.setTitle("Add Course");
  modal.setWidth("50%");
  modal.showModal();
};

const openEditFormDialog = async (id: string) => {
  await coursesStore.getCourseById(id);
  formType.value = "edit";
  modal.setTitle("Update Course");
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
        await coursesStore.removeCourse(id);
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

const handleActionClick = async (command: string, row: ICourse) => {
  if (command === "edit") {
    await openEditFormDialog(row.course_id);
  }
  if (command === "delete") {
    confirmDelete(row.course_id);
  }
  if (command === "functions") {
    router.push({ name: "course-functions", params: { id: row.course_id } });
  }
  if (command === "students") {
    router.push({ name: "course-students", params: { id: row.course_id } });
  }
  if (command === "grades") {
    router.push({ name: "course-grades", params: { id: row.course_id } });
  }
};

const submitForm = async (data: any) => {
  try {
    loading.value = true;
    if (formType.value === "edit" && course.value) {
      await coursesStore.editCourse(data);
      ElMessage({
        message: i18n.t("shared.updated"),
        type: "success",
      });
    } else {
      await coursesStore.createCourse(data);
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
