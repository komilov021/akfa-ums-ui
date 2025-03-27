<template>
  <div>
    <div class="h-[562px] w-full flex items-center justify-center pb-10">
      <div class="text-center">
        <img
          class="w-72 h-72 mx-auto"
          src="@/assets/images/holiday.png"
          alt=""
        />
        <h6 class="mt-6 font-semibold text-lg">{{ props.holiday?.title }}</h6>
        <p class="text-gray-400 text-sm max-w-[500px] mx-auto mt-0.5">
          Enjoy a well-deserved break to relax, recharge, and create lasting
          memories with family. Happy holidays!
        </p>
        <el-button
          size="large"
          :icon="EditPen"
          class="mt-6 !text-[#1F2A37] hover:!text-primary"
          @click="holidayForm = true"
        >
          {{ dialogTitle }}
        </el-button>
      </div>
    </div>
    <el-dialog
      class="custom-dialog"
      :title="dialogTitle"
      width="604px"
      v-model="holidayForm"
      v-loading="loading"
    >
      <HolidayForm
        @close-dialog="holidayForm = false"
        @submit-success="handleFormSubmit"
        :holiday="props.holiday"
        v-if="holidayForm"
      />
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { EditPen } from "@element-plus/icons-vue";
// @ts-ignore
import HolidayForm from "../forms/HolidayForm.vue";
import { computed, ref } from "vue";
const props = defineProps(["holiday"]);
const loading = ref(false);
const holidayForm = ref(false);
const dialogTitle = computed(() => {
  return props.holiday ? "Edit Holiday" : "Add Holiday";
});
const emit = defineEmits(["onFetch"]);
function handleFormSubmit(data: any) {
  if (data.closeDialog) {
    holidayForm.value = false;
  }
  emit("onFetch");
}
</script>
