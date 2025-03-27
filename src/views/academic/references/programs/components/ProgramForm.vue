<template>
  <div class="px-4 py-8 bg-white rounded">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
    >
      <div class="grid sm:grid-cols-2 gap-y-4 gap-x-8">
        <el-form-item class="!text-xs" label="Program name (en)" prop="en">
          <el-input
            v-model="ruleForm.en"
            class="medium"
            type="text"
            autocomplete="off"
            :placeholder="$t('shared.text')"
            maxlength="65"
          />
        </el-form-item>
        <el-form-item class="!text-xs" label="Program name (rus)" prop="ru">
          <el-input
            v-model="ruleForm.ru"
            class="medium"
            type="text"
            maxlength="65"
            autocomplete="off"
            :placeholder="$t('shared.text')"
          />
        </el-form-item>
        <el-form-item class="!text-xs" label="Program name (uz)" prop="uz">
          <el-input
            v-model="ruleForm.uz"
            class="medium"
            type="text"
            maxlength="65"
            autocomplete="off"
            :placeholder="$t('shared.text')"
          />
        </el-form-item>
        <el-form-item label="Degree type" prop="degree_id">
          <el-select
            v-model="ruleForm.degree_id"
            placeholder="Degree type"
            class="w-full medium"
            filterable
          >
            <el-option
              v-for="degree of degrees"
              :key="degree.value"
              :label="degree.label"
              :value="degree.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="School" prop="school_id">
          <el-select
            v-model="ruleForm.school_id"
            :disabled="props.type == 'create'"
            placeholder="Choose school"
            class="w-full medium"
          >
            <el-option
              v-for="school of schools"
              :key="school.id"
              :label="school.title"
              :value="school.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Duration (Semesters)" prop="duration">
          <el-input
            v-model="ruleForm.duration"
            class="medium"
            v-mask="'##'"
            type="text"
            autocomplete="off"
            :placeholder="$t('shared.text')"
          ></el-input>
        </el-form-item>
        <el-form-item label="Language" prop="lang">
          <el-select
            filterable
            v-model="ruleForm.lang"
            class="w-full medium"
            multiple
          >
            <el-option
              v-for="lang of langs"
              :key="lang.code"
              :label="lang.name"
              :value="lang.code"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Head of department" prop="chief_id">
          <el-select
            v-model="ruleForm.chief_id"
            placeholder="Select"
            class="w-full medium"
            :remote-method="fetchStaff"
            :loading="loading"
            remote
            reserve-keyword
            filterable
          >
            <el-option
              v-for="item of staffs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Local tuition ( UZS )" prop="per_semester">
          <el-input
            v-model.number="ruleForm.per_semester"
            class="medium"
            autocomplete="off"
            v-mask="'#########'"
            type="text"
            placeholder="Number"
            maxlength="9"
            onkeypress="return event.charCode >= 48"
          />
        </el-form-item>
        <el-form-item
          label="International tuition ( USD )  "
          prop="fee_foreign_student"
        >
          <el-input
            v-model.number="ruleForm.fee_foreign_student"
            class="medium"
            autocomplete="off"
            v-mask="'#####'"
            placeholder="Number"
            maxlength="5"
            onkeypress="return event.charCode >= 48"
          />
        </el-form-item>

        <div class="flex items-center gap-11">
          <el-form-item prop="has_scholarship" label="Scholarship">
            <el-radio-group v-model="ruleForm.has_scholarship">
              <el-radio :label="true">Yes</el-radio>
              <el-radio :label="false">No</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="is_active" label="Admission">
            <el-radio-group v-model="ruleForm.is_active">
              <el-radio :label="true">Yes</el-radio>
              <el-radio :label="false">No</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="flex items-center justify-between">
          <el-form-item prop="icon" label="Icon">
            <el-popover placement="top" :width="400" trigger="click">
              <template #reference>
                <div
                  class="flex items-center p-2 gap-6 cursor-pointer rounded-md border border-[#D0D5DD]"
                >
                  <div class="p-1.5 bg-[#9E77ED] rounded-md">
                    <SvgIcon
                      :name="'local-' + ruleForm.icon"
                      color="transparent"
                      stroke="white"
                      size="22"
                    />
                  </div>
                  <el-icon :size="24"><ArrowDown /></el-icon>
                </div>
              </template>
              <div class="grid grid-cols-3 gap-2 md:grid-cols-8">
                <div
                  v-for="item of iconNames"
                  :key="item"
                  class="py-1.5 bg-[#9E77ED] rounded-md flex items-center justify-center cursor-pointer"
                  @click="ruleForm.icon = item"
                >
                  <SvgIcon
                    :name="'local-' + item"
                    color="transparent"
                    stroke="white"
                    size="18"
                  />
                </div>
              </div>
            </el-popover>
          </el-form-item>
          <el-button
            type="primary"
            size="large"
            @click="submitForm(ruleFormRef)"
          >
            {{ $t("shared.save") }}
          </el-button>
        </div>
      </div>
    </el-form>
    <div class="flex"></div>
  </div>
