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
        <el-form-item label="Exam year" prop="year">
          <el-date-picker
            v-model="ruleForm.year"
            type="year"
            autocomplete="off"
            class="!w-full"
            :placeholder="$t('shared.year')"
            size="large"
          />
        </el-form-item>
        <el-form-item label="Exam date" prop="admission_date">
          <el-date-picker
            v-model="ruleForm.admission_date"
            type="date"
            autocomplete="off"
            class="!w-full"
            :placeholder="$t('shared.date')"
            size="large"
          />
        </el-form-item>
        <!-- <el-form-item prop="is_active" label="Active">
          <el-radio-group v-model="ruleForm.is_active">
            <el-radio :label="true">Yes</el-radio>
            <el-radio :label="false">No</el-radio>
          </el-radio-group>
        </el-form-item> -->
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
import { dayjs, type FormInstance, type FormRules } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();

const props = defineProps<{
  year?: any | null;
  type?: "create" | "edit";
}>();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  year: "",
  admission_date: "",
  // is_active: false,
});

const rules = reactive<FormRules>({
  id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});

const emit = defineEmits(["onSubmit"]);

onMounted(() => {
  if (props.year && props.type === "edit") {
    ruleForm.year = props.year.year.toString();
    ruleForm.admission_date = props.year.to_char;
  }
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      emit("onSubmit", {
        admission_date: dayjs(ruleForm.admission_date).format("YYYY-MM-DD"),
        year: dayjs(ruleForm.year).format("YYYY"),
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
