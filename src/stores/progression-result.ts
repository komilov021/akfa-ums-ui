import { defineStore } from "pinia";

import request from "@/utils/request";
import type { IFilter, IStudentProgression, ListData } from "@/models/backend";

interface StoreState {
  progressionResults: ListData<IStudentProgression>;
}

export const useProgressionResultStore = defineStore("progression-result", {
  state: (): StoreState => ({
    progressionResults: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
  }),

  actions: {
    async fetchProgressionResult(
      filters: IFilter & { curriculum_id?: string } = { page: 1, limit: 30 }
    ) {
      const response = await request.post("/student-progression/list", filters);
      this.progressionResults = response;
    },
    async generateProgressionResult(curriculum_id: string) {
      return request.post("/student-progression/generate", { curriculum_id });
    },
  },

  getters: {},
});
