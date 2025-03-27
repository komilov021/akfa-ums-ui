export const academicYearRoutes = {
  path: "academic",
  children: [
    {
      path: "",
      name: "academic",
      redirect: "/academic/academic/year",
    },
    {
      path: "year",
      name: "year",
      component: () => import("@/views/academic/academic/AcademicYearView.vue"),
      meta: { breadcrumb: "year" },
    },
    {
      path: "semestrs",
      name: "semestrs",
      component: () =>
        import("@/views/academic/academic/AcademicSemestrsView.vue"),
      meta: { breadcrumb: "semestrs" },
    },
  ],
};
