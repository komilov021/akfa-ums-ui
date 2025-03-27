<template>
  <div v-loading="loading" class="space-y-8 mt-4">
    <div>
      <div class="flex items-center justify-between mb-8">
        <div class="flex flex-col gap-3">
          <h1 class="font-semibold text-xl">Main course</h1>
          <p class="text-tertiary-600 font-normal">
            Update your company photo and details here.
          </p>
        </div>
        <div class="flex items-center gap-2 right-0 top-2">
          <el-button v-if="!editable" @click="editable = true">Edit</el-button>
          <template v-else>
            <el-button @click="editable = false">Cancel</el-button>
            <el-button @click="openRequestModal" color="#344054"
              >Save</el-button
            >
          </template>
        </div>
      </div>
      <div v-if="!editable">
        <div class="grid grid-cols-5 gap-2">
          <h1 class="font-semibold text-text-secondary-700">Grading</h1>
          <h1 class="text-base ext-text-tertiary-600">
            {{ course.grading_type }}
          </h1>
        </div>
        <el-divider />
        <div class="grid grid-cols-5 gap-2">
          <h1 class="font-semibold text-text-secondary-700">
            Number of credits
          </h1>
          <h1 class="text-base ext-text-tertiary-600">{{ course.credits }}</h1>
        </div>
      </div>
      <el-form
        v-else
        ref="ruleFormRef"
        :model="ruleForm"
        label-position="left"
        hide-required-asterisk
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
            <el-input-number
              class="!w-full"
              v-model="ruleForm.credits"
              :min="0"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div>
      <div class="flex items-center justify-between mb-8">
        <div class="flex flex-col gap-3">
          <h1 class="font-semibold text-xl">Retake Course</h1>
          <p class="text-tertiary-600 font-normal">
            Update your company photo and details here.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <el-button v-if="!editable2" @click="editable2 = true"
            >Edit</el-button
          >
          <template v-else>
            <el-button @click="editable2 = false">Cancel</el-button>
            <el-button @click="openRequestModal2" color="#344054"
              >Save</el-button
            >
          </template>
        </div>
      </div>
      <div v-if="!editable2">
        <div class="grid grid-cols-5 gap-2">
          <h1 class="font-semibold text-text-secondary-700">Grading</h1>
          <h1 class="text-base">Pass/Fail</h1>
        </div>
        <el-divider />
        <div class="grid grid-cols-5 gap-2">
          <h1 class="font-semibold text-text-secondary-700">
            Number of credits
          </h1>
          <h1 class="text-base ext-text-tertiary-600">
            {{ course.retake_credits }}
          </h1>
        </div>
      </div>
      <el-form
        v-else
        ref="ruleFormRef2"
        :model="ruleForm2"
        label-position="left"
        hide-required-asterisk
      >
        <div class="grid md:grid-cols-3 gap-6">
          <el-form-item
            label="Main course grading:"
            prop="retake_grading_type"
            label-width="300"
            :rules="{
              required: true,
              message: $t('validation.fillField'),
              trigger: 'blur',
            }"
            class="col-span-2"
          >
            <el-select
              v-model="ruleForm2.retake_grading_type"
              disabled
              class="w-full"
            >
              <el-option
                v-for="item of ['PASS/FAIL']"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="Credits:"
            prop="retake_credits"
            label-width="120"
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
              v-model="ruleForm2.retake_credits"
              :min="0"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
  <teleport to="#modal" v-if="showModal">
    <UpdateRequestDialog @on-submit="submitForm($event)" />
  </teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { useI18n } from "vue-i18n";
import { IAssignedCourse, RequestTypeEnum } from "@/models/backend";
import { useModal } from "@/composables";
import UpdateRequestDialog from "@/components/common/UpdateRequestDialog.vue";
import { useCurriculumStore } from "@/stores";

const curriculumStore = useCurriculumStore();

const modal = useModal();
const i18n = useI18n();

const showModal = computed(() => modal.show.value);
const editable = ref(false);
const editable2 = ref(false);

const emit = defineEmits(["onChange"]);

const currentType = ref<RequestTypeEnum>(
  RequestTypeEnum.assigned_grading_credits
);

const props = defineProps<{
  course: IAssignedCourse;
}>();

const loading = ref(false);
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  grading_type: "",
  credits: 0,
});

const ruleFormRef2 = ref<FormInstance>();
const ruleForm2 = reactive({
  retake_grading_type: "PASS/FAIL",
  retake_credits: 0,
});

const openRequestModal = () => {
  ruleFormRef.value?.validate((valid) => {
    if (valid) {
      currentType.value = RequestTypeEnum.assigned_grading_credits;
      modal.setTitle(i18n.t(`request.${currentType.value}`));
      modal.setWidth("35vw");
      modal.showModal();
    }
  });
};

const openRequestModal2 = () => {
  ruleFormRef2.value?.validate((valid) => {
    if (valid) {
      currentType.value = RequestTypeEnum.assigned_retake_grading_credits;
      modal.setTitle(i18n.t(`request.${currentType.value}`));
      modal.setWidth("35vw");
      modal.showModal();
    }
  });
};

const submitForm = async (request: any) => {
  try {
    loading.value = true;
    request.type = currentType.value;
    if (currentType.value === RequestTypeEnum.assigned_grading_credits) {
      await curriculumStore.editAssignCourseGradingCredits({
        ...ruleForm,
        assigned_course_id: props.course.id,
        request,
      });
    } else {
      await curriculumStore.editAssignCourseRetakeGradingCredits({
        ...ruleForm2,
        assigned_course_id: props.course.id,
        request,
      });
    }

    ElMessage({
      message: i18n.t("shared.created"),
      type: "success",
    });
    modal.hideModal();
    editable.value = false;
    editable2.value = false;
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};

onMounted(() => {
  ruleForm.grading_type = props.course.grading_type;
  ruleForm.credits = props.course.credits;
  ruleForm2.retake_credits = props.course.retake_credits;
});
</script>

<style scoped lang="scss"></style>
