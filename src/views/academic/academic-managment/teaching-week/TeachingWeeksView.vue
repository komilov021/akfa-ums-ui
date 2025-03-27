<template>
  <div class="mt-2">
    <el-breadcrumb :separator-icon="ArrowRight" class="mb-2">
      <el-breadcrumb-item
        :to="{ path: `/academic/managment/programs/${currentProgram?.id}` }"
        ><span class="font-semibold text-base">
          {{ currentProgram?.program }}
        </span></el-breadcrumb-item
      >
      <el-breadcrumb-item
        :to="{
          path: `/academic/managment/programs/${currentProgram?.id}/${route.params?.year}`,
        }"
        ><span class="font-semibold text-base">
          {{ currentCurriculum?.semester1 }} -
          {{ currentCurriculum?.semester2 }}
        </span></el-breadcrumb-item
      >
      <el-breadcrumb-item
        :to="{
          path: `/academic/managment/programs/${currentProgram?.id}/${route.params?.year}/${currentCurriculum?.id}`,
        }"
        ><span class="font-semibold text-base">
          Level {{ currentCurriculum?.study_year }}
        </span></el-breadcrumb-item
      >
      <el-breadcrumb-item
        :to="{
          path: `/academic/managment/programs/${currentProgram?.id}/${route.params?.year}/${currentCurriculum?.id}/${route.params?.grade}`,
        }"
        ><span class="font-semibold text-base">
          {{ currentCourse?.title + " " + currentCourse?.semester }}
        </span></el-breadcrumb-item
      >
      <!-- <el-breadcrumb-item class="underline"
        ><span class="!text-primary font-semibold text-base">
          {{ $route.params?.group }}
        </span></el-breadcrumb-item
      > -->
      <el-breadcrumb-item class="underline"
        ><span class="!text-primary font-semibold text-base">
          Weeks
        </span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <div>
      <h1 class="text-text-900 font-semibold text-3xl">
        {{ currentCourse?.title + " " + currentCourse?.semester }}
      </h1>
      <el-divider></el-divider>
    </div>
    <div v-loading="loading">
      <div class="flex items-center justify-between">
        <h4 class="text-xl font-semibold text-[#101828]">Teaching weeks</h4>
        <div class="flex">
          <el-button disabled> Publish </el-button>
          <el-button @click="createTeachingWeek()">
            <Plus class="w-5 h-5 mr-2"></Plus>
            Add teaching week
          </el-button>
        </div>
      </div>
      <div class="flex flex-wrap gap-8 mt-4" v-if="teachingWeeks.data.length">
        <div
          v-for="week in teachingWeeks.data"
          :key="week.id"
          class="card gap-6 p-4"
        >
          <button class="float-right" @click="confirmDelete(week.id)">
            <SvgIcon name="local-trash" size="22" />
          </button>
          <div
            class="flex items-center justify-center px-6 py-7"
            @click="
              router.push({
                name: 'academic-managment-weeks-view',
                params: {
                  week: week.id,
                },
              })
            "
          >
            <div class="flex flex-col gap-2 flex-1">
              <h1 class="card__title">{{ week.title }}</h1>
              <h2 class="card__subtitle">Attendance: {{ week.total }}</h2>
              <!-- <el-tag round color="#F9FAFB" class="!text-[#344054] !w-28 !border-[#EAECF0] mt-6 !font-medium">
                            Not published
                        </el-tag> -->
            </div>
            <el-icon :size="20">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
      </div>
      <div v-else class="my-14 text-center">No data</div>
      <div class="flex items-center justify-between mt-10">
        <h4 class="text-xl font-semibold text-[#101828]">
          Low attendance students
        </h4>
        <div class="flex">
          <el-button
            type="primary"
            :disabled="!teachingWeeks.data.length"
            @click="generateLowAttendance"
          >
            Create
          </el-button>
        </div>
      </div>
      <div
        v-if="lowAttendanceStudents.data.length"
        class="flex flex-col grow justify-between mt-6"
      >
        <el-table
          :data="lowAttendanceStudents.data"
          style="width: 100%"
          class="whiteStripe"
          row-class-name="noHover"
        >
          <el-table-column
            label="ID"
            min-width="150"
            max-width="220"
            show-overflow-tooltip
            align="left"
            prop="student_uid"
          />
          <el-table-column
            label="Attendance"
            min-width="150"
            max-width="220"
            show-overflow-tooltip
            align="left"
            prop="score"
          >
            <template #default="{ row }">
              <div
                class="py-1 px-3 bg-[#FA9D9D] rounded-[32px] inline-block text-white w-[60px] text-center"
              >
                {{ row.absent_percent }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="Approved by"
            min-width="120"
            show-overflow-tooltip
            align="left"
          >
            <template #default="{ row }">
              {{ row.approved_by || "" }}
            </template>
          </el-table-column>
          <el-table-column
            label="Status"
            min-width="120"
            max-width="220"
            show-overflow-tooltip
            align="left"
            prop="status"
          />
          <el-table-column
            width="200"
            align="center"
            prop="action"
            label="Actions"
          >
            <template #default="{ row }">
              <el-button
                class="action-button"
                @click="updateLowAttendanceStudent(row)"
                :class="{ '!bg-[#ECFDF3]': !!row.approved_by }"
              >
                <SvgIcon name="local-checks" size="22" />
              </el-button>
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
            :total="lowAttendanceStudents.total"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, Plus } from "@element-plus/icons-vue";
