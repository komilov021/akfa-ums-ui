<template>
  <div
    class="elective-course-lesson-detail-wrapper flex items-center justify-between mb-10"
  >
    <h4 class="text-xl font-semibold text-[#101828]">
      {{ DIALOG_TITLE.intro_video }}
    </h4>
    <div class="flex">
      <el-button @click="onClickToggleDialog(DIALOG_TITLE.intro_video)">
        <Plus class="w-5 h-5 mr-2"></Plus>
        Add Lesson Content
      </el-button>
      <el-button @click="onClickEditLessonContent(DIALOG_TITLE.intro_video)">
        <Edit class="w-5 h-5 mr-2"></Edit>
        Edit Lesson Content
      </el-button>
    </div>
  </div>
  <div
    class="elective-course-lesson-detail-tab flex flex-col justify-center mb-5"
  >
    <el-tabs v-model="viewOnlyActiveTab" type="border-card">
      <el-tab-pane
        v-for="field of textareaFields"
        :key="field.value"
        :label="field.text"
        :name="field.value"
      >
        <div class="flex flex-col h-48">
          <p
            v-if="lessonSubModules[field.value]"
            v-html="lessonSubModules[field.value]"
          ></p>
          <p v-else class="mt-5 text-black">No {{ field.text }}</p>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Intro video" name="intro_video">
        <el-link
          v-if="introVideo"
          class="text-xl"
          type="primary"
          :href="introVideoUrl"
          target="_blank"
          >Open the intro video <el-icon><Link /></el-icon
        ></el-link>
        <p v-else class="mt-5 text-black">No Intro Video</p>
      </el-tab-pane>
      <el-tab-pane label="Notes" name="notes">
        <p
          v-if="lessonSubModules.notes"
          class="mt-5 text-black"
          v-html="markedContent(lessonSubModules.notes)"
        ></p>
        <p v-else class="mt-5 text-black">No notes</p>
      </el-tab-pane>
    </el-tabs>
  </div>
  <div
    class="elective-course-lesson-detail-wrapper flex items-center justify-between"
  >
    <h4 class="text-xl font-semibold text-[#101828]">
      {{ DIALOG_TITLE.sub_modules }}
    </h4>
    <div class="flex">
      <el-button @click="onClickToggleDialog(DIALOG_TITLE.sub_modules)">
        <Plus class="w-5 h-5 mr-2"></Plus>
        Add sub-module
      </el-button>
    </div>
  </div>
  <div class="elective-course-lesson-detail-table mt-5">
    <el-table
      :data="lessonSubModules?.sub_modules"
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
      <el-table-column label="Operations" align="center">
        <template #default="scope">
          <div class="flex justify-center space-x-3">
            <Edit
              class="h-4 w-4 text-green-500 cursor-pointer"
              @click="
                onClickEditLessonSubModule(scope.row.lesson_sub_module_id)
              "
            />
            <Delete
              v-if="!scope.row.is_active"
              class="h-4 w-4 text-primary cursor-pointer"
              @click="
                onClickDeleteLessonSubModule(scope.row.lesson_sub_module_id)
              "
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
      <h2 class="text-lg font-semibold text-[#111928]">{{ dialogTitle }}</h2>
    </template>
    <div class="elective-course-lesson-dialog-body">
      <el-select
        v-if="!isDialogIntroVideo"
        filterable
        v-model="ruleForm.ai_module_files_id"
        class="w-full"
        placeholder="Sub Module"
        size="large"
      >
        <el-option
          v-for="(item, i) in allAiModuleFiles"
          :key="i"
          :label="item.title"
          :value="item.id"
        />
      </el-select>
      <div v-else class="flex flex-col">
        <el-tabs v-model="activeTab" type="card" @tab-change="onClickTabChange">
          <el-tab-pane
            v-for="(field, index) of textareaFields"
            :key="index"
            :label="field.text"
            :name="field.value"
          >
            <div class="flex flex-col h-60">
              <QuillEditor
                :id="`custom-id-editor-${field.value}`"
                v-model:content="ruleForm[activeTab]"
                contentType="html"
                :toolbar="toolbarOptions"
                theme="snow"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="Notes" name="notes">
            <el-button
              :disable="loader"
              :loading="loader"
              @click="onClickGenerateNote()"
            >
              Generate note
            </el-button>

            <p
              class="mt-5 text-black"
              v-html="markedContent(ruleForm.notes)"
            ></p>
          </el-tab-pane>
        </el-tabs>
        <AppUpload
          class="mt-10"
          @upload="(data) => (ruleForm.intro_video = data)"
          @remove="() => (ruleForm.intro_video = null)"
          @load="(isLoading) => (loaderSaveBtn = isLoading)"
          :reset="isDialogVisible"
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
      </div>
    </div>
    <div class="dialog-footer w-full flex gap-4 mt-8">
      <el-button @click="onClickToggleDialog" class="w-full">Cancel</el-button>
      <el-button
        type="primary"
        class="w-full"
        @click="onClickCreateSubModule()"
        :disabled="loaderSaveBtn"
      >
        Save
      </el-button>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { onMounted, ref, reactive, computed } from "vue";
