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
        <el-form-item label="Semestr" prop="semester_id">
          <el-select
            v-model="ruleForm.semester_id"
            class="w-full"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="item in $props.semestrs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Subject" prop="subject_id">
          <el-select
            v-model="ruleForm.subject_id"
            filterable
            remote
            :remote-method="remoteMethod"
            class="w-full"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="item in subjectStore.getSubjectsSelct"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Program" prop="program_ids">
          <el-select
            v-model="ruleForm.program_ids"
            multiple
            class="w-full"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="item in $props.programs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="flex">
      <el-button type="primary" size="large" @click="submitForm(ruleFormRef)">
        {{ $t("shared.save") }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ControlItem } from "@/models/frontend";
import { useGuideStore, useSubjectStore } from "@/stores";
import type { FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();

const subjectStore = useSubjectStore();
const guideStore = useGuideStore();

const props = defineProps<{
  course?: any | null;
  programs: ControlItem[];
  semestrs: ControlItem[];
  subjects: ControlItem[];
  type?: "create" | "edit";
}>();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  id: "",
  subject_id: "",
  semester_id: "",
  program_ids: [],
});

const rules = reactive<FormRules>({
  subject_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
  ],
  semester_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
  ],
  program_ids: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
  ],
});

const emit = defineEmits(["onSubmit"]);

onMounted(() => {
  if (props.course && props.type === "edit") {
    ruleForm.id = props.course.id;
    ruleForm.program_ids = props.course.programs?.map((p: any) => p.id);
    ruleForm.semester_id = props.course.semester?.id;
    ruleForm.subject_id = props.course.subject?.id;

    const subject = subjectStore.getSubjectsSelct.find(
      (s) => s.value === props.course.subject?.id
    );
    if (!subject) {
      subjectStore.getOne(props.course.subject?.id);
    }
  }
});

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
  subjectStore.fetchSubjects({ page: 1, limit: 100, title: query });
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
