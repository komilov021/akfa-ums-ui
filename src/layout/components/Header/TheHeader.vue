<template>
  <div>
    <div class="app-header p-4 md:p-8 border-b border-b-[gray200]">
      <div
        class="md:hidden flex items-center justify-center w-[40px] h-[40px] border rounded-full cursor-pointer"
        @click="visibleProfile = true"
        ref="componentRef"
      >
        <Profile />
      </div>
      <!-- <div v-if="visibleProfile" class="">
            <div :visible="visibleProfile" placement="bottom" :width="200" class=" !left-4 !top-6">
              <div class="flex flex-col gap-2 items-start p-3" ref="excludeRef">
                <h1 class="font-bold text-lg">
                  {{ store.getUser?.first_name + " " + store.getUser?.last_name }}
                </h1>
                <h1 class="font-bold text-lg text-[#92929D]">
                  {{ store.getUser?.role }}
                </h1>
                <h1 class="font-bold text-lg text-[#92929D]">
                  {{ store.getUser?.email }}
                </h1>
                <el-button size="large" type="primary" class="self-center mt-2 w-32"
                  @click="visibleProfile = false">Close</el-button>
              </div>
            </div>
          </div> -->
      <div class="flex items-center gap-5">
        <div class="flex items-center gap-2 cursor-pointer">
          <img
            v-if="logo"
            class="h-10 hidden md:block"
            :src="logo"
            alt="Logo"
            @click="
              store.getUser?.role !== 'teacher'
                ? router.push('/')
                : router.push('#')
            "
          />

          <img
            v-else
            class="h-10 hidden md:block"
            src="@/assets/images/eduplus.png"
            alt="Logo"
            @click="
              store.getUser?.role !== 'teacher'
                ? router.push('/')
                : router.push('#')
            "
          />
          <div class="md:hidden">
            <svg
              width="26"
              height="30"
              viewBox="0 0 26 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M25.9577 29.9485H19.4903C19.4903 29.1099 19.4903 28.3312 19.4903 27.5568C19.4903 26.7738 19.4986 25.9866 19.4903 25.2036C19.4737 23.9158 18.9534 23.3682 17.6799 23.3553C16.473 23.3425 15.262 23.3725 14.055 23.3767C13.7429 23.3767 13.4349 23.3468 13.0146 23.3211V16.7323C12.536 16.7323 12.1614 16.7323 11.791 16.7323C10.7423 16.7323 9.6935 16.7323 8.64057 16.7323C7.07574 16.7365 6.6221 17.2115 6.61794 18.8544C6.61794 20.7155 6.61794 22.5809 6.61794 24.4421C6.61794 25.1523 6.61794 25.8668 6.61794 26.6669H0.0714698C0.0464992 26.2733 0.00488141 25.8925 0.00488141 25.516C0.000719636 22.5767 0.00488141 19.6331 0.00488141 16.6938C0.00488141 13.7545 1.25758 11.6366 3.87949 10.4087C3.93776 10.383 4.00019 10.3659 4.05429 10.336C4.07926 10.3231 4.09591 10.2889 4.1833 10.1862C2.86818 9.86532 1.74867 9.25778 0.974575 8.13254C0.192161 6.98591 -0.174075 5.72376 0.0797934 4.32898C0.525103 1.88597 2.35628 0.153192 4.75347 0.0547876C7.16314 -0.0393388 9.07755 1.53514 9.70182 3.72144C10.3927 6.1345 9.38552 8.3593 6.73447 9.94234H13.0271C13.1062 11.1061 13.0604 12.1714 13.0687 13.2325C13.077 14.3107 13.0687 15.3846 13.0687 16.5825C15.1995 16.7152 17.2762 16.5996 19.3946 16.6125C17.8339 15.7482 16.6437 14.5973 16.3066 12.7576C16.1026 11.6366 16.2358 10.5499 16.7477 9.51877C17.809 7.38809 20.1229 6.32703 22.3869 6.9474C24.5635 7.54639 26.0742 9.66851 25.9827 12.0088C25.9036 13.994 24.5594 16.3173 21.5421 16.7879C21.8459 16.9376 22.0456 17.0403 22.2454 17.1387C24.6592 18.3153 25.9411 20.262 25.9827 23.0131C26.016 25.0068 25.991 27.0006 25.991 28.9944C25.991 29.2853 25.966 29.572 25.9494 29.9442L25.9577 29.9485Z"
                fill="black"
              />
              <path
                d="M25.9577 29.9485H19.4903C19.4903 29.1099 19.4903 28.3312 19.4903 27.5568C19.4903 26.7738 19.4986 25.9866 19.4903 25.2036C19.4737 23.9158 18.9534 23.3682 17.6799 23.3553C16.473 23.3425 15.262 23.3725 14.055 23.3767C13.7429 23.3767 13.4349 23.3468 13.0146 23.3211V16.7323C12.536 16.7323 12.1614 16.7323 11.791 16.7323C10.7423 16.7323 9.6935 16.7323 8.64057 16.7323C7.07574 16.7365 6.6221 17.2115 6.61794 18.8544C6.61794 20.7155 6.61794 22.5809 6.61794 24.4421C6.61794 25.1523 6.61794 25.8668 6.61794 26.6669H0.0714698C0.0464992 26.2733 0.00488141 25.8925 0.00488141 25.516C0.000719636 22.5767 0.00488141 19.6331 0.00488141 16.6938C0.00488141 13.7545 1.25758 11.6366 3.87949 10.4087C3.93776 10.383 4.00019 10.3659 4.05429 10.336C4.07926 10.3231 4.09591 10.2889 4.1833 10.1862C2.86818 9.86532 1.74867 9.25778 0.974575 8.13254C0.192161 6.98591 -0.174075 5.72376 0.0797934 4.32898C0.525103 1.88597 2.35628 0.153192 4.75347 0.0547876C7.16314 -0.0393388 9.07755 1.53514 9.70182 3.72144C10.3927 6.1345 9.38552 8.3593 6.73447 9.94234H13.0271C13.1062 11.1061 13.0604 12.1714 13.0687 13.2325C13.077 14.3107 13.0687 15.3846 13.0687 16.5825C15.1995 16.7152 17.2762 16.5996 19.3946 16.6125C17.8339 15.7482 16.6437 14.5973 16.3066 12.7576C16.1026 11.6366 16.2358 10.5499 16.7477 9.51877C17.809 7.38809 20.1229 6.32703 22.3869 6.9474C24.5635 7.54639 26.0742 9.66851 25.9827 12.0088C25.9036 13.994 24.5594 16.3173 21.5421 16.7879C21.8459 16.9376 22.0456 17.0403 22.2454 17.1387C24.6592 18.3153 25.9411 20.262 25.9827 23.0131C26.016 25.0068 25.991 27.0006 25.991 28.9944C25.991 29.2853 25.966 29.572 25.9494 29.9442L25.9577 29.9485Z"
                fill="black"
                fill-opacity="0.2"
              />
              <path
                d="M25.9577 29.9485H19.4903C19.4903 29.1099 19.4903 28.3312 19.4903 27.5568C19.4903 26.7738 19.4986 25.9866 19.4903 25.2036C19.4737 23.9158 18.9534 23.3682 17.6799 23.3553C16.473 23.3425 15.262 23.3725 14.055 23.3767C13.7429 23.3767 13.4349 23.3468 13.0146 23.3211V16.7323C12.536 16.7323 12.1614 16.7323 11.791 16.7323C10.7423 16.7323 9.6935 16.7323 8.64057 16.7323C7.07574 16.7365 6.6221 17.2115 6.61794 18.8544C6.61794 20.7155 6.61794 22.5809 6.61794 24.4421C6.61794 25.1523 6.61794 25.8668 6.61794 26.6669H0.0714698C0.0464992 26.2733 0.00488141 25.8925 0.00488141 25.516C0.000719636 22.5767 0.00488141 19.6331 0.00488141 16.6938C0.00488141 13.7545 1.25758 11.6366 3.87949 10.4087C3.93776 10.383 4.00019 10.3659 4.05429 10.336C4.07926 10.3231 4.09591 10.2889 4.1833 10.1862C2.86818 9.86532 1.74867 9.25778 0.974575 8.13254C0.192161 6.98591 -0.174075 5.72376 0.0797934 4.32898C0.525103 1.88597 2.35628 0.153192 4.75347 0.0547876C7.16314 -0.0393388 9.07755 1.53514 9.70182 3.72144C10.3927 6.1345 9.38552 8.3593 6.73447 9.94234H13.0271C13.1062 11.1061 13.0604 12.1714 13.0687 13.2325C13.077 14.3107 13.0687 15.3846 13.0687 16.5825C15.1995 16.7152 17.2762 16.5996 19.3946 16.6125C17.8339 15.7482 16.6437 14.5973 16.3066 12.7576C16.1026 11.6366 16.2358 10.5499 16.7477 9.51877C17.809 7.38809 20.1229 6.32703 22.3869 6.9474C24.5635 7.54639 26.0742 9.66851 25.9827 12.0088C25.9036 13.994 24.5594 16.3173 21.5421 16.7879C21.8459 16.9376 22.0456 17.0403 22.2454 17.1387C24.6592 18.3153 25.9411 20.262 25.9827 23.0131C26.016 25.0068 25.991 27.0006 25.991 28.9944C25.991 29.2853 25.966 29.572 25.9494 29.9442L25.9577 29.9485Z"
                fill="black"
                fill-opacity="0.2"
              />
            </svg>
          </div>
        </div>
        <div class="tab-header flex items-center gap-2">
          <div v-for="item of navigationItems[currentRoute]" :key="item.title">
            <RouterLink
              v-if="!item.childrens"
              :to="item.route"
              @click="onRouteChange()"
              class="font-semibold text-[#1B1B1B] py-2 px-3 rounded-md text-base flex items-center gap-2"
              :class="{
                '!bg-[#895AF5] !text-white': route.path.includes(item.route),
              }"
            >
              <component
                v-if="item.icon"
                :is="item.icon"
                class="stroke-current flex md:hidden"
              />
              <span>{{ item.title }}</span>
            </RouterLink>
            <div
              v-else
              @click="setCurrentSubMenu(item)"
              class="flex items-center gap-2 font-semibold text-[#101828] py-2 px-3 rounded-md text-base cursor-pointer"
            >
              <component v-if="item.icon" :is="item.icon" />
              <span>{{ item.title }}</span>
              <ArrowDown class="w-4 h-4" />
            </div>
          </div>
        </div>
        <div
          class="bottom_tab flex items-center gap-2 border-t border-t-[gray200]"
        >
          <div
            v-for="item of navigationItems[currentRoute]"
            :key="item.title"
            class="grid"
          >
            <RouterLink
              v-if="!item.childrens"
              :to="item.route"
              @click="onRouteChange()"
              class="font-normal text-[#8C8C8C] text-base grid items-center !h-11 justify-between"
              active-class="!text-[#000000] font-semibold"
            >
              <!-- :stroke="isActive ? 'white' : '#344054'" -->
              <div>
                <component
                  v-if="item.icon"
                  :is="item.icon"
                  class="icons-mobile mx-auto flex md:hidden"
                />
                <component
                  v-if="item.activeIcon"
                  :is="item.activeIcon"
                  class="icons-mobile-active mx-auto flex md:hidden"
                />
              </div>
              <span class="">
                {{
                  item.title === "Professors"
                    ? "Professors"
                    : item.title?.slice(0, 9)
                }}
              </span>
            </RouterLink>
            <div
              v-else
              @click="setCurrentSubMenu(item)"
              class="flex items-center gap-2 font-semibold text-[#101828] py-2 px-3 rounded-md text-base cursor-pointer"
            >
              <component v-if="item.icon" :is="item.icon" />
              <span>{{ item.title }}</span>
              <ArrowDown class="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <template v-if="route.path.includes('academic')">
          <el-button
            @click="openSearchDialog"
            color="#EBECEE"
            :icon="Search"
            circle
          />
          <RouterLink
            to="/academic/requests"
            v-slot="{ isActive }"
            custom
            v-if="currentRoute !== 'finance'"
          >
            <div
              class="flex items-center justify-center space-x-2 px-[14px] py-2 border rounded-md cursor-pointer"
              :class="
                isActive
                  ? 'text-white bg-[#344054]'
                  : 'text-[#1B1B1B] border-[#D0D5DD]'
              "
              @click="
                isActive ? router.back() : router.push('/academic/requests')
              "
            >
              <SvgIcon
                name="local-hour-glass"
                color="transparent"
                size="22"
                :stroke="isActive ? 'white' : '#344054'"
              />
              <span class="font-semibold text-sm">Changelog</span>
            </div>
          </RouterLink>
        </template>
        <div class="hidden md:block" v-if="store.getUser?.role !== 'teacher'">
          <SettingsDropdown />
        </div>
        <div v-else class="hidden md:block">
          <ProfileLogOut />
        </div>
        <div class="flex md:hidden">
          <ProfileLogOut />
        </div>
      </div>
    </div>

    <div
      v-if="showSubMenu"
      class="flex items-center justify-center gap-2 !h-16"
    >
      <RouterLink
        v-for="item of currentSubMenu?.childrens || []"
        :key="item.title"
        :to="item.route"
        class="font-semibold text-[#101828] py-2 px-3 rounded-md text-base flex items-center gap-2"
        active-class="bg-primary text-white active-child"
      >
        <component v-if="item.icon" :is="item.icon" class="stroke-[#667085]" />
        <span>{{ item.title }}</span>
      </RouterLink>
    </div>
  </div>
  <el-dialog
    v-model="showModal"
    title="Search student"
    width="45vw"
    :before-close="onSearchClose"
  >
    <SearchDialog @navigate="navigateToStudent($event)" />
  </el-dialog>
