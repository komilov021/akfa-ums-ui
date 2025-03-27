<template>
  <div>
    <el-button size="large" type="primary" class="mt-8">
      View template
    </el-button>
    <div class="mt-5 w-full min-h-[243px] space-y-5">
      <AppUpload
        @upload="(data) => (form.file_id = data.id)"
        :reset="reset"
        @remove="form.file_id = null"
        accept=".xlsx, .xls, .csv"
      >
        <el-button
          class="!h-12 !text-sm !font-semibold w-full !justify-start hover:shadow-lg"
        >
          <svg
            width="24"
            height="24"
            class="mr-3"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H12M12 12H19M12 12V5M12 12V19"
              stroke="#6941C6"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Press here to upload your file
        </el-button>
      </AppUpload>
      <template v-if="form.file_id">
        <el-select
          v-model="form.semester_id"
          class="w-full"
          :placeholder="`${$t('shared.select')} ${$t('app.semestrs')}`"
          size="large"
        >
          <el-option
            v-for="(item, i) in [
              { value: 'none', label: 'All' },
              ...ExamDatesStore.getSemestrsSelct,
            ]"
            :key="i"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="flex items-center gap-2">
          <el-button
            size="large"
            class="!font-semibold !text-[#44444F]"
            @click="reset = true"
          >
            Clear
          </el-button>
          <el-button type="primary" size="large" @click="submit">
            Submit
          </el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { useAcademicStore, useFinanceStore } from "@/stores";
import AppUpload from "@/components/common/AppUpload.vue";
import { ElMessage } from "element-plus";
const reset = ref(false);
const emit = defineEmits(["onUpdate"]);
const ExamDatesStore = useAcademicStore();
const financeStore = useFinanceStore();
const form = reactive({
  semester_id: "",
  file_id: null,
});
onMounted(() => {
  if (!ExamDatesStore.getSemestrsSelct.length) {
    ExamDatesStore.fetchSemestr();
  }
});
const submit = async () => {
  if (!form.semester_id) {
    ElMessage({
      message: "Please select semester !",
      type: "error",
    });
    return;
  }
  try {
    await financeStore.paymentImportDetails(form);
    emit("onUpdate");
    (form.file_id = null), (form.semester_id = "");
    reset.value = true;
    ElMessage({
      message: "File uploaded",
      type: "success",
    });
  } catch (error: any) {
    console.log("error", error.message);
  }
};
</script>
<style></style>
