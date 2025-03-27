import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  IFilter,
  ISubject,
  IcreateSubjects,
  ListData,
} from "@/models/backend";
import type { ControlItem } from "@/models/frontend";

interface SubjectState {
  subjects: ListData<ISubject>;
}

export const useSubjectStore = defineStore("subject", {
  state: (): SubjectState => ({
    subjects: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
  }),

  actions: {
    async fetchSubjects(
      filters: IFilter & { title?: string } = { page: 1, limit: 30 }
    ) {
      const response = await request.post("/subject/list", filters);
      this.subjects = response;
    },
    async createSubjects(data: IcreateSubjects) {
      return request.post("/subject/create", data);
    },
    async editSubjects(data: ISubject) {
      return request.post("/subject/update", data);
    },
    async removeSubjects(id: string) {
      return request.post("/subject/remove", { id });
    },
    async getOne(id: string) {
      const subject = (await request.post("/subject/get-one", { id })) as any;
      this.subjects.data.push(subject);
    },
  },

  getters: {
    getSubjectsSelct: (state): ControlItem[] =>
      state.subjects.data.map((subject) => ({
        value: subject.id,
        label: subject.title,
      })),
  },
});
