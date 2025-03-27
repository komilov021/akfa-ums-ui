import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  IProgramByMonth,
  IApplicationByStatus,
  IApplicationByGender,
  IAplication,
  IApplicationFilter,
  IApplication,
} from "@/models/backend/application.model";
import type { ListData } from "@/models/backend";

interface ApplicationState {
  application: any;
  applications: ListData<IAplication>;
  programsByMonth: IProgramByMonth[];
  applicationsByStatus: IApplicationByStatus;
  applicationsByGender: IApplicationByGender;
}

export const useApplicationStore = defineStore("application", {
  state: (): ApplicationState => ({
    application: null,
    applications: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    programsByMonth: [],
    applicationsByStatus: {
      total: 0,
      pending: 0,
      reject: 0,
      accept: 0,
    },
    applicationsByGender: {
      total: 0,
      female: 0,
      male: 0,
    },
  }),

  actions: {
    async getApplication() {
      const application = await request.post("/application/get-one");
      this.application = application;
    },

    async createApplication(application: IApplication) {
      return request.post("/application/create", application);
    },
    // defender
    async addApplication(application: any) {
      return request.post("/application/add", application);
    },

    async updateApplication(application: any) {
      return request.post("/application/update", application);
    },

    async fetchProgramsByMonth() {
      this.programsByMonth = await request.post(
        "/application/report/program-by-month"
      );
    },

    async fetchApplicationsByStatus() {
      this.applicationsByStatus = await request.post(
        "/application/report/status"
      );
    },

    async fetchApplicationsByGender() {
      this.applicationsByGender = await request.post(
        "/application/report/gender"
      );
    },

    async getApplicationFileId() {
      return request.post("/application/export", { page: 1, limit: 20 });
    },

    async changeApplicationStatus(application: {
      id: string;
      status: string;
      reject_comment?: string;
    }) {
      await request.post("/application/status", application);
    },

    async getApplications(filter: IApplicationFilter) {
      this.applications = await request.post("/application/list", filter);
    },
  },
});
