<template>
  <div>
    <div v-if="isPdf(fileData?.type)">
      <a :href="pdfUrl" target="_blank" rel="noopener noreferrer">
        <el-button type="primary">Open PDF</el-button>
      </a>
    </div>

    <div v-else-if="isImage(fileData?.type)">
      <img
        :src="imageUrl"
        alt="document image"
        style="cursor: pointer; max-width: 200px; height: auto"
        @click="openImageInNewTab"
      />
    </div>

    <div v-else>
      <em class="text-gray-500 text-sm">No preview available</em>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { ElButton } from "element-plus";

const props = defineProps<{
  fileData: {
    id?: string;
    type?: string;
  } | null;
}>();

const isPdf = (mimeType?: string) => mimeType === "application/pdf";
const isImage = (mimeType?: string) =>
  !!mimeType && mimeType.startsWith("image/");

const pdfUrl = computed(() => {
  if (!props.fileData?.id || !isPdf(props.fileData.type)) return "";

  return `https://test-lms.eduplus.uz/public/static/${props.fileData.id}.pdf`;
});

const imageUrl = computed(() => {
  if (!props.fileData?.id || !isImage(props.fileData.type)) return "";
  let ext = props.fileData.type?.split("/")[1] || "png";

  if (ext === "jpeg") {
    ext = "jpg";
  }

  return `https://test-lms.eduplus.uz/public/static/${props.fileData.id}.${ext}`;
});

const openImageInNewTab = () => {
  if (!imageUrl.value) return;
  window.open(imageUrl.value, "_blank");
};
</script>
