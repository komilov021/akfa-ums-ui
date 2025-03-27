<template>
  <div class="mt-5">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-form-item label="Title" prop="title">
        <el-input
          v-model="ruleForm.title"
          type="text"
          autocomplete="off"
          size="large"
          :placeholder="$t('shared.text')"
        />
      </el-form-item>
      <el-form-item label="Department" prop="program_id">
        <el-select
          v-model="ruleForm.program_id"
          class="w-full"
          placeholder="Select"
          size="large"
          filterable
        >
          <el-option
            v-for="item in $props.programs"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Level" prop="level">
        <el-select
          v-model="ruleForm.level"
          filterable
          @change="fetchList"
          class="w-full"
          placeholder="Select"
          size="large"
        >
          <el-option
            v-for="item in [1, 2, 3, 4, 5, 6]"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Semester" prop="semester_id">
        <el-select
          v-model="ruleForm.semester_id"
          filterable
          @change="fetchList"
          class="w-full"
          placeholder="Select"
          size="large"
        >
          <el-option
            v-for="item in $props.semester"
            :key="item.value"
            :label="item.label"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Courses" prop="course_ids">
        <el-select
          v-model="ruleForm.course_ids"
          multiple
          class="w-full"
          placeholder="Select"
          filterable
          remote
          :remote-method="remoteMethod"
        >
          <el-option
            v-for="item in courses"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="flex justify-end !mt-10">
      <el-button type="primary" size="large" @click="submitForm(ruleFormRef)">
        {{ $t("shared.save") }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ControlItem } from "@/models/frontend";
import type { FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useCoursesStore } from "@/stores";
import { useCurriculumStore } from "../../../../stores/curriculum";
const i18n = useI18n();
const courses = computed(() => CurriculumStore.getAssignCoursesSelct);
const props = defineProps<{
  rank?: any | null;
  programs: ControlItem[];
  semester: ControlItem[];
  type?: "create" | "edit";
}>();
const CoursesStore = useCoursesStore();
const CurriculumStore = useCurriculumStore();
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  id: undefined,
  title: "",
  program_id: "",
  semester_id: undefined as any,
  course_ids: [],
  level: 1,
});

const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
    },
  ],
  program_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
    },
  ],
  semester_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
    },
  ],
  course_ids: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
    },
  ],
});
const emit = defineEmits(["onSubmit"]);

onMounted(() => {
  if (props.rank && props.type === "edit") {
    ruleForm.id = props.rank.id;
    ruleForm.title = props.rank.title;
    ruleForm.program_id = props.rank.program.id;
    ruleForm.semester_id = {
      value: props.rank.semester.id,
    };
    let list: any = [];
    props.rank.courses?.forEach((acc: any, curr: any) => {
      list.push(acc.id);
    });
    ruleForm.course_ids = list;
  }
});
const fetchList = () => {
  CurriculumStore.fetchCourseReferancesByCurriculum({
    page: 1,
    limit: 400,
    semester: ruleForm.semester_id?.label.split("-").reverse().join(" "),
    department_id: ruleForm.program_id,
    level: ruleForm.level,
  });
};
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

const remoteMethod = (query: string) => {
  if (query && ruleForm.semester_id) {
    CoursesStore.fetchCoursess({
      page: 1,
      limit: 100,
      semester_id: ruleForm.semester_id,
      search: query,
    });
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
