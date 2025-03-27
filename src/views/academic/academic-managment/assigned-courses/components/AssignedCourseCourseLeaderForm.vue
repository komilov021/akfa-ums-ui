<template>
  <div v-loading="loading">
    <div class="flex items-center justify-between mb-8">
      <div class="flex flex-col gap-3">
        <h1 class="font-semibold text-xl">School and course leader</h1>
        <p class="text-tertiary-600 font-normal">
          Update your company photo and details here.
        </p>
      </div>
      <div class="flex items-center gap-2 absolute right-0 top-2">
        <el-button v-if="!editable" @click="editable = true">Edit</el-button>
        <template v-else>
          <el-button @click="editable = false">Cancel</el-button>
          <el-button @click="openRequestModal" color="#344054">Save</el-button>
        </template>
      </div>
    </div>
    <div v-if="!editable">
      <div class="grid grid-cols-5 gap-2">
        <h1 class="font-semibold">Course leader</h1>
        <h1 class="text-base">{{ getStaffName(course.chief_id) }}</h1>
      </div>
      <el-divider />
      <div class="grid grid-cols-5 gap-2">
        <h1 class="font-semibold">School</h1>
        <h1 class="text-base">{{ getSchoolName(course.school_id) }}</h1>
      </div>
    </div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="left"
      hide-required-asterisk
      label-width="200"
      v-else
    >
      <div>
        <el-form-item label="School" prop="school_id">
          <el-select v-model="ruleForm.school_id" class="w-full">
            <el-option
              v-for="{ label, value } of schoolStore.getSchoolsSelct"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-divider />
        <el-form-item label="Course leader" prop="chief_id">
          <el-select v-model="ruleForm.chief_id" filterable class="w-full">
            <el-option
              v-for="{ label, value } of staffStore.getStaffSelect"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <teleport to="#modal" v-if="showModal">
      <UpdateRequestDialog @on-submit="submitForm($event)" />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { useI18n } from "vue-i18n";
import { IAssignedCourse, RequestTypeEnum } from "@/models/backend";
import { useCurriculumStore, useSchoolStore, useStaffStore } from "@/stores";
import { useModal } from "@/composables";
import UpdateRequestDialog from "@/components/common/UpdateRequestDialog.vue";

const i18n = useI18n();
const schoolStore = useSchoolStore();
const staffStore = useStaffStore();
const curriculumStore = useCurriculumStore();
const modal = useModal();
const emit = defineEmits(["onChange"]);

const props = defineProps<{
  course: IAssignedCourse;
}>();

const loading = ref(false);
const editable = ref(false);
const showModal = computed(() => modal.show.value);
const schools = computed(() => schoolStore.schools);

const currentType = ref<RequestTypeEnum>(
  RequestTypeEnum.assigned_grading_leader
);

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  school_id: "",
  chief_id: "",
});

const rules = reactive<FormRules>({
  school_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  chief_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});

onMounted(() => {
  if (schools.value.length === 0) {
    schoolStore.fetchSchools();
  }
  if (staffStore.getStaffSelect.length === 0) {
    staffStore.getStaffs({ type: "course_leader" });
  }
  ruleForm.school_id = props.course.school_id;
  ruleForm.chief_id = props.course.chief_id;
});

const openRequestModal = () => {
  ruleFormRef.value?.validate((valid) => {
    if (valid) {
      currentType.value = RequestTypeEnum.assigned_grading_leader;
      modal.setTitle(currentType.value);
      modal.setWidth("35vw");
      modal.showModal();
    }
  });
};

const submitForm = async (request: any) => {
  try {
    loading.value = true;
    request.type = currentType.value;
    await curriculumStore.editAssignCourseGradingLeader({
      ...ruleForm,
      assigned_course_id: props.course.id,
      request,
    });
    ElMessage({
      message: i18n.t("shared.created"),
      type: "success",
    });
    modal.hideModal();
    editable.value = false;
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};

const getSchoolName = (id: string) => {
  const school = schools.value.find((school: any) => school.id === id);
  return school?.title;
};

const getStaffName = (id: string) => {
  const staff = staffStore.getStaffSelect.find(
    (staff: any) => staff.value === id
  );
  return staff?.label;
};
</script>

<style scoped lang="scss"></style>
