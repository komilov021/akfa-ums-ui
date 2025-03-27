import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  ICurriculumFilter,
  ListData,
  ICurriculum,
  ICurriculumCourse,
  IAssignedCourse,
  ICurriculumYear,
  ICurriculumLevel,
  IAttachedProfessor,
  IProfessor,
  ICreateCurriculum,
  ICurriculumPopulate,
  IAssignCoursesFilter,
  ICurriculumLevels,
  IAssignCourses,
  editAssignCourses,
  IupdateAssignCoursesComponents,
  IeditAssignCourseGradingLeader,
  IeditAssignCourseGradingCredits,
  IeditAssignCourseRetakeGradingCredits,
  IeditAssignCourseLessons,
  IdeleteAssignCourses,
  IsaveProgressionRule,
  IeditProgressionRule,
  IProfessorsFilter,
  IcreateAttachProfessor,
  IAssignCoursesGetGroupsList,
  Ilist_by_levels,
  IElectiveModulesWithGroups,
} from "@/models/backend";
import { ControlItem } from "@/models/frontend";
import { IElectiveModulesListFilter } from "@/models/backend/ai-module-files.model";

interface CurriculumState {
  curriculums: ListData<ICurriculum>;
  assignCourses: ListData<ICurriculumCourse>;
  selectedCourses: ListData<ICurriculumCourse>;
  currentCurriculum: ICurriculum | null;
  currentCourse: IAssignedCourse | null;
  curriculumYear: ICurriculumYear[];
  curriculumLevels: ICurriculumLevel[];
  currentSemestr: string | null;
  academicYears: { name: string; is_actual: boolean; id: string }[];
  loading?: boolean;
  professors: ListData<IProfessor>;
  attachedProfessors: IAttachedProfessor[];
  list_by_levels: Ilist_by_levels[];
  groups: any;
  currentAppeal: any;
  electiveModulesWithAttachedGroups: ListData<IElectiveModulesWithGroups>;
}

