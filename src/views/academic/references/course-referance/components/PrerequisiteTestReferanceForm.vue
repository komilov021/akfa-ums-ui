<template>
  <div class="flex flex-col gap-3 my-7">
    <h1 class="font-semibold text-xl">Prerequisites</h1>
    <p class="text-tertiary-600 font-normal">
      Information about what results a student who wishes to enroll in this
      course must have
    </p>
  </div>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    label-position="top"
    require-asterisk-position="right"
    :disabled="disabled"
  >
    <div class="flex flex-col">
      <div>
        <div
          class="flex items-center gap-2"
          v-for="(item, index) in ruleForm.tests"
          :key="index"
        >
          <div class="grid md:grid-cols-4 gap-4 w-full">
            <el-form-item
              label="Test"
              :prop="'tests.' + index + '.id'"
              :rules="{
                required: true,
                message: $t('validation.fillField'),
                trigger: 'blur',
              }"
              class="col-span-2"
            >
              <el-select v-model="item.id" class="w-full">
                <el-option
                  v-for="{
                    label,
                    value,
                  } of prequisiteTestsStore.getTestTypesSelect"
                  :key="value"
                  :label="label"
                  :value="value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="Min"
              label-width="50"
              :prop="'tests.' + index + '.min'"
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
                v-model="item.min"
                :min="0"
                :precision="1"
                :step="0.1"
              />
            </el-form-item>
            <el-form-item
              label="Max"
              :prop="'tests.' + index + '.max'"
              label-width="50"
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
                v-model="item.max"
                :min="0"
                :precision="1"
                :step="0.1"
              />
            </el-form-item>
          </div>
          <el-button
            @click="removePrerequisite(index)"
            :icon="Minus"
            circle
            size="small"
            class="relative top-2"
          />
        </div>
        <el-button
          class="relative"
          :class="{ 'top-8': !ruleForm.tests.length }"
          link
          @click="addPrerequisite()"
          v-if="!disabled"
          >+ Add new prerequisites
        </el-button>
      </div>
      <el-divider />
      <el-form-item label="Prerequisites course:" prop="prerequisite_ids">
        <el-select
          v-model="ruleForm.prerequisite_ids"
          class="w-full"
          filterable
          remote
          :remote-method="remoteMethod"
          multiple
        >
          <el-option
            v-for="{
              label,
              value,
            } of courseReferanceStore.getCourseReferanceSelect"
            :key="value"
            :label="label"
            :value="value"
          />
        </el-select>
      </el-form-item>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, reactive, ref } from "vue";
import { FormInstance } from "element-plus";
import { useStepper } from "@/composables";
import { Subject, takeUntil } from "rxjs";
import { useCourseReferanceStore, usePrequisiteTestsStore } from "@/stores";
import { Minus } from "@element-plus/icons-vue";
const courseReferanceStore = useCourseReferanceStore();
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
  prerequisite_ids: [],
  tests: [
    {
      id: "",
      min: 0,
      max: 0,
    },
  ],
});

const addPrerequisite = () => {
  ruleForm.tests.push({
    id: "",
    min: 0,
    max: 0,
  });
};

const removePrerequisite = (index: number) => {
  ruleForm.tests.splice(index, 1);
};

const remoteMethod = (query: string) => {
  if (query) {
    courseReferanceStore.fetchCourseReferances({
      page: 1,
      limit: 100,
      search: query,
    });
  }
};

onMounted(() => {
  // Fetch Tests
  prequisiteTestsStore.fetchTestTypes();
  courseReferanceStore.fetchCourseReferances({
    page: 1,
    limit: 100,
  });

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
