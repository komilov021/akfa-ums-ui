<template>
  <StudentProfile v-if="student" :student="student" />
</template>
<script lang="ts" setup>
import StudentProfile from "@/components/academic/StudentProfile.vue";
import { useStudentsStore } from "@/stores";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const studentsStore = useStudentsStore();
const student = computed(() => studentsStore.currentStudent);

onMounted(() => {
  studentsStore.getStudentById(route.params.id as string);
});
</script>

<style lang="scss" scoped>
.header-card {
  border-radius: 13.893px;
  background: #edf1ff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  h2 {
    color: #182857;
  }
  span {
    color: #000;
  }
}

.detail-card {
  border: 1px solid #d3d3d3;
  overflow: hidden;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 13.87px;

  &__header {
    border-radius: 13.87px 13.87px 0px 0px;
    background: #131a34;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
    color: #fff;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  &__body {
    font-size: 10px;
    font-style: normal;
    font-weight: 500;
    h2 {
      color: #313e68;
    }
    span {
      color: #000;
    }
    h1 {
      color: #182857;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
    }
  }
}
</style>
