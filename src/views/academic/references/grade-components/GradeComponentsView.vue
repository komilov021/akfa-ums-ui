<template>
  <div class="mx-auto mt-6 md:mt-0">
    <h1 class="text-main font-semibold text-xl">Grade component types</h1>
    <p class="text-tertiary text-sm font-normal mt-2">
      Information about the name of the course, its code and the course code for
      retaking
    </p>
    <div class="my-4">
      <el-button
        v-if="!visibleCreateFrom"
        @click="visibleCreateFrom = true"
        type="primary"
        class="display-inline self-start"
        >+ Add</el-button
      >
      <div v-else class="grid md:grid-cols-3 sm:grid-cols-2">
        <div class="flex items-center gap-2">
          <el-input
            v-model="createInput"
            placeholder="Please input"
            autofocus
            @keyup.enter="createDegree"
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
    </div>
    <div class="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
      <div v-for="item of store.getGradeComponentsSelect" :key="item.value">
        <div class="card pl-2" v-if="!item.editable">
          <h1 class="p-4 text-xs">{{ item.label }}</h1>
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
        <div class="flex items-center gap-2" v-else>
          <el-input
            v-model="currentDegree.label"
            placeholder="Please input"
            class="w-32"
            @keyup.enter="updateDegree"
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
              @click="store.changeEditable(item.value as string)"
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
    <div class="py-4">
      <el-pagination
        v-if="gradeComponentsList?.total / pagination.limit > 1"
        background
        @current-change="onPaginationChange"
        layout="prev, pager, next"
        :page-size="pagination.limit"
        :total="gradeComponentsList.total"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGradeComponentsStore } from "@/stores";
import { ElMessage, ElMessageBox } from "element-plus";
import { computed, onMounted, reactive, ref } from "vue";
import { Check, Close } from "@element-plus/icons-vue";
import { ControlItem } from "@/models/frontend";
import { useI18n } from "vue-i18n";
const i18n = useI18n();
const store = useGradeComponentsStore();
const gradeComponentsList = computed(() => store.gradeComponents);
const loading = ref(false);
const visibleCreateFrom = ref(false);
const createInput = ref("");
const currentDegree = reactive<any>({});

const pagination = reactive({
  page: 1,
  limit: 100,
});

const fetchList = () => {
  store.fetchGradeComponents(pagination);
};

onMounted(() => {
  store.fetchGradeComponents();
  fetchList();
});

const onPaginationChange = (event: number) => {
  pagination.page = event;
  fetchList();
};

const createDegree = async () => {
  if (!createInput.value) {
    ElMessage({
      message: "Fill the field",
      type: "error",
      duration: 5 * 1000,
    });
    return;
  }
  ElMessage({
    message: `${createInput.value} has successfully created!`,
    type: "success",
    duration: 5 * 1000,
  });
  try {
    loading.value = true;
    await store.createGradeComponents({
      name: createInput.value,
      // reference: createInput.value,
    });
    createInput.value = "";
    visibleCreateFrom.value = false;
    store.fetchGradeComponents();
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
};

const onEditClick = (degree: ControlItem & { editable: boolean }) => {
  Object.assign(currentDegree, degree);
  store.changeEditable(degree.value as string);
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
  ElMessage({
    message: `Successfully changed to ${currentDegree.label}`,
    type: "success",
    duration: 5 * 1000,
  });
  try {
    loading.value = true;
    createInput.value = "";
    await store.editGradeComponents({
      id: currentDegree.value,
      name: currentDegree.label,
    });
    store.fetchGradeComponents();
    store.changeEditable(currentDegree.value as string);

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
        let response = await store.removeGradeComponents(id);
        if (response?.message?.length > 0) {
          const description = response?.message
            ?.map((message: any) => `${message.description}`)
            .join("<br/> <br/>");
          ElMessage({
            dangerouslyUseHTMLString: true,
            type: "error",
            message: description,
            duration: 5000,
          });
        } else {
          store.fetchGradeComponents();
          ElMessage({
            type: "success",
            message: i18n.t("shared.deleteCompleted"),
          });
        }
        loading.value = false;
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
