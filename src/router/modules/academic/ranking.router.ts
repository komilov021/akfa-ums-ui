export const rankingRoutes = {
  path: "ranking",
  name: "ranking",
  children: [
    {
      path: "",
      name: "ranking-view",
      component: () => import("@/views/academic/ranking/RankingView.vue"),
      meta: { breadcrumb: "ranking" },
    },
    {
      path: ":id",
      name: "ranking-detail",
      component: () =>
        import("@/views/academic/ranking/RankingDetailsView.vue"),
      meta: { breadcrumb: "student" },
    },
    {
      path: ":id/:student",
      name: "ranking-grade",
      component: () => import("@/views/academic/ranking/MainGradesRanking.vue"),
      meta: { breadcrumb: "student" },
    },
  ],
};
