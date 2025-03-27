export const coursesRoutes = {
  path: "courses",
  children: [
    {
      path: "",
      name: "course",
      component: () => import("@/views/academic/courses/CoursesView.vue"),
      meta: { breadcrumb: "courses" },
    },
    {
      path: "students/:id",
      name: "course-students",
      component: () =>
        import("@/views/academic/courses/CourseStudentsView.vue"),
      meta: { breadcrumb: "course-students" },
    },
    {
      path: "functions/:id",
      name: "course-functions",
      component: () =>
        import("@/views/academic/courses/CourseFunctionsView.vue"),
      meta: { breadcrumb: "course-functions" },
    },
    {
      path: "grades/:id",
      name: "course-grades",
      component: () => import("@/views/academic/courses/CourseGradesView.vue"),
      meta: { breadcrumb: "course-grades" },
    },
    {
      path: "grades/:course_id/:function_id",
      name: "function-grades",
      component: () =>
        import("@/views/academic/courses/FunctionGradesView.vue"),
      meta: { breadcrumb: "function-grades" },
    },
  ],
};
