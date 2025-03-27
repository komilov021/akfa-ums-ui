import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  ICreateExamDates,
  IEditExamDates,
  IExamDate,
  IExamYear,
} from "@/models/backend";
import type { ControlItem } from "@/models/frontend";

interface ExamDatesState {
  examDates: IExamDate[];
  examYears: IExamYear[];
}

export const useExamDatesStore = defineStore("exam-dates", {
  state: (): ExamDatesState => ({
    examDates: [],
    examYears: [],
  }),

  actions: {
    async fetchExamYears() {
      const response = await request.post("/exam-year/list");
      this.examYears = response;
    },
    async createExamYears(data: any) {
      return request.post("/exam-year/create", data);
    },
    async editExamYears(data: any) {
      return request.post("/exam-year/update", data);
    },
    async removeExamYears(id: string) {
      return request.post("/exam-year/remove", { id });
    },

    // async fetchExamDates(id: string) {
    //   const examDates = await request.post("/exam-date/list", {
    //     year_id: id,
    //     page: 1,
    //     limit: 100,
    //   });
    //   this.examDates = examDates.data;
    // },

    // async createExamDates(date: ICreateExamDates) {
    //   await request.post("/exam-date/create", date);
    //   // this.fetchExamDates();
    // },

    // async editExamDates(date: IEditExamDates) {
    //   await request.post("/exam-date/update", date);
    //   // this.fetchExamDates();
    // },

    // async removeExamDates(id: string) {
    //   await request.post("/exam-date/remove", { id });
    //   // this.fetchExamDates();
    // },

    async fetchExamDates(id: string) {
      const examDates = await request.post("/exam/date/list", {
        year_id: id,
      });
      this.examDates = examDates;
    },

    async createExamDates(date: ICreateExamDates) {
      await request.post("/exam/date/create", date);
      // this.fetchExamDates();
    },

    async editExamDates(date: IEditExamDates) {
      await request.post("/exam/date/update", date);
      // this.fetchExamDates();
    },

    async removeExamDates(id: string) {
      await request.post("/exam/date/delete", { id });
      // this.fetchExamDates();
    },
  },

  getters: {
    getYearsSelct: (state): ControlItem[] =>
      state.examYears.map((year) => ({
        value: year.year,
        label: `${year.year}`,
      })),
  },
});
