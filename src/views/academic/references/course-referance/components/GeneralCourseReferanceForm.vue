<template>
  <div class="flex flex-col gap-3 mt-6">
    <h1 class="font-semibold text-xl">Grade components</h1>
    <p class="text-tertiary-600 font-normal">
      Information about the weight of events that affects the final estimate
    </p>
  </div>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-position="left"
    require-asterisk-position="right"
    class="mt-6"
    label-width="200"
    :disabled="disabled"
  >
    <el-form-item label="Course name" prop="title">
      <el-input
        v-model="ruleForm.title"
        type="text"
        autocomplete="off"
        :placeholder="$t('shared.text')"
      />
    </el-form-item>
    <el-divider />
    <el-form-item label="Course code:" prop="code">
      <el-input
        v-model="ruleForm.code"
        type="text"
        autocomplete="off"
        max="15"
        :placeholder="$t('shared.text')"
      />
    </el-form-item>
    <el-divider />
    <el-form-item label="Retake course code:">
      <el-input
        :value="retakeCode"
        type="text"
        autocomplete="off"
        disabled
        :placeholder="$t('shared.text')"
      />
    </el-form-item>
  </el-form>
  <el-divider />
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from "vue";
import { FormInstance, FormRules } from "element-plus";
import { useI18n } from "vue-i18n";
import { useStepper } from "@/composables";
import { Subject, takeUntil } from "rxjs";
import { useGuideStore } from "@/stores";

const destroy = new Subject<any>();
const { check$, next } = useStepper();
const guideStore = useGuideStore();

const emit = defineEmits(["onChange"]);

const props = defineProps<{
  value: any;
  disabled?: boolean;
}>();

const i18n = useI18n();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  title: "",
  code: "",
});

const retakeCode = computed(() =>
  ruleForm.code ? ruleForm.code + "(retake)" : ""
);

const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  code: [
    {
      type: "string",
      trigger: ["blur", "change"],
      // pattern: /^[A-Z]{3}[0-9]{3}$/,
      max: 15,
      message: i18n.t("validation.maxLength", { value: 15 }),
    },
  ],
});

onMounted(() => {
  assignValue();
  if (!guideStore.getProgramsSelct.length) {
    guideStore.fetchPrograms();
  }
  check$.pipe(takeUntil(destroy)).subscribe(() => {
    ruleFormRef.value?.validate((valid) => {
      if (valid) {
        emit("onChange", ruleForm);
        next.next(true);
      }
    });
  });
});

const assignValue = () => {
  if (props.value) {
    Object.assign(ruleForm, props.value);
  }
};

watch(
  () => props.value,
  (val) => {
    assignValue();
  }
);

onBeforeMount(() => {
  destroy.next(null);
  destroy.complete();
});
</script>

<style scoped lang="scss"></style>
