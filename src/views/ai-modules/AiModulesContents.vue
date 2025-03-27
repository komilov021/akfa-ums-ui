<template>
  <div class="ai-modules-content-wrapper flex items-center justify-between">
    <h4 class="text-xl font-semibold text-[#101828]">AI module contents</h4>
    <div class="flex">
      <el-button @click="onClickOpenDialog()">
        <Plus class="w-5 h-5 mr-2"></Plus>
        Add content
      </el-button>
    </div>
  </div>
  <div class="ai-modules-content-body mt-5">
    <el-table
      :data="aiModuleFiles"
      empty-text="No content is added"
      row-class-name="noHover"
      class="whiteStripe"
      style="width: 100%"
    >
      <el-table-column type="index" label="№" width="50" align="left" />
      <el-table-column
        prop="title"
        label="Title"
        min-width="300"
        align="center"
      />
      <el-table-column
        prop="topic_content"
        label="Topic Content"
        min-width="300"
        show-overflow-tooltip
        align="center"
      >
      </el-table-column>
      <el-table-column label="Operations" align="center">
        <template #default="scope">
          <div class="flex justify-center space-x-3">
            <Edit
              class="h-4 w-4 text-green-500 cursor-pointer"
              @click="onClickEditAiModuleFile(scope.row.id)"
            />
            <Delete
              v-if="!scope.row.is_active"
              class="h-4 w-4 text-primary cursor-pointer"
              @click="onClickDeleteAiModuleFile(scope.row.id)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog
    v-model="isDialogVisible"
    width="700px"
    class="custom-dialog"
    @close="isDialogVisible = false"
  >
    <template #header>
      <h2 class="text-lg font-semibold text-[#111928]">AI content</h2>
    </template>
    <div class="ai-module-dialog-body-wrapper">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-position="top"
        require-asterisk-position="right"
      >
        <div class="grid sm:grid-cols-1 gap-y-1">
          <el-form-item label="Title" prop="title">
            <el-input
              v-model="ruleForm.title"
              type="title"
              autocomplete="off"
              placeholder="Dental Math 3"
              class="!text-xs"
            />
          </el-form-item>
          <el-form-item label="Topic content" prop="topic_content">
            <el-input
              type="textarea"
              placeholder="This lecture is about"
              :rows="6"
              resize="none"
              v-model="ruleForm.topic_content"
            />
          </el-form-item>
          <el-form-item label="Presentation" prop="presentation">
            <AppUpload
              @upload="(data) => (ruleForm.presentation = data)"
              @remove="() => (ruleForm.presentation = null)"
              :reset="isDialogVisible"
              name="presentation"
              list-type="picture"
              accept=".pdf"
              :is-file-public="true"
            >
              <div
                class="bg-white min-w-[669px] h-[126px] rounded-lg flex items-center text-center justify-center border"
              >
                <div class="flex flex-col items-center">
                  <UploadFile class="mb-2" />
                  <h1>
                    <span class="text-primary font-semibold">
                      Click to upload
                    </span>
                    or drag and drop
                  </h1>
                  <h1>PDF</h1>
                </div>
              </div>
            </AppUpload>

            <p v-if="aiModuleFile?.presentation?.id">
              Presentation Link:
              <a :href="presentationUrl" target="_blank">Open Presentation</a>
            </p>
          </el-form-item>
          <el-form-item label="Avatar video" prop="avatar_video">
            <AppUpload
              @upload="(data) => (ruleForm.avatar_video = data)"
              @remove="() => (ruleForm.avatar_video = null)"
              :reset="isDialogVisible"
              name="avatar_video"
              list-type="picture"
              accept="video/*"
              :is-file-public="true"
            >
              <div
                class="bg-white min-w-[669px] h-[126px] rounded-lg flex items-center text-center justify-center border"
              >
                <div class="flex flex-col items-center">
                  <UploadFile class="mb-2" />
                  <h1>
                    <span class="text-primary font-semibold">
                      Click to upload
                    </span>
                    or drag and drop
                  </h1>
                </div>
              </div>
            </AppUpload>

            <p v-if="isAvatarVideoUrlDisplayed">
              Video Link:
              <a :href="avatarVideoUrl" target="_blank">Open Avatar Video</a>
            </p>
          </el-form-item>
          <el-form-item label="Video Transcript *">
            <div class="video-transcript-wrapper w-full">
              <div class="header flex flex-row items-center gap-4">
                <p class="font-medium text-sm text-[#9ca3af] mb-0 w-[80px]">
                  №
                </p>
                <p class="font-medium text-sm text-[#9ca3af] mb-0 w-[220px]">
                  From
                </p>
                <p class="font-medium text-sm text-[#9ca3af] mb-0 w-[220px]">
                  To
                </p>
                <p class="font-medium text-sm text-[#9ca3af] mb-0 w-[120px]">
                  Actions
                </p>
              </div>
              <div
                v-for="(time_code, index) of ruleForm.time_codes"
                :key="index"
                class="timeslape-per-page flex flex-row items-center gap-4 mt-4"
              >
                <p class="font-medium text-lg text-[#9ca3af] mb-0 w-[80px]">
                  {{ index + 1 }}
                </p>
                <el-form-item class="!mb-0 w-[220px]">
                  <el-input
                    v-model="time_code.from"
                    type="text"
                    size="small"
                    v-mask="'##:##'"
                    placeholder="From"
                    @change="(val:any) => timeChange(val, 'start',index)"
                  />
                </el-form-item>
                <el-form-item class="!mb-0 w-[220px]">
                  <el-input
                    v-model="time_code.to"
                    type="text"
                    size="small"
                    v-mask="'##:##'"
                    placeholder="To"
                    @change="(val:any) => timeChange(val, 'end', index)"
                  />
                </el-form-item>
                <div class="w-[120px]">
                  <el-button
                    type="danger"
                    :icon="Delete"
                    circle
                    class="w-[67px]"
                    :disabled="isRemoveButtonDisabled"
                    @click="onClickRemoveTranscript(index)"
                  />
                </div>
              </div>
              <el-button
                type="primary"
                class="w-full mt-7"
                @click="onClickAddTranscript()"
              >
                Add
              </el-button>
            </div>
          </el-form-item>
          <h4 class="font-semibold text-black *">Flashcards</h4>
          <el-collapse accordion v-if="ruleForm.flashcards?.length">
            <el-collapse-item
              v-for="(flashcard, index) of ruleForm?.flashcards"
              :key="index"
              :name="index + 1"
            >
              <template #title>
                <p class="mx-5">{{ flashcard.question }}</p>
              </template>
              <div class="p-5">
                {{ flashcard.answer }}
              </div>
            </el-collapse-item>
          </el-collapse>
          <p v-else>No flashcard is generated yet</p>
          <el-button
            type="primary"
            class="w-full mt-7"
            @click="onClickGenerateFlashcard()"
            :disabled="loader"
            :loading="loader"
          >
            Generate flashcard
          </el-button>
        </div>
      </el-form>
    </div>
    <div class="dialog-footer w-full flex gap-4 mt-8">
      <el-button @click="onClickOpenDialog" class="w-full">Cancel</el-button>
      <el-button
        type="primary"
        class="w-full"
        @click="submitForm(ruleFormRef)"
        :disabled="disableSaveBtn"
      >
        Save
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage, dayjs } from "element-plus";
import AppUpload from "@/components/common/AppUpload.vue";
import UploadFile from "@/components/icons/Upload.vue";
import { useAiModuleFilesStore } from "@/stores/ai-modules";
import { Delete, Edit } from "@element-plus/icons-vue";
import { baseUrl } from "@/utils/common";
import { FileUploadJobStatus } from "@/models/backend/ai-module-files.model";

