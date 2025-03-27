<template>
  <el-dropdown
    @command="handleProfileChange"
    trigger="hover"
    class="flex justify-center dropdown reset-password"
  >
    <div
      :class="
        activeDropdownItem
          ? 'text-white bg-[#344054]'
          : 'text-[#1B1B1B] border-[#D0D5DD] font-semibold'
      "
      class="md:hidden"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="font-medium"
      >
        <path
          d="M14.4329 13.2497C13.481 11.6041 12.0142 10.4241 10.3023 9.86475C11.1491 9.36066 11.8069 8.59255 12.1749 7.67837C12.5429 6.76419 12.6006 5.7545 12.3392 4.80435C12.0778 3.85419 11.5117 3.01612 10.7279 2.41883C9.94408 1.82153 8.98587 1.49805 8.00041 1.49805C7.01496 1.49805 6.05675 1.82153 5.27293 2.41883C4.48911 3.01612 3.92304 3.85419 3.66163 4.80435C3.40022 5.7545 3.45793 6.76419 3.82591 7.67837C4.19388 8.59255 4.85177 9.36066 5.69854 9.86475C3.98666 10.4235 2.51979 11.6035 1.56791 13.2497C1.53301 13.3067 1.50985 13.37 1.49982 13.436C1.48978 13.502 1.49307 13.5694 1.50949 13.6341C1.52591 13.6988 1.55512 13.7596 1.59541 13.8128C1.63569 13.8661 1.68624 13.9107 1.74405 13.9441C1.80187 13.9775 1.86579 13.999 1.93204 14.0073C1.9983 14.0156 2.06554 14.0105 2.1298 13.9924C2.19407 13.9743 2.25405 13.9435 2.30622 13.9018C2.35838 13.8601 2.40168 13.8084 2.43354 13.7497C3.61104 11.7147 5.69229 10.4997 8.00041 10.4997C10.3085 10.4997 12.3898 11.7147 13.5673 13.7497C13.5992 13.8084 13.6424 13.8601 13.6946 13.9018C13.7468 13.9435 13.8068 13.9743 13.871 13.9924C13.9353 14.0105 14.0025 14.0156 14.0688 14.0073C14.135 13.999 14.199 13.9775 14.2568 13.9441C14.3146 13.9107 14.3651 13.8661 14.4054 13.8128C14.4457 13.7596 14.4749 13.6988 14.4913 13.6341C14.5078 13.5694 14.511 13.502 14.501 13.436C14.491 13.37 14.4678 13.3067 14.4329 13.2497ZM4.50041 5.99975C4.50041 5.30751 4.70569 4.63082 5.09027 4.05525C5.47485 3.47968 6.02148 3.03108 6.66102 2.76617C7.30056 2.50126 8.0043 2.43195 8.68323 2.567C9.36216 2.70205 9.9858 3.03539 10.4753 3.52487C10.9648 4.01436 11.2981 4.638 11.4332 5.31693C11.5682 5.99586 11.4989 6.6996 11.234 7.33914C10.9691 7.97868 10.5205 8.52531 9.94491 8.90989C9.36934 9.29448 8.69265 9.49975 8.00041 9.49975C7.07246 9.49875 6.1828 9.12969 5.52664 8.47353C4.87047 7.81736 4.50141 6.9277 4.50041 5.99975Z"
          fill="#343330"
        />
      </svg>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-popover :visible="visibleProfile" placement="bottom" :width="140">
          <template #reference>
            <div class="items-start p-3" ref="excludeRef">
              <h1 class="font-semibold text-sm">
                {{ store.getUser?.first_name + " " + store.getUser?.last_name }}
              </h1>
              <h1 class="font-semibold text-sm text-[#92929D]">
                {{ store.getUser?.role }}
              </h1>
              <h1 class="font-semibold text-sm text-[#92929D]">
                {{ store.getUser?.email }}
              </h1>
              <!-- <el-button
                size="small"
                type="primary"
                class="self-center mt-2 w-18"
                @click="visibleProfile = false"
                >Close</el-button
              > -->
            </div>
          </template>
        </el-popover>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- <el-popover :visible="visibleProfile" placement="bottom" :width="160">
    <div class="items-start p-3" ref="excludeRef">
      <h1 class="font-semibold text-sm">
        {{ store.getUser?.first_name + " " + store.getUser?.last_name }}
      </h1>
      <h1 class="font-semibold text-sm text-[#92929D]">
        {{ store.getUser?.role }}
      </h1>
      <h1 class="font-semibold text-sm text-[#92929D]">
        {{ store.getUser?.email }}
      </h1>
      <el-button
        size="small"
        type="primary"
        class="self-center mt-2 w-18"
        @click="visibleProfile = false"
        >Close</el-button
      >
    </div>
    <template #reference>
      <div
        :class="
          activeDropdownItem
            ? 'text-white bg-[#344054]'
            : 'text-[#1B1B1B] border-[#D0D5DD]'
        "
        class="md:hidden"
        @click="visibleProfile = true"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.4329 13.2497C13.481 11.6041 12.0142 10.4241 10.3023 9.86475C11.1491 9.36066 11.8069 8.59255 12.1749 7.67837C12.5429 6.76419 12.6006 5.7545 12.3392 4.80435C12.0778 3.85419 11.5117 3.01612 10.7279 2.41883C9.94408 1.82153 8.98587 1.49805 8.00041 1.49805C7.01496 1.49805 6.05675 1.82153 5.27293 2.41883C4.48911 3.01612 3.92304 3.85419 3.66163 4.80435C3.40022 5.7545 3.45793 6.76419 3.82591 7.67837C4.19388 8.59255 4.85177 9.36066 5.69854 9.86475C3.98666 10.4235 2.51979 11.6035 1.56791 13.2497C1.53301 13.3067 1.50985 13.37 1.49982 13.436C1.48978 13.502 1.49307 13.5694 1.50949 13.6341C1.52591 13.6988 1.55512 13.7596 1.59541 13.8128C1.63569 13.8661 1.68624 13.9107 1.74405 13.9441C1.80187 13.9775 1.86579 13.999 1.93204 14.0073C1.9983 14.0156 2.06554 14.0105 2.1298 13.9924C2.19407 13.9743 2.25405 13.9435 2.30622 13.9018C2.35838 13.8601 2.40168 13.8084 2.43354 13.7497C3.61104 11.7147 5.69229 10.4997 8.00041 10.4997C10.3085 10.4997 12.3898 11.7147 13.5673 13.7497C13.5992 13.8084 13.6424 13.8601 13.6946 13.9018C13.7468 13.9435 13.8068 13.9743 13.871 13.9924C13.9353 14.0105 14.0025 14.0156 14.0688 14.0073C14.135 13.999 14.199 13.9775 14.2568 13.9441C14.3146 13.9107 14.3651 13.8661 14.4054 13.8128C14.4457 13.7596 14.4749 13.6988 14.4913 13.6341C14.5078 13.5694 14.511 13.502 14.501 13.436C14.491 13.37 14.4678 13.3067 14.4329 13.2497ZM4.50041 5.99975C4.50041 5.30751 4.70569 4.63082 5.09027 4.05525C5.47485 3.47968 6.02148 3.03108 6.66102 2.76617C7.30056 2.50126 8.0043 2.43195 8.68323 2.567C9.36216 2.70205 9.9858 3.03539 10.4753 3.52487C10.9648 4.01436 11.2981 4.638 11.4332 5.31693C11.5682 5.99586 11.4989 6.6996 11.234 7.33914C10.9691 7.97868 10.5205 8.52531 9.94491 8.90989C9.36934 9.29448 8.69265 9.49975 8.00041 9.49975C7.07246 9.49875 6.1828 9.12969 5.52664 8.47353C4.87047 7.81736 4.50141 6.9277 4.50041 5.99975Z"
            fill="#343330"
          />
        </svg>
      </div>
    </template>
  </el-popover> -->
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useUsersStore } from "@/stores/user";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";

