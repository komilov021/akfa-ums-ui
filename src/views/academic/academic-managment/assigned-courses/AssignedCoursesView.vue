<template>
  <div class="h-full flex flex-col" v-loading="loading">
    <div class="flex flex-col grow justify-between">
      <el-table
        :data="assignCourses.data"
        style="width: 100%"
        class="whiteStripe"
        row-class-name="noHover"
      >
        <el-table-column
          label="Course name and code"
          min-width="150"
          max-width="220"
          show-overflow-tooltip
          align="left"
        >
          <template #default="{ row }">
            <h1 class="leading-none">
              <span class="text-text-900">{{ row.title }}</span
              ><br /><span class="text-tertiary-600">{{ row.code }}</span>
            </h1>
          </template>
        </el-table-column>
        <el-table-column
          label="Total grade status"
          min-width="120"
          show-overflow-tooltip
          align="left"
        >
          <template #default="{ row }">
            <el-tag
              v-if="row.is_published"
              round
              color="#ECFDF3"
              class="!text-[#067647] !w-28 !border-[#ABEFC6] !font-medium"
            >
              Published
            </el-tag>
            <el-tag
              v-else
              round
              color="#F9FAFB"
              class="!text-[#344054] !w-28 !border-[#EAECF0] !font-medium"
            >
              Not published
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="Course leader"
          min-width="120"
          show-overflow-tooltip
          align="left"
        >
          <template #default="{ row }">
            {{ row.chief }}
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
                    name: 'academic-managment-courses-grade',
                    params: { grade: row.id },
                  })
                "
              >
                <SvgIcon name="local-exam" size="22" />
              </el-button>
              <el-button
                class="action-button"
                @click="
                  router.push({
                    name: 'academic-managment-course-view',
                    params: { grade: row.id },
                  })
                "
              >
                <el-icon size="20">
                  <View />
                </el-icon>
              </el-button>
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
          :total="assignCourses.total"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from "@element-plus/icons-vue";
import { useCurriculumStore, useGuideStore } from "@/stores";
import { computed, onBeforeMount, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const curriculumStore = useCurriculumStore();
const guideStore = useGuideStore();

const assignCourses = computed(() => curriculumStore.assignCourses);
const tuitions = computed(() => guideStore.tuitions);
const semester = computed(() => curriculumStore.currentSemestr);
const currentCurriculum = computed(() => curriculumStore.currentCurriculum);
const currentsemester = computed(
  () => curriculumStore.currentCurriculum?.semester1
);
const currentProgram = ref();
const loading = ref(false);
const filter = reactive({
  page: 1,
  limit: 30,
  semester: semester.value,
  curriculum_id: route.params.curriculum as string,
});

const fetchList = async () => {
  loading.value = true;
  if (!filter.semester) {
    filter.semester = currentsemester.value || null;
  }
  await curriculumStore.fetchAssignCourses(filter);
  loading.value = false;
};

const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};

onBeforeMount(() => {
  filter.semester = curriculumStore.currentSemestr;
});
onMounted(async () => {
  if (tuitions.value.length === 0) await guideStore.fetchTuitions();
  currentProgram.value = tuitions.value.find(
    (tuition: any) => tuition.id === route.params.program
  );
  fetchList();
});
</script>

<style scoped></style>
