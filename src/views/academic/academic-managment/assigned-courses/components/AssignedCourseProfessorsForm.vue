<template>
  <div v-loading="loading">
    <div class="flex items-center justify-between mb-8">
      <div class="flex flex-col gap-3">
        <h1 class="font-semibold text-xl">Professors</h1>
        <p class="text-tertiary-600 font-normal">
          Update your company photo and details here.
        </p>
      </div>
      <div class="flex">
        <el-button v-if="disabled" @click="disabled = false">Edit</el-button>
        <div v-else>
          <el-button @click="(disabled = true), getAttachedProfessors()"
            >Cancel</el-button
          >
          <el-button type="primary" @click="submitForm(ruleFormRef)"
            >Save</el-button
          >
        </div>
      </div>
    </div>
    <div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        label-position="top"
        require-asterisk-position="right"
        :disabled="disabled"
        @submit.prevent=""
      >
        <div class="flex items-center">
          <h1 class="font-semibold w-[20%]">Course leader</h1>
          <div
            class="flex items-center justify-between gap-4 w-[80%]"
            v-for="(row, index) in [
              ruleForm.professors.filter((x) => x.is_leader == true)[0],
            ]"
            :key="index"
          >
            <div class="w-[40%]">
              <el-form-item label="Full name">
                <el-select v-model="row.professor_id" filterable class="w-full">
                  <el-option
                    v-for="{ label, value } of staffStore.getStaffSelect"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </el-select>
              </el-form-item>
            </div>
            <el-form-item class="w-[30%]" label="Lessons to teach">
              <el-select
                multiple
                v-model="row.lessons"
                class="w-full"
                :placeholder="`${$t('shared.select')}`"
              >
                <el-option
                  v-for="(item, i) in lessons"
                  :key="i + 'jsanjnc'"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Can put grades" class="w-[15%]">
              <el-switch v-model="row.can_put_grade" size="large" />
            </el-form-item>
          </div>
        </div>
        <el-divider />
        <div class="flex items-center">
          <h1 class="font-semibold w-[20%]">Professors</h1>
          <div
            class="w-[80%]"
            v-if="attachedProfessors.length !== 0 || !disabled"
          >
            <div
              v-for="(row, index) in ruleForm.professors"
              :key="index"
              class="flex items-center justify-between gap-4 w-full"
            >
              <template v-if="row.is_leader === false">
                <el-form-item
                  label="Full name"
                  :prop="'professors.' + index + '.professor_id'"
                  :rules="{
                    required: true,
                    message: $t('validation.fillField'),
                    trigger: 'blur',
                  }"
                  class="w-[40%]"
                >
                  <div class="flex w-full items-center gap-5">
                    <el-select
                      class="w-[90%]"
                      filterable
                      v-model="row.professor_id"
                      :placeholder="`${$t('shared.select')}`"
                    >
                      <el-option
                        v-for="(item, i) in curriculumStore.getProfessorsSelect"
                        :key="i"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <button
                      v-if="!disabled"
                      @click="remove(index)"
                      class="w-8 h-8 rounded-full border-2 border-[#343330] text-xl font-semibold"
                    >
                      <Minus class="w-5 h-5 mx-auto"></Minus>
                    </button>
                  </div>
                </el-form-item>
                <el-form-item
                  class="w-[30%]"
                  label="Lessons to teach"
                  :prop="'professors.' + index + '.lessons'"
                  :rules="{
                    required: true,
                    message: $t('validation.fillField'),
                    trigger: 'blur',
                  }"
                >
                  <el-select
                    multiple
                    v-model="row.lessons"
                    class="w-full"
                    :placeholder="`${$t('shared.select')}`"
                  >
                    <el-option
                      v-for="(item, i) in lessons"
                      :key="i + 'jsanjnc'"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Can put grades" class="w-[15%]">
                  <el-switch v-model="row.can_put_grade" size="large" />
                </el-form-item>
              </template>
            </div>
            <el-button
              v-if="!disabled"
              class="!text-white !bg-[#2E2E2E] mt-4"
              @click="addNew"
            >
              Add new professor
            </el-button>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { useI18n } from "vue-i18n";
