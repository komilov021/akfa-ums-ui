export const academicPabRoutes = {
  path: "pab",
  children: [
    {
      path: "",
      redirect: "/academic/pab/programs",
    },
    {
      path: "programs",
      name: "academic-pab-programs",
      component: () => import("@/views/academic/pab/ProgramsCard.vue"),
    },
    {
      path: "programs/:program",
      name: "academic-pab-curriculum",
      component: () => import("@/views/academic/pab/CurriculumCardsView.vue"),
    },
    {
      path: "programs/:program/:year",
      name: "academic-pab-levels",
      component: () => import("@/views/academic/pab/LevelsCardsView.vue"),
    },
    {
      path: "programs/:program/:year/:curriculum",
      name: "academic-pab-tabs",
      component: () => import("@/views/academic/pab/pabs/PabsView.vue"),
      children: [
        {
          path: "",
          redirect: "pab-one",
        },
        {
          path: "pab-one",
          name: "academic-pab-one",
          component: () => import("@/views/academic/pab/pabs/PabOneView.vue"),
        },
        {
          path: "pab-two",
          name: "academic-pab-two",
          component: () => import("@/views/academic/pab/pabs/PabTwoView.vue"),
        },
        {
          path: "pab-three",
          name: "academic-pab-three",
          component: () => import("@/views/academic/pab/pabs/PabThreeView.vue"),
        },
        {
          path: "pab-four",
          name: "academic-pab-four",
          component: () => import("@/views/academic/pab/pabs/PabFourView.vue"),
        },
      ],
    },
  ],
};
