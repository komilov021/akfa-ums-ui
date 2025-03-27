<template>
  <div class="pt-6">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
    >
      <div class="grid sm:grid-cols-1 gap-y-1">
        <el-form-item label="Course code" prop="courses_reference_id">
          <el-select
            v-model="ruleForm.courses_reference_id"
            remote
            filterable
            :remote-method="remoteMethod"
            class="w-full"
            :loading="loading"
            @change="onCourseChange"
          >
            <el-option
              v-for="course of allCourses"
              :key="course.id"
              :label="`${course.code} - ${course.title}`"
              :value="course.id"
            />
          </el-select>
        </el-form-item>
        <div v-if="currentCourse">
          <el-form-item label="Main course events" prop="component_ids">
            <el-checkbox-group v-model="ruleForm.component_ids">
              <el-checkbox
                v-for="component of currentCourse.components"
                :key="component.id"
                :label="component.id"
                name="component_ids"
              >
                {{ component.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            label="Retake course events"
            prop="retake_component_ids"
          >
            <el-checkbox-group v-model="ruleForm.retake_component_ids">
              <el-checkbox
                v-for="component of currentCourse.retake_components"
                :key="component.id"
                :label="component.id"
                name="retake_component_ids"
              >
                {{ component.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>

        <el-form-item prop="is_elective" label="Is this course elective?">
          <el-radio-group v-model="ruleForm.is_elective">
            <el-radio :label="true">Yes</el-radio>
            <el-radio :label="false">No</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="Related course:"
          prop="related_courses_reference_ids"
          :rules="{
            required: ruleForm.is_elective,
            message: $t('validation.fillField'),
            trigger: 'blur',
            type: 'array',
          }"
        >
          <el-select
            v-model="ruleForm.related_courses_reference_ids"
            remote
            filterable
            :remote-method="remoteMethod2"
            class="w-full"
            :loading="loading"
            multiple
          >
            <el-option
              v-for="course of relatedCourses"
              :key="course.id"
              :label="`${course.code} - ${course.title}`"
              :value="course.id"
            />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="flex justify-end mt-6">
      <el-button
        type="primary"
        class="rounded"
        @click="submitForm(ruleFormRef)"
      >
        Submit
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ICourseReferance, ICurriculumCourse } from "@/models/backend";
import { useCourseReferanceStore } from "@/stores";
import type { FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();
const loading = ref(false);
const props = defineProps<{
  course_references: ICourseReferance[];
  value?: ICurriculumCourse;
  type?: "create" | "edit";
}>();

const courseReferanceStore = useCourseReferanceStore();

const allCourses = ref<any>([]);
const relatedCourses = ref<any>([]);
const currentCourse = ref<any>(null);

const emit = defineEmits(["onSubmit", "onUpdate"]);

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  courses_reference_id: "",
  related_courses_reference_ids: [],
  is_elective: false,
  component_ids: [],
  retake_component_ids: [],
});

const rules = reactive<FormRules>({
  is_elective: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  courses_reference_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  component_ids: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
      type: "array",
    },
  ],
  retake_component_ids: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
      type: "array",
    },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (props.type === "edit") {
        emit("onUpdate", {
          ...ruleForm,
          assigned_course_id: props.value?.id,
        });
      } else {
        emit("onSubmit", ruleForm);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

const remoteMethod = async (query: string) => {
  if (query.length > 2) {
    loading.value = true;
    setTimeout(async () => {
      const courses = await courseReferanceStore.fetchAndReturnCourseReferances(
        {
          page: 1,
          limit: 30,
          search: query,
        }
      );
      allCourses.value = courses?.data;
      loading.value = false;
    }, 200);
  } else {
    allCourses.value = props.course_references;
  }
};

const remoteMethod2 = async (query: string) => {
  if (query.length > 2) {
    loading.value = true;
    setTimeout(async () => {
      const courses = await courseReferanceStore.fetchAndReturnCourseReferances(
        {
          page: 1,
          limit: 30,
          search: query,
        }
      );
      relatedCourses.value = courses?.data;
      loading.value = false;
    }, 200);
  } else {
    relatedCourses.value = props.course_references;
  }
};

const onCourseChange = (id: string) => {
  const course = allCourses.value.find((course: any) => course.id === id);
  if (course) {
    currentCourse.value = course;
    ruleForm.component_ids = [];
    ruleForm.retake_component_ids = [];
  }
};

onMounted(() => {
  allCourses.value = props.course_references;
  relatedCourses.value = props.course_references;
  if (props.type === "edit" && props.value) {
    Object.assign(ruleForm, props.value);
    const course = allCourses.value.find(
      (course: any) => course.id === props.value?.courses_reference_id
    );
    if (course) {
      currentCourse.value = course;
      console.log("course", course);
      ruleForm.retake_component_ids = course.retake_components.map(
        (component: any) => component.id
      );
      ruleForm.component_ids = course.components.map(
        (component: any) => component.id
      );
      console.log("ruleForm", ruleForm);
    }
  }
});
</script>

<style>
.request-upload .el-upload {
  width: 100%;
}
</style>
