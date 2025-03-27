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
        <el-form-item label="Groups" prop="group">
          <el-select
            v-model="ruleForm.group"
            class="w-full"
            placeholder="Select"
            size="large"
            filterable
          >
            <el-option
              v-for="item in groups"
              :key="item.title"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="flex justify-end">
      <el-button type="primary" size="large" @click="submitForm(ruleFormRef)">
        Approve
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useAttendanceStore, useCurriculumStore } from "@/stores";
import { useRoute } from "vue-router";

const i18n = useI18n();

const curriculumStore = useCurriculumStore();
const route = useRoute();
const props = defineProps({
  semester: String,
});
const groups = computed(() => curriculumStore.groups);
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  group: "",
});

const rules = reactive<FormRules>({
  group: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});

const emit = defineEmits(["onSubmit"]);

onMounted(() => {
  if (!groups.value?.length) {
    curriculumStore.fetchGroups({
      assigned_course_id: route.params.grade as string,
      semester: props.semester as string,
    });
  }
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      emit("onSubmit", ruleForm);
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
