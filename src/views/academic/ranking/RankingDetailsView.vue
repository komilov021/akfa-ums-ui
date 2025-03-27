<template>
  <div class="flex justify-between flex-wrap items-center mb-4 gap-4">
    <div class="flex items-center w-full justify-between space-x-4">
      <el-button type="primary" @click="router.back()" link>
        <ArrowLeft class="h-4 w-4" /> Back
      </el-button>
      <div>
        <el-button type="primary" @click="downloadExportReports">
          Download
        </el-button>
        <el-button type="primary" @click="publishOrUnPublish">
          {{ rank?.is_published ? "Unpublish" : "Publish" }}
        </el-button>
        <!-- abdulaziz aka asked -->
        <el-button type="primary" @click="generateScholarship">
          Generate
        </el-button>
      </div>
    </div>
  </div>
  <div class="table-wrapper" v-loading="loading">
    <el-table
      class="whiteStripe"
      :data="students.data"
      stripe
      style="width: 100%"
      row-class-name="noHover"
    >
      <el-table-column
        label="Email"
        min-width="100"
        max-width="200"
        show-overflow-tooltip
        align="left"
        prop="student_email"
      />
      <el-table-column
        prop="student_name"
        label="Full name"
        min-width="120"
        max-width="160"
        align="left"
      />
      <el-table-column
        prop="rank"
        label="Rank"
        min-width="90"
        max-width="160"
        align="left"
      />
      <el-table-column
        prop="total_score"
        label="Total score"
        min-width="90"
        max-width="160"
        align="left"
      />
      <el-table-column
        prop="fails"
        label="Fails"
        min-width="90"
        max-width="160"
        align="left"
      />
      <!-- <el-table-column
        prop="aes"
        label="AES Total Number %"
        min-width="150"
        max-width="160"
        align="left"
      />
      <el-table-column
        prop="eps"
        label="EPS"
        min-width="90"
        max-width="160"
        align="left"
      /> -->
      <el-table-column
        v-for="(item, i) in uniqueCriteria"
        :key="i"
        prop="eps"
        :label="item"
        min-width="140"
        show-overflow-tooltip
        align="left"
      >
        <template #default="{ row }">
          <p>
            {{
              row.criterias?.filter((x: any) => x.criteria == item)?.[0]
                ?.percentage || 0
            }}%
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="eps"
        label="Scholarship distribution"
        min-width="170"
        align="left"
      >
        <template #default="{ row }">
          <p>
            <!-- {{
              row.distribution?.criteria
                ? row.distribution?.criteria + " -"
                : ""
            }} -->
            {{ row.distribution?.percentage || 0 }}%
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="total_scholarship"
        label="Total scholarship"
        min-width="120"
        max-width="160"
        align="left"
      />
      <el-table-column
        prop="failed_courses"
        show-overflow-tooltip
        label="Failed courses"
        min-width="200"
        max-width="360"
        align="left"
      >
        <template #default="{ row }">
          <p v-for="(course, i) in row.failed_courses" :key="i">
            {{ course.course }}
            {{ dayjs(course.created_at).format("DD.MM.YYYY") }} Retake :
            {{ course.retake ? "Yes" : "No" }}
            {{ row.failed_courses.length - 1 == i ? "" : ", " }}
          </p>
        </template>
      </el-table-column>
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
                <!-- <el-dropdown-item command="set"
                  class="danger-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded">
                  <EditPen class="h-4 w-4" />
                  <span>Set scholarship</span>
                </el-dropdown-item>
                <el-dropdown-item command="distribution"
                  class="danger-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded">
                  <EditPen class="h-4 w-4" />
                  <span>Distribution</span>
                </el-dropdown-item> -->
                <el-dropdown-item
                  command="view"
                  class="danger-dropdown-item flex items-center justify-start space-x-3 !py-2 rounded"
                >
                  <View class="h-4 w-4" />
                  <span>View</span>
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
        :total="students.total"
      />
    </div>
    <teleport to="#modal" v-if="showModal">
      <SetScholarshipForm
        :type="formType"
        :student_id="student_id"
        :criteriaStore="scholarshipStore"
        :semesterStore="semesterStore"
        @on-submit="submitForm($event)"
        @confirmDelete="confirmDeleteInForm"
      />
    </teleport>
    <el-dialog
      title="Edit distribution"
      width="350px"
      v-model="editDistrubition"
    >
      <div>
        <el-form :model="distribution">
          <el-form-item label="Percentage" class="!block">
            <el-input-number
              class="!w-full"
              v-model="distribution.percentage"
              :min="0"
              :max="100"
            ></el-input-number>
          </el-form-item>
          <div class="flex w-full items-center gap-4">
            <el-button class="w-full" @click="editDistrubition = false"
              >Cancel</el-button
            >
            <el-button class="w-full" type="primary" @click="saveDistribution"
              >Save</el-button
            >
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  useRankingStore,
  useScholarshipStore,
  useGroupStore,
  useFileStore,
} from "@/stores";
import { onMounted, computed, ref } from "vue";
import { EditPen, MoreFilled, View } from "@element-plus/icons-vue";
import type { IStudent, IStudentCourses } from "@/models/backend";
import { useModal } from "@/composables";
import SetScholarshipForm from "./components/SetScholarshipForm.vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox, dayjs } from "element-plus";
import { useI18n } from "vue-i18n";
import { saveFile } from "@/utils/common";

