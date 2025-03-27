import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  ICreateTestType,
  TEditTestType,
  IFilter,
  IPrequisite,
  ListData,
} from "@/models/backend";
import type { ControlItem } from "@/models/frontend";

interface StoreState {
  prequisiteTests: ListData<IPrequisite>;
}

export const usePrequisiteTestsStore = defineStore("prequisite-tests", {
  state: (): StoreState => ({
    prequisiteTests: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
  }),

  actions: {
    async fetchTestTypes(
      filters: IFilter & { title?: string } = { page: 1, limit: 100 }
    ) {
      const response = await request.post("/test-type/list", filters);
      this.prequisiteTests = response;
    },
    async createTestTypes(data: ICreateTestType) {
      return request.post("/test-type/create", data);
    },
    async editTestTypes(data: TEditTestType) {
      return request.post("/test-type/update", data);
    },
    async removeTestTypes(id: string) {
      return request.post("/test-type/remove", { id });
    },
    changeEditable(id: string) {
      const item = this.prequisiteTests.data.find((item) => item.id === id);
      if (item) {
        item.editable = !item.editable;
      }
    },
  },

  getters: {
    getTestTypesSelect: (state): (ControlItem & { editable: boolean })[] =>
      state.prequisiteTests.data.map((item) => ({
        value: item.id,
        label: item.name,
        editable: !!item.editable,
      })),
  },
});
