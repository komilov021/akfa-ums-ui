<template>
  <div class="space-y-3">
    <div>
      <div>
        <h1 class="font-semibold">Before edit:</h1>
        <div class="grid grid-cols-5 gap-4 my-2 leading-none">
          <h1 class="font-medium">Lesson type:</h1>
          <h1 class="font-medium">Lesson per week:</h1>
          <h1 class="font-medium">Duration (min/lesson):</h1>
          <h1 class="font-medium">Max students per lesson:</h1>
          <h1 class="font-medium">Limitation by room:</h1>
        </div>
      </div>
      <div
        class="grid grid-cols-5 gap-4"
        v-for="requestLesson of request.old_value?.lessons"
        :key="requestLesson"
      >
        <div class="input-wrapper">
          {{ requestLesson.name }}
        </div>
        <div class="input-wrapper">
          {{ requestLesson.per_week }}
        </div>
        <div class="input-wrapper">
          {{ requestLesson.duration }}
        </div>
        <div class="input-wrapper">
          {{ requestLesson.max_students }}
        </div>
        <div class="input-wrapper">
          <span v-for="room in requestLesson.rooms" :key="room">
            {{ room?.code }}
          </span>
        </div>
      </div>
    </div>
    <el-divider class="!my-4" />
    <div>
      <div>
        <h1 class="font-semibold">After edit:</h1>
        <div class="grid grid-cols-5 gap-4 my-2 leading-none">
          <h1 class="font-medium">Lesson type:</h1>
          <h1 class="font-medium">Lesson per week:</h1>
          <h1 class="font-medium">Duration (min/lesson):</h1>
          <h1 class="font-medium">Max students per lesson:</h1>
          <h1 class="font-medium">Limitation by room:</h1>
        </div>
      </div>
      <div
        class="grid grid-cols-5 gap-4"
        v-for="requestLesson of request.new_value?.lessons"
        :key="requestLesson"
      >
        <div class="input-wrapper">
          {{ requestLesson.name }}
        </div>
        <div class="input-wrapper">
          {{ requestLesson.per_week }}
        </div>
        <div class="input-wrapper">
          {{ requestLesson.duration }}
        </div>
        <div class="input-wrapper">
          {{ requestLesson.max_students }}
        </div>
        <div class="input-wrapper">
          <span v-for="room in requestLesson.rooms" :key="room">
            {{ room?.code }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

const props = defineProps<{
  request: any;
}>();

onMounted(() => {
  console.log("request", props.request);
});
</script>
