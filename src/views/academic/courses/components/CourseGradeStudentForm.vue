<template>
  <div class="bg-white px-4 py-8 rounded">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
    >
      <div class="grid sm:grid-cols-1 gap-y-1">
        <el-form-item label="Student Id">
          <div class="flex items-center space-x-2 w-full">
            <el-input
              v-model="search"
              type="number"
              autocomplete="off"
              size="large"
              class="w-full"
              disabled
              :placeholder="$t('shared.text')"
            />
            <!-- <el-button type="primary" :icon="Search" size="large" @click="searchUser"
                            :disabled="search.length <= 2">Search</el-button> -->
          </div>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="ruleForm.email"
            type="text"
            autocomplete="off"
            size="large"
            disabled
            :placeholder="$t('shared.text')"
          />
        </el-form-item>
        <el-form-item label="Grade" prop="grade">
          <el-select
            v-model="ruleForm.grade"
            class="w-full"
            @change="updateGPA"
            placeholder="Status"
          >
            <el-option
              v-for="(item, i) in currentCourse?.grade"
              :key="i"
              :label="item.grade"
              :value="item.grade"
            />
            <el-option label="P" value="P" />
          </el-select>
        </el-form-item>
        <div class="grid sm:grid-cols-2 gap-6">
          <el-form-item label="GPA" prop="gpa">
            <el-input-number
              v-model="ruleForm.gpa"
              autocomplete="off"
              disabled
              class="!w-full"
              :placeholder="$t('shared.text')"
              size="large"
            />
          </el-form-item>
          <el-form-item label="Total" prop="total">
            <el-input-number
              v-model="ruleForm.total"
              autocomplete="off"
              class="!w-full"
              :placeholder="$t('shared.text')"
              size="large"
            />
          </el-form-item>
        </div>
        <!-- <div class="flex flex-wrap gap-10">
          <el-switch
            v-model="ruleForm.is_verified"
            class="mb-2"
            active-text="Verified"
            inactive-text="Not verified"
          />
          <el-switch
            v-model="ruleForm.is_custom"
            class="mb-2"
            active-text="Custom"
            inactive-text="Auto"
          />
          <el-switch
            v-model="ruleForm.is_published"
            class="mb-2"
            active-text="Published"
            inactive-text="Not Published"
          />
        </div> -->
      </div>
    </el-form>
    <div class="flex mt-8">
      <el-button type="primary" size="large" @click="submitForm(ruleFormRef)">
        {{ $t("shared.save") }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCourseGradesStore, useCurriculumStore } from "@/stores";
import { Search } from "@element-plus/icons-vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { watch } from "vue";
import { ref, reactive, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const i18n = useI18n();
const coursesGradeStore = useCourseGradesStore();
const curriculumStore = useCurriculumStore();
const currentCourse = computed(() => curriculumStore.currentCourse);
const route = useRoute();
const props = defineProps<{
  student?: any | null;
  type?: "edit";
}>();
const search = ref("");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  id: "",
  email: "",
  gpa: 0,
  grade: "",
  total: 0,
  student_id: "",
  is_verified: false,
  is_published: false,
  is_custom: false,
});

const updateGPA = () => {
  const selectedGrade = ruleForm.grade;

  if (selectedGrade === "P") {
    ruleForm.gpa = 0.7;
    return;
  }
  const gradeData = currentCourse.value?.grade.find(
    (item) => item.grade === selectedGrade
  );
  if (gradeData) {
    ruleForm.gpa = gradeData.gpa;
  }
};
watch(() => ruleForm.grade, updateGPA);

const rules = reactive<FormRules>({
  email: [
    {
      required: false,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  gpa: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  total: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  grade: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});

const emit = defineEmits(["onSubmit"]);

onMounted(async () => {
  if (props.student && props.type === "edit") {
    ruleForm.id = props.student.id;
    ruleForm.email = props.student.student_email;
    ruleForm.student_id = props.student.student_uid;
    ruleForm.total = props.student.total_score;
    ruleForm.grade = props.student.grade;
    ruleForm.is_verified = props.student.is_verified;
    ruleForm.is_custom = props.student.is_custom;
    ruleForm.is_published = props.student.is_published;
    ruleForm.gpa = props.student.gpa;
    search.value = props.student.student_uid;
  }
  await curriculumStore.getAssignCourseById(route.params.grade as string);
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const data = {
        id: ruleForm.id,
        gpa: ruleForm.gpa,
        grade: ruleForm.grade,
        total: ruleForm.total,
        // is_verified: ruleForm.is_verified,
        // is_custom: ruleForm.is_custom,
        // is_published: ruleForm.is_published,
      } as any;
      if (ruleForm.id) data["id"] = ruleForm.id;
      emit("onSubmit", data);
    } else {
      console.log("error submit!", fields);
    }
  });
};

const searchUser = async () => {
  try {
    if (isNaN(+search.value)) {
      ElMessage({
        message: "Please input only number value",
        type: "warning",
      });
      return;
    }
    const user = await coursesGradeStore.searchUser(+search.value);

    if (!user) {
      ElMessage({
        message: "User not found",
        type: "error",
      });
      (ruleForm.email = ""), (ruleForm.student_id = "");
      return;
    }
    ruleForm.student_id = user.id;
    ruleForm.email = user.email;
  } catch (error: any) {
    console.log("error", error.message);
  }
};
</script>

<style scoped>
.title {
  font-weight: 700;
  font-size: 18px;
  line-height: 25px;
  color: #1f1f1f;
}
</style>