const aiModuleFilesStore = useAiModuleFilesStore();
const isDialogVisible = ref(false);
const loader = ref(false);
const updateAiContentId = ref("");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  title: "",
  presentation: null,
  avatar_video: null,
  topic_content: "",
  time_codes: [{ from: "", to: "" }],
  flashcards: [] as any,
});

const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: "Title is required",
      trigger: "blur",
    },
  ],
  topic_content: [
    {
      required: true,
      message: "Topic content is required",
      trigger: "blur",
    },
  ],
  presentation: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        if (!value || value?.length === 0) {
          callback(new Error("Please upload a file."));
        } else {
          callback();
        }
      },
      trigger: ["blur", "change"],
    },
  ],
  avatar_video: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        if (!value || value?.length === 0) {
          callback(new Error("Please upload a file."));
        } else {
          callback();
        }
      },
      trigger: ["blur", "change"],
    },
  ],
});

const resetForm = () => {
  ruleForm.title = "";
  ruleForm.presentation = null;
  ruleForm.avatar_video = null;
  ruleForm.topic_content = "";
  ruleForm.time_codes = [{ from: "", to: "" }];
  ruleForm.flashcards = [];
  updateAiContentId.value = "";
};

const isRemoveButtonDisabled = computed(() => {
  return ruleForm.time_codes?.length === 1;
});
const aiModuleFiles = computed(() => aiModuleFilesStore.aiModuleFiles);
const aiModuleFile = computed(() => aiModuleFilesStore.aiModuleFile);
const disableSaveBtn = computed(() => {
  return loader.value;
});
const avatarVideoUrl = computed(
  () =>
    `${baseUrl.origin}/public/videos/${
      aiModuleFile.value.avatar_video?.id
    }/original.${aiModuleFile.value.avatar_video?.type.split("/")[1]}`
);
const presentationUrl = computed(
  () =>
    `${baseUrl.origin}/public/static/${aiModuleFile.value.presentation?.id}.${
      aiModuleFile.value.presentation?.type.split("/")[1]
    }`
);
const isAvatarVideoUrlDisplayed = computed(
  () =>
    aiModuleFile.value?.file_upload_job_status === FileUploadJobStatus.completed
);