</template>

<script setup lang="ts">
import { navigationItems } from "@/utils/constants";
import { ArrowDown, Search } from "@element-plus/icons-vue";
import Profile from "./ProfileView.vue";
import LogoDashboard from "../../../assets/images/logoDash.svg";
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import { INavigationItem, NavigationType } from "@/models/frontend";
import SettingsDropdown from "../Settings/SettingsDropdown.vue";
import SearchDialog from "../SearchDialog/SearchDialog.vue";
import { useGeneralInfoStore, useStudentsStore, useUsersStore } from "@/stores";
import { DialogBeforeCloseFn, ElMessageBox } from "element-plus";
import ProfileLogOut from "./ProfileLogOut.vue";
const store = useUsersStore();
const universityStore = useGeneralInfoStore();
const studentsStore = useStudentsStore();
const router = useRouter();
const route = useRoute();
const currentSubMenu = ref<INavigationItem | null>(null);
const showSubMenu = ref<boolean>(false);
const showModal = ref(false);

const currentRoute = computed(
  () =>
    (router.currentRoute.value.fullPath.split("/")[1] ||
      "default") as NavigationType
);
const logo = computed(() => universityStore.logo);

const setCurrentSubMenu = (item: INavigationItem) => {
  if (item.title === currentSubMenu.value?.title) {
    showSubMenu.value = !showSubMenu.value;
  } else {
    currentSubMenu.value = item;
    showSubMenu.value = true;
  }
};
const visibleProfile = ref(false);
const handleProfileChange = (command: string) => {
  if (command === "profile") {
    visibleProfile.value = true;
  }
};

const onRouteChange = () => {
  showSubMenu.value = false;
};

const openSearchDialog = () => {
  showModal.value = true;
};

const navigateToStudent = (id: string) => {
  router.push({
    name: "academic-student-view",
    params: { id },
  });
  showModal.value = false;
  studentsStore.clearStudents();
};

const onSearchClose: DialogBeforeCloseFn = () => {
  studentsStore.clearStudents();
  showModal.value = false;
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/colors.scss";

.app-header {
  height: 72px;
  background: $bg-white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.active-child {
  svg {
    stroke: white !important;
  }
}

.icons-mobile-active {
  display: none;
}
a.router-link-exact-active .icons-mobile {
  display: none !important;
}
a.router-link-exact-active .icons-mobile-active {
  display: flex !important;
}

.bottom_tab {
  display: none;
}

.user-icons {
  display: none;
}

@media (max-width: 600px) {
  .tab-header {
    display: none;
  }

  .img-d {
    display: none;
  }

  .bottom_tab {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 90px;
    z-index: 9999;
    width: 100%;
    display: flex;
    justify-content: space-around;
    gap: 16px;
    background-color: #fff;
  }
}
</style>
