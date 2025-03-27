<template>
  <el-dialog
    v-model="show"
    :title="title"
    :width="width"
    :before-close="hideModal"
  >
    <div id="modal"></div>
  </el-dialog>
  <router-view />
</template>
<script lang="ts" setup>
import { useModal } from "@/composables";
import { onMounted } from "vue";
import { useGeneralInfoStore, useUsersStore } from "./stores";

const { show, hideModal, title, width } = useModal();

const universityStore = useGeneralInfoStore();
const userStore = useUsersStore();

onMounted(() => {
  if (userStore.user && !universityStore.getUniversity) {
    universityStore.fetchUniversityInfo();
  }
});
</script>
<style lang="scss">
@import "@/assets/styles/colors.scss";
.el-dialog {
  background-color: #f4f5f7 !important;
  border-radius: 16px;

  &__title {
    font-weight: 700;
    font-size: 20px;
    color: #181c25;
  }

  &__close {
    font-size: 20px !important;
    color: #fff !important;
    background-color: $primary !important;
    padding: 2px;
    border-radius: 50%;
  }
  &__body {
    padding-top: 10px !important;
  }
}
</style>
