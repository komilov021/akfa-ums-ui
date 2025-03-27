import DashboardLayout from "@/layout/DashboardLightLayout.vue";
import { academicYearRoutes } from "./academic.router";
import { coursesRoutes } from "./courses.router";
import { courseEnrollmentRoutes } from "./enrollment.router";
import { rankingRoutes } from "./ranking.router";
import { studentsRoutes } from "./students.router";
// import { programsRoutes } from "./programs.router";
import { referancesRoutes } from "./referances.router";
import { requestsRoutes } from "./requests.router";
import { academicManagmentRoutes } from "./academic-managment.router";
import { academicGroupsRoutes } from "./groups.router";
import { academicPabRoutes } from "./pab.router";
import { aiModulesRoutes } from "../ai-modules.router";

export const academicRoutes = {
  path: "/academic",
  name: "academic",
  component: DashboardLayout,
  children: [
    {
      path: "",
      redirect: "/academic/managment",
    },
    // {
    //   path: "dashboard",
    //   redirect: "/dashboard/general",
    // },
    {
      path: "subjects",
      name: "subjects",
      component: () => import("@/views/academic/subjects/SubjectsView.vue"),
      meta: { breadcrumb: "subjects" },
    },
    {
      path: "certificates-history",
      name: "Certificates",
      component: () => import("@/views/academic/certificates/HistoryView.vue"),
      meta: { breadcrumb: "certificates" },
    },
    {
      path: "certificates-history/:id",
      name: "Certificate",
      component: () => import("@/views/academic/certificates/Certificate.vue"),
      meta: { breadcrumb: "certificate" },
    },
    {
      path: "dashboard",
      name: "academic-dashboard",
      component: () => import("@/views/academic/dashboard/DashboardView.vue"),
      meta: { breadcrumb: "dashboard" },
    },
    academicManagmentRoutes,
    academicPabRoutes,
    academicGroupsRoutes,
    academicYearRoutes,
    academicGroupsRoutes,
    coursesRoutes,
    rankingRoutes,
    studentsRoutes,
    courseEnrollmentRoutes,
    referancesRoutes,
    requestsRoutes,
  ],
};
