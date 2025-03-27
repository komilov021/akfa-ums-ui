import DashboardLayout from "@/layout/DashboardLayout.vue";

export const administrativeRoutes = {
  path: "/administrative",
  component: DashboardLayout,
  name: "administrative",
  meta: { name: "administrative" },
  children: [
    {
      path: "/administrative",
      redirect: "/",
      // redirect: "/administrative/access-roles",
    },
    {
      path: "access-roles",
      name: "access-roles",
      component: () => import("@/views/administrative/AccessRolesViiew.vue"),
      meta: { breadcrumb: "access-roles" },
    },
    {
      path: "permissions",
      name: "permissions",
      component: () => import("@/views/administrative/PermissionsView.vue"),
      meta: { breadcrumb: "permissions" },
    },
  ],
};
