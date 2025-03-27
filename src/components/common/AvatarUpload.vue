<template>
  <el-upload
    class="avatar-uploader"
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    :auto-upload="false"
    list-type="picture"
    :accept="accept"
    :on-change="onFileChange"
    :on-remove="onRemove"
    :file-list="fileList"
    ref="upload"
  >
    <template #trigger>
      <slot>
        <div v-if="fileList.length" class="avatar-container" @click.stop>
          <img :src="fileList[0].url" class="avatar" />
          <div class="overlay">
            <el-icon class="icon" @click.stop="updatePhoto">
              <Edit />
            </el-icon>
            <el-icon class="icon" @click.stop="removePhoto">
              <DeleteFilled />
            </el-icon>
          </div>
        </div>
        <el-icon
          v-else
          class="el-icon-plus avatar-uploader-icon"
          @click="triggerUpload"
        >
          <UploadFilled />
        </el-icon>
      </slot>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { useFileStore } from "@/stores";
import {
  ElMessage,
  ElMessageBox,
  UploadProps,
  type UploadFile,
  type UploadInstance,
  type UploadUserFile,
} from "element-plus";
import { onMounted, ref, watch } from "vue";

export interface Props {
  accept?: string;
  reset?: any;
}

const props = withDefaults(defineProps<Props>(), {
  accept: ".svg, .png, .jpg, .jpeg",
  reset: false,
});
const emit = defineEmits(["upload", "remove"]);
const fileList = ref<UploadUserFile[]>([]);
const uploadRef = ref<UploadInstance>();
let fileInput: HTMLInputElement | null = null;
const fileStore = useFileStore();
const onFileChange = async (file: any, updatedFileList: any) => {
  const fileURL = URL.createObjectURL(file.raw);
  const result = await fileStore.uploadFile(file.raw as File);
  fileList.value = [file];
  fileList.value = updatedFileList.map((item: any) => ({
    url: fileURL,
  }));
  emit("upload", result);
};
const onRemove = (file: any, updatedFileList: any) => {
  fileList.value = updatedFileList;
  emit("remove");
};
const removePhoto = () => {
  ElMessageBox.confirm(
    "Are you sure you want to delete this photo?",
    "Warning",
    {
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      type: "warning",
    }
  ).then(() => {
    fileList.value = [];
  });
};
const updatePhoto = () => {
  (
    document.querySelector(
      ".avatar-uploader input[type=file]"
    ) as HTMLInputElement
  ).click();
};
const triggerUpload = () => {
  if (fileList.value.length === 0 && fileInput) {
    fileInput.click();
  }
};
onMounted(() => {
  if (uploadRef.value) {
    fileInput = uploadRef.value.$el.querySelector('input[type="file"]');
  }
});

const validate = (file: File): boolean => {
  if ((file.size || 0) / 1024 / 1024 >= 2) {
    ElMessage({
      message: "File size should be less than 2mb",
      type: "error",
    });
    fileList.value = [];
    return false;
  }
  return true;
};
</script>

<style scoped lang="scss">
.avatar-uploader {
  display: inline-block;
  width: 120px;
  height: 120px;
}

.avatar-uploader {
  border: 1px dashed #a2a2a2 !important;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  position: relative;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    border-color: #6941c6 !important;
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #a2a2a2;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;

  &:hover {
    color: #6941c6;
  }
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-container:hover .overlay {
  opacity: 1;
}

.icon {
  color: #fff;
  font-size: 24px;
  margin: 0 10px;
  cursor: pointer;
}

.avatar {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
