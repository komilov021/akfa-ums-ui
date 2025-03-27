<template>
  <div>
    <div class="flex flex-col">
      <h1 class="text-text-900 font-semibold text-xl">Attendance</h1>
      <p class="text-tertiary-600">Track student attendance by week</p>
    </div>
    <div class="items-center gap-4 px-3 md:px-5 md:grid lg:px-0 lg:flex mt-8">
      <div class="grid gap-1.5 w-[250px] mb-4">
        <label class="text-sm text-[#101828] font-medium font-inter"
          >Semester</label
        >
        <el-select
          v-model="ruleform.semester_id"
          class="w-full"
          @change="fetchList"
          :placeholder="`${$t('shared.select')} ${$t('app.semestrs')}`"
          size="large"
        >
          <el-option
            v-for="(item, i) in ExamDatesStore.getSemestrsSelct"
            :key="i"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="grid gap-1.5 w-[350px] mb-4">
        <label class="text-sm text-[#101828] font-medium font-inter"
          >Course</label
        >
        <el-select
          v-model="ruleform.assigned_course_id"
          class="w-full"
          @change="fetchList"
        >
          <el-option
            v-for="(date, p) in studentEnrolled"
            :key="p"
            :label="date.title"
            :value="date.assigned_course_id"
          />
        </el-select>
      </div>
    </div>
    <div class="mt-4 flex" v-loading="loading">
      <el-table :data="[{}]" v-if="AttendanceList" :select-on-click-all="false">
        <template v-for="(week, i) in AttendanceList" :key="week.id">
          <el-table-column :label="week.title" min-width="150" align="center">
            <template
              v-for="(lesson_types, p) in week.lesson_types"
              :key="lesson_types.lesson_id"
            >
              <el-table-column
                :label="lesson_types.title"
                min-width="120"
                align="center"
              >
                <template
                  v-for="lessons in lesson_types.lessons"
                  :key="lessons.attendance_id"
                >
                  <el-table-column
                    :label="'lesson' + ' ' + lessons.lesson"
                    min-width="120"
                    align="center"
                  >
                    <el-checkbox
                      :show-overflow-tooltip="true"
                      class="hover-column"
                      :checked="i === 0 && p === 0 && lessons.present_in_class"
                      v-model="lessons.present_in_class"
                      size="large"
                      disabled
                      style="
                        display: flex;
                        justify-content: center;
                        padding: 0 !important;
                        height: 60px;
                        text-align: center;
                        margin: 0 auto;
                      "
                    />
                  </el-table-column>
                </template>
              </el-table-column>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  useAcademicStore,
  useAttendanceStore,
  useCourseEnrollmentStore,
  useCoursesStore,
  useCurriculumStore,
  useStudentsStore,
} from "@/stores";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const AttendanceStore = useAttendanceStore();
const ExamDatesStore = useAcademicStore();
const studentStore = useStudentsStore();
const curriculumStore = useCurriculumStore();
const enrollmentStore = useCourseEnrollmentStore();
const semestrs = computed(() => studentStore.semestrs);
const AttendanceList = computed(() => AttendanceStore.studentAttendance);
const studentEnrolled: any = computed(
  () => enrollmentStore.studentCourses?.courses
);
const route = useRoute();
const loading = ref(false);
const ruleform = reactive({
  assigned_course_id: "" as any,
  semester_id: "" as any,
  student_id: route.params.id as string,
});

const fetchList = async () => {
  loading.value = true;
  ruleform.assigned_course_id =
    ruleform.assigned_course_id == ""
      ? studentEnrolled.value[0].assigned_course_id
      : ruleform.assigned_course_id;
  ruleform.semester_id =
    ruleform.semester_id == ""
      ? ExamDatesStore.getSemestrsSelct[
          ExamDatesStore.getSemestrsSelct.length - 1
        ].value
      : ruleform.semester_id;
  await AttendanceStore.fechtAttendanceStudents({
    ...ruleform,
    assigned_course_id: ruleform.assigned_course_id,
    // assigned_course_id: "65b2e652a4eca900012e6795"
  });
  loading.value = false;
};
onMounted(() => {
  loading.value = true;
  ruleform.assigned_course_id = "";
  ruleform.semester_id = "";
  if (!ExamDatesStore.getSemestrsSelct.length) {
    ExamDatesStore.fetchSemestr();
  }
  enrollmentStore.getStudentsEnrolledCourses(route.params.id as string);
  if (!curriculumStore.getAssignCoursesSelct.length) {
    curriculumStore.fetchAssignCourses({
      page: 1,
      limit: 100,
      semester_id: ruleform.semester_id,
    });
  }
  fetchList();
  loading.value = false;
});
</script>

<style scoped lang="scss"></style>
