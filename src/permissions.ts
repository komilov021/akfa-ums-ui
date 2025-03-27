import router from "./router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ElMessage } from "element-plus";
import type { RouteLocationNormalized } from "vue-router";
import { useGeneralInfoStore, useUsersStore } from "./stores";
import { i18n } from "@/i18n";
import { ALLOWED_EMAILS } from "@/utils/constants";

const title = "Eduplus- Admin";

NProgress.configure({ showSpinner: false });

const whiteList = [
  "/login",
  "/signin",
  "/check-mail",
  "/forgot-password",
  "/reset-password",
  "/sso-callback",
];

const getPageTitle = (key: string) => {
  const { t, te } = i18n.global as any;
  const hasKey = te(`app.${key}`) as any;
  if (hasKey) {
    const pageName = t(`app.${key}`);

    return `${pageName} - ${title}`;
  }
  return title;
};

const isAIModuleRouteAccessible = (
  to: RouteLocationNormalized,
  email: string,
  next: any
) => {
  if (!to.path.includes("/ai-modules")) {
    next();
  }

  const isAiModuleFileRouteAccessible = !!ALLOWED_EMAILS.includes(email);

  if (!isAiModuleFileRouteAccessible) {
    next("/");
  }

  next();
};

router.beforeEach(
  async (
    to: RouteLocationNormalized,
    _: RouteLocationNormalized,
    next: any
  ) => {
    const store = useUsersStore();
    const universityStore = useGeneralInfoStore();

    // Start progress bar
    NProgress.start();

    // Determine whether the user has logged in
    if (store.token) {
      if (to.path === "/login" || to.path === "/signin") {
        // If is logged in, redirect to the home page
        next({ path: "/" });
        NProgress.done();
      } else if (to.path === "/verification" && !store.user?.is_verified) {
        next();
      } else {
        // Check whether the user has obtained his permission roles
        if (!store.getUser) {
          try {
            await store.getUserInfo();

            if (!universityStore.getUniversity) {
              universityStore.fetchUniversityInfo();
            }

            if (!store.user) {
              store.resetToken();
              next(`/login`);
            } else if (!store.user?.is_verified) {
              next("/check-mail");
            } else {
              next({ ...to, replace: true });
            }
          } catch (err: any) {
            store.resetToken();
            ElMessage({
              message: err?.message || "Has Error",
              type: "error",
              duration: 5 * 1000,
            });
            next(`/login?redirect=${to.path}`);
            NProgress.done();
          }
        } else {
          const email = store.user?.email ?? "";
          isAIModuleRouteAccessible(to, email, next);
        }
      }
    } else {
      // Has no token
      if (whiteList.indexOf(to.path) !== -1) {
        // In the free login whitelist, go directly
        next();
      } else {
        // Other pages that do not have permission to access are redirected to the login page.
        next(`/login?redirect=${to.path}`);
        NProgress.done();
      }
    }
  }
);

router.afterEach((to: RouteLocationNormalized) => {
  NProgress.done();
  document.title = getPageTitle((to.name || "") as string);
});
