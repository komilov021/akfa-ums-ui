<template>
  <div class="grid gap-4">
    <div class="bg-gray-200 rounded-2xl p-6 h-[222px]">
      <div class="flex gap-6">
        <div class="h-[173px] w-[173px]">
          <img
            class="w-full h-full object-cover rounded-lg"
            src="../../../../assets/images/card-header.jpg"
            alt=""
          />
        </div>
        <div>
          <h1 class="text-[#111928] font-bold text-xl mb-1">
            {{ currentTeacher.full_name }}
          </h1>
          <p class="text-[#6B7280] mb-3 text-base font-medium">
            {{ currentTeacher.position }}
          </p>
          <div class="flex flex-wrap gap-3 mb-4">
            <el-tag
              class="text-[#175CD3] px-[10px] py-[2px] text-sm font-medium"
              round
              :style="{
                color: '#175CD3',
                backgroundColor: '#EFF8FF',
                border: 'none',
              }"
            >
              {{ currentTeacher.email }}
            </el-tag>
            <el-tag
              class="text-[#175CD3] px-[10px] py-[2px] text-sm font-medium"
              round
              :style="{
                color: '#175CD3',
                backgroundColor: '#EFF8FF',
                border: 'none',
              }"
            >
              {{ currentTeacher.workload }}
            </el-tag>
            <el-tag
              class="text-[#175CD3] px-[10px] py-[2px] text-sm font-medium"
              round
              :style="{
                color: '#175CD3',
                backgroundColor: '#EFF8FF',
                border: 'none',
              }"
            >
              {{ currentTeacher.department }}
            </el-tag>
          </div>
          <!-- <span class="font-semibold text-xl text-[#070811]">4,000$</span> -->
        </div>
        <div class="flex items-start gap-2">
          <div class="cursor-pointer">
            <EditIcon />
          </div>
          <div class="cursor-pointer">
            <DeleteIcons />
          </div>
        </div>
      </div>
    </div>
    <div class="bg-gray-200 rounded-2xl grid p-6 gap-4">
      <div>
        <h1 class="text-base font-bold text-[#111928]">Subjects to teach</h1>
        <p class="text-base font-normal text-[#6B7280]">
          {{ currentTeacher.subjects_taught }}
        </p>
      </div>
      <div>
        <h1 class="text-base font-bold text-[#111928]">
          Educational background
        </h1>
        <p class="text-base font-normal text-[#6B7280]">
          {{ currentTeacher.educational_background }}
        </p>
      </div>
      <div>
        <h1 class="text-base font-bold text-[#111928]">Brief info</h1>
        <p class="text-base font-normal text-[#6B7280]">
          {{ currentTeacher.brief_bio }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {} from "vue";
import DeleteIcons from "@/components/icons/DeleteIcons.vue";
import EditIcon from "@/components/icons/EditIcon.vue";
const props = defineProps(["currentTeacher"]);
const emit = defineEmits<{}>();
</script>

<style scoped></style>
