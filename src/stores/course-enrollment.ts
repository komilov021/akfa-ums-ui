import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  IEnrollment,
  ISummary,
  ListData,
  IStudentEnroll,
  IEnrolledCourses,
  IcreateCourseEnrollment,
  publishCourseEnrollment,
  getEnrollmentStudents,
  IAddStudentsEnrolledCourse,
} from "@/models/backend";
import type { ControlItem } from "@/models/frontend";

interface CourseEnrollmentState {
  enrollments: IEnrollment[];
  summary: ISummary[];
  enrolledStudents: ListData<IStudentEnroll>;
  enrollment: IEnrollment | null;
  studentCourses: IEnrolledCourses | null;
}

export const useCourseEnrollmentStore = defineStore("course-enrollment", {
  state: (): CourseEnrollmentState => ({
    enrollments: [],
    summary: [],
    enrolledStudents: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    enrollment: null,
    studentCourses: null,
  }),

  actions: {
    async fetchCourseEnrollment() {
      const response = await request.post("/enrollment/list");
      this.enrollments = response;
    },
    async getEnrollmentById(enrollment_id: string) {
      const response = await request.post("/enrollment/get-one", {
        enrollment_id,
      });
      this.enrollment = response;
    },
    async createCourseEnrollment(data: IcreateCourseEnrollment) {
      return request.post("/enrollment/create", data);
    },
    async publishCourseEnrollment(data: publishCourseEnrollment) {
      return request.post("/enrollment/publish", data);
    },
    async regenerateCourseEnrollment(enrollment_id: string) {
      return request.post("/enrollment/regenerate", { enrollment_id });
    },
    async getEnrollmentSummaryById(enrollment_id: string) {
      const response = await request.post("/enrollment/summary", {
        enrollment_id,
      });
      this.summary = response;
    },
    async exportEnrollmentSummary(enrollment_id: string) {
      return request.post("/enrollment/summary-export", { enrollment_id });
    },
    async getEnrollmentStudents(data: getEnrollmentStudents) {
      const response = await request.post("/enrollment/students", data);
      this.enrolledStudents = response;
    },
    async getStudentsEnrolledCourses(student_id: string) {
      const response = await request.post(
        "/enrollment/student-enrolled-course-list",
        { student_id }
      );
      this.studentCourses = response;
    },
    async addStudentsEnrolledCourse(data: IAddStudentsEnrolledCourse) {
      return request.post("/enrollment/student-enrolled-course-add", data);
    },
    async removeStudentsEnrolledCourse(course_enroll_id: string) {
      return request.post("/enrollment/student-enrolled-course-remove", {
        course_enroll_id,
      });
    },
  },

  getters: {},
});