const router = useRouter();
const route = useRoute();
const modal = useModal();
const i18n = useI18n();
const rankingStore = useRankingStore();
const scholarshipStore = useScholarshipStore();
const fileStore = useFileStore();
const semesterStore = useGroupStore();
const scholarships = computed(() => scholarshipStore.scholarships);
const showModal = computed(() => modal.show.value);
const students = computed(() => rankingStore.rankingStudents);
const rank = computed(() => rankingStore.currentRank);
const current = ref({});
const student_id = ref("");
const editDistrubition = ref(false);
const loading = ref(false);
const formType = ref<"edit">("edit");
const distribution = ref({
  id: "",
  criteria: "",
  percentage: 0,
  student_id: "",
  semester: "",
  semester_id: "",
});
const filter = {
  id: route.params.id as string,
  page: 1,
  limit: 30,
};
interface Criteria {
  criteria: string;
  percentage: number;
}
const uniqueCriteria = computed((): string[] => {
  const criteriaSet = new Set<string>();
  students.value.data.forEach((student: any) => {
    if (student.criterias) {
      student.criterias.forEach((criteria: Criteria) => {
        criteriaSet.add(criteria.criteria);
      });
    }
  });
  return Array.from(criteriaSet);
});
const scholarFilter = {
  id: route.params.id as string,
  page: 1,
  limit: 100,
};
onMounted(async () => {
  fetchList();
});

const openEditFormDialog = async (student_name: string) => {
  formType.value = "edit";
  modal.showModal();
  // modal.setTitle(`Set scholarship for ${student_name}`);
};
const fetchList = async () => {
  semesterStore.fetchSemestrs();
  scholarshipStore.fetchScholarshipList(scholarFilter);
  await rankingStore.getRankingById(route.params.id as string);
  await rankingStore.getRankingByStudents({
    ...filter,
    program_id: rank.value?.program?.id as string,
    level: rank.value?.level as number,
  });
};
const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};
const handleActionClick = async (command: string, row: any) => {
  if (command === "set") {
    student_id.value = row.student_id;
    // current.value = {
    //   student_id: row.student_id,
    // };
    await openEditFormDialog(row.student_name);
    await scholarshipStore.fetchScholarshipStudentList(row.student_id);
  }
  if (command === "view") {
    router.push(`/academic/ranking/${route.params.id}/${row.student_id}`);
  }
  if (command === "distribution") {
    editDistrubition.value = true;
    distribution.value = {
      id: row.distribution?.id || "",
      criteria: row.distribution?.criteria || "",
      percentage: row.distribution?.percentage || 0,
      student_id: row.student_id,
      semester: row.distribution?.semester || "",
      semester_id: row.distribution?.semester_id || "",
    };
  }
};

const saveDistribution = async () => {
  try {
    const data = {
      id: distribution.value.id,
      percentage: distribution.value.percentage,
      student_id: distribution.value.student_id,
      semester: distribution.value.semester,
      semester_id: distribution.value.semester_id,
    };
    await scholarshipStore.editScholarshipRankingStudents(data);
    ElMessage({
      message: i18n.t("shared.save"),
      type: "success",
    });
    fetchList();
    loading.value = false;
    editDistrubition.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};

const confirmDeleteInForm = (id: string) => {
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
      loading.value = true;
      await scholarshipStore.detachStudent(id);
      ElMessage({
        message: i18n.t("shared.deleted"),
        type: "success",
      });
      fetchList();
      loading.value = false;
      modal.hideModal();
    } catch (error) {
      console.log(error);
    }
  });
};
const generateScholarship = () => {
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
      loading.value = true;
      await scholarshipStore.setScholarShipByRank(route.params.id as string);
      ElMessage({
        message: "Successfully generated",
        type: "success",
      });
      fetchList();
      loading.value = false;
      modal.hideModal();
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  });
};
const publishOrUnPublish = () => {
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
      loading.value = true;
      await scholarshipStore.publishScholarShipByRank(
        route.params.id as string
      );
      ElMessage({
        message: `Successfully ${
          rank.value?.is_published ? "unpublished" : "published"
        }`,
        type: "success",
      });
      fetchList();
      loading.value = false;
      modal.hideModal();
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  });
};
const downloadExportReports = async () => {
  try {
    if (rank?.value) {
      loading.value = true;
      const data = await fileStore.downloadRankingExportReports({
        id: route.params.id as string,
        program_id: rank.value?.program?.id as string,
        level: rank.value?.level as number,
      });
      saveFile(
        data,
        `${rank.value?.title} ${rank.value?.program?.name} ${rank.value?.semester?.title}.xlsx` ||
          "FileName.xlsx"
      );
      loading.value = false;
    }
  } catch (error: any) {
    console.log("error", error?.message);
    loading.value = false;
  }
};

const submitForm = async (data: any) => {
  try {
    loading.value = true;
    // await rankingStore.setScholarship(data);
    await scholarshipStore.attachStudentScholarship(data);
    ElMessage({
      message: i18n.t("shared.created"),
      type: "success",
    });
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
