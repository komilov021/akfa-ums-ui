<template>
  <div v-loading="loading" class="mt-6">
    <div v-if="fileUrl">
      <div class="flex items-center justify-end gap-2">
        <!-- <el-button type="primary" size="large" @click="regeneratePdf">Regenerate</el-button> -->
        <el-button type="primary" size="large" @click="printPdf"
          >Print</el-button
        >
        <el-button type="primary" size="large" @click="download"
          >Download</el-button
        >
      </div>
      <div class="border-red-600 border mt-6">
        <vue-pdf-embed :source="fileUrl" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTranscriptStore, useFileStore } from "@/stores";
import { saveFile } from "@/utils/common";
import { onMounted, computed, ref } from "vue";
import VuePdfEmbed from "vue-pdf-embed";
import { useRoute } from "vue-router";

const route = useRoute();

const transcriptsStore = useTranscriptStore();
const fileStore = useFileStore();
const fileUrl = ref<string>("");
const loading = ref(false);

const transcript = computed(() => transcriptsStore.transcript);

onMounted(async () => {
  try {
    loading.value = true;
    // await transcriptsStore.getTranscript(route.params.id as string);
    await generatePdf();
    await downloadFile();
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error.message);
  }
});

const generatePdf = async () => {
  await transcriptsStore.generate(route.params.id as string);
  await transcriptsStore.getTranscript(route.params.id as string);
};

const downloadFile = async () => {
  if (transcript.value) {
    const data = await fileStore.downloadById(transcript.value.pdf?.id);
    fileUrl.value = URL.createObjectURL(data);
  }
};

const regeneratePdf = async () => {
  try {
    loading.value = true;
    await generatePdf();
    await downloadFile();
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error.message);
  }
};

const printPdf = () => {
  const iframe = document.createElement("iframe") as any;
  document.body.appendChild(iframe);

  iframe.style.display = "none";
  iframe.src = fileUrl.value;
  iframe.onload = function () {
    setTimeout(function () {
      iframe.focus();
      iframe.contentWindow.print();
    }, 1);
  };
};

const download = () => {
  saveFile(fileUrl.value as any, "FileName" + new Date() + ".pdf", true);
};
</script>

<style scoped></style>
