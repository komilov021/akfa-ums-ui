import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  IRankingCreate,
  TRankingUpdate,
  IRankingsFilter,
  IRankingsStudents,
  IStudent,
  ListData,
  IgetRankingByStudents,
  IsetScholarship,
  IgetRankingGrade,
  IcurrentRankGetOne,
  IgradeRanking,
} from "@/models/backend";

interface RankingState {
  rankings: ListData<IStudent>;
  rankingStudents: ListData<IRankingsStudents>;
  currentRank: IcurrentRankGetOne | null;
  headers: any[];
  gradeRanking: IgradeRanking[];
}

export const useRankingStore = defineStore("ranking", {
  state: (): RankingState => ({
    rankings: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    headers: [],
    rankingStudents: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    gradeRanking: [],
    currentRank: null,
  }),

  actions: {
    async fetchRanking(filters: IRankingsFilter) {
      const response = await request.post("/ranking/list", filters);
      this.rankings = response;
    },
    async editRanking(data: TRankingUpdate) {
      return request.post("/ranking/update", data);
    },
    async removeRanking(data: { id: string }) {
      return request.post("/ranking/remove", data);
    },
    async createRanking(id: IRankingCreate) {
      return request.post("/ranking/create", id);
    },
    async getRankingById(id: string) {
      const response = await request.post("/ranking/get-one", { id });
      this.currentRank = response;
    },
    async getRankingByStudents(data: IgetRankingByStudents) {
      const response = await request.post("/ranking/students", data);
      this.rankingStudents = response;
    },
    async setScholarship(data: IsetScholarship) {
      return request.post("/ranking/set-scholarship", data);
    },
    async getRankingGrade(data: IgetRankingGrade) {
      const response = await request.post(
        "/ranking/student-main-grades-list-by-ranking",
        data
      );
      this.gradeRanking = response;
    },
  },
  getters: {
    // getCourses: (state) =>
    //   state.courses.data.map((course) => ({
    //     ...course,
    //     programs: course.programs.map((p) => p.name).join(","),
    //   })),
  },
});
