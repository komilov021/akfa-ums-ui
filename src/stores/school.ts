import { defineStore } from "pinia";

import request from "@/utils/request";
import type { ISchool, ListData } from "@/models/backend";
import { ControlItem } from "@/models/frontend";

interface SchoolState {
  schools: any;
  school: ISchool | null;
}

export const useSchoolStore = defineStore("school", {
  state: (): SchoolState => ({
    schools: [],
    school: null,
  }),
  actions: {
    async fetchSchools(filters = { page: 1, limit: 100 }) {
      const response = await request.post("/school/list", filters);
      this.schools = response;
    },
    async createSchool(data: any) {
      return request.post("/school/create", data);
    },
    async editSchool(data: any) {
      return request.post("/school/update", data);
    },
    async removeSchool(id: string) {
      return request.post("/school/remove", { id });
    },
    async getSchoolById(id: string) {
      const response = await request.post("/school/get-one", { id });
      this.school = response;
    },
    changeOpen(id: string) {
      const school = this.schools.find((item: any) => item.id === id);

      if (school) {
        school.is_open = !school.is_open;
      }
      console.log(school);
    },
  },

  getters: {
    getSchoolsSelct: (state): (ControlItem & { is_open: boolean })[] =>
      state.schools.map((item: any) => ({
        value: item.id,
        label: item.title,
        is_open: item.is_open,
      })),
  },
});
