import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  ICourse,
  ICourseStudents,
  ICourseStudentsFilter,
  IEditCourseStudents,
  IRemoveCourseSingleStudent,
  ListData,
} from "@/models/backend";

interface CourseStudentState {
  students: ListData<ICourseStudents>;
  headers: any[];
}

export const useCourseStudentsStore = defineStore("course-students", {
  state: (): CourseStudentState => ({
    students: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    headers: [],
  }),

  actions: {
    async fetchCourseStudents(filters: ICourseStudentsFilter) {
      const response = await request.post(
        "/grade/excel/students-list",
        filters
      );
      this.students = response;
    },
    async editCourseStudents(data: IEditCourseStudents) {
      return request.post("/grade/excel/students-update", data);
    },
    async editCourseStudentsGrading(data: IEditCourseStudents) {
      return request.post("/grading-system/main-grade-update", data);
    },
    async removeCourseStudents(course_id: string) {
      return request.post("/grade/excel/students-remove", { course_id });
    },
    async removeCourseSingleStudent(data: IRemoveCourseSingleStudent) {
      return request.post("/grade/excel/single-student-remove", data);
    },
    async fetchHeadres(course_id: string) {
      const response = await request.post("/grade/excel/table-header", {
        course_id,
      });
      this.headers = response;
    },
    async calculateGrade(course_id: string) {
      return request.post("/grade/excel/calculate-grade", { course_id });
    },
  },

  getters: {
    // getCourses: (state) =>
    //   state.courses.data.map((course) => ({
    //     ...course,
    //     programs: course.programs.map((p) => p.name).join(","),
    //   })),
  },
});
