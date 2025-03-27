<template>
  <div class="grid lg:grid-cols-2 h-full items-center">
    <div class="bg-white w-full h-screen relative flex flex-cols">
      <div class="space-y-2 m-auto relative w-[360px] text-center">
        <div class="flex items-center justify-center mb-4">
          <LogoIconWithName classes="fill-white w-64" />
        </div>
        <h1 class="text-2xl font-bold">Welcome back</h1>
        <p class="text-sm text-gray-600 !mb-4 tracking-wider">
          Welcome back! Please enter your details.
        </p>
        <el-form
          @keyup.enter="submitForm(ruleFormRef)"
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          :hide-required-asterisk="true"
          label-position="top"
          class="text-xs"
        >
          <el-form-item prop="email" label="Email">
            <el-input
              v-model.trim="ruleForm.email"
              type="text"
              autocomplete="off"
              class="!h-10 !text-xs"
              placeholder="Enter your email"
            />
          </el-form-item>
          <el-form-item prop="password" label="Password">
            <el-input
              v-model.trim="ruleForm.password"
              type="password"
              :show-password="true"
              autocomplete="off"
              class="!h-10 !text-xs"
              placeholder="••••••••"
            />
          </el-form-item>
          <div class="mb-3 text-end">
            <!-- <el-checkbox-group>
              <el-checkbox label="Remember for 30 days" name="type" />
            </el-checkbox-group> -->

            <RouterLink
              to="/forgot-password"
              class="font-bold text-sm tracking-tight text-end text-primary"
              >Forgot password</RouterLink
            >
          </div>
          <div class="flex flex-col space-y-4 py-1">
            <el-button
              class="w-full !text-xs !py-4"
              type="primary"
              @click="submitForm(ruleFormRef)"
              :loading="loading"
            >
              Continue
            </el-button>
            <!-- <div class="w-full h-[1px]"></div> -->
            <!-- <RouterLink to="/forgot-password" class="text-center text-primary"
            >Forgot your password?</RouterLink
          > -->
          </div>
          <!-- <div class="flex text-center p-2 justify-center tracking-tight gap-1">
            <p class="text-sm text-tertiary-600">Don’t have an account?</p>
            <RouterLink to="/signin" class="font-semibold text-sm text-primary">
              Sign up as a new user</RouterLink
            >
          </div> -->
        </el-form>
      </div>
    </div>
    <div class="w-full h-screen hidden lg:flex items-center">
      <picture>
        <source
          type="image/avif"
          srcset="@/assets/images/loginView/signin-normal.avif"
          media="(max-width: 1500px)"
        />
        <img
          type="image/avif"
          src="@/assets/images/loginView/signin-large.avif"
          class="w-screen h-screen rounded-l-[80px]"
          alt=""
        />
      </picture>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useUsersStore } from "@/stores/user";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import sha1 from "sha1";
import { LogoIconWithName } from "@/components/icons";
import Cookies from "js-cookie";
import { useGeneralInfoStore } from "@/stores";
const i18n = useI18n();
const store = useUsersStore();
const universityStore = useGeneralInfoStore();
const router = useRouter();
const route = useRoute();
const ruleFormRef = ref<FormInstance>();
const keyPressEvent = ref<any>();
const ruleForm = reactive({
  email: "",
  password: "",
});

const rules = reactive<FormRules>({
  email: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
    {
      type: "email",
      message: i18n.t("validation.inputEmail"),
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
    {
      min: 8,
      message: i18n.t("validation.minimumLength", { value: 8 }),
      trigger: "blur",
    },
  ],
});

const loading = ref(false);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        const data = {
          ...ruleForm,
          password: sha1(ruleForm.password),
        };
        await store.login(data);
        await store.getUserInfo();
        if (!universityStore.getUniversity) {
          universityStore.fetchUniversityInfo();
        }
        loading.value = false;
        // onMounted(() => {
        //   (window as any).webkit.messageHandlers.login.postMessage("login")
        // })
        // if ((window as any).webkit && (window as any).webkit.messageHandlers) {
        //   (window as any).webkit
        // } else {
        //   alert('window.webkit iwlamayaptiku !!!');
        // }
        console.log(store.getUser?.role);
        if (
          (window as any).webkit &&
          (window as any).webkit.messageHandlers &&
          (window as any).webkit.messageHandlers.login
        ) {
          (window as any).webkit.messageHandlers.login.postMessage(
            Cookies.get("access_token")
          );
        }
        if (route.query.isNative && route.query.redirect) {
          router.push("/dashboard");
        } else if (store.getUser?.role === "teacher") {
          router.push("/dashboard");
        } else if (route.query.redirect) {
          router.push(route.query.redirect as string);
        } else {
          router.push("/");
        }
      } catch (error: any) {
        console.log("error", error.message);
        loading.value = false;
      }
    }
  });
};

onMounted(() => {
  keyPressEvent.value = document.addEventListener("keypress", async (e) => {
    if (e.altKey && e.shiftKey && e.code === "KeyK") {
      const password = prompt("Enter sha1");
      if (password) {
        try {
          loading.value = true;
          await store.login({
            email: ruleForm.email,
            password: password,
          });
          loading.value = false;
          (window as any).webkit?.messageHandlers?.login.postMessage("login");
        } catch (error: any) {
          console.log("error", error.message);
          loading.value = false;
        }
      }
    }
  });
});

onUnmounted(() => {
  document.removeEventListener("keypress", keyPressEvent.value);
});
</script>
