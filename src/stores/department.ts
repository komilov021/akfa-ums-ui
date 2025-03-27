import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  Department,
  ICreateDepartment,
  ICreatePosition,
  IDegree,
  IEditDepartment,
  IEditPosition,
  IFilter,
  ListData,
} from "@/models/backend";
import type { ControlItem } from "@/models/frontend";

interface SubjectState {
  departments: ListData<Department>;
}

export const useDepartmentStore = defineStore("department", {
  state: (): SubjectState => ({
    departments: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
  }),

  actions: {
    async fetchDepartment(
      filters: IFilter & { title?: string } = { page: 1, limit: 100 }
    ) {
      const response = await request.post("/department/list", filters);
      this.departments = response;
    },
    async createDepartment(data: ICreateDepartment) {
      return request.post("/department/create", data);
    },
    async editDepartment(data: IEditDepartment) {
      return request.post("/department/update", data);
    },
    async removeDepartment(id: string) {
      return request.post("/department/remove", { id });
    },

    async createPosition(data: ICreatePosition) {
      return request.post("/position/create", data);
    },
    async editPosition(data: IEditPosition) {
      return request.post("/position/update", data);
    },
    async removePosition(id: string) {
      return request.post("/position/remove", { id });
    },

    changeEditable(id: string) {
      const department = this.departments.data.find((item) => item.id === id);
      if (department) {
        department.editable = !department.editable;
      }
    },
    changePositionEditable(department_id: string, position_id: string) {
      const department = this.departments.data.find(
        (item) => item.id === department_id
      );
      if (department) {
        const position = department.positions?.find(
          (p) => p.id === position_id
        );
        if (position) {
          position.editable = !position.editable;
        }
      }
    },
    changeOpen(id: string) {
      const department = this.departments.data.find((item) => item.id === id);
      if (department) {
        department.open = !department.open;
      }
    },
  },

  getters: {
    getDepartmentSelect: (
      state
    ): (ControlItem & { editable: boolean; open: boolean; positions: any })[] =>
      state.departments.data.map((subject) => ({
        value: subject.id,
        label: subject.name,
        editable: !!subject.editable,
        open: !!subject.open,
        positions: subject.positions,
      })),
  },
});
