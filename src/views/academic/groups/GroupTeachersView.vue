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
      <el-breadcrumb-item class="underline"
        ><span class="!text-primary font-semibold text-base">
          {{ currentCourse?.title }}
        </span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <div class="flex flex-col grow justify-between">
      <el-table
        :data="students.data"
        style="width: 100%"
        class="whiteStripe"
        row-class-name="noHover"
      >
        <el-table-column
          label="Full name"
          min-width="150"
          max-width="200"
          show-overflow-tooltip
          align="left"
        >
          <template #default="{ row }">
            <span>{{ row.first_name + " " + row.last_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="ID and email"
          min-width="150"
          max-width="200"
          show-overflow-tooltip
          align="left"
        >
          <template #default="{ row }">
            <p>{{ row.student_uid }}</p>
            <p>{{ row.email }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="Department"
          min-width="150"
          max-width="200"
          show-overflow-tooltip
          align="left"
          prop="program"
        />
        <el-table-column
          prop="study_year"
          label="Study year"
          min-width="100"
          show-overflow-tooltip
          align="left"
        />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModal } from "@/composables";
import { useGroupStore } from "@/stores";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import { ArrowRight, Delete, EditPen, User } from "@element-plus/icons-vue";

const i18n = useI18n();
const modal = useModal();
const route = useRoute();
const groupStore = useGroupStore();
const students = computed(() => groupStore.students);
const courses = computed(() => groupStore.courses);
const loading = computed(() => groupStore.loading);

const currentCourse = computed(() =>
  courses.value.data.find((c) => c.course_reference_id === route.params.course)
);

const filter = reactive({
  teacher_id: route.params.teacher as string,
  group_id: route.params.group as string,
});

const fetchList = () => {
  groupStore.fetchGroupTeachers(filter);
};
onMounted(() => {
  fetchList();
  if (!courses.value.data.length) {
    groupStore.fetchCourses({
      ...filter,
      limit: 100,
      page: 1,
      study_year: Number(route.params.level),
      semester: decodeURIComponent(route.params.semester as string),
    });
  }
});
</script>

<style scoped lang="scss"></style>
