<template>
  <div class="h-full flex flex-col">
    <el-breadcrumb :separator-icon="ArrowRight" class="mb-2">
      <el-breadcrumb-item :to="{ path: '/academic/managment/programs' }"
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
      <el-breadcrumb-item class="underline"
        ><span class="!text-primary font-semibold text-base">
          Level {{ currentCurriculum?.study_year }}
        </span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <h1 class="text-text-900 font-semibold text-3xl">
      {{ currentProgram?.program }}
    </h1>
    <div class="flex">
      <el-tabs v-model="filter.semester" @tab-change="fetchList">
        <el-tab-pane
          v-for="item of [
            currentCurriculum?.semester1,
            currentCurriculum?.semester2,
          ]"
          :key="item"
          :label="item"
          :name="item"
        />
      </el-tabs>
    </div>
    <div class="flex justify-between mb-2">
      <el-tabs v-model="activeTab" @tab-change="tabChange">
        <el-tab-pane label="Students" :name="tabItems.students" />
        <el-tab-pane label="Courses and grades" :name="tabItems.courses" />
        <el-tab-pane
          v-if="currentCurriculum?.is_closed"
          label="Progression results"
          :name="tabItems.progression"
        />
      </el-tabs>
      <div class="flex items-center gap-4">
        <!-- <el-button type="primary" @click="submitExportGrades"
          >Export grades</el-button
        > -->
        <!-- <el-button
          v-if="!currentCurriculum?.is_closed"
          type="primary"
          @click="closeAcademicYear"
          >Close academic year</el-button
        >
        <el-tag
          v-else
          effect="dark"
          size="large"
          class="!bg-[#47CD89] !border-0"
          >Academic year is closed</el-tag
        > -->
      </div>
    </div>
    <RouterView v-if="currentCurriculum" />
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from "@element-plus/icons-vue";
import {
  useCurriculumStore,
  useFileStore,
  useGradeStore,
  useGuideStore,
  useProgressionResultStore,
} from "@/stores";
import {
  computed,
  onBeforeMount,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from "vue";
import { saveFile } from "@/utils/common";
import { useRoute } from "vue-router";
import router from "@/router";
import { ElMessage, ElMessageBox } from "element-plus";

const route = useRoute();
const curriculumStore = useCurriculumStore();
const progressionResultStore = useProgressionResultStore();
const guideStore = useGuideStore();
const fileStore = useFileStore();
const gradeStore = useGradeStore();
const semester = computed(() => curriculumStore.currentSemestr);
const currentCurriculum = computed(() => curriculumStore.currentCurriculum);
const tuitions = computed(() => guideStore.tuitions);
const currentProgram = ref();
const loading = ref(false);

const filter = reactive({
  page: 1,
  limit: 30,
  semester: currentCurriculum.value?.semester1,
  curriculum_id: route.params.curriculum as string,
});

const tabItems = {
  students: "academic-managment-students",
  courses: "academic-managment-courses",
  progression: "academic-managment-progression",
} as any;

const activeTab = ref(tabItems.courses);

const fetchList = () => {
  if (activeTab.value === tabItems.courses) {
    curriculumStore.setCurrentSemestr(filter?.semester as string);
    filter.semester = curriculumStore.currentSemestr as string;
    curriculumStore.fetchAssignCourses(filter);
  }
};

const tabChange = (tab: any) => {
  activeTab.value = tab;
  router.push({
    name: tab,
  });
};

const closeAcademicYear = () => {
  ElMessageBox.confirm(
    "This will close the academic year and you will not be able to edit the grades. Are you sure?",
    "Warning",
    {
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      type: "warning",
    }
  )
    .then(async () => {
      try {
        loading.value = true;
        await progressionResultStore.generateProgressionResult(
          route.params.curriculum as string
        );
        ElMessage({
          message: "Academic year closed",
          type: "success",
        });
        loading.value = false;
      } catch (error: any) {
        loading.value = false;
      }
    })
    .catch(() => {});
};

const submitExportGrades = async () => {
  try {
    if (currentCurriculum?.value) {
      loading.value = true;
      const exportFile = (await gradeStore.fetchGradingSystemExport({
        program_id: currentCurriculum.value.program_id,
        level: currentCurriculum.value.study_year,
        to_semester: 11,
        from_semester: 0,
      })) as any;
      const data = await fileStore.downloadById(exportFile?.id);
      saveFile(data, exportFile.name || "FileName.xlsx");
      loading.value = false;
    }
  } catch (error: any) {
    console.log("error", error?.message);
    loading.value = false;
  }
};

onMounted(async () => {
  activeTab.value = route.name as string;

  await curriculumStore.getCurriculumById(route.params.curriculum as string);
  filter.semester = currentCurriculum.value?.semester1;
  curriculumStore.setCurrentSemestr(filter?.semester as string);
  if (tuitions.value.length === 0) await guideStore.fetchTuitions();

  currentProgram.value = tuitions.value.find(
    (tuition: any) => tuition.id === route.params.program
  );
});
onBeforeMount(() => {
  curriculumStore.setCurrentSemestr(filter.semester as string);
});
onUnmounted(async () => {
  curriculumStore.clearCurrentCurriculum();
});
</script>

<style scoped></style>
