import { defineStore } from "pinia";

import request from "@/utils/request";
import { ListData, IRequest, IFilter } from "@/models/backend";

interface ExamDatesState {
  requests: ListData<IRequest>;
}

export const useRequestStore = defineStore("requests", {
  state: (): ExamDatesState => ({
    requests: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
  }),

  actions: {
    async fetchRequests(filter: any) {
      if (!filter.page) {
        filter.page = 1;
        filter.limit = 30;
      }
      const response = await request.post("/request/list", filter);
      this.requests = response;
    },
    async createRequest(data: any) {
      return request.post("/request/create", data);
    },
    async editRequest(data: any) {
      return request.post("/request/update", data);
    },
    async removeRequest(id: string) {
      return request.post("/request/remove", { id });
    },
  },

  getters: {
    // getSemestrsSelct: (state): ControlItem[] =>
    //   state.ExamSemestr.map((semester) => ({
    //     value: semester.id,
    //     label: `${semester.year}-${semester.name}`,
    //   })),
  },
});
