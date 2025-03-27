export const academicGroupsRoutes = {
  path: "groups",
  children: [
    {
      path: "",
      name: "group-years",
      component: () => import("@/views/academic/groups/GroupSemestersView.vue"),
    },
    {
      path: "/academic/groups/:semester",
      name: "group-levels",
      component: () => import("@/views/academic/groups/GroupLevelsView.vue"),
    },
    {
      path: "/academic/groups/:semester/:level",
      name: "group-courses-view",
      component: () => import("@/views/academic/groups/GroupCoursesView.vue"),
    },
    {
      path: "/academic/groups/:semester/:level/:course",
      name: "group-list-view",
      component: () => import("@/views/academic/groups/GroupListView.vue"),
    },
    {
      path: "/academic/groups/:semester/:level/:course/:group",
      name: "group-students-view",
      component: () => import("@/views/academic/groups/GroupStudentsView.vue"),
    },
    {
      path: "/academic/groups/:semester/:level/:course/:group/:teacher",
      name: "group-teachers-view",
      component: () => import("@/views/academic/groups/GroupTeachersView.vue"),
    },
  ],
};
