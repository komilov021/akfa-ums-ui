import DashboardLayout from "@/layout/DashboardLayout.vue";

export const admissionRoutes = {
  path: "/admission",
  name: "admission",
  component: DashboardLayout,
  children: [
    {
      path: "",
      redirect: "/admission/applicants",
    },
    {
      path: "applicants",
      name: "applicants",
      component: () => import("@/views/admission/ApplicantsView.vue"),
    },
    {
      path: "applicants-programs",
      name: "applicants-programs",
      component: () => import("@/views/admission/ApplicantsProgramsView.vue"),
    },
    {
      path: "kanban",
      name: "applicants-kanbans",
      component: () => import("@/views/admission/KanbanView.vue"),
    },
    {
      path: "applicants/create",
      name: "create-applicants",
      component: () => import("@/views/admission/CreateApplicationView.vue"),
    },
    {
      path: "exam-years",
      name: "exam-years",
      component: () => import("@/views/admission/ExamYearsView.vue"),
    },
    // {
    //   path: "exam-years/:id",
    //   name: "exam-dates",
    //   component: () => import("@/views/admission/ExamDatesView.vue"),
    // },
    {
      path: "exam-years/:id",
      name: "exam-dates",
      component: () => import("@/views/admission/exam/ExamDateView.vue"),
    },
    {
      path: "departments",
      name: "departments",
      component: () => import("@/views/admission/DepartmentsView.vue"),
      meta: { admin: true },
    },
    {
      path: "metrics",
      name: "admission-metrics",
      component: () => import("@/views/dashboard/AdmissionStatistics.vue"),
      meta: { breadcrumb: "admission-metrics" },
    },
    {
      path: "additional-metrics",
      name: "additional-metrics",
      component: () => import("@/views/admission/AdditionalView.vue"),
      meta: { breadcrumb: "additional-metrics" },
    },
  ],
};