</template>

<script setup lang="ts">
import { ControlItem } from "@/models/frontend";
import { useStaffStore } from "@/stores";
import { ArrowDown } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useI18n } from "vue-i18n";

const iconNames = [
  "activity-heart",
  "dental",
  "announcement",
  "atom",
  "atom2",
  "bank",
  "bank-note",
  "beaker",
  "building",
  "devices",
  "beaker2",
  "book-closed",
  "book-open",
  "browser",
  "building-02",
  "car",
  "camera",
  "briefcase",
  "activity",
  "mail",
  "certificate",
  "fluent-communication-person",
  "microscope",
  "marker-pin",
  "material-symbols-psychology-outline",
  "compass",
  "wallet",
  "truck",
  "scales",
  "stand",
  "server",
  "ruler",
  "piggy-bank",
  "puzzle-piece",
  "rocket",
  "colors",
  "ic-round-architecture",
  "tool",
  "material-symbols-engineering-outline",
  "group",
  "tabler-math",
  "streamline-money-graph-bar-increase-up-product-performance-increase-arrow-graph-business-chart",
  "group2",
  "presentation-chart",
];
const i18n = useI18n();
const staffStore = useStaffStore();
const props = defineProps<{
  department?: any | null;
  langs?: any | null;
  schools?: any | null;
  school?: any | null;
  degrees?: ControlItem[];
  staffs?: ControlItem[];
  type?: "create" | "edit";
}>();
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  program: "",
  en: "",
  ru: "",
  uz: "",
  degree_id: "",
  per_semester: "",
  fee_foreign_student: "",
  chief_id: "",
  duration: "",
  icon: iconNames[0],
  lang: [],
  is_active: true,
  has_scholarship: false,
  school_id: "",
});

const rules = reactive<FormRules>({
  en: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
    {
      min: 5,
      message: i18n.t("validation.minimumLength", { value: 5 }),
      trigger: ["blur", "change"],
    },
    {
      max: 64,
      message: i18n.t("validation.maxLength", { value: 64 }),
      trigger: ["blur", "change"],
    },
  ],
  ru: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
    {
      min: 5,
      message: i18n.t("validation.minimumLength", { value: 5 }),
      trigger: ["blur", "change"],
    },
    {
      max: 64,
      message: i18n.t("validation.maxLength", { value: 64 }),
      trigger: ["blur", "change"],
    },
  ],
  uz: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
    {
      min: 5,
      message: i18n.t("validation.minimumLength", { value: 5 }),
      trigger: ["blur", "change"],
    },
    {
      max: 64,
      message: i18n.t("validation.maxLength", { value: 64 }),
      trigger: ["blur", "change"],
    },
  ],
  degree_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
  ],
  per_semester: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
    {
      type: "number",
      message: i18n.t("validation.pattern"),
      trigger: ["blur", "change"],
    },
  ],
  chief_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
  ],
  fee_foreign_student: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
    {
      type: "number",
      message: i18n.t("validation.pattern"),
      trigger: ["blur", "change"],
    },
  ],
  duration: [
    {
      required: true,
      validator: checkduration,
      trigger: "blur",
    },
  ],
  lang: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
  ],
  school_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
  ],
});
const fetchStaff = async (val: any) => {
  if (val.length >= 2) {
    loading.value = true;
    await staffStore.getStaffs({
      page: 1,
      limit: 100,
      type: "dean",
      search: val ? val : undefined,
    });
    loading.value = false;
  }
};
const emit = defineEmits(["onSubmit"]);
function checkduration(rule: any, value: any, callback: any) {
  if (!value) {
    return callback(i18n.t("validation.fillField"));
  }
  if (value <= 16) {
    callback();
  } else {
    callback(i18n.t("validation.maximumLength", { value: 16 }));
  }
}
onMounted(() => {
  if (props.department && props.type === "edit") {
    console.log("props.department", props.department);
    Object.assign(ruleForm, props.department);
    ruleForm.chief_id = props.department?.chief?.id || "";
    ruleForm.school_id = props.department?.school?.id || "";
    ruleForm.degree_id = props.department?.degree?.id || "";
    ruleForm.en = props.department?.title?.en || "";
    ruleForm.ru = props.department?.title?.ru || "";
    ruleForm.uz = props.department?.title?.uz || "";
  } else {
    ruleForm.school_id = props.school.id;
  }
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      emit("onSubmit", ruleForm);
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<style scoped>
.title {
  font-weight: 700;
  font-size: 18px;
  line-height: 25px;
  color: #1f1f1f;
}
</style>
