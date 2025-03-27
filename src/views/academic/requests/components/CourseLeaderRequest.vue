<template>
  <div class="space-y-3" v-loading="loading">
    <div class="grid grid-cols-5 gap-4">
      <div></div>
      <h1 class="font-semibold col-span-2">Before edit:</h1>
      <h1 class="font-semibold col-span-2">After edit:</h1>
    </div>
    <div class="grid grid-cols-5">
      <h1 class="font-semibold">School</h1>
      <div class="grid grid-cols-2 col-span-4 gap-4">
        <div class="input-wrapper">
          {{ oldSchool }}
        </div>
        <div class="input-wrapper">
          {{ newSchool }}
        </div>
      </div>
    </div>
    <div class="grid grid-cols-5">
      <h1 class="font-semibold">Course leader</h1>
      <div class="grid grid-cols-2 gap-4 col-span-4">
        <div class="input-wrapper">
          {{ getCourseLeader(oldStaff) }}
        </div>
        <div class="input-wrapper">
          {{ getCourseLeader(newStaff) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSchoolStore } from "@/stores";
import utilsRequest from "@/utils/request";
import { onMounted, ref } from "vue";
const schoolStore = useSchoolStore();

const props = defineProps<{
  request: any;
}>();

const loading = ref(false);
const oldStaff = ref(null);
const newStaff = ref(null);
const oldSchool = ref("");
const newSchool = ref("");

onMounted(async () => {
  if (schoolStore.schools.length === 0) {
    await schoolStore.fetchSchools();
  }
  try {
    loading.value = true;
    if (props.request.old_value?.chief_id) {
      oldStaff.value = await utilsRequest.post("/staff/get-one", {
        id: props.request.old_value?.chief_id,
      });
    }
    if (props.request.new_value?.chief_id) {
      newStaff.value = await utilsRequest.post("/staff/get-one", {
        id: props.request.new_value?.chief_id,
      });
    }
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error?.message);
  }

  oldSchool.value = getSchool(props.request.old_value?.school_id)?.title;
  newSchool.value = getSchool(props.request.new_value?.school_id)?.title;
});

const getSchool = (id: string) => {
  return schoolStore.schools.find((school: any) => school.id === id);
};

const getCourseLeader = (staff: any) => {
  return staff ? staff?.first_name + " " + staff?.last_name : "";
};
</script>
