<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useUsersStore } from "@/stores/user";
import { useRouter, useRoute } from "vue-router";

const store = useUsersStore();
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  try {
    await store.verifyEmail(route.query.code as string);
    router.push("/login");
  } catch (error) {
    router.push("/login");
  }
});
</script>
