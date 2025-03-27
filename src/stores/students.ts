import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  IResidency,
  IStudentsFilter,
  IStudent,
  IStudentGetOne,
  IStudentParent,
  IStudentParents,
  IStudentParentUpdate,
  ListData,
  IStudentSemestrList,
  IStudentCourses,
  IStudentCourseDetails,
  IForStudentGrade,
  IeditSubjects,
  IcreateStudent,
  ItutionFeeStudents,
  ItoggleArchivedStudent,
  IfetchStudentCourseDetails,
  IfetchStudentBlockStatus,
  IfetchFilterStudentGrade,
} from "@/models/backend";

interface StudentState {
  students: ListData<IStudent>;
  currentStudent: any | null;
  currentStudentUrl: any | null;
  headers: any[];
  semestrs: IStudentSemestrList[];
  studentCourses: IStudentCourses[];
  studentCourseDetails: IStudentCourseDetails[];
  paymentStudentFee: any | null;
  getstudentparents: IStudentParent[];
  country: IResidency[];
  studentGradeFilter: IForStudentGrade[];
  studentModuleName: IForStudentGrade[];
  studentStatus: any;
}

export const useStudentsStore = defineStore("students", {
  state: (): StudentState => ({
    students: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    headers: [],
    currentStudent: null,
    currentStudentUrl: null,
    semestrs: [],
    studentCourses: [],
    studentCourseDetails: [],
    paymentStudentFee: null,
    getstudentparents: [],
    country: [],
    studentGradeFilter: [],
    studentModuleName: [],
    studentStatus: null,
  }),

  actions: {
    async fetchStudents(filters: any) {
      const response = await request.post("/student/list", filters);
      this.students = response;
    },
    async editStudent(data: IeditSubjects) {
      return request.post("/student/update", data);
    },
    async removeStudent(data: { id: string }) {
      return request.post("/student/remove", data);
    },
    async createStudent(data: IcreateStudent) {
      return request.post("/student/create", data);
    },
    async tutionFeeStudents(data: ItutionFeeStudents) {
      const response = await request.post(
        "/students/tuition-fee/payments",
        data
      );
      this.paymentStudentFee = response;
    },
    async getStudentById(id: string) {
      const response = await request.post("/student/get-one", { id });
      this.currentStudentUrl = response;
      this.currentStudent = response;
      // if (this.currentStudentUrl?.avatar !== null) {
      //   const file = (await request.post(
      //     "/file/download",
      //     { file_id: this.currentStudentUrl?.avatar.id },
      //     {
      //       responseType: "blob",
      //     } as any
      //   )) as any;
      //   this.currentStudentUrl = URL.createObjectURL(file);
      // }
    },
    async toggleArchivedStudent(data: ItoggleArchivedStudent) {
      return request.post("/student/toggle-archived-student", data);
    },
    async fetchStudentSemestrList(id: string) {
      const response = await request.post(
        "/course/semester-list-by-student-id",
        { student_id: id }
      );
      this.semestrs = response;
    },
    async fetchStudentCourses(filter: {
      student_id: string;
      semester_id: string;
    }) {
      const response = await request.post("/course/list-by-student-id", filter);
      this.studentCourses = response;
    },
    async fetchStudentCourseDetails(filter: IfetchStudentCourseDetails) {
      const response = await request.post("/course/details", filter);
      this.studentCourseDetails = response;
    },
    async StudentFinanceCertificateFileDownload(data: any) {
      return request.post("/students/certificate/finance-checks", data);
    },
    async fetchStudentBlockStatus(data: IfetchStudentBlockStatus) {
      return request.post("/student/block", data);
    },
    // students Additional information
    async createStudentParenst(data: IStudentParents) {
      await request.post("/student-parents", data);
    },
    async getStudentParentsList(student_id: string) {
      const response = await request.post(
        "/student-parents/get-student-parents",
        { student_id }
      );
      this.getstudentparents = response;
    },
    async updateStudentParents(data: IStudentParentUpdate) {
      await request.post("/student-parents/update", data);
    },
    async deleteStudentParent(parent_id: string) {
      await request.post("/student-parents/delete", parent_id);
    },
    async fetchCountryList() {
      const responde = await request.post("/country/list");
      this.country = responde;
    },
    async fetchGradeModuleList(data: { student_id: string; semester: string }) {
      const response = await request.post("/student/grades", data);
      this.studentModuleName = response;
    },
    async fetchFilterStudentGrade(filter: IfetchFilterStudentGrade) {
      const response = await request.post("/student/grades", filter);
      this.studentGradeFilter = response;
    },
    async fetchStudentStatus(data: any) {
      const response = await request.post("/student/change-status", data);
      this.studentStatus = response;
    },
    clearStudents() {
      this.students = {
        page: 1,
        limit: 30,
        total: 0,
        data: [],
      };
    },
  },
  getters: {
    // getCourses: (state) =>
    //   state.courses.data.map((course) => ({
    //     ...course,
    //     programs: course.programs.map((p) => p.name).join(","),
    //   })),
    getstudentGradeFilter: (state) =>
      state.studentGradeFilter.map((gradeFilter: IForStudentGrade) => {
        return {
          value: gradeFilter.id,
          label: gradeFilter.module_name,
        };
      }),
    getCountryList: (state) =>
      state.country.map((country: IResidency) => {
        return {
          value: country.id,
          label: country.name,
        };
      }),
  },
});
