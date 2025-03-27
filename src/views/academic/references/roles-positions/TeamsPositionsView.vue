<template>
  <div class="mx-auto mt-6 md:mt-0">
    <h1 class="text-main font-bold text-lg">Employee teams and positions</h1>
    <p class="text-gray700 text-base font-semibold mt-3">
      This is a list of teams and roles that can be assigned to employees. Only
      names can be edited in this list
    </p>
    <div class="grid gap-4 mt-6 justify-start">
      <div>
        <el-button
          v-if="!visibleCreateFrom"
          @click="visibleCreateFrom = true"
          link
          class="display-inline self-start"
          >+ Add team</el-button
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
              @click="createDepartment"
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
      <div
        v-for="item of departmentStore.getDepartmentSelect"
        :key="item.value"
      >
        <div v-if="!item.editable" class="card">
          <div class="pl-3 card-header">
            <div
              class="flex items-center gap-1"
              @click="departmentStore.changeOpen(item.value as string)"
            >
              <el-icon v-if="!item.open"><ArrowRightBold /></el-icon>
              <el-icon v-else><ArrowUpBold /></el-icon>
              <h1 class="p-4 text-xs">{{ item.label }}</h1>
            </div>
            <div class="flex items-stretch">
              <div
                class="flex items-center p-3 cursor-pointer hover:bg-primary-300"
                @click="onEditClick(item)"
              >
                <el-icon><EditPen /></el-icon>
              </div>
              <div
                class="flex items-center p-3 cursor-pointer hover:bg-primary-300"
                @click="confirmDelete(item.value as string)"
              >
                <el-icon><Delete /></el-icon>
              </div>
            </div>
          </div>
          <div class="pl-8 pb-6 pr-4" v-if="item.open">
            <el-button
              v-if="!visiblePositionCreateFrom"
              @click="visiblePositionCreateFrom = true"
              link
              class="display-inline self-start text-sm"
              >+ Add position</el-button
            >
            <div v-else class="flex items-center gap-2">
              <el-input
                v-model="positionInput"
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
                  @click="createPosition(item.value as string)"
                />
                <el-button
                  @click="visiblePositionCreateFrom = false"
                  :icon="Close"
                  size="small"
                  circle
                  color="#44444F"
                  class="!ml-2"
                />
              </div>
            </div>
            <div class="py-2">
              <div v-for="position of item.positions" :key="position.id">
                <div class="pl-3 card-header" v-if="!position.editable">
                  <h1 class="p-1 text-xs">{{ position.name }}</h1>
                  <div class="flex items-stretch">
                    <div
                      class="flex items-center p-2 cursor-pointer hover:bg-primary-300"
                      @click="
                        onPositionEditClick(item.value as string, position)
                      "
                    >
                      <el-icon><EditPen /></el-icon>
                    </div>
                    <div
                      class="flex items-center p-2 cursor-pointer hover:bg-primary-300"
                      @click="confirmPositionDelete(position.id as string)"
                    >
                      <el-icon><Delete /></el-icon>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2" v-else>
                  <el-input
                    v-model="currentPosition.name"
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
                      @click="updatePosition"
                    />
                    <el-button
                      @click="
                        departmentStore.changePositionEditable(
                          item.value as string,
                          position.id as string
                        )
                      "
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
              @click="updateDepartment"
            />
            <el-button
              @click="departmentStore.changeEditable(item.value as string)"
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
import { useDepartmentStore } from "@/stores";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { Check, Close } from "@element-plus/icons-vue";
import { ControlItem } from "@/models/frontend";
import { useI18n } from "vue-i18n";
const i18n = useI18n();
const departmentStore = useDepartmentStore();

const loading = ref(false);
const visibleCreateFrom = ref(false);
const visiblePositionCreateFrom = ref(false);
const degreeInput = ref("");
const positionInput = ref("");
const currentDegree = reactive<any>({});
const currentPosition = reactive<any>({});

onMounted(() => {
  departmentStore.fetchDepartment();
});

const createDepartment = async () => {
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
    await departmentStore.createDepartment({
      name: degreeInput.value,
      description: null,
    });
    degreeInput.value = "";
    visibleCreateFrom.value = false;
    departmentStore.fetchDepartment();
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
};
const createPosition = async (department_id: string) => {
  if (!positionInput.value) {
    ElMessage({
      message: "Fill the field",
      type: "error",
      duration: 5 * 1000,
    });
    return;
  }
  try {
    loading.value = true;
    await departmentStore.createPosition({
      name: positionInput.value,
      department_id,
    });
    positionInput.value = "";
    visiblePositionCreateFrom.value = false;
    departmentStore.fetchDepartment();
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
};

const onEditClick = (degree: ControlItem & { editable: boolean }) => {
  Object.assign(currentDegree, degree);
  departmentStore.changeEditable(degree.value as string);
};

const onPositionEditClick = (department_id: string, position: any) => {
  Object.assign(currentPosition, { ...position, department_id });
  departmentStore.changePositionEditable(department_id as string, position.id);
};

const updateDepartment = async () => {
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
    await departmentStore.editDepartment({
      id: currentDegree.value,
      name: currentDegree.label,
    });
    departmentStore.fetchDepartment();
    departmentStore.changeEditable(currentDegree.value as string);
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
};

const updatePosition = async () => {
  if (!currentPosition.name) {
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
    await departmentStore.editPosition(currentPosition);
    departmentStore.fetchDepartment();
    departmentStore.changePositionEditable(
      currentPosition.department_id as string,
      currentPosition.id as string
    );
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
        await departmentStore.removeDepartment(id);
        departmentStore.fetchDepartment();
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

const confirmPositionDelete = (id: string) => {
  ElMessageBox.confirm("This action cannot be undone. Continue?", "Warning", {
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    type: "warning",
    center: true,
  })
    .then(async () => {
      try {
        loading.value = true;
        await departmentStore.removePosition(id);
        departmentStore.fetchDepartment();
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
.card {
  max-width: 500px;
  min-width: 400px;
  border-radius: 7.237px;
  background: #fff;
  box-shadow: 0px 0.72368px 3.61842px 0.72368px rgba(0, 0, 0, 0.1);

  &-header {
    display: grid;
    grid-template-columns: 1fr auto;
  }
  &__title {
    font-size: 16.699px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
}
</style>
