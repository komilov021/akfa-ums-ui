import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  ListData,
  IGroupCourse,
  IGroup,
  IGroupStudent,
  IgroupsCourseList,
  IGroupsList,
  IGroupsCreate,
  IGroupsStudentList,
  IGroupsAttachTeacher,
  IgroupsImport,
  IgroupsStudentCreate,
} from "@/models/backend";
import { ControlItem } from "@/models/frontend";

interface GroupState {
  semesters: { id: string; semester: string }[];
  loading?: boolean | any;
  courses: ListData<IGroupCourse>;
  groups: ListData<IGroup>;
  students: ListData<IGroupStudent>;
}

export const useGroupStore = defineStore("groups", {
  state: (): GroupState => ({
    semesters: [],
    loading: false,
    courses: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    groups: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    students: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
  }),

  actions: {
    async fetchSemestrs() {
      try {
        this.loading = true;
        const response = await request.post("/groups/semesters");
        this.semesters = response;
        this.loading = false;
      } catch (error: any) {
        this.loading = false;
        console.log("error", error?.message);
        throw error;
      }
    },
    async fetchCourses(filter: IgroupsCourseList) {
      try {
        this.loading = true;
        const response = await request.post("/groups/course-list", filter);
        this.courses = response;
        this.loading = false;
      } catch (error: any) {
        this.loading = false;
        console.log("error", error?.message);
        throw error;
      }
    },
    async fetchGroups(filter: IGroupsList) {
      try {
        this.loading = true;
        const response = await request.post("/groups/list", filter);
        this.groups = response;
        this.loading = false;
      } catch (error: any) {
        this.loading = false;
        console.log("error", error?.message);
        throw error;
      }
    },
    async createGroup(data: IGroupsCreate) {
      try {
        this.loading = true;
        await request.post("/groups/create", data);
        this.loading = false;
      } catch (error: any) {
        this.loading = false;
        console.log("error", error?.message);
        throw error;
      }
    },

    async fetchGroupStudents(filter: IGroupsStudentList) {
      try {
        this.loading = true;
        const response = await request.post("/groups/student/list", filter);
        this.students = response;
        this.loading = false;
      } catch (error: any) {
        this.loading = false;
        console.log("error", error?.message);
        throw error;
      }
    },
    async fetchGroupTeachers(filter: IGroupsAttachTeacher) {
      try {
        this.loading = true;
        const response = await request.post("/groups/attach-teacher", filter);
        this.students = response;
        this.loading = false;
      } catch (error: any) {
        this.loading = false;
        console.log("error", error?.message);
        throw error;
      }
    },
    async importStudents(data: IgroupsImport) {
      try {
        this.loading = true;
        await request.post("/groups/import", data);
        this.loading = false;
      } catch (error: any) {
        this.loading = false;
        console.log("error", error?.message);
        throw error;
      }
    },
    async addStudent(data: IgroupsStudentCreate) {
      try {
        this.loading = true;
        await request.post("/groups/student/create", data);
        this.loading = false;
      } catch (error: any) {
        this.loading = false;
        console.log("error", error?.message);
        throw error;
      }
    },

    async removeStudent(id: string) {
      try {
        this.loading = true;
        await request.post("/groups/student/delete", { id });
        this.loading = false;
      } catch (error: any) {
        this.loading = false;
        console.log("error", error?.message);
        throw error;
      }
    },
  },
  getters: {
    getSemestrs: (state) =>
      state.semesters.map((item) => ({
        value: item.id,
        label: item.semester,
      })),
  },
});