export const useCurriculumStore = defineStore("curriculum", {
  state: (): CurriculumState => ({
    curriculums: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    assignCourses: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    selectedCourses: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    attachedProfessors: [],
    academicYears: [],
    curriculumYear: [],
    curriculumLevels: [],
    currentCurriculum: null,
    currentCourse: null,
    currentSemestr: null,
    loading: false,
    list_by_levels: [],
    professors: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    groups: null,
    currentAppeal: null,
    electiveModulesWithAttachedGroups: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
  }),

  actions: {
    async fetchCurriculums(filters: ICurriculumFilter) {
      try {
        this.loading = true;
        const response = await request.post("/curriculum/list", filters);
        this.curriculums = response;
        this.loading = false;
      } catch (error: any) {
        this.loading = false;
        console.log("error", error?.message);
        throw error;
      }
    },
    async editCurriculum(data: any) {
      return request.post("/curriculum/update", data);
    },
    async removeCurriculum(data: any) {
      return request.post("/curriculum/remove", data);
    },
    async createCurriculum(data: ICreateCurriculum) {
      return request.post("/curriculum/create", data);
    },
    async getCurriculumById(id: string) {
      const response = await request.post("/curriculum/get-one", { id });
      this.currentCurriculum = response;
    },
    async getElectiveModulesListWithAttachedGroups(
      data: IElectiveModulesListFilter
    ) {
      const response = await request.post(
        "/curriculum/elective-modules-list-with-attached-groups",
        data
      );
      this.electiveModulesWithAttachedGroups = response;
    },

    clearCurrentCurriculum() {
      this.currentCurriculum = null;
    },

    async setCurrentSemestr(semestr: string) {
      this.currentSemestr = semestr;
    },

    async populate(data: ICurriculumPopulate) {
      return request.post("/curriculum/populate", data);
    },

    async fetchAcademicYears() {
      const response = await request.post("/curriculum/academic-years");
      this.academicYears = response;
    },

    async fetchAssignCourses(filters: IAssignCoursesFilter) {
      const response = await request.post(
        "/curriculum/assign-course/list",
        filters
      );
      this.assignCourses = response;
    },

    async fetchCourseReferancesByCurriculum(filter: IAssignCoursesFilter) {
      const response = await request.post(
        "/curriculum/assign-course/list",
        filter
      );
      this.selectedCourses = response;
    },

    activateRetake(assigned_course_id: string) {
      return request.post("/curriculum/assign-course/retake-activate", {
        assigned_course_id,
      });
    },
    deactivateRetake(assigned_course_id: string) {
      return request.post("/curriculum/assign-course/retake-deactivate", {
        assigned_course_id,
      });
    },
    async getAssignCourseById(assigned_course_id: string) {
      const response = await request.post("/curriculum/assign-course/get-one", {
        assigned_course_id,
      });
      this.currentCourse = response;
    },

    async fetchCurriculumYear(program_id: string) {
      const response = await request.post("/curriculum/curriculum-year", {
        program_id,
      });
      this.curriculumYear = response;
    },

    async fetchCurriculumLevels(filter: ICurriculumLevels) {
      const response = await request.post(
        "/curriculum/curriculum-levels",
        filter
      );
      this.curriculumLevels = response;
    },

    async createAssignCourses(data: IAssignCourses) {
      return await request.post("/curriculum/assign-course/create", data);
    },
    // defender defender
    async editAssignCourses(data: editAssignCourses) {
      return await request.post("/curriculum/assign-course/edit", data);
    },
    async updateAssignCoursesComponents(data: IupdateAssignCoursesComponents) {
      return await request.post(
        "/curriculum/assign-course/component/update",
        data
      );
    },

    async editAssignCourseGradingLeader(data: IeditAssignCourseGradingLeader) {
      return await request.post(
        "/curriculum/assign-course/edit-grading-leader",
        data
      );
    },
    async editAssignCourseGradingCredits(
      data: IeditAssignCourseGradingCredits
    ) {
      return await request.post(
        "/curriculum/assign-course/edit-grading-credits",
        data
      );
    },
    async editAssignCourseRetakeGradingCredits(
      data: IeditAssignCourseRetakeGradingCredits
    ) {
      return await request.post(
        "/curriculum/assign-course/edit-retake-grading-credits",
        data
      );
    },
    async editAssignCourseLessons(data: IeditAssignCourseLessons) {
      return await request.post("/curriculum/assign-course/edit-lessons", data);
    },

    async deleteAssignCourses(data: IdeleteAssignCourses) {
      return await request.post("/curriculum/assign-course/remove", data);
    },

    async saveProgressionRule(data: IsaveProgressionRule) {
      return await request.post("/curriculum/progression-rule", data);
    },
    async editProgressionRule(data: IeditProgressionRule) {
      return await request.post("/curriculum/progression-rule-edit", data);
    },
    async fetchProfessors(filters: IProfessorsFilter) {
      const response = await request.post("/curriculum/professors", filters);
      this.professors = response;
    },
    async createAttachProfessor(data: IcreateAttachProfessor) {
      return await request.post(
        "/curriculum/assign-course/attach-professors",
        data
      );
    },
    async fetchAttachProfessor(assigned_course_id: string) {
      const response = await request.post("/curriculum/attached-professors", {
        assigned_course_id,
      });
      this.attachedProfessors = response;
    },
    async fetchByLevels(program_id: string) {
      const response = await request.post("/curriculum/list-by-levels", {
        program_id,
      });
      this.list_by_levels = response;
    },
    async fetchGroups(data: IAssignCoursesGetGroupsList) {
      const res = await request.post(
        "/curriculum/assign-course/get-group-list",
        data
      );
      this.groups = res;
    },
    async appealSetConfiguration(data: any) {
      const response = await request.post(
        "/curriculum/appeal-set-configuration",
        data
      );
      this.currentAppeal = response;
      return response;
    },
  },
  getters: {
    getAcademicYearSelect: (state) =>
      state.academicYears.map((item) => ({
        value: item.name,
        label: item.name,
      })),
    academicYearWithIds: (state) =>
      state.academicYears.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    getAssignCoursesCodeSelect: (state): ControlItem[] =>
      state.selectedCourses.data.map((item) => ({
        value: item.courses_reference_id,
        label: item.code,
      })),
    getAssignCoursesSelct: (state): ControlItem[] =>
      state.selectedCourses.data.map((item) => ({
        value: item.id,
        label: item.title,
      })),
    getProfessorsSelect: (state): ControlItem[] =>
      state.professors.data.map((item) => ({
        value: item.id,
        label: item.first_name + " " + item.last_name,
      })),
  },
});
