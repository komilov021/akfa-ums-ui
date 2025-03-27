import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  ICreateGradeComponents,
  IEditGradeComponents,
  IFilter,
  IFunctionReference,
  ListData,
} from "@/models/backend";
import type { ControlItem } from "@/models/frontend";

interface StoreState {
  gradeComponents: ListData<IFunctionReference>;
}

export const useGradeComponentsStore = defineStore("function-reference", {
  state: (): StoreState => ({
    gradeComponents: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
  }),

  actions: {
    async fetchGradeComponents(
      filters: IFilter & { title?: string } = { page: 1, limit: 100 }
    ) {
      const response = await request.post("/function-reference/list", filters);
      this.gradeComponents = response;
    },

    async createGradeComponents(data: ICreateGradeComponents) {
      return request.post("/function-reference/create", data);
    },
    async editGradeComponents(data: IEditGradeComponents) {
      return request.post("/function-reference/update", data);
    },
    async removeGradeComponents(id: string) {
      return request.post("/function-reference/remove", { id });
    },
    changeEditable(id: string) {
      const degree = this.gradeComponents.data.find((item) => item.id === id);
      if (degree) {
        degree.editable = !degree.editable;
      }
    },
  },

  getters: {
    getGradeComponentsSelect: (
      state
    ): (ControlItem & { editable: boolean })[] =>
      state.gradeComponents.data.map((item) => ({
        value: item.id,
        label: item.name,
        editable: !!item.editable,
      })),
  },
});
