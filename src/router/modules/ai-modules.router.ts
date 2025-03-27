import DashboardLayout from "@/layout/DashboardLayout.vue";

export const aiModulesRoutes = {
  path: "/ai-modules",
  name: "ai-modules",
  component: DashboardLayout,
  children: [
    {
      path: "",
      redirect: "/ai-modules/elective-courses",
    },
    {
      path: "elective-courses",
      name: "elective-courses",
      component: () => import("@/views/ai-modules/ElectiveCoursesView.vue"),
    },
    {
      path: "elective-courses/:flow_group_id",
      name: "elective-course-lessons",
      component: () =>
        import("@/views/ai-modules/ElectiveCourseLessonsView.vue"),
    },
    {
      path: "elective-courses/:flow_group_id/:lesson_id",
      name: "elective-course-lesson-detail",
      component: () =>
        import("@/views/ai-modules/ElectiveCourseLessonDetail.vue"),
    },
    {
      path: "contents",
      name: "ai-modules-contents",
      component: () => import("@/views/ai-modules/AiModulesContents.vue"),
    },
  ],
};
