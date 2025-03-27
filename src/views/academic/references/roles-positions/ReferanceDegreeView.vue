<template>
  <div class="mx-auto mt-6 md:mt-0">
    <h1 class="text-main font-bold text-lg">
      Employee degrees, roles, positions
    </h1>
    <p class="text-gray700 text-base font-semibold mt-3">
      List of degree that employees can hold such as MD, PhD, MBA etc.
    </p>
    <div class="grid gap-4 mt-6 justify-start">
      <div>
        <el-button
          v-if="!visibleCreateFrom"
          @click="visibleCreateFrom = true"
          link
          class="display-inline self-start"
          >+ Add new employee degree</el-button
        >
        <div v-else class="flex items-center gap-2">
          <el-input
            v-model="degreeInput"
            placeholder="Please input"
            class="w-32"
          />
          <div class="flex items-center">
            <el-button
              :loading="loading"
              :icon="Check"
              size="small"
              circle
              color="#6941c6"
              @click="createDegree"
            />
            <el-button
              @click="visibleCreateFrom = false"
              :icon="Close"
              size="small"
              circle
              color="#44444F"
              class="!ml-2"
            />
          </div>
        </div>
      </div>
      <div v-for="degree of degreeStore.getDegreesSelect" :key="degree.value">
        <div class="degree pl-2" v-if="!degree.editable">
          <h1 class="p-4 text-xs">{{ degree.label }}</h1>
          <div class="flex items-stretch">
            <div
              class="flex items-center p-3 cursor-pointer hover:bg-primary-300"
              @click="onEditClick(degree)"
            >
              <el-icon><EditPen /></el-icon>
            </div>
            <div
              class="flex items-center p-3 cursor-pointer hover:bg-primary-300"
              @click="confirmDelete(degree.value as string)"
            >
              <el-icon><Delete /></el-icon>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2" v-else>
          <el-input
            v-model="currentDegree.label"
            placeholder="Please input"
            class="w-32"
          />
          <div class="flex items-center">
            <el-button
              :loading="loading"
              :icon="Check"
              size="small"
              circle
              color="#6941c6"
              @click="updateDegree"
            />
            <el-button
              @click="degreeStore.changeEditable(degree.value as string)"
              :icon="Close"
              size="small"
              circle
              color="#44444F"
              class="!ml-2"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDegreeStore } from "@/stores";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { Check, Close } from "@element-plus/icons-vue";
import { ControlItem } from "@/models/frontend";
import { useI18n } from "vue-i18n";
const i18n = useI18n();
const degreeStore = useDegreeStore();

const loading = ref(false);
const visibleCreateFrom = ref(false);
const degreeInput = ref("");
const currentDegree = reactive<any>({});

onMounted(() => {
  degreeStore.fetchDegree();
});

const createDegree = async () => {
  if (!degreeInput.value) {
    ElMessage({
      message: "Fill the field",
      type: "error",
      duration: 5 * 1000,
    });
    return;
  }
  try {
    loading.value = true;
    await degreeStore.createDegree({
      name: degreeInput.value,
      reference: degreeInput.value,
    });
    degreeInput.value = "";
    visibleCreateFrom.value = false;
    degreeStore.fetchDegree();
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
};

const onEditClick = (degree: ControlItem & { editable: boolean }) => {
  Object.assign(currentDegree, degree);
  degreeStore.changeEditable(degree.value as string);
};

const updateDegree = async () => {
  if (!currentDegree.label) {
    ElMessage({
      message: "Fill the field",
      type: "error",
      duration: 5 * 1000,
    });
    return;
  }
  try {
    loading.value = true;
    degreeInput.value = "";
    await degreeStore.editDegree({
      id: currentDegree.value,
      name: currentDegree.label,
      reference: currentDegree.label,
    });
    degreeStore.fetchDegree();
    degreeStore.changeEditable(currentDegree.value as string);
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
};

const confirmDelete = (id: string) => {
  ElMessageBox.confirm("This action cannot be undone. Continue?", "Warning", {
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    type: "warning",
    center: true,
  })
    .then(async () => {
      try {
        loading.value = true;
        await degreeStore.removeDegree(id);
        degreeStore.fetchDegree();
        loading.value = false;
        ElMessage({
          type: "success",
          message: i18n.t("shared.deleteCompleted"),
        });
      } catch (error: any) {
        loading.value = false;
        console.log("error", error);
      }
    })
    .catch(() => {});
};
</script>

<style scoped lang="scss">
.degree {
  max-width: 500px;
  min-width: 400px;
  border-radius: 7.237px;
  background: #fff;
  box-shadow: 0px 0.72368px 3.61842px 0.72368px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr auto;
  &__title {
    font-size: 16.699px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
}
</style>
