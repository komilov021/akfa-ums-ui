import DashboardLayout from "@/layout/DashboardLayout.vue";
export const financeRoutes = {
  path: "/finance",
  component: DashboardLayout,
  name: "finance",
  meta: { name: "finance" },
  children: [
    {
      path: "",
      redirect: "/finance/status",
    },
    {
      path: "dashboard",
      name: "finance-dashboard",
      component: () => import("@/views/finance/dashboard/DashboardView.vue"),
      meta: { breadcrumb: "finance-dashboard" },
    },
    {
      path: "history",
      name: "finance-history",
      component: () => import("@/views/finance/history/HistoryView.vue"),
      meta: { breadcrumb: "finance-history" },
    },
    {
      path: "status",
      name: "finance-status",
      component: () => import("@/views/finance/status/FinanceView.vue"),
      meta: { breadcrumb: "finance-status" },
    },
    {
      path: "status/:id",
      name: "finance-status-detail",
      component: () => import("@/views/finance/status/StatusDetailView.vue"),
      meta: { breadcrumb: "finance-status" },
    },
    {
      path: "programs",
      name: "finance-programs",
      component: () =>
        import("@/views/finance/finance-programs/FinanceProgamsView.vue"),
      meta: { breadcrumb: "finance-programs" },
    },
    {
      path: "programs/:id",
      name: "finance-programs-detail",
      component: () =>
        import("@/views/finance/finance-programs/FinanceProgamDetailView.vue"),
      meta: { breadcrumb: "finance-program-detail" },
    },
    {
      path: "scholarship",
      name: "scholarship-configuration",
      component: () =>
        import(
          "@/views/finance/scholarship-configuration/ScholarshipConfigurationView.vue"
        ),
      meta: { breadcrumb: "scholarship-configuration" },
    },
  ],
};
