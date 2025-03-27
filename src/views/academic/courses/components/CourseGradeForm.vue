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
        <el-form-item label="Search by Id">
          <div class="flex items-center space-x-2 w-full">
            <el-input
              v-model="search"
              type="number"
              autocomplete="off"
              size="large"
              class="w-full"
              :placeholder="$t('shared.text')"
            />
            <el-button
              type="primary"
              :icon="Search"
              size="large"
              @click="searchUser"
              :disabled="search.length <= 2"
              >Search</el-button
            >
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
        <el-form-item label="Grade" prop="score">
          <el-input-number
            v-model="ruleForm.score"
            autocomplete="off"
            class="!w-full"
            :placeholder="$t('shared.text')"
            size="large"
          />
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
import { useCourseGradesStore } from "@/stores";
import { Search } from "@element-plus/icons-vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();
const coursesGradeStore = useCourseGradesStore();

const props = defineProps<{
  grade?: any | null;
  type?: "create" | "edit" | "import";
}>();

const search = ref("");

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  id: "",
  email: "",
  score: 0,
  student_id: "",
});

const rules = reactive<FormRules>({
  email: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  score: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});

const emit = defineEmits(["onSubmit"]);

onMounted(() => {
  if (props.grade && props.type === "edit") {
    ruleForm.id = props.grade.id;
    ruleForm.email = props.grade.student_email;
    ruleForm.student_id = props.grade.student_id;
    ruleForm.score = props.grade.score;
    search.value = props.grade.student_uid;
  }
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const data = {
        student_id: ruleForm.student_id,
        score: ruleForm.score,
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
