import { defineStore } from "pinia";

import request from "@/utils/request";
import type { IProfessorDashboard } from "@/models/backend";
interface Professors {
  professors: any;
  professor: any;
  school_list: string[];
  urlImgGetOne: any | null;
}
export const useProfessorStore = defineStore("professor", {
  state: (): Professors => ({
    professors: {
      data: [] as any,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
      },
    },
    professor: null,
    school_list: [],
    urlImgGetOne: null,
  }),
  actions: {
    async createProfessor(data: any) {
      return request.post("/professors/create", data);
    },
    async fetchProfessor(filter: any) {
      const mazgiroute = new URLSearchParams({
        page: filter.page?.toString() || "1",
        limit: filter.limit?.toString() || "12",
        search: filter.search ? filter.search.toString() : "",
        select: filter.select ? filter.select.toString() : "",
      }).toString();
      const response = await request.get(`/professors?${mazgiroute}`);
      this.professors = response;
    },
    async getProfessorSchoolList() {
      const response = await request.get("/professors/s_list");
      this.school_list = response;
    },
    async getProfessorId(id: string) {
      const response = await request.get(`/professors/${id}`);
      this.professor = response;
    },
    async updateProfessor(id: string, data: any) {
      return request.patch(`/professors/${id}`, data);
    },
    async deleteProfessor(id: string) {
      await request.delete(`/professors/${id}`);
    },
  },

  getters: {},
});