const onClickOpenDialog = () => {
  isDialogVisible.value = !isDialogVisible.value;
  resetForm();
};

// const onEmitUploadFile = (
//   file: any,
//   fileProp: "avatar_video" | "presentation"
// ) => {
//   ruleForm[fileProp] = file;
//   console.log(fileProp);
//   ruleFormRef.value?.validate();
// };

const onClickGenerateFlashcard = async () => {
  loader.value = true;
  ruleForm.flashcards = await aiModuleFilesStore.createFlashcards(
    "",
    ruleForm.topic_content
  );
  loader.value = false;
};

const onClickAddTranscript = () => {
  ruleForm.time_codes.push({
    from: "",
    to: "",
  });
};

const onClickEditAiModuleFile = async (id: string) => {
  onClickOpenDialog();
  updateAiContentId.value = id;
  await aiModuleFilesStore.fetchAiModuleFile(id);

  ruleForm.title = aiModuleFile.value.title;
  ruleForm.presentation = aiModuleFile.value.presentation;
  ruleForm.avatar_video = aiModuleFile.value.avatar_video;
  ruleForm.topic_content = aiModuleFile.value.topic_content;
  ruleForm.time_codes = aiModuleFile.value.time_codes?.length
    ? aiModuleFile.value.time_codes
    : ruleForm.time_codes;
  ruleForm.flashcards = aiModuleFile.value.flashcards;
};

const onClickDeleteAiModuleFile = async (id: string) => {
  await aiModuleFilesStore.deleteAiModuleFile(id);
  await aiModuleFilesStore.fetchAiModuleFiles();
};

const onClickRemoveTranscript = (index: number) => {
  if (ruleForm.time_codes?.length > 1) {
    ruleForm.time_codes.splice(index, 1);
  }
};

const timeChange = (val: any, type: string, index: number) => {
  if (val) {
    if (type == "start") {
      ruleForm.time_codes[index].from = dayjs(val, "HH:mm").format("HH:mm");
    } else if (type == "end") {
      ruleForm.time_codes[index].to = dayjs(val, "HH:mm").format("HH:mm");
    }
    // if (ruleForm.start_time === ruleForm.end_time) {
    //   ruleForm.start_time = "";
    //   ruleForm.end_time = "";
    //   ElMessage({
    //     message: "Start time and end time cannot be the same.",
    //     type: "warning",
    //   });
    // }
  }
};

const submitForm = async (formEl: FormInstance | undefined) => {
  console.log(ruleForm);
  if (!formEl) return;

  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (updateAiContentId.value) {
        await aiModuleFilesStore.updateAiModuleFile(
          updateAiContentId.value,
          ruleForm
        );
      } else {
        await aiModuleFilesStore.createAiModuleFiles(ruleForm);
      }
      onClickOpenDialog();
      await aiModuleFilesStore.fetchAiModuleFiles();

      ElMessage({
        message: `Successfully ${
          updateAiContentId.value ? "updated" : "created"
        }`,
        type: "success",
        duration: 5 * 1000,
      });
    } else {
      console.log("error submit!", fields);
      ElMessage({
        message: "Fill left fields",
        type: "error",
        duration: 5 * 1000,
      });
    }
  });
};

onMounted(async () => {
  await aiModuleFilesStore.fetchAiModuleFiles();
});
</script>
