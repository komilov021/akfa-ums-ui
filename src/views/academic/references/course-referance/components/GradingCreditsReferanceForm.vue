<template>
  <div class="flex flex-col gap-3 mt-6 mb-12">
    <h1 class="font-semibold text-xl">Grading and credits</h1>
    <p class="text-tertiary-600 font-normal">
      Information about what results affect the completion of the main course,
      its credits and similar information for the retake course
    </p>
  </div>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    label-position="left"
    hide-required-asterisk
    :disabled="disabled"
  >
    <div class="grid md:grid-cols-3 gap-6">
      <el-form-item
        label="Main course grading:"
        prop="grading_type"
        label-width="300"
        :rules="{
          required: true,
          message: $t('validation.fillField'),
          trigger: 'blur',
        }"
        class="col-span-2"
      >
        <el-select v-model="ruleForm.grading_type" class="w-full">
          <el-option
            v-for="item of ['GPA', 'PASS/FAIL']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="Credits:"
        prop="credits"
        label-width="120"
        :rules="{
          required: true,
          message: $t('validation.fillField'),
          trigger: 'blur',
          type: 'number',
          min: 0,
        }"
      >
        <el-input-number class="!w-full" v-model="ruleForm.credits" :min="0" />
      </el-form-item>
    </div>
    <el-divider />
    <div class="grid md:grid-cols-3 gap-6">
      <el-form-item
        label-width="300"
        label="Retake course grading:"
        class="col-span-2"
      >
        <el-input value="Pass/Fail" disabled> </el-input>
      </el-form-item>
      <el-form-item
        label-width="120"
        label="Credits:"
        prop="retake_credits"
        :rules="{
          required: true,
          message: $t('validation.fillField'),
          trigger: 'blur',
          type: 'number',
          min: 0,
        }"
      >
        <el-input-number
          class="!w-full"
          v-model="ruleForm.retake_credits"
          :min="0"
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
import { usePrequisiteTestsStore } from "@/stores";

const destroy = new Subject<any>();
const { check$, next } = useStepper();
const prequisiteTestsStore = usePrequisiteTestsStore();

const emit = defineEmits(["onChange"]);

const props = defineProps<{
  value: any;
  disabled?: boolean;
}>();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  grading_type: "",
  credits: 0,
  retake_credits: 0,
});

onMounted(() => {
  // Fetch Tests
  prequisiteTestsStore.fetchTestTypes();

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
