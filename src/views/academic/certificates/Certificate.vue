<template>
  <div v-loading="loading" class="mt-6">
    <div v-if="fileUrl">
      <div class="flex items-center justify-end gap-2">
        <el-button
          class="!text-[#44444F] !border-[#44444F] !h-[49px] !w-[110px]"
          size="large"
          @click="download"
          >Download</el-button
        >
        <el-button
          type="primary"
          size="large"
          class="!bg-[#6941C6] !h-[49px] !w-[110px]"
          @click="printPdf"
          >Print</el-button
        >
      </div>
      <div class="max-w-[595px] 2xl:max-w-screen-lg mt-6 mx-auto">
        <vue-pdf-embed :source="fileUrl" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line vue/multi-word-component-names
import { useFileStore } from "@/stores";
import { onMounted, ref } from "vue";
import VuePdfEmbed from "vue-pdf-embed";
import { useRoute } from "vue-router";

const route = useRoute();

const fileStore = useFileStore();
const fileUrl = ref<string>("");
const loading = ref(false);

onMounted(async () => {
  try {
    loading.value = true;
    await downloadFile();
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error.message);
  }
});

const downloadFile = async () => {
  const data = await fileStore.downloadById(route.params.id as string);
  fileUrl.value = URL.createObjectURL(data);
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
  const link = document.createElement("a");
  link.href = fileUrl.value;
  link.download = "FileName" + new Date() + ".pdf";
  link.click();
};
// eslint-disable-next-line vue/multi-word-component-names
</script>

<style scoped></style>
