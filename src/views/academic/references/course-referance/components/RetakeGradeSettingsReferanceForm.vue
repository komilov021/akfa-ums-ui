<template>
  <div class="flex flex-col gap-3 mt-6 mb-10">
    <h1 class="font-semibold text-xl">Retake grade settings</h1>
    <p class="text-tertiary-600 font-normal">
      Information about the grading for retake course
    </p>
  </div>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    label-position="left"
    hide-required-asterisk
    class="mt-12"
    :disabled="disabled"
  >
    <div class="grid md:grid-cols-3 gap-6">
      <el-form-item
        class="col-span-2"
        label="Pass/Fail settings:"
        label-width="300"
      >
        <el-select v-model="course" disabled class="w-full">
          <el-option label="Main course" value="main" />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="retake_grade.proportion"
        :rules="{
          required: true,
          message: $t('validation.fillField'),
          trigger: 'blur',
          type: 'number',
          min: 0,
        }"
        label="Fail Cutline"
        label-width="120"
      >
        <el-input-number
          v-model="ruleForm.retake_grade.proportion"
          :min="0"
          class="!w-full"
        />
      </el-form-item>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, reactive, ref } from "vue";
import { FormInstance } from "element-plus";
import { useStepper } from "@/composables";
import { Subject, takeUntil } from "rxjs";

interface Props {
  value: any;
  disabled?: boolean;
}

const destroy = new Subject<any>();
const { check$, next } = useStepper();

const emit = defineEmits(["onChange"]);

const props = withDefaults(defineProps<Props>(), {});

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<{
  retake_grade: { grade: string; proportion: number; gpa: number };
}>({
  retake_grade: {
    grade: "F",
    proportion: 30,
    gpa: 0,
  },
});

const course = ref("main");

onMounted(() => {
  // Assign Values
  if (props.value) {
    Object.assign(ruleForm, props.value);
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

onBeforeMount(() => {
  destroy.next(null);
  destroy.complete();
});
</script>

<style scoped lang="scss"></style>
