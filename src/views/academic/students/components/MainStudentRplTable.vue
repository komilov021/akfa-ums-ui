<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <div class="flex flex-col">
        <h1 class="text-text-900 font-semibold text-xl">RPL</h1>
        <p class="text-tertiary-600">RPL(Recognition of Prior Learning)</p>
      </div>
      <el-button size="large" type="primary" @click="openCreateRpl"
        >Add</el-button
      >
    </div>
    <div>
      <div
        v-if="hasStudentRpltranscripts"
        class="grid grid-cols-1 xl:grid-cols-2 md:grid-cols-1 gap-4"
      >
        <div
          v-for="transcript of studentRpltranscripts"
          :key="transcript.id"
          class="text-sm w-full"
        >
          <div
            class="w-full border-[2px] font-medium border-black text-[#182857]"
          >
            <div
              class="flex w-full border-b-2 border-black text-white font-semibold bg-[#182857] items-center"
            >
              <h1 class="w-3/4 border-r-2 border-r-black pl-2">
                {{ transcript.title }}<br />
                Course title
              </h1>
              <div class="flex gap-10 mx-auto">
                <h1>GR</h1>
                <h1>CR</h1>
              </div>
            </div>
            <div
              class="flex items-center text-[15.3px]"
              v-for="item of transcript.courses"
              :key="item.subject"
            >
              <div
                class="w-3/4 h-9 flex items-center truncate border-r-2 border-r-black pl-2"
              >
                {{ item.subject }}
              </div>
              <div class="flex gap-10 mx-auto">
                <h1 class="w-6">{{ item.grade }}</h1>
                <h1>{{ item.credit }}</h1>
              </div>
            </div>
            <div class="flex items-center border-t-2 border-black">
              <div
                class="flex pl-2 w-3/4 h-8 font-semibold items-center gap-32"
              >
                <span>AC: {{ transcript.all_credits }}</span>
                <span>TS: {{ transcript.ts }}</span>
                <span>GPA: {{ transcript.overall_gpa }}</span>
              </div>
              <div class="flex gap-10 mx-auto">
                <div>
                  <EditPen
                    @click="openEditeRpl(transcript)"
                    id="edit"
                    class="w-[18px] cursor-pointer"
                  />
                </div>
                <div>
                  <Delete
                    @click="deletedRpl(transcript.id)"
                    class="w-[18px] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="mt-24">
        <el-empty description="No Data" />
      </div>
    </div>
    <el-dialog
      v-model="showModal"
      :title="
        formType == 'edit'
          ? 'Edit form'
          : formType == 'create'
          ? 'Create Form'
          : 'Delete form'
      "
    >
      <StudentRplDialog
        v-if="showModal"
        :type="formType"
        :semester="groupStore.getSemestrs"
        :grade="gpaGrades"
        :rpltranscriptsForm="currentTranscript"
        :student_id="props.student_id"
        @on-submit="FromRplToRequest($event)"
      />
    </el-dialog>
    <el-dialog
      v-model="showRequestModal"
      width="45vw"
      :title="
        formType == 'edit'
          ? 'Edit required'
          : formType == 'create'
          ? 'Create required'
          : 'Delete required'
      "
    >
      <UpdateRequestDialog
        @on-submit="
          formType === 'delete' ? onDeleteRpl($event) : submitForm($event)
        "
      />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import { useGroupStore, useTranscriptStore } from "@/stores";
import type { ITranscriptRpl } from "@/models/backend";
import { onMounted, computed, ref, reactive } from "vue";
import { EditPen, Delete } from "@element-plus/icons-vue";
import { gpaGrades } from "@/utils/constants";
import { useModal } from "@/composables";
import StudentRplDialog from "./StudentRplDialog.vue";
import UpdateRequestDialog from "@/components/common/UpdateRequestDialog.vue";

const i18n = useI18n();
const groupStore = useGroupStore();
const transcriptsStore = useTranscriptStore();

const formType = ref<"create" | "edit" | "delete">("create");
const modalType = ref<"required" | "rpl">();
const showModal = ref(false);
const showRequestModal = ref(false);
const currentTranscript = ref<any>();
const rplId = ref<string | null>(null);
const loading = ref(false);

const props = defineProps<{
  student_id: any;
}>();

const studentRpltranscripts = computed(
  () => transcriptsStore?.transcriptRplList
);
const hasStudentRpltranscripts = computed(() => {
  return (
    studentRpltranscripts.value !== null &&
    studentRpltranscripts.value.length > 0
  );
});

function FromRplToRequest(data: any) {
  currentTranscript.value = data;
  showModal.value = false;
  showRequestModal.value = true;
}

const submitForm = async (request: any) => {
  const data = {
    ...currentTranscript.value,
    request,
  };

  try {
    loading.value = true;
    if (formType.value === "edit") {
      data.request["type"] = "rpl_edit";
      await transcriptsStore.updateTranscriptRpl(data);
      ElMessage({
        message: i18n.t("shared.updated"),
        type: "success",
      });
    } else {
      data.request["type"] = "rpl_insert";
      await transcriptsStore.createTranscriptRpl(data);
      ElMessage({
        message: i18n.t("shared.created"),
        type: "success",
      });
    }
    transcriptsStore.fetchListRpl(props.student_id);
    loading.value = false;
    showRequestModal.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};

function deletedRpl(id: string) {
  ElMessageBox.confirm(
    "This action cannot be undone. Continue?",
    i18n.t("shared.warning"),
    {
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      type: "warning",
      center: true,
    }
  ).then(async () => {
    rplId.value = id;
    formType.value = "delete";
    showRequestModal.value = true;
  });
}

function openEditeRpl(transcriptRpl: ITranscriptRpl) {
  currentTranscript.value = JSON.parse(JSON.stringify(transcriptRpl));
  formType.value = "edit";
  showModal.value = true;
}

function openCreateRpl() {
  formType.value = "create";
  modalType.value = "rpl";
  showModal.value = true;
}

async function onDeleteRpl(request: any) {
  try {
    request["type"] = "rpl_remove";
    await transcriptsStore.removeTranscriptRpl({
      request,
      id: rplId.value as string,
    });
    ElMessage({
      message: i18n.t("shared.updated"),
      type: "success",
    });
    transcriptsStore.fetchListRpl(props.student_id);
    loading.value = false;
    showRequestModal.value = false;
  } catch (error: any) {
    console.log("Error", error?.message);
    loading.value = false;
  }
}
</script>

<style scoped></style>
