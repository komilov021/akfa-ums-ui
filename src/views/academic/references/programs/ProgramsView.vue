<template>
  <div class="mx-auto mt-6 md:mt-2">
    <el-breadcrumb :separator-icon="ArrowRight" class="mb-4">
      <el-breadcrumb-item
        class="underline"
        :to="{ path: '/academic/reference/schools-view' }"
        >Schools and Program</el-breadcrumb-item
      >
      <el-breadcrumb-item class="underline">{{
        school?.title
      }}</el-breadcrumb-item>
    </el-breadcrumb>
    <h5 class="text-2xl font-semibold">
      {{ school?.title }}
    </h5>
    <div class="flex items-center justify-end">
      <el-button type="primary" size="large" @click="openDepartmentFormDialog">
        + Add new program
      </el-button>
    </div>
    <div class="table-wrapper mt-6" v-loading="loading">
      <el-table
        :data="tuitions"
        style="width: 100%"
        class="noHover whiteStripe"
      >
        <el-table-column
          prop="program"
          label="Program"
          min-width="300"
          align="left"
          fixed
        >
          <template #default="{ row }">
            <div class="flex gap-2 w-full items-center">
              <div
                class="bg-[#9E77ED] flex items-center justify-center rounded-md w-[30px] min-w-[30px] h-[30px]"
              >
                <SvgIcon
                  :name="'local-' + row.icon"
                  color="transparent"
                  stroke="white"
                  size="18"
                />
              </div>
              <p class="truncate">
                {{ row.program }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="Head of department"
          min-width="200"
          align="left"
        >
          <template #default="{ row }">
            <div
              v-if="row.chief"
              class="flex gap-2 w-full items-center object-top justify-start"
            >
              <AvatarIcon></AvatarIcon>
              <p>
                {{
                  (row.chief?.first_name || "") +
                  " " +
                  (row.chief?.last_name || "")
                }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="per_semester"
          label="Local Students (UZS)"
          min-width="160"
          align="center"
        >
          <template #default="{ row }">
            <div class="flex items-center justify-center gap-2">
              <p class="text-center">
                {{ $n(row.per_semester) }}
              </p>
              <SvgIcon
                name="local-clock-counter"
                color="transparent"
                size="18"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="fee_foreign_student"
          label="Foreign Students (USD)"
          min-width="200"
          align="center"
        >
          <template #default="{ row }">
            <div class="flex items-center justify-center gap-2">
              <p class="text-center">
                {{ $n(row.fee_foreign_student) }}
              </p>
              <SvgIcon
                name="local-clock-counter"
                color="transparent"
                size="18"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="duration"
          label="Duration (Semesters)"
          min-width="180"
          align="center"
        >
          <!-- <template #default="{ row }">
            <div class="flex items-center justify-center gap-2">
              <p>{{ row.duration }}</p>
              Semesters
            </div>
          </template> -->
        </el-table-column>
        <el-table-column label="Admission" min-width="180" align="center">
          <template #default="{ row }">
            <span
              v-if="row.is_active"
              class="text-[#067647] w-[72px] py-[3px] text-xs border border-[#ABEFC6] bg-[#ECFDF3] rounded-2xl gap-1 flex items-center justify-center mx-auto"
            >
              <span class="w-2 h-2 rounded-full bg-[#17B26A]"></span>
              Active
            </span>
            <span
              v-else
              class="text-[#344054] w-[72px] py-[3px] text-xs border border-[#EAECF0] rounded-2xl gap-1 flex items-center justify-center mx-auto"
            >
              <span class="w-2 h-2 rounded-full bg-[#667085]"></span>
              Inactive
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="Operations"
          align="center"
          min-width="120"
          fixed="right"
        >
          <template #default="scope">
            <div class="flex justify-center space-x-3">
              <el-button class="!px-2" @click="onEditClick(scope.row)"
                ><EditPenIcon class="h-4 w-"
              /></el-button>
              <el-button class="!px-2">
                <DeleteIcon
                  class="h-4 w-"
                  @click="confirmDelete(scope.row.id)"
                />
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog v-model="showModal" :width="917" class="reset">
        <DepartmentForm
          :type="formType"
          :department="tuition"
          :school="school"
          :schools="SchoolStore.schools"
          :degrees="degreeStore.getDegreesSelect"
          :staffs="staffStore.getStaffSelect"
          v-if="showModal"
          :langs="langs"
          @on-submit="submitForm($event)"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useGuideStore,
  useSchoolStore,
  useDegreeStore,
  useStaffStore,
} from "@/stores";
import { onMounted, computed, ref } from "vue";
import DepartmentForm from "./components/ProgramForm.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import { AvatarIcon, DeleteIcon, EditPenIcon } from "@/components/icons";
import { useRoute } from "vue-router";
import { ArrowRight } from "@element-plus/icons-vue";
const route = useRoute();
const i18n = useI18n();
const guideStore = useGuideStore();
const degreeStore = useDegreeStore();
const SchoolStore = useSchoolStore();
const staffStore = useStaffStore();

const formType = ref<"create" | "edit">("create");
const showModal = ref(false);
const loading = ref(false);

const tuitions = computed(() => guideStore.tuitions);
const tuition = ref(tuitions.value[0]);
const langs = computed(() => guideStore.langs);
const school = computed(() => SchoolStore.school);

onMounted(() => {
  SchoolStore.getSchoolById(route.params.id as string);
  if (!SchoolStore.schools.length) {
    SchoolStore.fetchSchools();
  }
  getPrograms();
  guideStore.fetchTuitionsLang();
  degreeStore.fetchStudentDegree();
  // staffStore.getStaffs({
  //   page: 1,
  //   limit: 100,
  //   type: "dean",
  // });
});

const openDepartmentFormDialog = () => {
  formType.value = "create";
  showModal.value = true;
};

const onEditClick = async (row: any) => {
  try {
    tuition.value = row;
    formType.value = "edit";
    staffStore.getStaffs({
      page: 1,
      limit: 100,
      type: "dean",
      search: row.chief?.first_name,
    });
    showModal.value = true;
  } catch (error: any) {
    console.log("error", error.message);
  }
};

const getPrograms = () => {
  guideStore.fetchTuitions({ school_id: route.params.id });
};

const confirmDelete = (id: string) => {
  ElMessageBox.confirm(
    "This action cannot be undone. Continue?",
    i18n.t("shared.warning"),
    {
      confirmButtonText: "Yes",
      cancelButtonText: "Cencel",
      type: "warning",
      center: true,
    }
  )
    .then(async () => {
      try {
        loading.value = true;
        await guideStore.removeTuition(id);
        loading.value = false;
        getPrograms();
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

const submitForm = async (department: any) => {
  try {
    loading.value = true;
    const { en, ru, uz, ...otherData } = department;
    const data = {
      ...otherData,
      per_semester: +department.per_semester,
      fee_foreign_student: +department.fee_foreign_student,
      duration: department.duration + " semestrs",
      title: {
        en,
        ru,
        uz,
      },
      program: en,
    };
    console.log("data", data);
    if (formType.value === "edit" && tuition.value) {
      data["id"] = tuition.value.id;
      await guideStore.editTuition(data);
      ElMessage({
        message: i18n.t("shared.updated"),
        type: "success",
      });
    } else {
      await guideStore.createTuition(data);
      ElMessage({
        message: i18n.t("shared.created"),
        type: "success",
      });
    }
    getPrograms();
    loading.value = false;
    showModal.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
</script>

<style>
.hover-row > td {
  background-color: initial !important;
}
</style>
