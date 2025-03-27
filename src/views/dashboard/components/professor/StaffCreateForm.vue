<template>
  <div class="px-4">
    <el-form
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      ref="ruleFormRef"
      require-asterisk-position="right"
    >
      <div class="grid grid-cols-2 gap-4">
        <el-form-item label="Name" prop="name" class="w-full !mb-0">
          <el-input
            v-model="ruleForm.name"
            type="text"
            autocomplete="off"
            placeholder="Enter the name"
          ></el-input
        ></el-form-item>
        <el-form-item label="Surname" prop="surname" class="w-full !mb-0">
          <el-input
            v-model="ruleForm.surname"
            type="text"
            autocomplete="off"
            placeholder="Enter the name"
          ></el-input
        ></el-form-item>
        <el-form-item label="Email" prop="email" class="w-full !mb-0">
          <el-input
            v-model="ruleForm.email"
            type="email"
            autocomplete="off"
            placeholder="Enter the email"
          ></el-input
        ></el-form-item>
        <el-form-item label="Position" prop="position" class="w-full !mb-0">
          <el-input
            v-model="ruleForm.position"
            type="text"
            autocomplete="off"
            placeholder="Enter the position"
          ></el-input
        ></el-form-item>
        <el-form-item
          label="Choose school"
          prop="department"
          class="w-full !mb-0"
        >
          <el-select
            class="w-full"
            :placeholder="`${$t('shared.select')} school`"
            clearable
            v-model="ruleForm.department"
          >
            <el-option
              v-for="(item, i) in schoolList"
              :key="i"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Workload" prop="workload" class="w-full !mb-0">
          <el-input
            v-model="ruleForm.workload"
            type="text"
            autocomplete="off"
            placeholder="Choose the workload"
          ></el-input
        ></el-form-item>
      </div>

      <div class="mt-6">
        <AppUpload
          @upload="
            (file) => {
              (ruleForm.photo_url = file), ruleFormRef?.clearValidate('photo');
            }
          "
          @remove="() => (ruleForm.photo_url = null)"
          list-type="picture"
          accept="image/*"
        >
          <div
            class="bg-white min-w-[640px] h-[126px] rounded-lg flex items-center text-center justify-center border"
          >
            <div class="flex flex-col items-center">
              <UploadFile class="mb-2" />
              <h1>
                <span class="text-primary font-semibold">Click to upload</span>
                or drag and drop
              </h1>
              <h1>SVG, PNG, JPG or GIF (max. 800x400px)</h1>
            </div>
          </div>
        </AppUpload>
      </div>
      <el-form-item label="Subjects to teach" prop="subjects_taught">
        <el-input
          type="textarea"
          placeholder="Staff’s subjects to teach"
          :rows="6"
          resize="none"
          v-model="ruleForm.subjects_taught"
        />
      </el-form-item>
      <el-form-item
        label="Educational background"
        prop="educational_background"
      >
        <el-input
          v-model="ruleForm.educational_background"
          type="textarea"
          placeholder="Staff’s educational background"
          :rows="6"
          resize="none"
        />
      </el-form-item>
      <el-form-item label="Brief info" prop="brief_bio">
        <el-input
          type="textarea"
          v-model="ruleForm.brief_bio"
          placeholder="Staff’s brief info"
          resize="none"
          :rows="6"
        />
      </el-form-item>
    </el-form>
    <div class="flex justify-end">
      <el-button
        v-if="props.type == 'create'"
        @click="submitForm(ruleFormRef)"
        type="primary"
        class="w-[245px]"
        >Confirm</el-button
      >
      <el-button
        v-else
        @click="submitForm(ruleFormRef)"
        type="primary"
        class="w-[245px]"
        >Save</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from "vue";
import { type FormInstance, type FormRules } from "element-plus";
import AppUpload from "@/components/common/AppUpload.vue";
import UploadFile from "@/components/icons/Upload.vue";
import AvatarIcon from "@/components/icons/Avatar.vue";
import { useSchoolStore } from "@/stores";
const schoolStore = useSchoolStore();
const emit = defineEmits<{
  onSubmit: any;
}>();
const props = defineProps<{
  type: "create" | "edit";
  data: any;
  schoolList: string[];
}>();
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  surname: "",
  name: "",
  email: "",
  position: "",
  department: "",
  workload: "",
  subjects_taught: "",
  educational_background: "",
  brief_bio: "",
  photo_url: "" as any,
});

const rules = reactive<FormRules>({
  name: [{ required: true, message: "Name is required", trigger: "blur" }],
  surname: [
    { required: true, message: "Surname is required", trigger: "blur" },
  ],
  email: [
    { required: true, message: "Email is required", trigger: "blur" },
    { type: "email", message: "Please enter a valid email", trigger: "blur" },
  ],
  position: [
    { required: true, message: "Position is required", trigger: "blur" },
  ],
  department: [
    { required: true, message: "Department is required", trigger: "blur" },
  ],
  workload: [
    { required: true, message: "Workload is required", trigger: "blur" },
  ],
  subjects_taught: [
    {
      required: true,
      message: "Subjects to teach is required",
      trigger: "blur",
    },
  ],
  educational_background: [
    {
      required: true,
      message: "Educational background is required",
      trigger: "blur",
    },
  ],
  brief_bio: [
    {
      required: true,
      message: "Brief info is required",
      trigger: "blur",
    },
  ],
  photo_url: [
    {
      required: true,
      message: "Upload is required",
      trigger: "blur",
    },
  ],
});
console.log(ruleForm.photo_url);

const submitForm = async (formData: FormInstance | undefined) => {
  if (!formData) return;
  await formData.validate(async (valid, fields) => {
    if (valid) {
      emit("onSubmit", {
        ...ruleForm,
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};
onMounted(() => {
  if (props.data && props.type === "edit") {
    Object.assign(ruleForm, props.data);
  }
  if (!schoolStore.getSchoolsSelct.length) {
    schoolStore.fetchSchools();
  }
});
</script>

<style>
.uploadDrag {
  border: 1px solid #e9eaeb;
}
</style>
