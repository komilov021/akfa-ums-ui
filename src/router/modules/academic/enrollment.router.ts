export const courseEnrollmentRoutes = {
  path: "course-enrollment",
  children: [
    {
      path: "",
      name: "course-enrollment",
      component: () =>
        import(
          "@/views/academic/course-enrollment/CourseEnrollmentListView.vue"
        ),
      meta: { breadcrumb: "course-enrollment" },
    },
    {
      path: "summary/:id",
      name: "enrollment-summary",
      component: () =>
        import("@/views/academic/course-enrollment/EnrollmentSummaryView.vue"),
      meta: { breadcrumb: "enrollment-summary" },
    },
    {
      path: "status/:id",
      name: "enrollment-status",
      component: () =>
        import("@/views/academic/course-enrollment/EnrollmentStatusView.vue"),
      meta: { breadcrumb: "enrollment-status" },
    },
  ],
};
