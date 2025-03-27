import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  ICourseReferance,
  ListData,
  IFilter,
  ICourseReferances,
  ICreateCourseReferance,
} from "@/models/backend";
import { ControlItem } from "@/models/frontend";

interface CourseReferanceState {
  courseReferances: ListData<ICourseReferance>;
  courseReferance: ICourseReferance | null;
}

export const useCourseReferanceStore = defineStore("course-referance", {
  state: (): CourseReferanceState => ({
    courseReferances: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    courseReferance: null,
  }),

  actions: {
    async fetchCourseReferances(filter: ICourseReferances) {
      if (!filter.page) {
        filter.page = 1;
        filter.limit = 30;
      }
      const response = await request.post("/course-reference/list", filter);
      this.courseReferances = response;
    },

    async fetchAndReturnCourseReferances(filter: ICourseReferances) {
      return request.post("/course-reference/list", filter);
    },

    async createCourseReferance(data: ICreateCourseReferance) {
      return request.post("/course-reference/create", data);
    },

    async editCourseReferance(data: ICreateCourseReferance) {
      return request.post("/course-reference/update", data);
    },

    async removeCourseReferance(id: string) {
      return request.post("/course-reference/remove", { id });
    },

    async getCourseReferanceById(id: string) {
      const response = await request.post("/course-reference/get-one", { id });
      this.courseReferance = response;
    },
  },
  getters: {
    getCourseReferanceSelect: (state): ControlItem[] =>
      state.courseReferances.data.map((item) => ({
        value: item.id,
        label: item.title,
      })),
    getCourseReferanceCodeSelect: (state): ControlItem[] =>
      state.courseReferances.data.map((item) => ({
        value: item.id,
        label: item.code,
      })),
  },
});
