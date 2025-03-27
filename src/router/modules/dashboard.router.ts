import DashboardLayout from "@/layout/DashboardLightLayout.vue";

export const dashboardRoutes = {
  path: "/dashboard",
  component: DashboardLayout,
  name: "dashboard",
  meta: { name: "dashboard" },
  children: [
    {
      path: "/dashboard",
      redirect: "/dashboard/general",
    },
    {
      path: "",
      name: "dashboard",
      component: () => import("@/views/dashboard/DashboardView.vue"),
      meta: { breadcrumb: "dashboard" },
      children: [
        {
          path: "strategic",
          name: "strategic-dashboard",
          component: () => import("@/views/dashboard/StrategicMetricsView.vue"),
          meta: { breadcrumb: "strategic-dashboard" },
          // redirect: "/dashboard/general",
        },
        {
          path: "general",
          name: "general-dashboard",
          component: () =>
            import(
              "@/views/dashboard/components/strategic/GeneralStatistics.vue"
            ),
          meta: { breadcrumb: "general-dashboard" },
        },
        {
          path: "operational",
          name: "operational-dashboard",
          component: () =>
            import("@/views/dashboard/OperationalMetricsView.vue"),
          meta: { breadcrumb: "operational-dashboard" },
        },
        {
          path: "staff",
          name: "staff-dashboard",
          component: () => import("@/views/dashboard/Staff.vue"),
          meta: { breadcrumb: "staff-dashboard" },
        },
        // {
        //   path: "student",
        //   name: "student-dashboard",
        //   component: () => import("@/views/dashboard/StudentStatistics.vue"),
        //   meta: { breadcrumb: "student-dashboard" },
        // },
        {
          path: "admission",
          name: "admission-dashboard",
          component: () => import("@/views/dashboard/AdmissionStatistics.vue"),
          meta: { breadcrumb: "admission-dashboard" },
        },
      ],
    },
  ],
};
