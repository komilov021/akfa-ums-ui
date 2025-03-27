<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col grow justify-between">
      <el-form
        v-if="pabTwo?.length"
        ref="ruleFormRef"
        :model="ruleForm"
        v-loading="loading"
      >
        <el-table
          :data="pabTwo"
          style="width: 100%"
          class="simpleBorderTable"
          row-class-name="noHover"
        >
          <el-table-column
            label="№"
            min-width="50"
            max-width="100"
            type="index"
          >
          </el-table-column>
          <el-table-column
            label="Student ID"
            min-width="120"
            prop="student_uid"
            show-overflow-tooltip
            align="left"
          >
          </el-table-column>
          <el-table-column
            label="Student's full name"
            min-width="150"
            show-overflow-tooltip
            align="left"
          >
            <template #default="{ row }">
              {{ row.first_name + " " + row.last_name }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="1000"
            :label="currentCurriculum?.semester1"
            align="center"
          >
            <template #default="{ row, $index }">
              <el-table
                :data="row.modules"
                :span-method="objectSpanMethod"
                border
                style="width: 100%"
              >
                <el-table-column
                  min-width="250"
                  align="left"
                  label="Name of the Module (Module Code)"
                  show-overflow-tooltip
                  prop="course"
                ></el-table-column>
                <el-table-column
                  label="Component Name (Weight %) - Score"
                  min-width="280"
                  align="left"
                  show-overflow-tooltip
                >
                  <template #default="{ row: module }">
                    <p v-for="(component, k) in module.components" :key="k">
                      {{ component.component }}({{ component.weight }}) -
                      {{ component.score.toFixed(2) }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Module Credit"
                  min-width="140"
                  align="left"
                  prop="credits"
                ></el-table-column>
                <el-table-column
                  label="Overall Grade"
                  min-width="140"
                  align="left"
                  prop="overall_grade"
                >
                  <template #default="{ row }">
                    {{ row.overall_grade?.toFixed(0) }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="Resit Grade"
                  min-width="140"
                  align="left"
                  prop="resit_grade"
                >
                  <template #default="{ row }">
                    {{ row.resit_grade || "N/A" }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="PAB 1 Decision for Module"
                  min-width="240"
                  align="left"
                  prop="module_pab_decision"
                >
                  <template #default="{ row }">
                    {{ row.module_pab_decision }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="Overall Grade After Resit"
                  min-width="180"
                  align="left"
                  prop="overall_grade"
                >
                  <template #default="{ row, $index: custom }">
                    <el-form-item
                      v-if="
                        editable == $index &&
                        row.reset &&
                        row.overall_grade_after_reset
                      "
                      :prop="
                        'configs.' +
                        $index +
                        '.modules.' +
                        custom +
                        '.overall_grade_after_resit'
                      "
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
                        v-model.number="
                          ruleForm.configs[$index].modules[custom]
                            .overall_grade_after_resit
                        "
                        :min="0"
                        :controls="false"
                        size="small"
                        @keypress="onlyNumber"
                      />
                    </el-form-item>
                    <span v-else>
                      {{
                        row.overall_grade_after_resit?.toFixed(0) || "No resit"
                      }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Module Attempt"
                  min-width="140"
                  align="left"
                  prop="module_attempt"
                ></el-table-column>
                <el-table-column
                  label="PAB 2 Decision for Module"
                  min-width="240"
                  align="left"
                  prop="pab_two_decision_module"
                >
                  <template #default="{ row, $index: custom }">
                    <el-form-item
                      v-if="editable == $index"
                      :prop="
                        'configs.' +
                        $index +
                        '.modules.' +
                        custom +
                        '.pab_two_decision_module'
                      "
                      :rules="{
                        required: true,
                        message: $t('validation.fillField'),
                        trigger: 'blur',
                      }"
                      class="!mb-0"
                    >
                      <el-select
                        v-model.number="
                          ruleForm.configs[$index].modules[custom]
                            .pab_two_decision_module
                        "
                        class="w-full"
                        size="small"
                      >
                        <el-option
                          v-for="(item, i) in [
                            'PASS',
                            'FAIL/RETAKE',
                            'FAIL/OUT of ATTEMPT',
                          ]"
                          :key="i"
                          :label="item"
                          :value="item"
                        />
                      </el-select>
                    </el-form-item>
                    <span v-else>
                      {{ row.pab_two_decision_module }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Credits Attempted/Passed per Semester"
                  min-width="280"
                  show-overflow-tooltip
                >
                  <template #default="{}">
                    {{ row.info.cp + row.info.cf }}/{{ row.info.cp }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="Semester Decision"
                  min-width="160"
                  show-overflow-tooltip
                >
                  <template #default="{}">
                    <el-form-item
                      v-if="editable == $index"
                      :prop="'configs.' + $index + '.pab_two_decision'"
                      :rules="{
                        required: true,
                        message: $t('validation.fillField'),
                        trigger: 'blur',
                      }"
                      class="!mb-0"
                    >
                      <el-select
                        v-model="ruleForm.configs[$index].pab_two_decision"
                        class="w-full"
                        size="small"
                      >
                        <el-option
                          v-for="(item, i) in [
                            'Progress',
                            'Progress with Modules Pending',
                            'Exclusion on Academic Failure',
                          ]"
                          :key="i"
                          :label="item"
                          :value="item"
                        />
                      </el-select>
                    </el-form-item>
                    <span v-else> {{ row.pab_two_decision }} </span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            align="center"
            prop="action"
            label="Actions"
          >
            <template #default="{ $index }">
              <div class="flex items-center justify-center gap-2">
                <div v-if="editable == $index">
                  <el-button
                    type="danger"
                    class="action-button"
                    @click="editable = null"
                  >
                    <CircleClose class="w-5" />
                  </el-button>
                  <el-button
                    type="success"
                    class="action-button"
                    @click="openRequestModal(ruleFormRef)"
                  >
                    <Check class="w-5" />
                  </el-button>
                </div>
                <el-button
                  v-else
                  class="action-button"
                  @click="editable = $index"
                >
                  <EditPen class="w-5" />
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <el-empty v-else description="No data" />
    </div>
    <teleport to="#modal" v-if="openModal">
      <UpdateRequestDialog @on-submit="submitForm($event)" />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  EditPen,
  CircleClose,
  Check,
} from "@element-plus/icons-vue";
import { useCurriculumStore, usePabStore } from "@/stores";
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, FormInstance } from "element-plus";
import { useI18n } from "vue-i18n";
import { IPabModuleTwo, IPabTwo, RequestTypeEnum } from "@/models/backend";
import { useModal } from "@/composables";
import UpdateRequestDialog from "@/components/common/UpdateRequestDialog.vue";
const route = useRoute();
const curriculumStore = useCurriculumStore();
const PabStore = usePabStore();

const pabTwo = computed(() => PabStore.pab_two);
const currentCurriculum = computed(() => curriculumStore.currentCurriculum);
const loading = ref(false);
const modal = useModal();
const currentType = ref(RequestTypeEnum.pab_two_edit);
const openModal = computed(() => modal.show.value);
const ruleFormRef = ref<FormInstance>();
const i18n = useI18n();
const ruleForm = reactive<{
  configs: {
    pab_two_id: string;
    pab_two_decision: string;
    modules: IPabModuleTwo[];
  }[];
}>({
  configs: [],
});
watch(
  () => route.query.reFetch,
  (newValue, oldValue) => {
    fetchList();
  }
);
const editable: any = ref(null);
const filter = reactive({
  level: currentCurriculum.value?.study_year as number,
  semester: currentCurriculum.value?.semester1 as string,
  program_id: route.params.program as string,
  pab_number: 2,
});
const openRequestModal = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      modal.setTitle(i18n.t(`request.${currentType.value}`));
      modal.setWidth("35vw");
      modal.showModal();
    } else {
      ElMessage({
        message: "Please, Fill all fields",
        type: "error",
        duration: 5 * 1000,
      });
      console.log("error submit!", fields);
    }
  });
};
const fetchList = async () => {
  await PabStore.fetchPabTwo(filter);
  pabTwo.value.forEach((acc: IPabTwo, curr: number) => {
    ruleForm.configs[curr] = {
      pab_two_id: acc.id,
      pab_two_decision: acc.pab_two_decision,
      modules: acc.modules?.map((item: IPabModuleTwo) => {
        return {
          ...item,
          reset_grade: 0,
          retake_grade: 0,
          overall_grade_after_resit: item.overall_grade_after_reset as number,
          overall_grade_after_reset: undefined,
        };
      }),
    };
  });
};
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  if (columnIndex == 9) {
    if (rowIndex % 20 === 0) {
      return {
        rowspan: 20,
        colspan: 1,
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      };
    }
  } else if (columnIndex == 10) {
    if (rowIndex % 20 === 0) {
      return {
        rowspan: 20,
        colspan: 1,
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      };
    }
  }
};
const onlyNumber = ($event: any) => {
  //console.log($event.keyCode); //keyCodes value
  let keyCode = $event.keyCode ? $event.keyCode : $event.which;
  if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
    // 46 is dot
    $event.preventDefault();
  }
};
onMounted(async () => {
  if (!pabTwo.value.length) {
    fetchList();
  }
});
const submitForm = async (request: any) => {
  try {
    request.type = currentType.value;
    loading.value = true;
    await PabStore.updatePabTwo({
      ...(ruleForm.configs[editable.value] as any),
      request,
    });
    await fetchList();
    modal.hideModal();
    ElMessage({
      message: i18n.t("shared.updated"),
      type: "success",
    });
    editable.value = null;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    console.log("error", error);
  }
};
</script>

<style scoped></style>
