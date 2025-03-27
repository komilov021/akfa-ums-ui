<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-position="top"
    require-asterisk-position="right"
    v-loading="loading"
  >
    <el-form-item label="Program*" prop="program">
      <el-select
        @change="curriculumStore.fetchByLevels(program)"
        v-model="program"
        placeholder="Select"
        class="w-full"
      >
        <el-option
          v-for="date of programs"
          :key="date.id"
          :label="date.program"
          :value="date.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="Level*" prop="level">
      <el-select v-model="level" placeholder="Select" class="w-full">
        <el-option
          v-for="item of curriculumStore.list_by_levels"
          :key="item.id"
          :label="item.study_year"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="Semester*" prop="semester">
      <el-select
        @change="
          curriculumStore.fetchAssignCourses({
            ...filter,
            curriculum_id: level,
            semester: `${
              semester.split('-')[1] + ' ' + semester.split('-')[0]
            }`,
          })
        "
        v-model="semester"
        placeholder="Select"
        class="w-full"
      >
        <el-option
          v-for="item of ExamDatesStore.getSemestrsSelct"
          :key="item.value"
          :label="item.label"
          :value="item.label"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="Course" prop="assigned_course_id">
      <el-select
        v-model="ruleForm.assigned_course_id"
        placeholder="Select"
        filterable
        class="w-full"
      >
        <el-option
          v-for="date of assignCourses.data"
          :key="date.id"
          :label="date.title"
          :value="date.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="Group type" prop="group_type">
      <el-select
        v-model="ruleForm.group_type"
        placeholder="Select"
        filterable
        class="w-full"
      >
        <el-option
          class="!capitalize"
          v-for="type in ['main', 'additional']"
          :key="type"
          :label="type"
          :value="type"
        />
      </el-select>
    </el-form-item>
  </el-form>
  <div class="flex pt-4">
    <el-button type="primary" size="large" @click="submitForm(ruleFormRef)">
      Save
    </el-button>
  </div>
</template>
<script setup lang="ts">
import { useAcademicStore, useCurriculumStore } from "@/stores";
import { InfoFilled } from "@element-plus/icons-vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { ref, reactive, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const router = useRouter();
const ExamDatesStore = useAcademicStore();
const ruleFormRef = ref<FormInstance>();
const emit = defineEmits(["onSubmit"]);
const program = ref();
const level = ref();
const semester = ref();
const curriculumStore = useCurriculumStore();
const props = defineProps<{
  programs?: any;
  student: any;
}>();
const i18n = useI18n();
const filter = reactive({
  page: 1,
  limit: 400,
});
const load = () => {
  // curriculumStore.fetchAssignCourses(filter)
};
const assignCourses = computed(() => curriculumStore.assignCourses);
const ruleForm = reactive({
  assigned_course_id: "",
  student_id: props.student.id,
  group_type: "",
});
const rules = reactive<FormRules>({
  assigned_course_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  group_type: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});
onMounted(async () => {
  if (!ExamDatesStore.getSemestrsSelct.length) {
    ExamDatesStore.fetchSemestr();
  }
  // curriculumStore.fetchAssignCourses(filter);
});
const loading = ref(false);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      emit("onSubmit", {
        ...ruleForm,
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
