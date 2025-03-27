<template>
  <div v-loading="loading">
    <div class="flex items-center justify-between mb-8">
      <div class="flex flex-col gap-3">
        <h1 class="font-semibold text-xl">Lessons</h1>
        <p class="text-tertiary-600 font-normal">
          Information about the rooms intended for teaching the course
        </p>
      </div>
      <div class="flex items-center gap-2 absolute right-0 top-2">
        <el-button v-if="!editable" @click="editable = true">Edit</el-button>
        <template v-else>
          <el-button @click="editable = false">Cancel</el-button>
          <el-button @click="openRequestModal" color="#344054">Save</el-button>
        </template>
      </div>
    </div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      label-position="top"
      require-asterisk-position="right"
      :disabled="!editable"
    >
      <div>
        <div
          class="grid md:grid-cols-7 gap-4 font-semibold text-mainDarkGray mb-2"
          style="width: 97%"
        >
          <h2 class="col-span-2">Lesson type:</h2>
          <h2>Lesson per week:</h2>
          <h2>Duration(min/lesson):</h2>
          <h2>Max students per lesson:</h2>
          <h2 class="col-span-2">Limitation by room:</h2>
        </div>
        <div
          class="flex items-center gap-4 mb-4 last:mb-0"
          v-for="(item, index) in ruleForm.lessons"
          :key="index"
        >
          <div class="grid grid-cols-7 gap-4 w-full">
            <el-form-item
              :prop="'lessons.' + index + '.id'"
              :rules="{
                required: true,
                message: $t('validation.fillField'),
                trigger: 'blur',
              }"
              class="!mb-0 col-span-2"
            >
              <el-select v-model="item.id" placeholder="Select" class="w-full">
                <el-option
                  v-for="{
                    label,
                    value,
                  } of lessonTypeStore.getLessonTypesSelect"
                  :key="value"
                  :label="label"
                  :value="value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              :prop="'lessons.' + index + '.per_week'"
              :rules="{
                required: true,
                message: $t('validation.fillField'),
                trigger: 'blur',
                type: 'number',
                min: 0,
              }"
              class="!mb-0"
            >
              <el-input-number
                class="!w-full"
                v-model="item.per_week"
                :min="0"
              />
            </el-form-item>
            <el-form-item
              :prop="'lessons.' + index + '.duration'"
              :rules="{
                required: true,
                message: $t('validation.fillField'),
                trigger: 'blur',
                type: 'number',
                min: 0,
              }"
              class="!mb-0"
            >
              <el-input-number
                class="!w-full"
                v-model="item.duration"
                :min="0"
              />
            </el-form-item>
            <el-form-item
              :prop="'lessons.' + index + '.max_students'"
              :rules="{
                required: true,
                message: $t('validation.fillField'),
                trigger: 'blur',
                type: 'number',
                min: 0,
              }"
              class="!mb-0"
            >
              <el-input-number
                class="!w-full"
                v-model="item.max_students"
                :min="0"
              />
            </el-form-item>
            <el-form-item
              :prop="'lessons.' + index + '.room_ids'"
              class="!mb-0 col-span-2"
            >
              <el-select
                v-model="item.room_ids"
                class="w-full"
                placeholder="Choose only if applicable"
                multiple
              >
                <el-option
                  v-for="{
                    label,
                    value,
                  } of roomReferenceStore.getRoomReferencesSelect"
                  :key="value"
                  :label="label"
                  :value="value"
                />
              </el-select>
            </el-form-item>
          </div>

          <el-button
            @click="removeLesson(index)"
            :icon="Minus"
            circle
            size="small"
            :class="{ '!invisible': index === 0 }"
          />
        </div>
        <el-button v-if="editable" link @click="addLesson()"
          >+ Add lesson
        </el-button>
      </div>
    </el-form>
    <teleport to="#modal" v-if="showModal">
      <UpdateRequestDialog @on-submit="submitForm($event)" />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { useI18n } from "vue-i18n";
import { Minus } from "@element-plus/icons-vue";
import { IAssignedCourse, RequestTypeEnum } from "@/models/backend";
import {
  useCurriculumStore,
  useSchoolStore,
  useRoomReferenceStore,
  useLessonTypeStore,
} from "@/stores";
import { useModal } from "@/composables";
import UpdateRequestDialog from "@/components/common/UpdateRequestDialog.vue";

const i18n = useI18n();
const curriculumStore = useCurriculumStore();
const roomReferenceStore = useRoomReferenceStore();
const lessonTypeStore = useLessonTypeStore();
const modal = useModal();
const emit = defineEmits(["onChange"]);
const props = defineProps<{
  course: IAssignedCourse;
}>();

const loading = ref(false);
const editable = ref(false);
const showModal = computed(() => modal.show.value);

const currentType = ref<RequestTypeEnum>(RequestTypeEnum.assigned_lessons);

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  lessons: [
    {
      id: "",
      per_week: 0,
      duration: 0,
      max_students: 0,
      room_ids: [],
    },
  ],
});

const addLesson = () => {
  ruleForm.lessons.push({
    id: "",
    per_week: 0,
    duration: 0,
    max_students: 0,
    room_ids: [],
  });
};

const removeLesson = (index: number) => {
  ruleForm.lessons.splice(index, 1);
};

onMounted(() => {
  lessonTypeStore.fetchLessonTypes();
  roomReferenceStore.fetchRoomReferences();

  // Assign Values
  if (props.course.lessons?.length) {
    props.course.lessons.forEach((lesson: any) => {
      lesson.room_ids = lesson.rooms?.map((room: any) => room.id);
    });
    ruleForm.lessons = props.course.lessons as any;
  }
});

const openRequestModal = () => {
  ruleFormRef.value?.validate((valid) => {
    if (valid) {
      currentType.value = RequestTypeEnum.assigned_lessons;
      modal.setTitle(currentType.value);
      modal.setWidth("35vw");
      modal.showModal();
    }
  });
};

const submitForm = async (request: any) => {
  try {
    loading.value = true;
    request.type = currentType.value;
    await curriculumStore.editAssignCourseLessons({
      ...ruleForm,
      assigned_course_id: props.course.id,
      request,
    });
    ElMessage({
      message: i18n.t("shared.created"),
      type: "success",
    });
    modal.hideModal();
    editable.value = false;
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
</script>

<style scoped lang="scss"></style>
