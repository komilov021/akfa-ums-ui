import { createRouter, createWebHistory } from "vue-router";
import LoginLayout from "@/layout/LoginLayout.vue";
import EmptyLayout from "@/layout/EmptyLayout.vue";
import DashboardLayout from "@/layout/DashboardLayout.vue";
import { academicRoutes } from "./modules/academic";
import {
  admissionRoutes,
  dashboardRoutes,
  financeRoutes,
  administrativeRoutes,
  timetableRoutes,
  aiModulesRoutes,
} from "./modules";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      component: LoginLayout,
      children: [
        {
          path: "",
          name: "login",
          component: () => import("@/views/auth/LoginView.vue"),
        },
      ],
    },
    {
      path: "/check-mail",
      component: LoginLayout,
      children: [
        {
          path: "",
          name: "check-mail",
          component: () => import("@/views/auth/CheckMailView.vue"),
        },
      ],
    },
    {
      path: "/signin",
      component: LoginLayout,
      children: [
        {
          path: "",
          name: "signin",
          component: () => import("@/views/auth/SigninView.vue"),
        },
      ],
    },
    {
      path: "/sign-up",
      component: LoginLayout,
      children: [
        {
          path: "",
          name: "sign-up",
          component: () => import("@/views/auth/SignupView.vue"),
        },
      ],
    },
    {
      path: "/check-your-email",
      component: LoginLayout,
      children: [
        {
          path: "",
          name: "check-your-email",
          component: () => import("@/views/auth/CheckYourMail.View.vue"),
        },
      ],
    },
    {
      path: "/forgot-password",
      component: LoginLayout,
      children: [
        {
          path: "",
          name: "forgot-password",
          component: () => import("@/views/auth/ForgotPasswordView.vue"),
        },
      ],
    },
    {
      path: "/verification",
      component: LoginLayout,
      children: [
        {
          path: "",
          name: "verification",
          component: () => import("@/views/auth/InviteView.vue"),
        },
      ],
    },
    {
      path: "/reset-password",
      component: LoginLayout,
      children: [
        {
          path: "",
          name: "reset-password",
          component: () => import("@/views/auth/ResetPasswordView.vue"),
        },
      ],
    },
    {
      path: "/sso-callback",
      component: LoginLayout,
      children: [
        {
          path: "",
          name: "sso-callback",
          component: () => import("@/views/auth/SSOView.vue"),
        },
      ],
    },
    {
      path: "/staffs",

      component: DashboardLayout,
      children: [
        {
          path: "",
          name: "staffs",
          component: () => import("@/views/staffs/StafsView.vue"),
        },
      ],
    },
    academicRoutes,
    dashboardRoutes,
    admissionRoutes,
    financeRoutes,
    administrativeRoutes,
    timetableRoutes,
    aiModulesRoutes,
    {
      path: "",
      component: EmptyLayout,
      children: [
        {
          path: "",
          name: "main",
          component: () => import("@/views/MainView.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      component: () => import("@/views/404/404.vue"),
    },
  ],
});
router.onError((error: any, to: any) => {
  if (
    error.message.includes("Failed to fetch dynamically imported module") ||
    error.message.includes("Importing a module script failed")
  ) {
    if (!to?.fullPath) {
      window.location.reload();
    } else {
      window.location = to.fullPath;
    }
  }
});
export default router;
