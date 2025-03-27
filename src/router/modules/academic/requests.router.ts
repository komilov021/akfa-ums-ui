export const requestsRoutes = {
  path: "requests",
  name: "requests",
  children: [
    {
      path: "",
      redirect: "/academic/requests/all",
    },
    {
      path: ":status",
      name: "requests-view",
      component: () => import("@/views/academic/requests/RequestsView.vue"),
    },
  ],
};
