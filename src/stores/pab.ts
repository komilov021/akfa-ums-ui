import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  IPabRequest,
  IPabUpdate,
  IPabOne,
  IPabTwo,
  IPabFinalRequest,
} from "@/models/backend";

interface PabState {
  pab_one: IPabOne[];
  pab_two: IPabTwo[];
  pab_three: IPabOne[];
  final: any;
}

export const usePabStore = defineStore("pub", {
  state: (): PabState => ({
    pab_one: [],
    pab_two: [],
    pab_three: [],
    final: [],
  }),
  actions: {
    async fetchPabOne(data: IPabRequest) {
      const response = await request.post("/pab/one/list", data);
      this.pab_one = response;
    },
    async fetchPabThree(data: IPabRequest) {
      const response = await request.post("/pab/one/list", data);
      this.pab_three = response;
    },
    async createPabOne(data: IPabRequest) {
      return request.post("/pab/one/create", data);
    },
    async updatePabOne(data: IPabUpdate) {
      return request.post("/pab/one/update", data);
    },
    async fetchPabTwo(data: IPabRequest) {
      const response = await request.post("/pab/two/list", data);
      this.pab_two = response;
    },
    async createPabTwo(data: IPabRequest) {
      return request.post("/pab/two/create", data);
    },
    async updatePabTwo(data: IPabUpdate) {
      return request.post("/pab/two/update", data);
    },
    async fetchPabFinal(data: IPabFinalRequest) {
      const response = await request.post("/pab/final/list", data);
      this.final = response;
    },
    async createPabFinal(data: IPabFinalRequest) {
      return request.post("/pab/final/create", data);
    },
    async updatePabFinal(data: any) {
      return request.post("/pab/final/update", data);
    },
    async exportPabFinal(data: { level: number; program_id: string }) {
      return request.post("/pab/final/export", data);
    },
  },

  getters: {},
});
