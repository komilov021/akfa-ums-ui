<template>
  <div class="flex flex-col gap-3 mt-6 mb-10">
    <h1 class="font-semibold text-xl">Grade components</h1>
    <p class="text-tertiary-600 font-normal">
      Information about the weight of events that affects the final estimate
    </p>
  </div>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    label-position="top"
    require-asterisk-position="right"
    class="mt-6"
    :disabled="disabled"
  >
    <div class="grid">
      <div class="flex">
        <h2 class="font-semibold text-mainDarkGray pl-3 w-[300px]">
          Main course events:
        </h2>
        <div class="w-full">
          <div
            class="grid md:grid-cols-2 gap-3 w-full mb-4 last:mb-0"
            v-for="(item, index) in ruleForm.components"
            :key="index"
          >
            <div class="flex items-center gap-2">
              <el-form-item
                :prop="'components.' + index + '.id'"
                :rules="{
                  required: true,
                  message: $t('validation.fillField'),
                  trigger: 'blur',
                }"
                class="!mb-0 w-full"
              >
                <el-select v-model="item.id" class="w-full">
                  <el-option
                    v-for="{
                      label,
                      value,
                    } of gradeComponentsStore.getGradeComponentsSelect"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </el-select>
              </el-form-item>
              <el-button
                @click="removeComponent(index)"
                :icon="Minus"
                circle
                size="small"
                :class="{ '!invisible': index === 0 }"
              />
            </div>
            <div class="flex w-full justify-between">
              <h2
                class="font-semibold text-mainDarkGray pl-3"
                :class="{ invisible: index !== 0 }"
              >
                Weight:
              </h2>
              <el-form-item
                :prop="'components.' + index + '.weight'"
                :rules="{
                  required: true,
                  message: $t('validation.fillField'),
                  trigger: 'blur',
                  type: 'number',
                  min: 0,
                }"
                class="!mb-0"
              >
                <el-input-number
                  class="!w-full"
                  v-model="item.weight"
                  :min="0"
                />
              </el-form-item>
            </div>
          </div>
          <div>
            <el-button link @click="addComponent()">+ Add component </el-button>
          </div>
        </div>
      </div>
      <el-divider />
      <div class="flex">
        <h2 class="font-semibold text-mainDarkGray pl-3 w-[300px]">
          Retake course events:
        </h2>
        <div class="w-full">
          <div
            class="grid md:grid-cols-2 gap-3 w-full mb-4 last:mb-0"
            v-for="(item, index) in ruleForm.retake_components"
            :key="index"
          >
            <div class="flex items-center gap-2">
              <el-form-item
                :prop="'retake_components.' + index + '.id'"
                :rules="{
                  required: true,
                  message: $t('validation.fillField'),
                  trigger: 'blur',
                }"
                class="!mb-0 w-full"
              >
                <el-select v-model="item.id" class="w-full">
                  <el-option
                    v-for="{
                      label,
                      value,
                    } of gradeComponentsStore.getGradeComponentsSelect"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </el-select>
              </el-form-item>
              <el-button
                @click="removeRetakeComponent(index)"
                :icon="Minus"
                circle
                size="small"
                :class="{ '!invisible': index === 0 }"
              />
            </div>
            <div class="flex w-full justify-between">
              <h2
                class="font-semibold text-mainDarkGray pl-3"
                :class="{ invisible: index !== 0 }"
              >
                Weight:
              </h2>
              <el-form-item
                :prop="'retake_components.' + index + '.weight'"
                :rules="{
                  required: true,
                  message: $t('validation.fillField'),
                  trigger: 'blur',
                  type: 'number',
                  min: 0,
                }"
                class="!mb-0"
              >
                <el-input-number
                  class="!w-full"
                  v-model="item.weight"
                  :min="0"
                />
              </el-form-item>
            </div>
          </div>
          <div>
            <el-button link @click="addRetakeComponent()"
              >+ Add component
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, reactive, ref } from "vue";
import { FormInstance } from "element-plus";
import { useStepper } from "@/composables";
import { Subject, takeUntil } from "rxjs";
import { useGradeComponentsStore } from "@/stores";
import { Minus } from "@element-plus/icons-vue";

const destroy = new Subject<any>();
const { check$, next } = useStepper();
const gradeComponentsStore = useGradeComponentsStore();

const emit = defineEmits(["onChange"]);

const props = defineProps<{
  value: any;
  disabled?: boolean;
}>();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  components: [
    {
      id: "",
      weight: 0,
    },
  ],
  retake_components: [
    {
      id: "",
      weight: 0,
    },
  ],
});

const addComponent = () => {
  ruleForm.components.push({
    id: "",
    weight: 0,
  });
};

const removeComponent = (index: number) => {
  ruleForm.components.splice(index, 1);
};

const addRetakeComponent = () => {
  ruleForm.retake_components.push({
    id: "",
    weight: 0,
  });
};

const removeRetakeComponent = (index: number) => {
  ruleForm.retake_components.splice(index, 1);
};

const totalComponentWeight = computed(() =>
  ruleForm.components.reduce((acc, curr) => (acc += curr.weight), 0)
);
const totalRetakeComponentWeight = computed(() =>
  ruleForm.retake_components.reduce((acc, curr) => (acc += curr.weight), 0)
);

onMounted(() => {
  // Fetch Tests
  gradeComponentsStore.fetchGradeComponents();

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
