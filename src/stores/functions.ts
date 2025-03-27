import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  IFunction,
  IcreateFunction,
  IeditFunction,
  IfunctionGetOne,
} from "@/models/backend";

interface ExamDatesState {
  functions: IFunction[];
  currentFunction: IfunctionGetOne | null;
}

export const useFunctionStore = defineStore("function", {
  state: (): ExamDatesState => ({
    functions: [],
    currentFunction: null,
  }),

  actions: {
    async fetchFunctions(course_id: string) {
      const response = await request.post("/function/list", { course_id });
      this.functions = response;
    },

    async getFunctionById(id: string) {
      const response = await request.post("/function/get-one", { id });
      this.currentFunction = response;
    },

    async createFunction(data: IcreateFunction) {
      return request.post("/function/create", data);
    },

    async editFunction(data: IeditFunction) {
      return request.post("/function/update", data);
    },

    async removeFunction(id: string) {
      return request.post("/function/remove", { id });
    },
    async publishFunction(id: string) {
      return request.post("/function/publish", { id });
    },
  },
});
