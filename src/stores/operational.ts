import { defineStore } from "pinia";
// operational qoldi SECRET NAME:defender
import request from "@/utils/request";
import type { IdailyActiveStudent } from "@/models/backend";
// import { format } from "date-fns";
// import type { IOperationalsMetrics } from "@/models/backend/statistics.model";

interface OperationalState {
  dailyActiveStudent: number | null;
  weeklyActiveStudent: number | null;
  dailyActiveTeacher: number | null;
  weeklyActiveTeacher: number | null;
  weeklyStudentAttendance: number | null;
  dailyStudentAttendance: number | null;
  mostHightRankedCourse: string | null;
  contentAvailability: string[] | null;
  onlineStudents: {
    count: number;
  } | null;
  onlineTeachers: {
    count: number;
  } | null;
  imploymentRate: any;
  projectBudgetPercentages: any;
  studentEmployStatistic: any;
  loading: boolean;
  numberAnnouncement: any;
}

export const useOperationalsStore = defineStore("operational", {
  state: (): OperationalState => ({
    dailyActiveStudent: null,
    weeklyActiveStudent: null,
    dailyActiveTeacher: null,
    weeklyActiveTeacher: null,
    weeklyStudentAttendance: null,
    dailyStudentAttendance: null,
    mostHightRankedCourse: null,
    contentAvailability: null,
    onlineStudents: null,
    onlineTeachers: null,
    imploymentRate: null,
    loading: false,
    projectBudgetPercentages: null,
    studentEmployStatistic: null,
    numberAnnouncement: null,
  }),
  getters: {},
  actions: {
    async studentEmployment(data?: any) {
      try {
        this.loading = true;
        this.studentEmployStatistic = null;
        const res = await request.post(
          "/v3/analytics/student-employment-statistics",
          data
        );
        this.studentEmployStatistic = res;
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    async projectBudget(data?: any) {
      const res = await request.post(
        "/v3/analytics/project-salary-percentages",
        data
      );
      this.projectBudgetPercentages = res;
    },
    async fetchDailyActiveStudents(date?: IdailyActiveStudent) {
      try {
        this.dailyActiveStudent = null;
        const response = await request.post(
          // "/v3/analytics/daily-or-weekly-active-students",
          "/analytics/daily-active-student",
          date
        );
        this.dailyActiveStudent = response?.count;
      } catch (error) {
        this.dailyActiveStudent = null;
      }
    },
    async fetchWeeklyActiveStudent(data?: IdailyActiveStudent) {
      try {
        this.weeklyActiveStudent = null;
        const response = await request.post(
          // "/v3/analytics/daily-or-weekly-active-students",
          "/analytics/weekly-active-student",
          data
        );
        this.weeklyActiveStudent = response?.count;
      } catch (error) {
        this.weeklyActiveStudent = null;
      }
    },
    async fetchDailyActiveTeacher(data?: IdailyActiveStudent) {
      try {
        this.dailyActiveTeacher = null;
        const response = await request.post(
          // "/v3/analytics/daily-or-weekly-active-teachers"
          "/analytics/daily-active-teacher",
          data
        );
        this.dailyActiveTeacher = response?.count;
      } catch (error) {
        this.dailyActiveTeacher = null;
      }
    },
    async fetchWeeklyActiveTeacher(data?: IdailyActiveStudent) {
      try {
        this.weeklyActiveTeacher = null;
        const response = await request.post(
          // "/v3/analytics/daily-or-weekly-active-teachers"
          "/analytics/weekly-active-teacher",
          data
        );
        this.weeklyActiveTeacher = response?.count;
      } catch (error) {
        this.weeklyActiveTeacher = null;
      }
    },
    async fetchWeeklyStudentAttendance(data?: IdailyActiveStudent) {
      try {
        this.weeklyStudentAttendance = null;
        const response = await request.post(
          "/analytics/weekly-student-attendance",
          data
        );
        this.weeklyStudentAttendance = response?.count;
      } catch (error) {
        this.weeklyStudentAttendance = null;
      }
    },
    async fetchDailyStudentAttendance(data?: IdailyActiveStudent) {
      try {
        this.dailyStudentAttendance = null;
        const response = await request.post(
          "/analytics/daily-student-attendance",
          data
        );
        this.dailyStudentAttendance = response?.count;
      } catch (error) {
        this.dailyStudentAttendance = null;
      }
    },
    async fetchMostHightRankedCourse(data?: IdailyActiveStudent) {
      try {
        this.mostHightRankedCourse = null;
        const response = await request.post(
          "/analytics/most-hight-ranked-course",
          data
        );
        this.mostHightRankedCourse = Array.isArray(response)
          ? response[0].title
          : "";
      } catch (error) {
        this.mostHightRankedCourse = null;
      }
    },
    async fetchContentAvailability(data?: any) {
      try {
        this.contentAvailability = null;
        const response = await request.post(
          "/v3/analytics/content-availability",
          data
        );
        this.contentAvailability = response;
      } catch (error) {
        this.contentAvailability = null;
      }
    },
    async fetchOnlineTeachers() {
      const response = await request.post(
        "/analytics/active-teacher-for-all-time"
      );
      this.onlineTeachers = response;
    },
    async fetchOnlineStudents() {
      const response = await request.post(
        "/analytics/active-student-for-all-time"
      );
      this.onlineStudents = response;
    },
    async fetchImploymentRate(data?: any) {
      try {
        const response = await request.post(
          "/v3/analytics/student-project-statistics",
          data
        );
        this.imploymentRate = response;
      } catch (error) {
        this.imploymentRate = null;
      }
    },
    async fetchNumberAnnouncement(data?: {
      from_date: string;
      to_date: string;
    }) {
      try {
        this.numberAnnouncement = null;
        const response = await request.post(
          "/v3/analytics/number-of-announcement",
          data
        );
        this.numberAnnouncement = response.number_of_announcement;
      } catch (error) {
        this.numberAnnouncement = null;
      }
    },
  },
});