import {
  useCurriculumStore,
  useGuideStore,
  useAttendanceStore,
  useGradeStore,
} from "@/stores";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";

const route = useRoute();
const router = useRouter();
const i18n = useI18n();
const curriculumStore = useCurriculumStore();
const guideStore = useGuideStore();
const attendanceStore = useAttendanceStore();
const currentCurriculum = computed(() => curriculumStore.currentCurriculum);
const currentCourse = computed(() => curriculumStore.currentCourse);
const teachingWeeks = computed(() => attendanceStore.teachingWeeks);
const lowAttendanceStudents = computed(
  () => attendanceStore.lowAttendanceStudents
);
const tuitions = computed(() => guideStore.tuitions);
const currentProgram = ref();
const currentSemester: any = computed(() => gradeStore.generalGrades);
const gradeStore = useGradeStore();

const showModal = ref(false);
const loading = ref(false);
const filter = reactive({
  page: 1,
  limit: 30,
  assigned_course_id: route.params.grade as string,
  semester: "",
  // group_code: route.params.group as string,
});

const fetchTeachingWeekList = () => {
  attendanceStore.fetchTeachingWeek(filter);
};
const fetchLowAttendanceStudents = () => {
  attendanceStore.fetchLowAttendanceStudents(filter);
};

const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchLowAttendanceStudents();
};

onMounted(async () => {
  await curriculumStore.getAssignCourseById(route.params.grade as string);
  filter.semester = curriculumStore.currentCourse?.semester as string;
  curriculumStore.fetchAssignCourses(filter);
  gradeStore.fetchGeneralGrades(route.params.grade as string);
  fetchTeachingWeekList();
  fetchLowAttendanceStudents();
  await curriculumStore.getCurriculumById(route.params.curriculum as string);

  if (tuitions.value.length === 0) await guideStore.fetchTuitions();
  currentProgram.value = tuitions.value.find(
    (tuition: any) => tuition.id === route.params.program
  );
});

const createTeachingWeek = async () => {
  try {
    loading.value = true;
    console.log(route.params.group as string);

    const data = {
      title: "Week" + " " + (teachingWeeks.value.data.length + 1),
      assigned_course_id: filter.assigned_course_id,
      semester: filter.semester,
      // group_id: route.params.group as string,
    };

    await attendanceStore.createTeachingWeek(data);

    ElMessage({
      message: i18n.t("shared.created"),
      type: "success",
    });

    fetchTeachingWeekList();
    showModal.value = false;
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
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
        await attendanceStore.removeTeachingWeek(id);
        fetchTeachingWeekList();
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
const updateLowAttendanceStudent = (row: any) => {
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

        await attendanceStore.approveLowAttendance(row.id);

        ElMessage({
          message: i18n.t("shared.updated"),
          type: "success",
        });

        fetchLowAttendanceStudents();
        loading.value = false;
      } catch (error: any) {
        loading.value = false;
        console.log("error", error);
      }
    })
    .catch(() => {});
};

const generateLowAttendance = async () => {
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

        await attendanceStore.generateLowAttendance(filter.assigned_course_id);

        ElMessage({
          message: i18n.t("shared.updated"),
          type: "success",
        });

        fetchLowAttendanceStudents();
        loading.value = false;
      } catch (error: any) {
        loading.value = false;
        console.log("error", error);
      }
    })
    .catch(() => {});
};
</script>

<style scoped lang="scss">
.card {
  border-radius: 17.505px;
  background: #fff;
  box-shadow: 0.53488px 0.53488px 5.34882px 0.2334px rgba(0, 0, 0, 0.25);
  width: 350px;

  &__title {
    color: #1b1b1b;
    font-size: 22px;
    font-style: normal;
    font-weight: 500;
    display: -webkit-box;
    max-width: 400px;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }

  &__subtitle {
    color: #7c7c7c;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
  }
}
</style>
