export const referancesRoutes = {
  path: "reference",
  children: [
    {
      path: "",
      name: "references",
      meta: { name: "academic" },
      component: () =>
        import("@/views/academic/references/AcademicSettingsView.vue"),
      children: [
        {
          path: "",
          redirect: "/academic/reference/schools-view",
        },
        {
          path: "roles-positions",
          name: "roles-positions",
          component: () =>
            import(
              "@/views/academic/references/roles-positions/RolesPositionsView.vue"
            ),
        },
        {
          path: "roles-positions/referance-degrees",
          name: "referance-degrees",
          component: () =>
            import(
              "@/views/academic/references/roles-positions/ReferanceDegreeView.vue"
            ),
        },
        {
          path: "roles-positions/referance-teams",
          name: "referance-teams",
          component: () =>
            import(
              "@/views/academic/references/roles-positions/TeamsPositionsView.vue"
            ),
        },
        {
          path: "schools-programs",
          name: "schools-programs",
          component: () =>
            import(
              "@/views/academic/references/schools-programs/SchoolsProgramsView.vue"
            ),
        },
        {
          path: "schools-view",
          name: "schools-view",
          component: () =>
            import("@/views/academic/references/programs/SchoolsView.vue"),
          meta: { breadcrumb: "schools", name: "academic" },
        },

        {
          path: "course-referance",
          name: "course-referance",
          component: () =>
            import(
              "@/views/academic/references/course-referance/CourseReferanceView.vue"
            ),
        },
        {
          path: "students",
          name: "reference-students",
          component: () => import("@/views/academic/students/StudentsView.vue"),
          meta: { breadcrumb: "students", name: "academic" },
        },
        {
          path: "curriculum",
          name: "reference-curriculum",
          component: () =>
            import(
              "@/views/academic/references/curriculum/CurriculumListView.vue"
            ),
          meta: { breadcrumb: "curriculum", name: "academic" },
        },
      ],
    },
    {
      path: "course-referance/create",
      name: "course-referance-create",
      meta: { name: "academic" },
      component: () =>
        import(
          "@/views/academic/references/course-referance/CreateCourseReferanceView.vue"
        ),
    },
    {
      path: "course-referance/:id",
      name: "course-referance-edit",
      meta: { name: "academic" },
      component: () =>
        import(
          "@/views/academic/references/course-referance/EditCourseReferanceView.vue"
        ),
    },
    {
      path: "schools-view/:id",
      name: "schools-detail",
      component: () =>
        import("@/views/academic/references/programs/ProgramsView.vue"),
      meta: { breadcrumb: "student", name: "academic" },
    },
    {
      path: "student/:id",
      name: "reference-student-edit",
      meta: { name: "academic" },
      component: () =>
        import("@/views/academic/students/UpdateStudentView.vue"),
    },
    {
      path: "curriculum/:id",
      name: "reference-curriculum-view",
      meta: { name: "academic" },
      component: () =>
        import("@/views/academic/references/curriculum/CurriculumView.vue"),
    },
    {
      path: "masterdata",
      name: "masterdata",
      meta: { name: "masterdata" },
      component: () => import("@/views/academic/references/MasterdataView.vue"),
      children: [
        {
          path: "",
          redirect: "/academic/reference/masterdata/degree-types",
        },
        {
          path: "prequisite-tests",
          name: "masterdata-prequisite-tests",
          component: () =>
            import(
              "@/views/academic/references/prequisite-tests/PrequisiteTestsView.vue"
            ),
        },
        {
          path: "years-semesters",
          name: "masterdata-years-semesters",
          component: () =>
            import(
              "@/views/academic/references/years-semesters/YearsSemestersView.vue"
            ),
        },
        {
          path: "degree-types",
          name: "masterdata-degree-types",
          component: () =>
            import(
              "@/views/academic/references/degree-types/DegreeTypesView.vue"
            ),
        },
        {
          path: "grade-components",
          name: "masterdata-grade-components",
          component: () =>
            import(
              "@/views/academic/references/grade-components/GradeComponentsView.vue"
            ),
        },
        {
          path: "lesson-types",
          name: "masterdata-lesson-types",
          component: () =>
            import(
              "@/views/academic/references/lesson-types/LessonTypesView.vue"
            ),
        },
        {
          path: "rooms",
          name: "masterdata-rooms",
          component: () =>
            import("@/views/academic/references/rooms/RoomsView.vue"),
        },
        {
          path: "scholarship",
          name: "scholarships",
          component: () =>
            import(
              "@/views/academic/references/scholarships/ScholarshipsView.vue"
            ),
        },
      ],
    },
  ],
};