import { useTimetableStore, useAiModuleFilesStore } from "@/stores";
import { useRoute } from "vue-router";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import AppUpload from "@/components/common/AppUpload.vue";
import { originUrl } from "@/utils/constants";
import { Link } from "@element-plus/icons-vue";
import { markedContent } from "@/utils/common";

const DIALOG_TITLE = {
  intro_video: "Lesson Content",
  sub_modules: "Sub-Modules",
};

const route = useRoute();
const timetableStore = useTimetableStore();
const aiModuleFilesStore = useAiModuleFilesStore();
const isDialogVisible = ref(false);
const isLessonSubModuleEdit = ref(false);
const dialogTitle = ref("");
const loader = ref(false);
const loaderSaveBtn = ref(false);
const lessonId = route.params?.lesson_id as string;
const textareaFields = [
  {
    value: "introduction",
    text: "Introduction",
  },
  {
    value: "table_of_content",
    text: "Table of Content",
  },
  {
    value: "learning_objectives",
    text: "Learning objectives",
  },
] as const;

const activeTab = ref(textareaFields[0].value);
const viewOnlyActiveTab = ref(textareaFields[0].value);

const ruleForm = reactive({
  introduction: null,
  table_of_content: null,
  learning_objectives: null,
  ai_module_files_id: "",
  sub_module_id: "",
  lesson_id: lessonId,
  intro_video: null,
  notes: "",
});

const toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  [{ color: [] }, { background: [] }],
  ["link"],
];

const allAiModuleFiles = computed(() => aiModuleFilesStore.aiModuleFiles);

const lessonSubModules = computed(() => timetableStore.lessonSubModules);

const lessonSubModule = computed(() => timetableStore.lessonSubModule);

const introVideo = computed(() => lessonSubModules.value.intro_video);

const introVideoUrl = computed(
  () => `${originUrl}/public/videos/${introVideo.value?.id}/original.mp4`
);

const isDialogIntroVideo = computed(
  () => dialogTitle.value === DIALOG_TITLE.intro_video
);

const onClickTabChange = () => {
  if (!ruleForm[activeTab.value]) {
    const element = document.querySelector(
      "#custom-id-editor-introduction > .ql-editor > p"
    )!;
    element.textContent = "";
  }
};

const onClickGenerateNote = async () => {
  loader.value = true;
  const content: string = lessonSubModules.value.sub_modules?.reduce(
    (acc: string, submodule: any) => (acc += submodule.topic_content),
    ""
  );
  ruleForm.notes = await timetableStore.createNote(lessonId, content);
  loader.value = false;
};

const onClickToggleDialog = (title: string): void => {
  dialogTitle.value = title;
  isDialogVisible.value = !isDialogVisible.value;
};

const onClickEditLessonContent = async (title: string): Promise<void> => {
  onClickToggleDialog(title);

  await timetableStore.fetchLessonSubModules(lessonId);

  const {
    sub_modules,
    intro_video,
    introduction,
    table_of_content,
    learning_objectives,
    notes,
  } = timetableStore.lessonSubModules;

  ruleForm.intro_video = intro_video;
  ruleForm.introduction = introduction;
  ruleForm.table_of_content = table_of_content;
  ruleForm.learning_objectives = learning_objectives;
  ruleForm.notes = notes;
};

const resetForm = () => {
  ruleForm.introduction = null;
  ruleForm.table_of_content = null;
  ruleForm.learning_objectives = null;
  ruleForm.ai_module_files_id = "";
  ruleForm.lesson_id = lessonId;
  ruleForm.intro_video = null;
  ruleForm.notes = "";
  isLessonSubModuleEdit.value = false;
};

const onClickCreateSubModule = async () => {
  if (isDialogIntroVideo.value) {
    await timetableStore.updateIntroVideoOfEvent(ruleForm.lesson_id, ruleForm);
  } else {
    isLessonSubModuleEdit.value
      ? await timetableStore.updateSubModule(ruleForm.sub_module_id, ruleForm)
      : await timetableStore.createLessonSubModule(ruleForm);
  }
  onClickToggleDialog("");
  resetForm();
  await timetableStore.fetchLessonSubModules(lessonId);
};

const onClickDeleteLessonSubModule = async (id: string) => {
  await timetableStore.deleteLessonSubModule(id);
  await timetableStore.fetchLessonSubModules(lessonId);
};

const onClickEditLessonSubModule = async (id: string) => {
  ruleForm.sub_module_id = id;
  isLessonSubModuleEdit.value = true;
  await timetableStore.fetchLessonSubModule(id);
  ruleForm.ai_module_files_id = lessonSubModule.value.ai_module_files_id;
  onClickToggleDialog(DIALOG_TITLE.sub_modules);
};

onMounted(async () => {
  await timetableStore.fetchLessonSubModules(lessonId);
  await aiModuleFilesStore.fetchAiModuleFiles();
});
</script>

<style lang="scss">
.elective-course-lesson-detail-tab {
  .el-tabs--border-card > .el-tabs__content {
    max-height: 300px !important;
    overflow-y: auto !important;
  }
}
</style>
