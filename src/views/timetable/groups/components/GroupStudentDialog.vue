<template>
  <div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
      v-loading="loading"
    >
      <div class="grid grid-cols-2 gap-5">
        <el-form-item label="Name" prop="name" class="w-full !mb-0">
          <el-input
            v-model="ruleForm.name"
            type="text"
            autocomplete="off"
            placeholder="Type the name of the class"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="Abbreviation"
          prop="short_name"
          class="w-full !mb-0"
        >
          <el-input
            v-model="ruleForm.short_name"
            type="text"
            autocomplete="off"
            placeholder="Type abbreviation"
          ></el-input>
        </el-form-item>
        <el-form-item label="Program" prop="program_id" class="w-full !mb-0">
          <el-select
            v-model="ruleForm.program_id"
            filterable
            placeholder="Programs"
          >
            <el-option
              v-for="item of programStore.getTuitions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="group_leader_id" class="w-full !mb-0">
          <template #label>
            Group leader
            <span class="font-medium text-sm text-[#9ca3af]">(optional)</span>
          </template>
          <el-select
            v-model="ruleForm.group_leader_id"
            filterable
            class="w-full"
          >
            <el-option
              v-for="{ label, value } of staffStore.getTeacherSelect"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Color"
          prop="selectedColorName"
          class="w-full !mb-0"
        >
          <el-select
            v-model="ruleForm.selectedColorName"
            placeholder="Choose color"
            class="w-full"
            clearable
            filterable
            @change="handleColorChange"
          >
            <el-option
              v-for="(item, i) in colors"
              :key="i"
              :value="item.name"
              class="flex items-center gap-2 bg-[#cdd0d1]"
              :label="item.name"
            >
              <!-- e6eaed -->
              <div
                class="rounded-xl w-[10px] p-2 h-[10px]"
                :style="{
                  backgroundColor: `rgba(${parseInt(
                    item.hex_code.slice(1, 3),
                    16
                  )}, ${parseInt(item.hex_code.slice(3, 5), 16)}, ${parseInt(
                    item.hex_code.slice(5, 7),
                    16
                  )}, 0.15)`,
                  borderColor: item.hex_code,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                }"
              ></div>

              <span>{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Level" prop="level" class="w-full !mb-0">
          <el-select v-model="ruleForm.level" placeholder="Choose level">
            <el-option
              v-for="item of [
                { value: 1, label: 1 },
                { value: 2, label: 2 },
                { value: 3, label: 3 },
                { value: 4, label: 4 },
                { value: 5, label: 5 },
                { value: 6, label: 6 },
              ]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="mt-4">
        <div v-if="selectedStudentsDisplay.length > 0">
          <span class="text-[#111928] font-semibold">Students</span>
        </div>
        <div
          v-if="selectedStudentsDisplay.length > 0"
          class="w-full flex items-center gap-1 !mt-2 text-left relative justify-left border px-3 !ml-0 cursor-pointer border-[#D1D5DB] !h-10 rounded-lg !bg-[#F9FAFB]"
          @click="openAddStudentDialog"
        >
          <div class="flex">
            <div class="flex">
              <template
                v-for="(student, index) in selectedStudentsDisplay"
                :key="index"
              >
                <span
                  class="flex items-center justify-center gap-2 !text-[#111928]"
                  >{{ student.uid
                  }}{{
                    index < selectedStudentsDisplay.length - 1 ? "," : ""
                  }}</span
                >
              </template>
              <span v-if="ruleForm.student_ids.length > 10">...</span>
            </div>
            <div class="absolute right-1">--></div>
          </div>
        </div>
        <el-button v-else class="w-full" @click="openAddStudentDialog"
          >+ Add students</el-button
        >
      </div>
      <div>
        <el-button
          class="w-full mt-4 !justify-center !ml-0"
          type="primary"
          @click="submitForm(ruleFormRef)"
          >Create</el-button
        >
      </div>
    </el-form>
    <el-dialog
      v-model="isAddStudentDialogOpen"
      title="Add student"
      min-width="700"
      style="background: #fff !important"
      class="custom-dialog"
    >
      <StudentAddingDialog
        v-if="isAddStudentDialogOpen"
        @close="isAddStudentDialogOpen = false"
        @add-students="handleAddStudents"
        :studentinfo="studentinfo"
        :selected-students="selectedStudents"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  useGuideStore,
  useStaffStore,
  useStudentsStore,
  useTimeTableGroups,
} from "@/stores";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted, computed } from "vue";
import StudentAddingDialog from "./StudentAddingDialog.vue";
import { useI18n } from "vue-i18n";
import { colors } from "@/utils/colors";

const timeTableGroups = useTimeTableGroups();
const i18n = useI18n();
const staffStore = useStaffStore();
const programStore = useGuideStore();
const studentStore = useStudentsStore();
const timetableGroupsStore = useTimeTableGroups();

const checkValid = computed(() => timeTableGroups.groups);
const studentinfo = computed(() => studentStore.students);
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();
const isAddStudentDialogOpen = ref(false);
const emit = defineEmits(["closeModal"]);
interface Student {
  id: string;
  uid: string;
  last_name: string;
  first_name: string;
}
const ruleForm = reactive({
  name: "",
  short_name: "",
  group_leader_id: "",
  selectedColorName: "",
  level: "",
  program_id: "",
  color_info: {
    name: "",
    hex_code: "",
  },
  student_ids: [] as any,
});
const props = defineProps<{
  icon?: any;
  filter?: any;
}>();

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  short_name: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
    {
      validator: check_short_name,
      trigger: "change",
    },
  ],
  program_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
    },
  ],
  selectedColorName: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
    },
  ],
  level: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
    },
  ],
});
function check_short_name(rule: any, value: any, callback: any) {
  const checkShortNames = checkValid.value.data.map(
    (item: any) => item.abbreviation
  );
  if (checkShortNames.includes(value)) {
    callback(new Error(i18n.t("validation.shortNameAlreadyExists")));
  } else {
    callback();
  }
}
const handleColorChange = () => {
  const selectedColor = colors.find(
    (item) => item.name === ruleForm.selectedColorName
  );
  if (selectedColor) {
    ruleForm.color_info = { ...selectedColor };
  }
};

const openAddStudentDialog = () => {
  isAddStudentDialogOpen.value = true;
};

const selectedStudents = ref<Student[]>([]);
function handleAddStudents(newStudents: Student[]) {
  newStudents.forEach((student) => {
    if (!selectedStudents.value.some((s) => s.id === student.id)) {
      selectedStudents.value.push(student);
    }
  });
}
const selectedStudentsDisplay = computed(() => {
  return selectedStudents.value.slice(0, 10);
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        loading.value = true;
        const studentIds = selectedStudents.value.map((student) => student.id);
        await timetableGroupsStore.fetchTimetableGroupsCreate({
          ...ruleForm,
          student_ids: studentIds,
        });
        ElMessage({
          message: i18n.t("shared.created"),
          type: "success",
        });
        emit("closeModal");
        loading.value = false;
      } catch (error: any) {
        loading.value = false;
        console.log("error", error);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<style lang="scss"></style>
