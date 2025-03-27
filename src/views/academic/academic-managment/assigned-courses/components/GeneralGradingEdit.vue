<template>
  <div v-loading="loading" class="space-y-8 mt-10">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      label-position="top"
      require-asterisk-position="right"
      class="mt-6"
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
                  <el-select
                    v-model="item.id"
                    class="w-full"
                    filterable
                    :remote-method="searchList"
                    :loading="loading"
                    remote
                    reserve-keyword
                  >
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
              <div class="flex w-full gap-10">
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
              <el-button link @click="addComponent()"
                >+ Add component
              </el-button>
            </div>
          </div>
        </div>
        <el-divider />
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useGradeComponentsStore } from "../../../../../stores";
import { onBeforeMount, onMounted, reactive, ref } from "vue";
import { Minus } from "@element-plus/icons-vue";
import { ElMessage, FormInstance } from "element-plus";
import { useStepper } from "@/composables";
import { Subject, takeUntil } from "rxjs";
const gradeComponentsStore = useGradeComponentsStore();
const destroy = new Subject<any>();
const { check$, next } = useStepper();
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();
const props = defineProps<{
  grade: { id: string; weight: number }[];
}>();
const ruleForm = reactive({
  components: [
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
const emit = defineEmits(["onChange"]);

const searchList = async (val: any) => {
  if (val.length >= 2) {
    loading.value = true;
    await gradeComponentsStore.fetchGradeComponents({
      page: 1,
      limit: 100,
      search: val,
    });
    loading.value = false;
  } else {
    gradeComponentsStore.fetchGradeComponents();
  }
};

onMounted(() => {
  // Fetch Tests
  gradeComponentsStore.fetchGradeComponents();
  // Assign Values
  if (props.grade) {
    Object.assign(ruleForm);
    ruleForm.components = props.grade.map((g: any) => ({
      id: g.id,
      weight: parseInt(g.weight),
    }));
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

<style scoped></style>
