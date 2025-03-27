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
      <div class="grid grid-cols-2 gap-4">
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
          prop="abbreviation"
          class="w-full !mb-0"
        >
          <el-input
            v-model="ruleForm.abbreviation"
            type="text"
            autocomplete="off"
            placeholder="Type abbreviation"
          ></el-input>
        </el-form-item>
        <el-form-item label="Program" prop="program_id" class="w-full !mb-0">
          <el-select
            v-model="ruleForm.program_id"
            placeholder="Program"
            class="w-full"
            filterable
            clearable
          >
            <el-option
              v-for="item of programStore.getTuitions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Class teacher"
          prop="group_leader_id"
          class="w-full !mb-0"
        >
          <el-select
            v-model="ruleForm.group_leader_id"
            placeholder="Choose class teacher"
            class="w-full"
            filterable
            clearable
          >
            <el-option
              v-for="item in staffStore"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Color" prop="color_info" class="w-full !mb-0">
          <el-select
            v-model="ruleForm.color_info.hex_code"
            placeholder="Choose color"
            filterable
            class="w-full"
          >
            <el-option
              v-for="item of colors"
              :key="item.hex_code"
              :value="item.hex_code"
              :style="{ backgroundColor: '#cdd0d1' }"
              class="flex items-center gap-2 custom-bg"
              :label="item.name"
            >
              <!-- e4e7e8 -->
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
      </div>
      <div class="mt-4">
        <el-button class="w-full !ml-0" type="primary" @click="submitEditForm"
          >Save changes</el-button
        >
      </div>
    </el-form>
  </div>
  <el-dialog v-if="showRequestModal" v-model="showRequestModal" width="45vw">
    <UpdateRequestDialog @on-submit="handleUpdateRequestSubmit" />
  </el-dialog>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { colors } from "@/utils/colors";
import { useI18n } from "vue-i18n";
import { useGuideStore } from "@/stores";
import UpdateRequestDialog from "@/components/common/UpdateRequestDialog.vue";
const loading = ref(false);
const addStudent = ref(false);
const showRequestModal = ref(false);
const i18n = useI18n();
const ruleFormRef = ref<FormInstance>();
const emit = defineEmits(["onSubmit"]);
// const programStore = useGuideStore();
const ruleForm = reactive({
  name: "",
  abbreviation: "",
  group_leader_id: "",
  program_id: "",
  color_info: {
    name: "",
    hex_code: "",
  } as { name: string | undefined; hex_code: string | undefined },
});
const props = defineProps<{
  type: any;
  program_id: string;
  programStore: any;
  groupGetOne: {
    id: string;
    name: string;
    abbreviation: string;
    leader_info: {
      id: string;
      first_name: string;
      last_name: string;
    };
    color_info: {
      name: string;
      hex_code: string;
    };
    program_info: {
      id: string;
      title: {
        en: string;
        ru: string;
        uz: string;
      };
    };
  };
  staffStore?: Array<{ value: string; label: string }>;
}>();

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
    },
  ],
  abbreviation: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
    },
  ],
  group_leader_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
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
});

onMounted(() => {
  if (props.groupGetOne && props.type === "edit") {
    ruleForm.group_leader_id = props.groupGetOne.leader_info.id;
    ruleForm.program_id = props.groupGetOne.program_info.id;
    Object.assign(ruleForm, props.groupGetOne);
  }
});

// const submitForm = async (formData: FormInstance | undefined) => {
//   let checkColor = colors.find(
//     (color) => color.hex_code === ruleForm.color_info.hex_code
//   );
//   checkColor
//     ? (ruleForm.color_info = {
//       name: checkColor.name,
//       hex_code: checkColor.hex_code,
//     })
//     : undefined;
//   if (!formData) return;
//   await formData.validate(async (valid, fields) => {
//     if (valid) {
//       if (props.type == "edit") {
//         const data = {
//           ...ruleForm,
//           program_id: ruleForm.program_id,
//           short_name: ruleForm.abbreviation,
//         };
//         emit("onSubmit", {
//           ...data,
//         });
//         showRequestModal.value = false
//       } else {
//         console.log("error submit!", fields);
//       }
//     }
//   });
// };
const submitEditForm = async () => {
  if (!ruleFormRef.value) return;
  await ruleFormRef.value.validate((valid) => {
    if (valid) {
      showRequestModal.value = true;
    } else {
      console.log("Validation failed!");
    }
  });
};
const handleUpdateRequestSubmit = (request: {
  explanation: string;
  files: Array<any>;
}) => {
  let checkColor = colors.find(
    (color) => color.hex_code === ruleForm.color_info.hex_code
  );
  checkColor
    ? (ruleForm.color_info = {
        name: checkColor.name,
        hex_code: checkColor.hex_code,
      })
    : undefined;
  const finalData = {
    ...ruleForm,
    request: {
      explanation: request.explanation,
      files: request?.files,
      type: "group_edit",
    },
    program_id: ruleForm.program_id,
    short_name: ruleForm.abbreviation,
  };
  emit("onSubmit", finalData);
  showRequestModal.value = false;
};
</script>

<style>
.additionalGroup {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #d1d5db !important;
  background: rgba(249, 250, 251, 1);
  width: 100%;
  height: 42px;
  padding: 12px;
  border-radius: 8px;
  border: 1px;
}
</style>

<style lang="scss">
.custom-bg .el-scrollbar .el-scrollbar__wrap {
  background: black !important;
}
</style>
