<template>
  <div>
    <div>
      <h1 class="text-main font-semibold text-xl">Academic years</h1>
      <el-button
        @click="openDepartmentFormDialog()"
        type="primary"
        class="display-inline self-start mt-8"
        >+ Add</el-button
      >
      <div class="grid md:grid-cols-6 sm:grid-cols-4 gap-4 mt-8">
        <div class="semester pl-2" v-for="year in examYears" :key="year.id">
          <h1 class="p-4 text-xs">{{ year.year }}</h1>
          <div class="flex items-stretch">
            <!-- <div
              class="flex items-center p-3 cursor-pointer hover:bg-primary-300"
              @click="openEditFormDialog(year)"
            >
              <el-icon><EditPen /></el-icon>
            </div> -->
            <!-- <div
              class="flex items-center p-3 cursor-pointer hover:bg-primary-300"
              @click="confirmDelete(year.id)"
            >
              <el-icon><Delete /></el-icon>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <div class="mt-10">
      <h1 class="text-main font-semibold text-xl">Semesters</h1>
      <el-button
        @click="openDepartmentFormDialog(1)"
        type="primary"
        class="display-inline self-start mt-8"
        >+ Add</el-button
      >
      <div class="grid md:grid-cols-5 sm:grid-cols-4 gap-4 mt-8">
        <div
          class="semester pl-2"
          v-for="semester in examSemesters"
          :key="semester.id"
        >
          <h1 class="p-4 text-xs">{{ semester.year + " " + semester.name }}</h1>
          <div class="flex items-stretch">
            <!-- <div
              class="flex items-center p-3 cursor-pointer hover:bg-primary-300"
              @click="openEditFormDialog(semester, 1)"
            >
              <el-icon><EditPen /></el-icon>
            </div>
            <div
              class="flex items-center p-3 cursor-pointer hover:bg-primary-300"
              @click="confirmDelete(semester.id, 1)"
            >
              <el-icon><Delete /></el-icon>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <teleport to="#modal" v-if="showModal">
      <AcademicSemestrForm
        v-if="typedFor === 1"
        :type="formType"
        :semestr="examSemester"
        @on-submit="submitForm($event)"
      />
      <AcademicYearForm
        v-else
        :type="formType"
        :year="examYear"
        @on-submit="submitForm($event)"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { useAcademicStore } from "@/stores";
import { onMounted, computed, ref } from "vue";
import { Delete, Edit } from "@element-plus/icons-vue";
import { useModal } from "@/composables";
import { ElMessage, ElMessageBox, dayjs } from "element-plus";
import { useI18n } from "vue-i18n";
import AcademicYearForm from "./components/AcademicYearForm.vue";
import AcademicSemestrForm from "./components/AcademicSemestrForm.vue";

const modal = useModal();
const formType = ref<"create" | "edit">("create");
const i18n = useI18n();
const examYearStore = useAcademicStore();

const showModal = computed(() => modal.show.value);
const loading = ref(false);

const examYears = computed(() => examYearStore.years);
const examSemesters = computed(() => examYearStore.semestrs);
const examYear = ref(examYears.value[0]);
const examSemester = ref(examSemesters.value[0]);
const typedFor = ref(0);
onMounted(() => {
  examYearStore.fetchExamYears();
  examYearStore.fetchSemestr();
});

const openDepartmentFormDialog = (val?: number) => {
  formType.value = "create";
  if (val == 1) {
    typedFor.value = 1;
    modal.setTitle("Add new semester");
  } else {
    typedFor.value = 0;
    modal.setTitle("Add new academic year");
  }
  modal.setWidth("40%");
  modal.showModal();
};

const openEditFormDialog = (row: any, val?: any) => {
  formType.value = "edit";
  if (val == 1) {
    typedFor.value = 1;
    examSemester.value = row;
    modal.setTitle("Update semester");
  } else {
    typedFor.value = 0;
    examYear.value = row;
    modal.setTitle("Update academic year");
  }
  modal.setWidth("40%");
  modal.showModal();
};
const confirmDelete = (id: string, val?: any) => {
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
        if (val === 1) {
          await examYearStore.removeSemestr(id);
          await examYearStore.fetchSemestr();
        } else {
          await examYearStore.removeExamYears(id);
          await examYearStore.fetchExamYears();
        }
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

const submitForm = async (data: any) => {
  try {
    loading.value = true;
    if ((formType.value === "edit" && examYear.value) || examSemester.value) {
      if (typedFor.value == 1) {
        data["id"] = examSemester.value.id;
        await examYearStore.editSemestr(data);
      } else {
        data["id"] = examYear.value.id;
        await examYearStore.editExamYears(data);
      }
      ElMessage({
        message: i18n.t("shared.updated"),
        type: "success",
      });
    } else {
      if (typedFor.value == 1) await examYearStore.createSemestr(data);
      else await examYearStore.createExamYears(data);

      ElMessage({
        message: i18n.t("shared.created"),
        type: "success",
      });
    }
    if (typedFor.value == 1) await examYearStore.fetchSemestr();
    else await examYearStore.fetchExamYears();
    loading.value = false;
    modal.hideModal();
    typedFor.value = 0;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
</script>

<style lang="scss" scoped>
.semester {
  border-radius: 7.237px;
  background: #fff;
  box-shadow: 0px 0.72368px 3.61842px 0.72368px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr auto;
  &__title {
    font-size: 16.699px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
}
</style>
