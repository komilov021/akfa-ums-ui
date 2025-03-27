import { defineStore } from "pinia";

import request from "@/utils/request";
import {
  IAttendanceOfgeneralGrades,
  IEditSingleGrade,
  IGradeRatioCreate,
  IGradeRatioUpdate,
  IGradeStudent,
  IGradingSystemCreate,
  IGradingSystemExport,
  IGradingSystemGenerate,
  IGradingSystemList,
  IGradingSystemMainList,
  IGradingSystemRemove,
  IStudentGrade,
  ISystemgradeSingleRemove,
  IgradeRatioList,
  IgradingSystemMainGradeRemove,
  IimportMainGradingSystem,
  ListData,
  gradingOfGeneralGrades,
} from "@/models/backend";

interface ExamDatesState {
  grades: IgradeRatioList[];
  generalGrades: {
    total_grade_is_published: boolean;
    grading: gradingOfGeneralGrades[];
    retake_grading: any[];
    attendance: IAttendanceOfgeneralGrades[];
  };
  students: {
    page: number;
    limit: number;
    total: number;
    data: IGradeStudent[];
    retake_grade_published: boolean;
    grade_published: boolean;
  };
  mainGradeList: {
    can_publish: boolean;
    published: boolean;
    lms_integrated: boolean;
    students: IStudentGrade[];
    has_appeal: boolean;
  };
  deadlinePublish: any;
}

export const useGradeStore = defineStore("grades", {
  state: (): ExamDatesState => ({
    grades: [],
    generalGrades: {
      total_grade_is_published: false,
      retake_grading: [],
      grading: [],
      attendance: [],
    },
    students: {
      data: [],
      limit: 30,
      total: 0,
      page: 1,
      retake_grade_published: false,
      grade_published: false,
    },
    mainGradeList: {
      can_publish: false,
      has_appeal: false,
      published: false,
      lms_integrated: false,
      students: [],
    },
    deadlinePublish: null,
  }),

  actions: {
    async fetchGrades(course_id: string) {
      const response = await request.post("/grade-ratio/list", { course_id });
      this.grades = response;
    },
    async createGrade(data: IGradeRatioCreate) {
      return request.post("/grade-ratio/create", data);
    },
    async editGrade(data: IGradeRatioUpdate) {
      return request.post("/grade-ratio/update", data);
    },
    async removeGrade(id: string) {
      return request.post("/grade-ratio/remove", { id });
    },
    async fetchGeneralGrades(assigned_course_id: string) {
      const response = await request.post("/grading-system/general", {
        assigned_course_id,
      });
      this.generalGrades = response;
    },
    async fetchGradingSystemExport(data: IGradingSystemExport) {
      return request.post("/grading-system/export", data);
    },
    async fetchGradingStudents(filter: IGradingSystemMainList) {
      const response = await request.post(
        "/grading-system/main-grade-list",
        filter
      );
      this.students = response;
    },

    async fetchMainComponents(filter: IGradingSystemList) {
      const res = await request.post("/grading-system/grade-list", filter);
      this.mainGradeList = res;
    },

    async importMainGradingSystem(data: IimportMainGradingSystem) {
      return request.post("/grading-system/import-with-changelog", data);
    },

    async removeMainGrading(filter: IGradingSystemRemove) {
      return request.post(
        "/grading-system/grade-remove-with-changelog",
        filter
      );
    },

    async generateTotalGrade(data: IGradingSystemGenerate) {
      return request.post("/grading-system/generate", data);
    },

    async removeTotalGrade(filter: IgradingSystemMainGradeRemove) {
      return request.post("/grading-system/main-grade-remove", filter);
    },

    async publishGrade(data: any) {
      return request.post("/grading-system/grade-publish-with-changelog", data);
    },
    async exportGrade(data: any) {
      return request.post("/grading-system/grade-export", data);
    },
    async publishTotalGrade(data: IgradingSystemMainGradeRemove) {
      return request.post("/grading-system/main-grade-publish", data);
    },
    async removeSingleGrade(data: ISystemgradeSingleRemove) {
      return request.post("/grading-system/grade-single-remove", data);
    },
    async createSingleGrade(data: IGradingSystemCreate) {
      return request.post("/grading-system/grade-create", data);
    },
    async editSingleGrade(data: IEditSingleGrade) {
      return request.post("/grading-system/grade-update", data);
    },
    async publishGradeDeadline(data: any) {
      const response = await request.post(
        "/grading-system/grade-publish",
        data
      );
      this.deadlinePublish = response;
    },
  },

  getters: {
    total_grade_is_published: (state) =>
      state.generalGrades.total_grade_is_published,
    // getSemestrsSelct: (state): ControlItem[] =>
    //   state.ExamSemestr.map((semester) => ({
    //     value: semester.id,
    //     label: `${semester.year}-${semester.name}`,
    //   })),
  },
});
