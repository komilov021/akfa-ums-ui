import DashboardLightLayout from "@/layout/DashboardLightLayout.vue";

export const requestsRoutes = {
  path: "/requests",
  component: DashboardLightLayout,
  name: "requests",
  meta: { name: "requests" },
  children: [
    {
      path: "",
      name: "requests-view",
      component: () => import("@/views/academic/requests/RequestsView.vue"),
    },
  ],
};
