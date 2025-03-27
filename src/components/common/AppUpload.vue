<template>
  <el-upload
    ref="uploadRef"
    :class="'upload-demo ' + props.name"
    :limit="2"
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    :auto-upload="false"
    list-type="picture"
    :accept="props.accept"
    :on-change="onFileChange"
    :on-remove="onRemove"
    :file-list="fileList"
    v-loading="loadingInstance"
  >
    <template #trigger>
      <slot>
        <el-button :icon="Plus" type="primary" plain size="large">
          Upload File
        </el-button>
      </slot>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { useFileStore } from "@/stores";
import { Plus } from "@element-plus/icons-vue";
import {
  ElLoading,
  ElMessage,
  type UploadFile,
  type UploadInstance,
  type UploadUserFile,
} from "element-plus";
import { LoadingInstance } from "element-plus/es/components/loading/src/loading";
import { ref, watch } from "vue";

export interface Props {
  accept?: string;
  reset?: any;
  isFilePublic?: boolean;
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  accept: ".xlsx, .xls",
  reset: false,
  isFilePublic: false,
  /**
   * if AppUpload is used more than once in one form,
   * unique name should be passed to the component,
   * in order to render loading to specific container.
   */
  name: "",
});

const emit = defineEmits(["upload", "remove", "load"]);
const fileList = ref<UploadUserFile[]>([]);
const uploadRef = ref<UploadInstance>();
const fileStore = useFileStore();
const loadingOptions = {
  lock: true,
  target: props.name ? `.${props.name}` : ".upload-demo",
};
const loadingInstance = ref<LoadingInstance | null>(null);

const onFileChange = async (file: UploadFile, _fileList: UploadFile[]) => {
  // if ((file.size || 0) / 1024 / 1024 >= 2) {
  //   ElMessage({
  //     message: "File size should be less than 2mb",
  //     type: "error",
  //   });
  //   fileList.value = [];
  //   return;
  // }
  startLoading();

  if (_fileList.length > 1) {
    uploadRef.value?.handleRemove(_fileList[0]);
  }

  const result = props.isFilePublic
    ? await fileStore.uploadFileToPublic(file.raw as File)
    : await fileStore.uploadFile(file.raw as File);

  fileList.value = [file];
  stopLoading();
  emit("upload", result);
};

const startLoading = () => {
  if (!loadingInstance.value) {
    emit("load", true);
    loadingInstance.value = ElLoading.service(loadingOptions);
  }
};

const stopLoading = () => {
  if (loadingInstance.value) {
    emit("load", false);
    loadingInstance.value.close();
    loadingInstance.value = null;
  }
};

const onRemove = () => {
  fileList.value = [];
  emit("remove");
};

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
watch(
  () => props.reset,
  (val) => {
    onRemove();
  }
);
</script>

<style scoped></style>
