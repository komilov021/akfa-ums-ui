import DashboardLayout from "@/layout/DashboardLayout.vue";

export const timetableRoutes = {
  path: "/timetable",
  component: DashboardLayout,
  name: "timetable",
  meta: { name: "timetable" },
  children: [
    {
      path: "/timetable",
      redirect: "/timetable/calendar",
    },
    {
      path: "calendar",
      name: "calendar",
      component: () => import("@/views/timetable/home/HomeView.vue"),
      meta: { breadcrumb: "calendar" },
    },
    {
      path: "calendar/:id",
      name: "calendar-detail",
      component: () => import("@/views/timetable/home/TimeTableView.vue"),
      meta: { breadcrumb: "calendar-detail" },
    },
    {
      path: "calendar/:id/:single_id",
      name: "calendar-detail-single",
      component: () => import("@/views/timetable/single/SingleView.vue"),
      meta: { breadcrumb: "calendar-detail-single" },
    },
    {
      path: "faculty",
      name: "faculty",
      component: () => import("@/views/timetable/faculty/FacultyView.vue"),
      meta: { breadcrumb: "faculty" },
    },
    {
      path: "classrooms",
      name: "classrooms",
      component: () =>
        import("@/views/timetable/classrooms/ClassroomsView.vue"),
      meta: { breadcrumb: "classrooms" },
    },
    {
      path: "courses",
      name: "courses",
      component: () => import("@/views/timetable/courses/CoursesView.vue"),
      meta: { breadcrumb: "courses" },
    },
    {
      path: "groups",
      name: "groups",
      component: () => import("@/views/timetable/groups/GroupsView.vue"),
      // children: [
      // {
      //   path: "",
      //   redirect: "/timetable/groups/group",
      // },
      // {
      //   path: "group",
      //   name: "timetable-group",
      //   component: () =>
      //     import("@/views/timetable/groups/TimetableGroupView.vue"),
      // },
      // {
      //   path: "student",
      //   name: "timetable-student",
      //   component: () =>
      //     import("@/views/timetable/groups/TimetableStudent.vue"),
      // },
      // ],
    },
    {
      path: "/timetable/groups/:id",
      name: "timetable-group-detail",
      component: () =>
        import("@/views/timetable/groups/TimetableGroupDetailView.vue"),
    },
    {
      path: "reports",
      name: "reports",
      component: () => import("@/views/timetable/reports/ReportsView.vue"),
      meta: { breadcrumb: "reports" },
    },
  ],
};
