import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  ICourseGrade,
  ICourseGradeFilter,
  ICreateGrade,
  IEditGrade,
  IRemoveFunctionGrade,
  IimportTemplate,
  ListData,
} from "@/models/backend";

interface ExamDatesState {
  grades: ListData<ICourseGrade>;
}

export const useCourseGradesStore = defineStore("course-grades", {
  state: (): ExamDatesState => ({
    grades: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
  }),

  actions: {
    async fetchGrades(filter: ICourseGradeFilter) {
      const response = await request.post("/grade/list", filter);
      this.grades = response;
    },

    async createGrade(data: ICreateGrade) {
      return request.post("/grade/create", data);
    },

    async editGrade(data: IEditGrade) {
      return request.post("/grade/update", data);
    },

    async removeGrade(id: string) {
      return request.post("/grade/remove", { id });
    },

    async searchUser(uid: number) {
      return request.post("/student/search", { uid });
    },

    async importTemplate(data: IimportTemplate) {
      return request.post("/grade/excel/import", data);
    },
    async removeFunctionGrade(data: IRemoveFunctionGrade) {
      return request.post("/grade/students-remove", data);
    },
  },
});
