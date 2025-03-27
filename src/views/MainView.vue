<template>
  <div class="min-h-screen">
    <div class="flex justify-between items-center pt-14 pl-12 pr-16">
      <div class="md:block">
        <div
          class="flex items-center gap-3 cursor-pointer"
          @click="router.push('/')"
        >
          <img
            v-if="universityStore.logo"
            :src="universityStore.logo"
            alt="Logo"
          />
          <img
            v-else
            class="h-12"
            src="../assets/svgs/eduplus.svg"
            alt="Logo"
          />
        </div>
      </div>
      <div>
        <SettingsDropdown theme="dark" />
      </div>
    </div>
    <div
      class="pt-14 md:pt-0 pl-8 md:pl-12 pr-16 flex justify-end md:justify-between items-center min-h-[74vh]"
    >
      <div class="grid md:grid-cols-2 w-full">
        <div class="flex-col justify-center hidden md:flex w-8/12">
          <div class="text-black font-semibold text-5xl">
            <h1 class="text-primary text-4xl mt-1">Welcome to the</h1>
            <h1 class="text-black leading-[123.5%] font-semibold text-5xl mt-9">
              University Management System
            </h1>
          </div>
          <p class="leading-[123.5%] text-mainDarkGray text-lg mt-12">
            Here you can easily monitor and manage all the key processes within
            your university.
          </p>
        </div>
        <div class="space-y-8 flex flex-col justify-center md:justify-start">
          <h1 class="text-[32px]">Select the module you want to work on:</h1>
          <div
            class="grid md:grid-cols-2 gap-8 w-full md:w-auto"
            v-loading="loading"
          >
            <template v-for="item of usersStore.getFilteredMenu" :key="item.id">
              <div
                v-if="isAiModulesVisible(item.path)"
                class="module-card relative p-4 md:p-5 flex items-center gap-5 bg-white cursor-pointer"
                @click="router.push(item.path)"
              >
                <component
                  :is="iconNames[item.icon]"
                  classes="icon stroke-black !w-16"
                />
                <div class="space-y-2">
                  <h1 class="text-base font-semibold leading-none">
                    {{ item.label }}
                  </h1>
                  <p class="text-xs w-10/12">{{ item.description }}</p>
                </div>
                <div class="absolute bottom-2 right-4">
                  <Right class="h-5 w-6" />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChartIcon,
  AcademicManagmentIcon,
  AdmissionIcon,
  FinanceIcon,
  SettingIcon,
  TimeTableIcon,
  LogoIconWithName,
  LogoIcon,
} from "@/components/icons";
import SettingsDropdown from "@/layout/components/Settings/SettingsDropdown.vue";
import { useGeneralInfoStore, useUsersStore } from "@/stores";
import { Right, Setting } from "@element-plus/icons-vue";
import { computed, onMounted } from "vue";
import staticImg from "../assets/svgs/eduplus.svg";
import { useRouter } from "vue-router";
import { ALLOWED_EMAILS } from "@/utils/constants";

const universityStore = useGeneralInfoStore();
const usersStore = useUsersStore();
const router = useRouter();
const loading = computed(() => usersStore.loading);

const iconNames = {
  ChartIcon,
  AcademicManagmentIcon,
  AdmissionIcon,
  SettingIcon,
  FinanceIcon,
  TimeTableIcon,
} as any;

const isAiModulesVisible = (path: string) => {
  if (path !== "/ai-modules") {
    return true;
  }

  const email = usersStore.user?.email ?? "";

  return !!ALLOWED_EMAILS.includes(email);
};

onMounted(() => {
  if (!usersStore.getFilteredMenu.length) {
    usersStore.fetchMenuList();
  }
});
</script>

<style scoped lang="scss">
.module-card {
  border-radius: 15px;
  background: #fff;
  box-shadow: 0.4583333432674408px 0.4583333432674408px 4.583333492279053px
    0.20000000298023224px rgba(0, 0, 0, 0.25);
  height: 103px;

  &:hover {
    box-shadow: 0.4583333432674408px 0.4583333432674408px 10px 1px
      rgba(0, 0, 0, 0.3);
  }

  .icon {
    stroke-width: 2.983px;
  }
}
</style>
