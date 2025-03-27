import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  IExamYear,
  IExamCreateYear,
  IExamYearUpdate,
  IExamSemestr,
  ISemesterCreate,
  ISemesterUpdate,
} from "@/models/backend";
import type { ControlItem } from "@/models/frontend";

interface ExamDatesState {
  semestrs: IExamSemestr[];
  years: IExamYear[];
}

export const useAcademicStore = defineStore("academic", {
  state: (): ExamDatesState => ({
    semestrs: [],
    years: [],
  }),

  actions: {
    async fetchExamYears() {
      const response = await request.post("/academic-year/list");
      this.years = response;
    },
    async createExamYears(data: IExamCreateYear) {
      return request.post("/academic-year/create", data);
    },
    async editExamYears(data: IExamYearUpdate) {
      return request.post("/academic-year/update", data);
    },
    async removeExamYears(id: string) {
      return request.post("/academic-year/remove", { id });
    },

    // ---------------------- Semestr ------------------
    async fetchSemestr() {
      const response = await request.post("/semester/list");
      this.semestrs = response;
    },
    async createSemestr(data: ISemesterCreate) {
      return request.post("/semester/create", data);
    },
    async editSemestr(data: ISemesterUpdate) {
      return request.post("/semester/update", data);
    },
    async removeSemestr(id: string) {
      return request.post("/semester/remove", { id });
    },
  },

  getters: {
    getSemestrsSelct: (state): ControlItem[] =>
      state.semestrs.map((semester) => ({
        value: semester.id,
        label: `${semester.year}-${semester.name}`,
      })),
    getYearsSelct: (state): ControlItem[] =>
      state.years.map((year) => ({
        value: year.year,
        label: `${year.year}`,
      })),
    listSemesters: (state) =>
      state.semestrs.map((semester) => `${semester.name} ${semester.year}`),
  },
});
