import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  ListData,
  IDetailHeader,
  IAttendanceStudent,
  IStudentGrade,
  IAttendanceTeachingWeekFilter,
  IcreateTeachingWeek,
  IStudentAttendace,
  IStudents,
  ILowAttendanceStudents,
} from "@/models/backend";

interface AttendanceState {
  teachingWeeks: ListData<any>;
  detailsHeaders: Record<"data", IDetailHeader[]>;
  students: ListData<IAttendanceStudent>;
  lowAttendanceStudents: ListData<IAttendanceStudent>;
  studentGroups: { group_code: string }[];
  // defender
  studentAttendance: any | null;
}

export const useAttendanceStore = defineStore("attendance", {
  state: (): AttendanceState => ({
    teachingWeeks: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    detailsHeaders: {
      data: [],
    },
    students: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    lowAttendanceStudents: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    studentGroups: [],
    studentAttendance: null,
  }),
  actions: {
    async fetchTeachingWeek(filter: IAttendanceTeachingWeekFilter) {
      const res = await request.post("/attendance/teaching-week/list", filter);
      this.teachingWeeks = res;
    },
    async createTeachingWeek(data: IcreateTeachingWeek) {
      return request.post("/attendance/teaching-week/create", data);
    },
    async removeTeachingWeek(id: string) {
      return request.post("/attendance/teaching-week/remove", { id });
    },

    async updateStudentAbsent(id: string) {
      return request.post("/attendance/student-absent", { id });
    },

    async fetchDetailHeaders(teaching_week_id: string) {
      const res = await request.post("/attendance/details-headers", {
        teaching_week_id,
      });
      this.detailsHeaders = res;
    },

    async fetchStudents(filter: IStudents) {
      const res = await request.post("/attendance/students", filter);
      this.students = res;
    },
    async fechtAttendanceStudents(data: IStudentAttendace) {
      const response = await request.post(
        "/attendance/student-attendance",
        data
      );
      this.studentAttendance = response;
    },
    async fetchLowAttendanceStudents(filter: ILowAttendanceStudents) {
      const res = await request.post("/attendance/low/list", filter);
      this.lowAttendanceStudents = res;
    },
    async generateLowAttendance(assigned_course_id: string) {
      return request.post("/attendance/low/generate", { assigned_course_id });
    },
    async approveLowAttendance(id: string) {
      return request.post("/attendance/low/approve", { id });
    },
    async fetchStudentGroups(assigned_course_ids: [string]) {
      const res = await request.post("/group-division/student-group-list", {
        assigned_course_ids,
      });
      this.studentGroups = res;
    },
  },

  getters: {},
});
