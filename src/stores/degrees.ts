import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  ICreateDegree,
  IDegree,
  IEditDegree,
  IFilter,
  ListData,
} from "@/models/backend";
import type { ControlItem } from "@/models/frontend";

interface SubjectState {
  degrees: ListData<IDegree>;
}

export const useDegreeStore = defineStore("degrees", {
  state: (): SubjectState => ({
    degrees: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
  }),

  actions: {
    async fetchDegree(
      filters: IFilter & { title?: string } = { page: 1, limit: 100 }
    ) {
      const response = await request.post("/degree/list", filters);
      this.degrees = response;
    },
    async fetchStudentDegree(
      filters = { page: 1, limit: 100, type: "student" }
    ) {
      const response = await request.post("/degree/list", filters);
      this.degrees = response;
    },
    async createDegree(data: ICreateDegree) {
      return request.post("/degree/create", data);
    },
    async editDegree(data: IEditDegree) {
      return request.post("/degree/update", data);
    },
    async removeDegree(id: string) {
      return request.post("/degree/remove", { id });
    },
    changeEditable(id: string) {
      const degree = this.degrees.data.find((item) => item.id === id);
      if (degree) {
        degree.editable = !degree.editable;
      }
    },
  },

  getters: {
    getDegreesSelect: (state): (ControlItem & { editable: boolean })[] =>
      state.degrees.data.map((subject) => ({
        value: subject.id,
        label: subject.reference,
        editable: !!subject.editable,
      })),
  },
});
