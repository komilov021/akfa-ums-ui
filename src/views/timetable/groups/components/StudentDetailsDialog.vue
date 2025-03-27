<template>
  <div>
    <div class="grid grid-cols-2 w-[100%] gap-3 mt-4">
      <div class="w-full text-sm border-b-[1px] pb-2">
        <h1 class="font-semibold text-[#000]">Name</h1>
        <h2 class="text-[#6B7280] leading-4 text-[#6B7280]">
          {{ studentInfo.last_name }}
          {{ studentInfo.first_name }}
        </h2>
      </div>
      <div class="w-full text-sm border-b-[1px] pb-2">
        <h1 class="font-semibold text-[#000]">ID</h1>
        <h2 class="text-[#6B7280] leading-4 text-[#6B7280]">
          {{ studentInfo.uid }}
        </h2>
      </div>
      <div class="w-full text-sm border-b-[1px] pb-2">
        <h1 class="font-semibold text-[#000]">Main groups</h1>
        <h2 class="text-[#6B7280] leading-4 text-[#6B7280]">BE 19-01</h2>
      </div>
      <div class="w-full text-sm border-b-[1px] pb-2">
        <h1 class="font-semibold text-[#000]">Programs</h1>
        <h2 class="text-[#6B7280] leading-4 text-[#6B7280]">
          {{ studentInfo.program_info.name }}
        </h2>
      </div>
      <div class="w-full text-sm border-b-[1px] pb-2">
        <h1 class="font-semibold text-[#000]">E-mail</h1>
        <h2 class="text-[#6B7280] leading-4 text-[#6B7280]">
          {{ studentInfo.email }}
        </h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  studentInfo: any;
}>();
</script>

<style scoped>
.additionalGroup {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #d1d5db !important;
  background: rgba(249, 250, 251, 1);
  width: 100%;
  height: 42px;
  padding: 12px;
  border-radius: 8px;
  border: 1px;
}
</style>
