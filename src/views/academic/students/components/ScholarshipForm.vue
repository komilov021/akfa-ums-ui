<template>
  <div>
    <h1 class="text-xl text-black font-semibold relative bottom-4">
      Add scholarship
    </h1>
    <div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-position="top"
        require-asterisk-position="right"
        v-loading="loading"
      >
        <el-form-item label="Criteria" class="!mb-2 w-full" prop="criteria_id">
          <el-select
            v-model="ruleForm.criteria_id"
            class="w-full"
            placeholder="Select"
            filterable
            clearable
          >
            <el-option
              v-for="item of criteria"
              :key="item.id"
              :value="item.id"
              :label="item.title"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Semestr" class="!mb-0 w-full" prop="semester">
          <el-select
            clearable
            v-model="ruleForm.semester"
            placeholder="Select"
            class="w-full"
          >
            <el-option
              v-for="item of semester"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="mt-3 !w-full" prop="file" label="Attach document">
          <AppUpload
            class="mt-3 !w-3/4"
            @upload="(data) => (ruleForm.file = data)"
            accept="image/*, application/pdf"
          >
            <el-button :icon="Plus" type="primary" plain>Upload File</el-button>
          </AppUpload>
        </el-form-item>
        <div class="flex justify-end">
          <el-button
            class="w-64"
            type="primary"
            @click="submitForm(ruleFormRef)"
            >Save</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { FormInstance, FormRules } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import AppUpload from "@/components/common/AppUpload.vue";

const emit = defineEmits(["onSubmit"]);
const props = defineProps<{
  semester: any;
  criteria: any;
}>();
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({});

const ruleForm = reactive({
  criteria_id: "",
  semester: "",
  file: null,
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      emit("onSubmit", {
        ...ruleForm,
        files: [ruleForm.file],
        semester: ruleForm.semester,
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<style scoped></style>
