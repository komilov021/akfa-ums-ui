import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  ICourse,
  ICourseFilter,
  ICourseGetOne,
  ICreateCourseReferance,
  ListData,
} from "@/models/backend";
import type { ControlItem } from "@/models/frontend";

interface CoursesState {
  courses: ListData<ICourse>;
  currentCourse: ICourseGetOne | null;
  filter: {
    program_id?: string;
    semester_id?: string;
    retake?: string;
    search_title?: string;
  };
}

export const useCoursesStore = defineStore("courses", {
  state: (): CoursesState => ({
    courses: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    filter: {
      program_id: undefined,
      semester_id: undefined,
      retake: undefined,
      search_title: undefined,
    },
    currentCourse: null,
  }),

  actions: {
    async fetchCoursess(filters: ICourseFilter) {
      const response = await request.post("/course/list", filters);
      this.filter = {
        program_id: filters.program_id,
        semester_id: filters.semester_id,
        retake: filters.retake,
        search_title: filters.search_title,
      };
      this.courses = response;
    },
    async getCourseById(id: string) {
      const response = await request.post("/course/get-one", { id });
      this.currentCourse = response;
    },
    async createCourse(data: ICreateCourseReferance) {
      return request.post("/course/create", data);
    },
    async editCourse(data: any) {
      return request.post("/course/update", data);
    },
    async removeCourse(id: string) {
      return request.post("/course/remove", { id });
    },
  },

  getters: {
    getCourses: (state) =>
      state.courses.data.map((course) => ({
        ...course,
        programs: course.programs.map((p) => p.name).join(","),
      })),
    getCoursesSelct: (state): ControlItem[] =>
      state.courses.data.map((course) => ({
        value: course.course_id,
        label: `${course.subject}`,
      })),
  },
});
