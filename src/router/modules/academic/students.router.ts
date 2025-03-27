export const studentsRoutes = {
  path: "students",
  children: [
    {
      path: "",
      name: "students",
      component: () => import("@/views/academic/students/StudentsView.vue"),
      meta: { breadcrumb: "students" },
    },
    {
      path: "courses/:id",
      name: "student-courses",
      component: () =>
        import("@/views/academic/students/StudentCoursesView.vue"),
      meta: { breadcrumb: "student-courses" },
    },
    {
      path: "courses/:student_id/:course_id",
      name: "student-course-details",
      component: () =>
        import("@/views/academic/students/StudentCourseDetailsView.vue"),
      meta: { breadcrumb: "student-course-details" },
    },
    {
      path: "transcript/:id",
      name: "student-transcript",
      component: () =>
        import("@/views/academic/students/StudentTranscriptView.vue"),
      meta: { breadcrumb: "student-transcript" },
    },
    {
      path: "students/:id",
      name: "student",
      component: () => import("@/views/academic/students/StudentView.vue"),
      meta: { breadcrumb: "student" },
    },
  ],
};
