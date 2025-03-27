export const academicManagmentRoutes = {
  path: "managment",
  children: [
    {
      path: "",
      redirect: "/academic/managment/programs",
    },
    {
      path: "programs",
      name: "academic-managment-programs",
      component: () =>
        import("@/views/academic/academic-managment/ProgramsCard.vue"),
    },
    {
      path: "programs/:program",
      name: "academic-managment-curriculum",
      component: () =>
        import("@/views/academic/academic-managment/CurriculumCardsView.vue"),
    },
    {
      path: "programs/:program/:year",
      name: "academic-managment-levels",
      component: () =>
        import("@/views/academic/academic-managment/LevelsCardsView.vue"),
    },
    {
      path: "student/:id",
      name: "academic-student-view",
      component: () => import("@/views/academic/students/StudentView.vue"),
    },
    {
      path: "programs/:program/:year/:curriculum",
      name: "academic-managment-tabs",
      component: () =>
        import(
          "@/views/academic/academic-managment/assigned-courses/AssignedCoursesTabView.vue"
        ),
      children: [
        {
          path: "",
          redirect: "courses",
        },
        {
          path: "courses",
          name: "academic-managment-courses",
          component: () =>
            import(
              "@/views/academic/academic-managment/assigned-courses/AssignedCoursesView.vue"
            ),
        },
        {
          path: "students",
          name: "academic-managment-students",
          component: () =>
            import(
              "@/views/academic/academic-managment/assigned-courses/AssignedStudentsView.vue"
            ),
        },
        {
          path: "progression",
          name: "academic-managment-progression",
          component: () =>
            import(
              "@/views/academic/academic-managment/assigned-courses/ProgressionResultView.vue"
            ),
        },
      ],
    },
    {
      path: "programs/:program/:year/:curriculum/students/:student",
      name: "academic-managment-student-view",
      component: () =>
        import(
          "@/views/academic/academic-managment/assigned-courses/AssignedStudentView.vue"
        ),
    },
    {
      path: "programs/:program/:year/:curriculum/:grade",
      name: "academic-managment-courses-grade",
      component: () =>
        import(
          "@/views/academic/academic-managment/assigned-courses/AssignedCourseGrade.vue"
        ),
    },
    {
      path: "programs/:program/:year/:curriculum/course/:grade",
      name: "academic-managment-course-view",
      component: () =>
        import(
          "@/views/academic/academic-managment/assigned-courses/AssignedCourseView.vue"
        ),
    },
    {
      path: "programs/:program/:year/:curriculum/:grade/grading/total",
      name: "academic-managment-total-grading",
      component: () =>
        import(
          "@/views/academic/academic-managment/general-grading/TotalGradingView.vue"
        ),
    },
    {
      path: "programs/:program/:year/:curriculum/:grade/grading/:component",
      name: "academic-managment-grading-view",
      component: () =>
        import(
          "@/views/academic/academic-managment/general-grading/GeneralGradingView.vue"
        ),
    },
    {
      path: "programs/:program/:year/:curriculum/:grade/weeks",
      name: "academic-managment-weeks",
      component: () =>
        import(
          "@/views/academic/academic-managment/teaching-week/TeachingWeeksView.vue"
        ),
    },
    {
      path: "programs/:program/:year/:curriculum/:grade/weeks/:week",
      name: "academic-managment-weeks-view",
      component: () =>
        import(
          "@/views/academic/academic-managment/teaching-week/TeachingWeekView.vue"
        ),
    },
  ],
};
