import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  ListData,
  IPayment,
  IPaymentFilter,
  IPaymentStudent,
  IPaymentHistoryFilter,
  IPaymentHistoryForm,
  IPaymentHistory,
  IPaymentForm,
  IFinanceProgram,
  IupdatePayment,
  IPaymentImport,
} from "@/models/backend";

interface FinanceState {
  loading: boolean;
  payments: ListData<IPayment>;
  allExport: any;
  paymentStudent: IPaymentStudent[];
  paymentHistory: ListData<IPaymentHistory>;
  programs: IFinanceProgram[];
  programDetails: {
    semester: string;
    editable?: boolean;
    data: {
      level: number;
      amount_usd: number;
      amount: number;
      credit: number;
    }[];
  }[];
  configurationList: {
    id: string;
    title: string;
    student_count: number;
    percentage_100: number;
    percentage_75: number;
    percentage_50: number;
    percentage_25: number;
    percentage_20: number;
    percentage_10: number;
    max_count: number;
  }[];
  studentPaymentHistory: any;
}

export const useFinanceStore = defineStore("finance", {
  state: (): FinanceState => ({
    loading: false,
    payments: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    allExport: null,
    paymentHistory: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    studentPaymentHistory: {},
    paymentStudent: [],
    programs: [],
    programDetails: [],
    configurationList: [],
  }),

  actions: {
    async fetchFinanceList(data: IPaymentFilter) {
      const response = await request.post("/v1/finance/list", data);

      response.data = response.items;
      this.payments = response;
    },
    async fetchFinanceExportList() {
      const response = await request.post("/v1/finance/list-export");
      this.allExport = response;
    },
    async fetchPaymentsList(data: IPaymentFilter) {
      const response = await request.post("/payment/list", data);
      this.payments = response;
    },
    async createPayment(data: IPaymentForm) {
      return request.post("/payment/create", data);
    },
    async updatePayment(data: IupdatePayment) {
      return request.post("/payment/deadline-extend", data);
    },
    async fetchPaymentByStudent(student_id: string) {
      const response = await request.post("/payment-detail/list-by-student", {
        student_id,
      });
      this.paymentStudent = response;
    },
    async fetchStudentPaymentHistory(payment_id: string) {
      const response = await request.post("/payment/student-payment-history", {
        payment_id,
      });
      this.studentPaymentHistory = response;
    },
    async fetchPaymentHistory(data: IPaymentHistoryFilter) {
      const response = await request.post("/payment-detail/list", data);
      this.paymentHistory = response;
    },
    async createPaymentHistory(data: IPaymentHistoryForm) {
      return request.post("/payment-detail/create", data);
    },
    async removePaymentHistory(id: string) {
      return request.post("/payment-detail/remove", { id });
    },
    async paymentImport(data: IPaymentImport) {
      return request.post("/payment/import", data);
    },
    async paymentImportDetails(data: IPaymentImport) {
      return request.post("/payment/import-payment-detail", data);
    },
    async fetchPaymentProgramList() {
      const response = await request.post("/v1/finance/program-list");
      this.programs = response;
    },
    async fetchPaymentProgramDetailList(program_id: string) {
      const response = await request.post("/v1/finance/program-details", {
        program_id,
      });
      this.programDetails = response?.map((item: any) => ({
        ...item,
        editable: false,
      }));
    },
    async editPaymentProgramDetailList(data = {}) {
      return request.post("/v1/finance/program-details-edit", data);
    },
    async fetchscholarshipConfigurationList(params = {}) {
      try {
        this.loading = true;
        const response = await request.post(
          "/v1/finance/scholarship-configuration-list",
          params
        );
        this.configurationList = response;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log("error", error);
      }
    },
    async editScholarshipConfigurationList(data = {}) {
      try {
        this.loading = true;
        await request.post("/v1/finance/scholarship-configuration-edit", data);
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log("error", error);
        throw error;
      }
    },
    async createScholarshipConfigurationList(data = {}) {
      try {
        this.loading = true;
        await request.post(
          "/v1/finance/scholarship-configuration-create",
          data
        );
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log("error", error);
        throw error;
      }
    },
    async resetScholarshipConfigurationList(data = {}) {
      try {
        this.loading = true;
        await request.post("/v1/finance/scholarship-configuration-reset", data);
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log("error", error);
        throw error;
      }
    },
  },

  getters: {},
});
