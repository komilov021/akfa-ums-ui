<template>
  <div class="mt-10">
    <h3 class="text-[30px] font-semibold">Enrollment summary</h3>
    <div class="flex items-center justify-between mt-8">
      <div class="flex items-center gap-10">
        <p class="text-sm font-semibold">
          Study year: {{ enrollment?.study_year }}
        </p>
        <p class="text-sm font-semibold">
          Semester: {{ enrollment?.semester }}
        </p>
      </div>
      <div class="flex items-center gap-5" v-if="!enrollment?.is_enrolled">
        <el-button v-if="!enrollment?.is_published" @click="publishConfirm">
          <VideoPlay class="w-6 h-6 mr-2"></VideoPlay>
          Publish enrollment
        </el-button>
        <el-button
          v-if="enrollment?.is_published && !enrollment.is_enrolled"
          @click="publishDialog = true"
        >
          <Refresh class="w-6 h-6 mr-2"></Refresh>
          Update enrollment deadline
        </el-button>
        <!-- <el-button @click="regenerate" v-else>
          <Operation class="w-5 h-5 mr-2"></Operation>
          Start Enrollment
        </el-button> -->
        <el-dropdown
          :hide-on-click="false"
          @command="(command: any) => handleActionClick(command)"
        >
          <el-button>
            <MoreFilled class="w-6 h-6"></MoreFilled>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                command="edit"
                class="flex items-center gap-2 text-base py-2"
                ><EditPenIcon class="w-5 h-5"></EditPenIcon>
                Edit</el-dropdown-item
              >
              <el-dropdown-item
                v-if="!enrollment?.is_published"
                command="regenerate"
                class="flex items-center gap-2 text-base py-2"
                ><Operation class="w-5 h-5"></Operation> Redistribute
                courses</el-dropdown-item
              >
              <el-dropdown-item
                command="export"
                class="flex items-center gap-2 text-base py-2"
                ><exel-icon class="w-5 h-5"></exel-icon>
                Export</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <el-tag v-else effect="dark" size="large" class="!bg-[#47CD89] !border-0"
        >Course enrollment closed</el-tag
      >
    </div>
    <div class="mt-6" v-loading="loading">
      <el-table :data="summary" style="width: 100%" class="whiteStripe">
        <el-table-column
          prop="title"
          label="Course name"
          min-width="150"
          align="left"
        />
        <el-table-column
          prop="code"
          label="Course code"
          min-width="150"
          align="left"
        />
        <el-table-column
          prop="program"
          label="Program"
          min-width="200"
          align="left"
        />
        <el-table-column
          prop="offered"
          label="# of students offered this course"
          min-width="250"
          align="left"
        />
        <el-table-column
          prop="enrolled"
          label="# of enrolled students"
          min-width="200"
          align="left"
        />
        <el-table-column
          prop="waiting"
          label="# of students waiting for enrollment"
          min-width="250"
          align="left"
        />
        <el-table-column
          prop="rejected"
          label="# of students who rejected this course"
          min-width="250"
          align="left"
        />
      </el-table>
    </div>
    <el-dialog v-model="publishDialog" width="250px" align-center>
      <p class="mt-4 mb-2">Enter deadline for enrollment</p>
      <el-date-picker
        v-model="ruleForm.deadline"
        type="date"
        placeholder="Pick a day"
      />
      <template #footer>
        <el-button type="primary" @click="submitPublish"> Submit </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  MoreFilled,
  VideoPlay,
  Operation,
  Refresh,
} from "@element-plus/icons-vue";
import { useCourseEnrollmentStore, useFileStore } from "@/stores";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { EditPenIcon } from "@/components/icons";
import { useI18n } from "vue-i18n";
import ExelIcon from "@/components/icons/ExelIcon.vue";
import { dayjs, ElMessage, ElMessageBox } from "element-plus";

const loading = ref(false);

const route = useRoute();
const router = useRouter();
const i18n = useI18n();
const EnrollmentStore = useCourseEnrollmentStore();
const summary = computed(() => EnrollmentStore.summary);
const fileStore = useFileStore();
const enrollment = computed(() => EnrollmentStore.enrollment);

const publishDialog = ref(false);

const ruleForm = reactive({
  enrollment_id: route.params.id as string,
  deadline: enrollment.value?.deadline || new Date(),
});

onMounted(() => {
  EnrollmentStore.getEnrollmentById(route.params.id as string);
  EnrollmentStore.getEnrollmentSummaryById(route.params.id as string);
});

const regenerate = () => {
  ElMessageBox.confirm(
    `Redistributing courses will delete all of your edits and redistribute courses based on latest curriculum data. Continue? `,
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
        await EnrollmentStore.regenerateCourseEnrollment(
          route.params.id as string
        );
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
const handleActionClick = async (command: string) => {
  if (command === "edit") {
    router.push(
      `/academic/course-enrollment/status/${route.params.id as string}`
    );
  }
  if (command === "regenerate") {
    regenerate();
  }
  if (command === "export") {
    const res = await EnrollmentStore.exportEnrollmentSummary(
      route.params.id as string
    );
    const data = await fileStore.downloadById(res.id);
    window.open(URL.createObjectURL(data));
  }
};
const publishConfirm = () => {
  ElMessageBox.confirm(
    "This action cannot be undone. Please make sure that all curriculum data is correct. Continue? ",
    i18n.t("shared.warning"),
    {
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      type: "warning",
      center: true,
    }
  )
    .then(async () => {
      publishDialog.value = true;
    })
    .catch(() => {});
};
const submitPublish = async () => {
  try {
    loading.value = true;
    const data = {
      ...ruleForm,
      deadline: dayjs(ruleForm.deadline).format("YYYY-MM-DD"),
    };
    await EnrollmentStore.publishCourseEnrollment(data);
    EnrollmentStore.getEnrollmentById(route.params.id as string);
    publishDialog.value = false;
    ElMessage({
      message: "Published",
      type: "success",
    });
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
</script>

<style></style>
