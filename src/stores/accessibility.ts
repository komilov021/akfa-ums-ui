import { defineStore } from "pinia";

import request from "@/utils/request";
import type { IRole, IAccessibilityPermissionList } from "@/models/backend";

interface AccessibilityState {
  roles: IRole[];
  currentRole: IRole | null;
  permissions: IAccessibilityPermissionList[];
  loading: boolean;
}

export const useAccessibility = defineStore("accessibility", {
  state: (): AccessibilityState => ({
    roles: [],
    currentRole: null,
    permissions: [],
    loading: false,
  }),

  actions: {
    async fetchRoles() {
      try {
        this.loading = true;
        const response = await request.post("/accessibility/role-list");
        this.roles = response;
        this.loading = false;
      } catch (error) {
        this.loading = true;
        console.log("Error", error);
      }
    },
    async fetchPermissionListByRole(role: string) {
      try {
        this.loading = true;
        const response = await request.post("/accessibility/permission-list", {
          role,
        });
        this.permissions = response;
        this.loading = false;
      } catch (error) {
        this.loading = true;
        console.log("Error", error);
      }
    },
    async getCurrentRole(id: string) {
      const response = await request.post("/accessibility/role-get-one", {
        id,
      });
      this.currentRole = response;
    },
  },

  getters: {
    // getSemestrsSelct: (state): ControlItem[] =>
    //   state.semestrs.map((semester) => ({
    //     value: semester.id,
    //     label: `${semester.year}-${semester.name}`,
    //   })),
  },
});
