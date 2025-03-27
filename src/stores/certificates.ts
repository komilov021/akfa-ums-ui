import { defineStore } from "pinia";

import request from "@/utils/request";
import type { ListData } from "@/models/backend";

interface CertificatesState {
  certificates: ListData<any>;
}

export const useCertificateStore = defineStore("certificates", {
  state: (): CertificatesState => ({
    certificates: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
  }),
  actions: {
    async fetchList(filters: { page: number; limit: number }) {
      const response = await request.post("/certificate/list", filters);
      this.certificates = response;
    },
  },

  getters: {},
});
