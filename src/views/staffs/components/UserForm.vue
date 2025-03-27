<template>
  <div class="bg-white px-4 py-8 rounded">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      :hide-required-asterisk="true"
      label-position="top"
    >
      <div class="col-span-2 grid grid-cols-2 gap-x-4">
        <div>
          <el-form-item label="First Name" prop="first_name">
            <el-input
              v-model="ruleForm.first_name"
              type="text"
              autocomplete="off"
              class="!h-11 w-full"
            />
          </el-form-item>
          <el-form-item label="Last Name" prop="last_name">
            <el-input
              v-model="ruleForm.last_name"
              type="text"
              autocomplete="off"
              class="!h-11"
            />
          </el-form-item>
        </div>
        <el-form-item class="pt-7" prop="avatar">
          <AppUpload
            @upload="(data: any) => (ruleForm.avatar = data)"
            accept="image/*"
          >
            <div
              class="upload-box cursor-pointer flex-col"
              v-if="type === 'create'"
            >
              <span>+</span>
              <span>Profile Picture</span>
            </div>
            <div
              class="upload-box cursor-pointer flex-col !bg-black text-white"
              v-else
            >
              <el-icon>
                <EditPen />
              </el-icon>
              <span>Edit photo</span>
            </div>
          </AppUpload>
        </el-form-item>
      </div>
      <div class="grid md:grid-cols-2 gap-x-4">
        <el-form-item label="E-mail Address" prop="email">
          <el-input
            v-model.trim="ruleForm.email"
            type="text"
            autocomplete="off"
            class="!h-11"
          />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            v-model.trim="ruleForm.password"
            type="password"
            autocomplete="off"
            class="!h-11"
          />
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select v-model="ruleForm.role" class="!w-full !h-11">
            <el-option
              v-for="{ label, value } of roles"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="ruleForm.role == 'teacher'"
          label="School"
          prop="school_id"
        >
          <el-select v-model="ruleForm.school_id" class="!w-full !h-11">
            <el-option
              v-for="{ label, value } of schools"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Team" prop="department_id">
          <el-select v-model="ruleForm.department_id" class="w-full !h-11">
            <el-option
              v-for="{ label, value } of guideStore.getDepartmentsSelect"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Position"
          prop="position_ids"
          class="md:col-span-2"
        >
          <el-select
            v-model="ruleForm.position_ids"
            class="w-full !h-11"
            multiple
          >
            <el-option
              v-for="item of guideStore.getPositionSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Degree" prop="degree_id">
          <el-select v-model="ruleForm.degree_id" class="w-full !h-11">
            <el-option
              v-for="item of guideStore.getDegreeSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Teaching hours / week" prop="work_hour">
          <el-input-number
            v-model="ruleForm.work_hour"
            autocomplete="off"
            class="!h-11 !w-full"
            :controls="false"
          />
        </el-form-item>
        <el-form-item
          v-if="ruleForm.role == 'teacher'"
          class="!-mb-2"
          label=""
          prop="is_dean"
        >
          <el-checkbox
            :disabled="!isDean"
            class="checkbox"
            v-model="ruleForm.is_dean"
            label="Assign as Dean"
            size="large"
          />
        </el-form-item>
        <el-form-item label="Employment status" prop="resource">
          <el-radio-group v-model="ruleForm.is_blocked">
            <el-radio :label="false">Active</el-radio>
            <el-radio :label="true">Inactive</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
    </el-form>
    <div class="flex mt-6 justify-end">
      <el-button type="primary" size="large" @click="submitForm(ruleFormRef)">
        {{ $t("shared.save") }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted, computed } from "vue";
import type { PropType } from "vue";
import { useI18n } from "vue-i18n";
import sha1 from "sha1";
import type { IStaff } from "@/models/backend";
import type { ControlItem } from "@/models/frontend";
import AppUpload from "@/components/common/AppUpload.vue";
import { useGuideStore, useSchoolStore } from "@/stores";

const guideStore = useGuideStore();
const schoolStore = useSchoolStore();
const i18n = useI18n();

const props = defineProps<{
  user?: IStaff | any;
  roles: ControlItem[];
  type?: "create" | "edit";
  userData: any;
}>();

const schools = computed(() => schoolStore.getSchoolsSelct);
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  first_name: "",
  last_name: "",
  email: "",
  department_id: "",
  degree_id: "",
  is_dean: false,
  password: "",
  position_ids: [],
  role: "",
  avatar: null,
  work_hour: 0,
  is_blocked: false,
  school_id: undefined,
});
const isDean = computed(() => {
  return (
    props.userData?.role === "super_admin" ||
    (props.userData?.role === "admin" && ruleForm.role === "teacher")
  );
});

const rules = reactive<FormRules>({
  first_name: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  last_name: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  role: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  department_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  degree_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  position_ids: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  school_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  avatar: [
    {
      required: props.type === "create",
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  email: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
    {
      type: "email",
      message: i18n.t("validation.inputEmail"),
      trigger: "blur",
    },
  ],
  password: [
    {
      required: props.type === "create",
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
    {
      min: 8,
      message: i18n.t("validation.minimumLength", { value: 8 }),
      trigger: "blur",
    },
  ],
});

const emit = defineEmits(["onSubmit"]);

onMounted(() => {
  if (props.user && props.type === "edit") {
    Object.assign(ruleForm, props.user);
    ruleForm.password = "********";
  }
  if (!schoolStore.schools.length) {
    schoolStore.fetchSchools();
  }
  if (!guideStore.positions.data.length) {
    guideStore.fetchPositions();
  }
  if (!guideStore.departments.data.length) {
    guideStore.fetchDepartments();
  }
  if (!guideStore.degree.data.length) {
    guideStore.fetchDegree();
  }
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const data = {
        ...ruleForm,
        password:
          ruleForm.password !== "********" ? sha1(ruleForm.password) : null,
        is_dean: ruleForm.role === "teacher" ? ruleForm.is_dean : null,
      };
      emit("onSubmit", data);
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

.upload-box {
  border-radius: 6.849px;
  border: 0.856px solid #d0d5dd;
  background: #fff;
  box-shadow: 0px 0.85608px 1.71217px 0px rgba(16, 24, 40, 0.05);
  width: 133px;
  height: 107px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<style lang="scss">
.checkbox {
  .el-checkbox__input {
    &.is-checked {
      .el-checkbox__inner {
        background-color: #6941c6 !important;
        border-color: #6941c6 !important;
      }
    }
  }

  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #000 !important;
  }

  .el-checkbox__input:not(.is-checked) + .el-checkbox__label {
    color: #6e6a6a !important;
  }
}
</style>
