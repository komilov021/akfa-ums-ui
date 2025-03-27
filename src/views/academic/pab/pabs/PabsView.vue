<template>
  <div class="h-full flex flex-col" v-loading="loading">
    <el-breadcrumb :separator-icon="ArrowRight" class="mb-2">
      <el-breadcrumb-item :to="{ path: '/academic/pab/programs' }"
        ><span class="font-semibold text-base">
          {{ currentProgram?.program }}
        </span></el-breadcrumb-item
      >
      <el-breadcrumb-item
        :to="{
          path: `/academic/pab/programs/${currentProgram?.id}/${route.params?.year}`,
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
        <el-tab-pane label="Pab 4 (Final)" :name="tabItems.four" />
      </el-tabs>
    </div>
    <div class="flex justify-between mb-4">
      <el-tabs v-model="activeTab" @tab-change="tabChange">
        <template v-if="filter.semester == currentCurriculum?.semester1">
          <el-tab-pane label="Pab 1" :name="tabItems.one" />
          <el-tab-pane label="Pab 2" :name="tabItems.two" />
        </template>
        <template v-else-if="filter.semester == currentCurriculum?.semester2">
          <el-tab-pane label="Pab 3" :name="tabItems.three" />
        </template>
      </el-tabs>
      <div class="flex items-center">
        <el-button
          type="primary"
          v-if="filter.semester == tabItems.four"
          @click="submitExport"
          >Export</el-button
        >
        <el-button class="!bg-black !text-white" @click="generatePab"
          >Generate PAB</el-button
        >
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
  usePabStore,
  useProgressionResultStore,
} from "@/stores";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import { ElMessage, ElMessageBox } from "element-plus";
import { saveFile } from "@/utils/common";

const route = useRoute();
const PabStore = usePabStore();
const curriculumStore = useCurriculumStore();
const guideStore = useGuideStore();
const fileStore = useFileStore();
const gradeStore = useGradeStore();
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
  one: "academic-pab-one",
  two: "academic-pab-two",
  three: "academic-pab-three",
  four: "academic-pab-four",
} as any;

const activeTab = ref(tabItems.courses);

const fetchList = (name: any) => {
  loading.value = true;
  if (name == tabItems.four) {
    activeTab.value = tabItems.four;
    router.push({
      name: name,
    });
  } else if (name == currentCurriculum.value?.semester1) {
    activeTab.value = tabItems.one;
    router.push({
      name: tabItems.one,
    });
  } else {
    activeTab.value = tabItems.three;
    router.push({
      name: tabItems.three,
    });
  }
  setTimeout(() => {
    loading.value = false;
  }, 5000);
};

const tabChange = (tab: any) => {
  loading.value = true;
  activeTab.value = tab;
  router.push({
    name: tab,
  });
  setTimeout(() => {
    loading.value = false;
  }, 5000);
};

const submitExport = async () => {
  try {
    if (currentCurriculum?.value) {
      loading.value = true;
      const exportFile = (await PabStore.exportPabFinal({
        program_id: currentCurriculum.value.program_id,
        level: currentCurriculum.value.study_year,
      })) as any;
      const data = await fileStore.downloadById(exportFile?.id);
      saveFile(data, exportFile.name || "final-pab.xlsx");
      loading.value = false;
    }
  } catch (error: any) {
    console.log("error", error?.message);
    loading.value = false;
  }
};

const generatePab = async () => {
  ElMessageBox.confirm(`Are you sure?`, "Warning", {
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    type: "warning",
  })
    .then(async () => {
      const request = {
        level: currentCurriculum.value?.study_year as number,
        semester:
          activeTab.value == "academic-pab-three"
            ? (currentCurriculum.value?.semester2 as string)
            : (currentCurriculum.value?.semester1 as string),
        program_id: route.params.program as string,
      };
      try {
        loading.value = true;
        if (activeTab.value == "academic-pab-one") {
          await PabStore.createPabOne({
            pab_number: 1,
            ...request,
          });
          // await PabStore.fetchPabOne(request);
        } else if (activeTab.value == "academic-pab-two") {
          await PabStore.createPabTwo({
            pab_number: 2,
            ...request,
          });
          // await PabStore.fetchPabTwo(request);
        } else if (activeTab.value == "academic-pab-three") {
          await PabStore.createPabOne({
            pab_number: 3,
            ...request,
          });
          // await PabStore.fetchPabOne(request);
        } else {
          await PabStore.createPabTwo({
            pab_number: 4,
            level: currentCurriculum.value?.study_year as number,
            semester: currentCurriculum.value?.semester2 as string,
            program_id: route.params.program as string,
          });
          await PabStore.createPabFinal({
            level: currentCurriculum.value?.study_year as number,
            program_id: route.params.program as string,
            fall_semester: currentCurriculum.value?.semester1 as string,
            spring_semester: currentCurriculum.value?.semester2 as string,
          });
        }
        router.push({ name: activeTab.value, query: { reFetch: "fetch" } });
        ElMessage({
          message: "Pab is generated !",
          type: "success",
        });
        loading.value = false;
      } catch (error: any) {
        console.log("error", error.message);
        loading.value = false;
      }
    })
    .catch(() => {});
};
onMounted(async () => {
  loading.value = true;
  activeTab.value = route.name as string;

  await curriculumStore.getCurriculumById(route.params.curriculum as string);
  filter.semester = currentCurriculum.value?.semester1;
  curriculumStore.setCurrentSemestr(filter?.semester as string);
  if (tuitions.value.length === 0) await guideStore.fetchTuitions();

  currentProgram.value = tuitions.value.find(
    (tuition: any) => tuition.id === route.params.program
  );
  setTimeout(() => {
    loading.value = false;
  }, 5000);
});
onUnmounted(() => {
  PabStore.pab_one = [];
  PabStore.pab_two = [];
  PabStore.final = [];
});
</script>

<style scoped></style>
