<template>
  <div class="flex flex-col gap-3 mt-6 mb-10">
    <h1 class="font-semibold text-xl">Lessons</h1>
    <p class="text-tertiary-600 font-normal">
      Information about the rooms intended for teaching the course
    </p>
  </div>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    label-position="top"
    require-asterisk-position="right"
    :disabled="disabled"
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
            <el-select v-model="item.id" class="w-full">
              <el-option
                v-for="{ label, value } of lessonTypeStore.getLessonTypesSelect"
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
            <el-input-number class="!w-full" v-model="item.per_week" :min="0" />
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
            <el-input-number class="!w-full" v-model="item.duration" :min="0" />
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
      <el-button v-if="!disabled" link @click="addLesson()"
        >+ Add lesson
      </el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, reactive, ref } from "vue";
import { FormInstance } from "element-plus";
import { useStepper } from "@/composables";
import { Subject, takeUntil } from "rxjs";
import { useLessonTypeStore, useRoomReferenceStore } from "@/stores";
import { Minus } from "@element-plus/icons-vue";

const roomReferenceStore = useRoomReferenceStore();

const destroy = new Subject<any>();
const { check$, create } = useStepper();
const lessonTypeStore = useLessonTypeStore();

const emit = defineEmits(["onChange"]);

const props = defineProps<{
  value: any;
  disabled?: boolean;
}>();

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
  // Fetch Tests
  lessonTypeStore.fetchLessonTypes();
  roomReferenceStore.fetchRoomReferences();

  // Assign Values
  if (props.value) {
    props.value.lessons.forEach((lesson: any) => {
      lesson.room_ids = lesson.rooms?.map((room: any) => room.id);
    });
    Object.assign(ruleForm, props.value);
  }

  check$.pipe(takeUntil(destroy)).subscribe(() => {
    ruleFormRef.value?.validate((valid) => {
      if (valid) {
        emit("onChange", ruleForm);
        create.next(true);
      }
    });
  });
});

onBeforeMount(() => {
  destroy.next(null);
  destroy.complete();
});
</script>

<style scoped lang="scss"></style>
