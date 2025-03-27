<template>
  <div class="relative">
    <AppUpload @upload="(data) => (file = data)" accept="image/*">
      <el-button type="primary" size="large"> Upload logo </el-button>
    </AppUpload>
    <el-button
      class="absolute top-0 left-32"
      type="primary"
      color="#0BA5EC"
      size="large"
      @click="submit"
      >Submit</el-button
    >
  </div>
</template>

<script setup lang="ts">
import AppUpload from "@/components/common/AppUpload.vue";
import { useGeneralInfoStore } from "@/stores";
import { ElMessage } from "element-plus";
import { ref } from "vue";
const universityStore = useGeneralInfoStore();
const file = ref();

const emit = defineEmits(["onUsert"]);

const submit = async () => {
  if (!file.value) {
    ElMessage({
      message: "Upload file",
      type: "error",
    });
    return;
  }
  try {
    await universityStore.upsertUniversityInfo({
      ...universityStore.university,
      logo: file.value,
    });
    emit("onUsert");
    ElMessage({
      message: "File uploaded",
      type: "success",
    });
  } catch (error: any) {
    console.log("error", error.message);
  }
};
</script>

<style scoped></style>
