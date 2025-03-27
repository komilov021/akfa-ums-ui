<template>
  <div class="space-y-3">
    <div class="grid grid-cols-5 gap-4">
      <div></div>
      <h1 class="col-span-2 font-semibold">Before edit:</h1>
      <h1 class="col-span-2 font-semibold">After edit:</h1>
    </div>
    <div class="grid grid-cols-5 gap-4">
      <h1 class="font-semibold">Title</h1>
      <div class="input-wrapper col-span-2">
        {{ request.old_value?.title }}
      </div>
      <div class="input-wrapper col-span-2">
        {{ request.new_value?.title }}
      </div>
    </div>
    <div class="grid grid-cols-5 gap-4">
      <h1 class="font-semibold">Code</h1>
      <div class="input-wrapper col-span-2">
        {{ request.old_value?.code }}
      </div>
      <div class="input-wrapper col-span-2">
        {{ request.new_value?.code }}
      </div>
    </div>
    <div class="grid grid-cols-5 gap-4 items-start">
      <h1 class="font-semibold">Retake courses code:</h1>
      <div class="input-wrapper col-span-2">
        {{ request.old_value?.retake_code }}
      </div>
      <div class="input-wrapper col-span-2">
        {{ request.new_value?.retake_code }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  request: any;
}>();
</script>
