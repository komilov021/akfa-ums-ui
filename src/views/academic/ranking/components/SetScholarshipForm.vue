<template>
  <div>
    <el-tabs v-model="activeTab" class="demo-tabs">
      <el-tab-pane
        v-for="item of scholarshipItems"
        :key="item.value"
        :label="item.label"
        :name="item.value"
      />
    </el-tabs>
    <div v-if="activeTab === 'addscholarship'">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-position="top"
        require-asterisk-position="right"
        :hide-required-asterisk="true"
      >
        <el-form-item label="Criteria" class="!mb-2 w-full" prop="criteria_id">
          <el-select
            class="w-full"
            v-model="ruleForm.criteria_id"
            filterable
            clearable
            placeholder="Select"
          >
            <el-option
              v-for="item of criteriaStore.scholarships.data"
              :key="item.id"
              :value="item.id"
              :label="item.title"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Semestr" class="!my-4 w-full" prop="semester">
          <el-select
            clearable
            placeholder="Select"
            class="w-full"
            v-model="ruleForm.semester"
          >
            <el-option
              v-for="item of semesterStore.getSemestrs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="mt-3 !w-full" prop="file" label="Attach document">
          <AppUpload
            class="mt-1 !w-3/4"
            @upload="uploadFile"
            accept="image/*, application/pdf"
          >
            <el-button :icon="Plus" type="primary" plain>Upload File</el-button>
          </AppUpload>
        </el-form-item>
        <div class="flex justify-end relative">
          <el-button
            class="w-64"
            type="primary"
            @click="submitForm(ruleFormRef)"
            >Save</el-button
          >
        </div>
      </el-form>
    </div>
    <div v-else-if="activeTab === 'received'">
      <div v-if="!criteriaStore.listByStudent">
        <el-empty description="No Data" />
      </div>
      <div v-else>
        <el-table
          :data="criteriaStore.listByStudent"
          style="width: 100%"
          class="whiteStripe"
        >
          <el-table-column
            label="Name"
            min-width="200"
            align="left"
            prop="title"
          />
          <el-table-column
            label="Description"
            min-width="200"
            align="left"
            prop="description"
          />
          <el-table-column label="Percentage %" min-width="200" align="center">
            <template #default="{ row }">
              <span>{{ row.percentage }} %</span>
            </template>
          </el-table-column>
          <el-table-column label="For semester" min-width="200" align="center">
            <template #default="{ row }">
              <span>{{
                row.semester
                  ? getSemesterList(row.semester)?.semester
                  : "Undefined"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column width="90" align="center">
            <template #default="scope">
              <div>
                <el-button
                  @click="emit('confirmDelete', scope.row.id)"
                  class="action-button"
                >
                  <SvgIcon name="local-trash" size="23" />
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppUpload from "@/components/common/AppUpload.vue";
import { ControlItem } from "@/models/frontend";
import { FormInstance, FormRules, ElMessageBox } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const i18n = useI18n();
const props = defineProps<{
  type?: "edit";
  student_id: any;
  criteriaStore: any | null;
  semesterStore: any | null;
}>();
const emit = defineEmits(["onSubmit", "confirmDelete"]);

const scholarshipItems: ControlItem[] = [
  {
    label: "Add a scholarship",
    value: "addscholarship",
  },
  {
    label: "Received Scholarships",
    value: "received",
  },
];
const route = useRoute();
const activeTab = ref("addscholarship");
const ruleFormRef = ref<FormInstance>();

const ruleForm = reactive({
  criteria_id: "",
  semester: "",
  file: "",
  student_id: "",
});

const rules = reactive<FormRules>({
  criteria_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
    },
  ],
  semester: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
    },
  ],
  file: [
    {
      required: true,
      message: i18n.t("validation.fileFill"),
      trigger: "change",
    },
  ],
});

const getSemesterList = (semester_id: string) => {
  let semester = props.semesterStore.semesters.find((semester: any) => {
    return semester.id === semester_id || semester.semester === semester_id;
  });
  return semester;
};
const uploadFile = (file: string) => {
  ruleForm.file = file;
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      emit("onSubmit", {
        ...ruleForm,
        files: [ruleForm.file],
        student_id: props.student_id,
      });
    } else {
      console.log("error submit!", fields);
    }
  });
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
