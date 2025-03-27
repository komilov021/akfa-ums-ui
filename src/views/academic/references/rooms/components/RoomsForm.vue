<template>
  <div class="pt-6">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="left"
      label-width="220"
      require-asterisk-position="right"
    >
      <el-form-item label="Room" prop="code">
        <el-input
          v-model="ruleForm.code"
          type="text"
          autocomplete="off"
          :placeholder="$t('shared.text')"
        />
      </el-form-item>
      <el-form-item label="Additional name" prop="name">
        <el-input
          v-model="ruleForm.name"
          type="text"
          autocomplete="off"
          :placeholder="$t('shared.text')"
        />
      </el-form-item>
      <el-form-item label="Room size" prop="seats">
        <el-input-number
          v-model="ruleForm.seats"
          autocomplete="off"
          class="!w-full"
          :placeholder="$t('shared.text')"
        />
      </el-form-item>
      <el-form-item label="Allowed lesson types" prop="lessons">
        <el-select v-model="ruleForm.lessons" class="w-full" multiple>
          <el-option
            v-for="{ label, value } of lessons"
            :key="value"
            :label="label"
            :value="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Limitation by course" prop="limitations">
        <el-select v-model="ruleForm.limitations" class="w-full" multiple>
          <el-option
            v-for="{ label, value } of courses"
            :key="value"
            :label="label"
            :value="value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="flex justify-end mt-6">
      <el-button
        type="primary"
        class="rounded"
        @click="submitForm(ruleFormRef)"
      >
        Save
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { ControlItem } from "@/models/frontend";

const i18n = useI18n();

const props = defineProps<{
  courses: ControlItem[];
  lessons: ControlItem[];
  type: "edit" | "create";
  value?: any;
}>();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  code: "",
  name: "",
  seats: 0,
  lessons: [],
  limitations: [],
});

const rules = reactive<FormRules>({
  code: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  name: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  seats: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});

const emit = defineEmits(["onSubmit"]);

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

onMounted(() => {
  if (props.value && props.type === "edit") {
    Object.assign(ruleForm, props.value);
    ruleForm.lessons = props.value.lessons.map((item: any) => item.id);
  }
});
</script>

<style scoped>
.title {
  font-weight: 700;
  font-size: 18px;
  line-height: 25px;
  color: #1f1f1f;
}
</style>