import { IAssignedCourse } from "@/models/backend";
import {
  useCurriculumStore,
  useLessonTypeStore,
  useSchoolStore,
  useStaffStore,
} from "@/stores";
import { Minus } from "@element-plus/icons-vue";

const i18n = useI18n();
const schoolStore = useSchoolStore();
const staffStore = useStaffStore();
const curriculumStore = useCurriculumStore();
const lessonTypeStore = useLessonTypeStore();
const emit = defineEmits(["onChange"]);
const lessons: any = ref([]);
const props = defineProps<{
  course: IAssignedCourse;
}>();
const disabled = ref(true);
const loading = ref(false);
const attachedProfessors = computed(() => curriculumStore.attachedProfessors);
const leaderName = computed(
  () =>
    curriculumStore.attachedProfessors.find((item) => item.is_leader)?.professor
);
const schools = computed(() => schoolStore.schools);
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  assigned_course_id: props.course.id,
  curriculum_id: props.course.curriculum_id,
  professors: [
    {
      professor_id: "",
      can_put_grade: false,
      is_leader: true,
      lessons: [] as any,
    },
  ],
});
const addNew = () => {
  ruleForm.professors.push({
    professor_id: "",
    can_put_grade: false,
    is_leader: false,
    lessons: [],
  });
};
const remove = (index: number) => {
  if (ruleForm.professors.length > 1) {
    ruleForm.professors.splice(index, 1);
  }
};
onMounted(() => {
  getAttachedProfessors();
  lessonTypeStore.fetchLessonTypes({ page: 1, limit: 100 });
  curriculumStore.fetchProfessors({ page: 1, limit: 300 });

  props.course.lessons.forEach((acc, curr) => {
    lessons.value.push({
      id: acc.id,
      name: acc.name,
    });
  });
  if (schools.value.length === 0) {
    schoolStore.fetchSchools();
  }
  if (staffStore.getStaffSelect.length === 0) {
    staffStore.getStaffs({ type: "course_leader" });
  }
});

const getSchoolName = (id: string) => {
  const school = schools.value.find((school: any) => school.id === id);
  return school?.title;
};
const getAttachedProfessors = async () => {
  await curriculumStore.fetchAttachProfessor(props.course.id);
  ruleForm.professors = [];
  attachedProfessors.value.forEach((acc: any, curr: number) => {
    ruleForm.professors.push({
      professor_id: acc.professor.id,
      can_put_grade: acc.can_put_grade,
      is_leader: acc.is_leader,
      lessons: acc.lessons.map((x: any) => x.id),
    });
  });
  if (ruleForm.professors.filter((x) => x.is_leader === true).length == 0) {
    ruleForm.professors.push({
      professor_id: getStaffName(props.course.chief_id)?.value as string,
      can_put_grade: false,
      is_leader: true,
      lessons: [],
    });
  }
};
const getStaffName = (id: string) => {
  const staff = staffStore.getStaffSelect.find(
    (staff: any) => staff.value === id
  );
  return staff;
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      ruleForm.professors.forEach((acc, curr1) => {
        acc.lessons.forEach((acc: any, curr2: number) => {
          let val = lessons.value.filter((x: any) => x.id == acc);
          ruleForm.professors[curr1].lessons[curr2] = val[0];
        });
      });
      if (ruleForm.professors[0].professor_id) {
        try {
          loading.value = true;
          await curriculumStore.createAttachProfessor(ruleForm);
          ElMessage({
            message: i18n.t("shared.updated"),
            type: "success",
          });
          disabled.value = true;
          loading.value = false;
          getAttachedProfessors();
        } catch (error: any) {
          loading.value = false;
          console.log("error", error);
        }
      } else {
        ElMessage({
          message: "You should add course leader !",
          type: "error",
        });
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<style scoped lang="scss"></style>
