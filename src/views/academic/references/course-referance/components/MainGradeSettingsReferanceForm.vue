<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    label-position="left"
    hide-required-asterisk
    label-width="0"
    v-if="ruleForm.grade.length"
    :disabled="disabled"
  >
    <div class="grid gap-6 items-start" v-if="isGpa">
      <div class="flex flex-col gap-3 mt-6">
        <h1 class="font-semibold text-xl">Main course grading</h1>
        <p class="text-tertiary-600 font-normal">
          Information about the grading for main course
        </p>
      </div>
      <div class="border rounded-md mx-auto max-w-[600px] overflow-hidden">
        <el-table :data="ruleForm.grade.slice(0, ruleForm.grade.length - 1)">
          <el-table-column
            prop="grade"
            label="Grade"
            width="180"
            align="left"
          />
          <el-table-column prop="gpa" label="GPA" width="180" align="center" />
          <el-table-column
            prop="name"
            label="Student proportion"
            min-width="220"
            align="center"
          >
            <template #default="{ $index }">
              <el-form-item
                :prop="'grade.' + $index + '.proportion'"
                :rules="{
                  required: true,
                  message: $t('validation.fillField'),
                  trigger: 'blur',
                  type: 'number',
                  min: 0,
                }"
                class="!mb-0 text-center"
              >
                <div class="flex justify-center w-full">
                  <el-input-number
                    v-model="ruleForm.grade[$index].proportion"
                    :min="0"
                    size="small"
                    class="mx-auto"
                  />
                </div>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="flex flex-col gap-3 mt-6">
        <h1 class="font-semibold text-xl">Fail cutline</h1>
        <p class="text-tertiary-600 font-normal">
          Information about under what conditions a student will not pass the
          course
        </p>
      </div>
      <div class="border rounded-md mx-auto max-w-[600px] overflow-hidden">
        <el-table
          :data="ruleForm.grade.slice(ruleForm.grade.length - 1)"
          row-class-name=""
        >
          <el-table-column
            prop="grade"
            label="Grade"
            width="180"
            align="left"
          />
          <el-table-column prop="gpa" label="GPA" width="180" align="center" />
          <el-table-column
            prop="name"
            label="Student proportion"
            min-width="220"
            align="center"
          >
            <template #default="{}">
              <el-form-item
                :prop="'grade.' + (ruleForm.grade.length - 1) + '.proportion'"
                :rules="{
                  required: true,
                  message: $t('validation.fillField'),
                  trigger: 'blur',
                  type: 'number',
                  min: 0,
                }"
                class="!mb-0 text-center"
              >
                <div class="flex justify-center w-full">
                  <el-input-number
                    v-model="
                      ruleForm.grade[ruleForm.grade.length - 1].proportion
                    "
                    :min="0"
                    size="small"
                    class="mx-auto"
                  />
                </div>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-else class="md:w-5/12 flex flex-col gap-4 mt-6">
      <div class="grid grid-cols-2">
        <h1 class="font-semibold">Pass/Fail settings:</h1>
        <h1 class="text-center font-semibold">Main course:</h1>
      </div>
      <div class="grid grid-cols-2">
        <h1 class="font-semibold">Fail Cutline (in actual score)</h1>
        <el-form-item
          :prop="'grade.' + 0 + '.proportion'"
          :rules="{
            required: true,
            message: $t('validation.fillField'),
            trigger: 'blur',
            type: 'number',
            min: 0,
          }"
          class="!mb-0"
        >
          <div class="flex justify-center w-full">
            <el-input-number
              v-model="ruleForm.grade[0].proportion"
              :min="0"
              class="!w-full"
            />
          </div>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, reactive, ref, computed } from "vue";
import { FormInstance } from "element-plus";
import { useStepper } from "@/composables";
import { Subject, takeUntil } from "rxjs";
import { GradingType } from "@/models/backend";
import { gpaGrades } from "@/utils/constants";

interface Props {
  value: any;
  grading_type: GradingType;
  disabled?: boolean;
}

const destroy = new Subject<any>();
const { check$, next } = useStepper();

const emit = defineEmits(["onChange"]);

const props = withDefaults(defineProps<Props>(), {
  grading_type: "GPA",
  disabled: false,
});

const isGpa = computed(
  () => props.grading_type === "GPA" || props.value?.grade?.length > 1
);

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<{
  grade: { grade: string; proportion: number; gpa: number }[];
}>({
  grade: [],
});

onMounted(() => {
  if (isGpa.value) {
    ruleForm.grade = gpaGrades;
  } else {
    ruleForm.grade = [
      {
        grade: "F",
        proportion: 30,
        gpa: 0,
      },
    ];
  }
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