const props = defineProps<{
  theme?: "light" | "dark";
}>();

const store = useUsersStore();
const I18n = useI18n();
const router = useRouter();
const route = useRoute();

const visibleProfile = ref(false);
const showResetModal = ref(false);
const showPaymentModal = ref(false);
const showLogoModal = ref(false);
const activeDropdownItem = ref(null);

const componentRef = ref();
const excludeRef = ref();

useClickOutside(
  componentRef,
  () => {
    visibleProfile.value = false;
  },
  excludeRef
);

//dropdown
function useClickOutside(component: any, callback: any, excludeComponent: any) {
  function listener(event: Event) {
    if (
      event.target === component.value ||
      event.composedPath().includes(component.value) ||
      event.target === excludeComponent.value ||
      event.composedPath().includes(excludeComponent.value)
    ) {
      return;
    }
    if (typeof callback === "function") {
      callback();
    }
  }
  onMounted(() => {
    window.addEventListener("click", listener);
  });
}
//dropdown
onMounted(() => {
  checkDropdown();
});

const handleProfileChange = (command: string) => {
  if (command === "profile") {
    visibleProfile.value = true;
  }
};

const dropdownNames = {
  academic: "Academic settings",
  masterdata: "Master data settings",
} as any;
const upenLogoModal = () => {
  showLogoModal.value = true;
};

watch(
  () => route.name,
  () => {
    checkDropdown();
  }
);

const checkDropdown = () => {
  if (Object.keys(dropdownNames).find((key) => key === route.meta?.name)) {
    activeDropdownItem.value = dropdownNames[route.meta?.name as string];
  } else {
    activeDropdownItem.value = null;
  }
};
</script>

<style scoped lang="scss">
.dropdown {
  .dark {
    background-color: #ffffff !important;
  }
}
</style>
<style>
.el-dialog.reset {
  background-color: #fff !important;
}

@media (min-width: 600px) {
  .mobile-drop {
    display: none;
  }

  .svg-mobile {
    display: none;
  }
}

@media (max-width: 600px) {
  .desktop-drop {
    display: none;
  }

  .svg-desktop {
    display: none;
  }
}
</style>
