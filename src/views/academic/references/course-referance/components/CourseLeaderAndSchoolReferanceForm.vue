<template>
  <div class="flex flex-col gap-3 mt-6 mb-10">
    <h1 class="font-semibold text-xl">School and course leader</h1>
    <p class="text-tertiary-600 font-normal">
      Information about the course's affiliation with the school and which
      course leader it has
    </p>
  </div>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-position="left"
    hide-required-asterisk
    label-width="200"
    :disabled="disabled"
  >
    <div>
      <el-form-item label="School" prop="school_id">
        <el-select v-model="ruleForm.school_id" class="w-full">
          <el-option
            v-for="{ label, value } of schoolStore.getSchoolsSelct"
            :key="value"
            :label="label"
            :value="value"
          />
        </el-select>
      </el-form-item>
      <el-divider />
      <el-form-item label="Course leader" prop="chief_id">
        <el-select v-model="ruleForm.chief_id" filterable class="w-full">
          <el-option
            v-for="{ label, value } of staffStore.getStaffSelect"
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
import { FormInstance, FormRules } from "element-plus";
import { useI18n } from "vue-i18n";
import { useStepper } from "@/composables";
import { Subject, takeUntil } from "rxjs";
import { useSchoolStore, useStaffStore } from "@/stores";

const destroy = new Subject<any>();
const { check$, next } = useStepper();
const schoolStore = useSchoolStore();
const staffStore = useStaffStore();

const emit = defineEmits(["onChange"]);

const props = defineProps<{
  value: any;
  disabled?: boolean;
}>();

const i18n = useI18n();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  school_id: "",
  chief_id: "",
});

const rules = reactive<FormRules>({
  school_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  chief_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
});

onMounted(() => {
  // Fetch Schools
  schoolStore.fetchSchools();
  staffStore.getStaffs({ type: "course_leader" });

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
