<template>
  <div class="space-y-3">
    <div class="grid grid-cols-5 gap-4">
      <div></div>
      <h1 class="col-span-2 font-semibold">Before edit:</h1>
      <h1 class="col-span-2 font-semibold">After edit:</h1>
    </div>
    <div class="grid grid-cols-5 gap-4">
      <h1 class="font-semibold">School</h1>
      <div class="input-wrapper col-span-2">
        {{ oldSchool }}
      </div>
      <div class="input-wrapper col-span-2">
        {{ newSchool }}
      </div>
    </div>
    <div class="grid grid-cols-5 gap-4">
      <h1 class="font-semibold">Course leader</h1>
      <div class="input-wrapper col-span-2">
        {{ getCourseLeader(oldStaff) }}
      </div>
      <div class="input-wrapper col-span-2">
        {{ getCourseLeader(newStaff) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useSchoolStore } from "@/stores";
import utilsRequest from "@/utils/request";
const schoolStore = useSchoolStore();

const props = defineProps<{
  request: any;
}>();

const oldStaff = ref(null);
const newStaff = ref(null);
const oldSchool = ref("");
const newSchool = ref("");

onMounted(async () => {
  if (schoolStore.schools.length === 0) {
    await schoolStore.fetchSchools();
  }
  try {
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
  } catch (error: any) {
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
