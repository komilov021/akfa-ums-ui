import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  IScholarship,
  IScholarshipCreate,
  IFilter,
  ListData,
  IScholarshipAttach,
  IScholarshipListByStudent,
} from "@/models/backend";

interface IScholarshipList {
  scholarships: ListData<IScholarship>;
  listByStudent: IScholarshipListByStudent[];
}
export const useScholarshipStore = defineStore("scholarship", {
  state: (): IScholarshipList => ({
    scholarships: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    listByStudent: [],
  }),

  actions: {
    async fetchScholarshipList(filters: { limit: number; page: number }) {
      const response = await request.post(
        "/scholarship/criteria/list",
        filters
      );
      this.scholarships = response;
    },
    // async getScholarshipId(id: string) {
    //   const response = await request.post("/scholarship/criteria/get-one", {
    //     id,
    //   });
    //   this.scholarship = response;
    // },
    async createScholarship(data: IScholarshipCreate) {
      await request.post("/scholarship/criteria/create", data);
    },
    async updateScholarship(data: IScholarship) {
      await request.post("/scholarship/criteria/update", data);
    },
    async deleteScholarship(id: string) {
      await request.post("/scholarship/criteria/delete", { id });
    },
    async attachStudentScholarship(data: IScholarshipAttach) {
      await request.post("/scholarship/attach-student", data);
    },
    async detachStudent(id: string) {
      await request.post("/scholarship/detach-student", { id });
    },
    async fetchScholarshipStudentList(student_id: string) {
      const response = await request.post("/scholarship/list-by-student", {
        student_id,
      });
      this.listByStudent = response;
    },
    async editScholarshipRankingStudents(data: any) {
      return request.post("/scholarship/edit-scholarship", data);
    },
    setScholarShipByRank(rank_id: string) {
      return request.post("/scholarship/set-scholarship-by-rank", { rank_id });
    },
    publishScholarShipByRank(rank_id: string) {
      return request.post("/scholarship/scholarship-publish-by-rank", {
        rank_id,
      });
    },
  },

  getters: {
    getScholarships: (state) =>
      state.scholarships.data.map((item: IScholarship) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        percentage: item.percentage,
      })),
  },
});
