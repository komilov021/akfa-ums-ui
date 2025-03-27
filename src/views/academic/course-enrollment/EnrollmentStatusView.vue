<template>
  <div class="mt-10">
    <h3 class="text-[30px] font-semibold text-[#2C1C5F]">Enrollment status</h3>
    <div class="flex items-center justify-between mt-8">
      <div class="flex items-center gap-10">
        <p class="text-sm font-semibold">
          Study year: {{ enrollment?.study_year }}
        </p>
        <p class="text-sm font-semibold">
          Semester: {{ enrollment?.semester }}
        </p>
      </div>
      <div class="flex items-center gap-5">
        <el-select
          v-model="filter.program_id"
          @change="fetchList"
          class="w-96"
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
        <div>
          <el-input
            placeholder="Search by ID"
            v-model="filter.student_uid"
            @keyup.enter="fetchList"
            :suffix-icon="Search"
          />
        </div>
      </div>
    </div>
    <div class="mt-6" v-loading="loading">
      <el-table :data="students.data" style="width: 100%" class="whiteStripe">
        <el-table-column
          prop="uid"
          label="Student ID"
          min-width="200"
          align="left"
        />
        <el-table-column
          prop="name"
          label="Student name"
          min-width="250"
          align="left"
        />
        <el-table-column
          prop="offered"
          label="Courses offered"
          min-width="200"
          align="center"
        />
        <el-table-column
          prop="enrolled"
          label="Courses enrolled "
          min-width="250"
          align="center"
        />
        <el-table-column
          prop="is_enroll_completed"
          label="Status"
          min-width="200"
          align="left"
        >
          <template #default="{ row }">
            <el-tag
              round
              color="#ECFDF3"
              class="!text-[#067647] !border-[#ABEFC6]"
              v-if="row.is_enroll_completed"
            >
              <div class="flex items-center gap-1">
                <div class="bg-[#17B26A] w-2 h-2 rounded-full"></div>
                Enrolled
              </div>
            </el-tag>
            <el-tag
              round
              color="#F9FAFB"
              class="!text-[#344054] !border-[#EAECF0]"
              v-else
            >
              <div class="flex items-center gap-1 font-medium">
                <div class="bg-[#667085] w-2 h-2 rounded-full"></div>
                Not enrolled
              </div>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="waiting"
          label="Action"
          min-width="250"
          align="center"
        >
          <template #default="{ row }">
            <el-button size="small" @click="openModal(row)" round>
              Edit
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pb-2 px-4">
      <el-divider />
      <el-pagination
        background
        @current-change="onPaginationChange"
        layout="prev, pager, next"
        next-text="Next ->"
        prev-text="<- Previous"
        :page-size="filter.limit"
        :total="30"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  MoreFilled,
  VideoPlay,
  Operation,
  Search,
} from "@element-plus/icons-vue";
import {
  useCourseEnrollmentStore,
  useFileStore,
  useGuideStore,
} from "@/stores";
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
const guideStore = useGuideStore();
const students = computed(() => EnrollmentStore.enrolledStudents);
const enrollment = computed(() => EnrollmentStore.enrollment);

const filter = reactive({
  enrollment_id: route.params.id as string,
  program_id: undefined,
  student_uid: undefined,
  page: 1,
  limit: 20,
});

const fetchList = () => {
  filter.program_id =
    filter.program_id === "none" ? undefined : filter.program_id;
  filter.student_uid = filter.student_uid ? filter.student_uid : undefined;
  guideStore.fetchPrograms();
  EnrollmentStore.getEnrollmentStudents(filter);
};
const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};
const openModal = (data: any) => {
  console.log(data);
};
onMounted(() => {
  EnrollmentStore.getEnrollmentById(route.params.id as string);
  fetchList();
});
</script>

<style></style>
