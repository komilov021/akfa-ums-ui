import { defineStore } from "pinia";

import request from "@/utils/request";
import type { IStaff, IUser, ListData } from "@/models/backend";

interface StaffState {
  staffs: ListData<IUser>;
  loading: boolean;
  currentStaff: IStaff | null;
  roles: { name: string; code: string }[];
  deanToteacher: any;
  selectedTeachers: any;
}

export const useStaffStore = defineStore("staff", {
  state: (): StaffState => ({
    staffs: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    roles: [],
    currentStaff: null,
    deanToteacher: null,
    selectedTeachers: [],
    loading: false,
  }),

  actions: {
    async createStaff(data: any) {
      await request.post("/staff/create", data);
    },

    async editStaff(data: any) {
      await request.post("/staff/update", data);
    },

    async fetchStaff() {
      try {
        this.loading = true;
        const staffs = await request.post("/staff/filter");
        this.staffs = staffs;
        this.loading = false;
      } catch (error: any) {
        this.loading = false;
        console.log("error", error?.message);
      }
    },

    async getStaffs(data: any) {
      try {
        this.loading = true;
        if (!data.page) {
          data.page = 1;
          data.limit = 500;
        }
        const staffs = await request.post("/staff/list", data);
        this.staffs = staffs;
        this.loading = false;
      } catch (error: any) {
        this.loading = false;
        console.log("error", error?.message);
      }
    },

    async getStaffById(id: string) {
      try {
        this.loading = true;
        const staff = await request.post("/staff/get-one", {
          id,
        });
        this.currentStaff = staff;
        this.loading = false;
      } catch (error: any) {
        this.loading = false;
        console.log("error", error?.message);
      }
    },
    async removeStaff(id: string) {
      try {
        this.loading = true;
        await request.post("/staff/remove", {
          id,
        });
        this.loading = false;
      } catch (error: any) {
        this.loading = false;
        throw error;
      }
    },
    async assignDeanTeacher(data: any) {
      await request.post("/staff/assign-dean-to-teacher", data);
    },
    async getAssignedDeanTeachers(data: any) {
      const res = await request.post("/staff/get-one-dean-list-teachers", data);
      this.selectedTeachers = res.dean_teachers_ids;
    },
    async getTeacherDeanList(data: any) {
      try {
        this.loading = true;
        const response = await request.post(
          "/staff/get-teacher-staff-list",
          data
        );
        this.deanToteacher = response;
        this.loading = false;
      } catch (error: any) {
        this.loading = false;
        console.log("error", error?.message);
      }
    },

    async fetchRoles() {
      this.roles = await request.post("/staff/roles");
    },
  },

  getters: {
    getRolesSelect: (state) =>
      state.roles.map((role) => ({ value: role.code, label: role.name })),
    getStaffSelect: (state) =>
      state.staffs.data.map((role) => ({
        value: role.id,
        label: `${role.first_name} ${role.last_name}`,
      })),
    getTeacherSelect: (state) =>
      state.staffs.data.map((role) => ({
        value: role.teacher_id,
        label: `${role.first_name} ${role.last_name}`,
      })),
  },
});
