import { defineStore } from "pinia";

import request from "@/utils/request";
import type { IFilter, IRoomReference, ListData } from "@/models/backend";
import type { ControlItem } from "@/models/frontend";

interface StoreState {
  roomReference: ListData<IRoomReference>;
  roomCalendarReference: ListData<IRoomReference>;
}

export const useRoomReferenceStore = defineStore("room-reference", {
  state: (): StoreState => ({
    roomReference: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    roomCalendarReference: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
  }),

  actions: {
    async fetchRoomReferences(
      filters: IFilter & { title?: string } = { page: 1, limit: 100 }
    ) {
      const response = await request.post("/room-reference/list", filters);
      this.roomReference = response;
    },
    async fetchRoomCalendarReferences(
      filters: IFilter & { title?: string } = { page: 1, limit: 100 }
    ) {
      const response = await request.post("/room-reference/list", filters);
      this.roomCalendarReference = response;
    },
    async createRoomReferences(data: any) {
      return request.post("/room-reference/create", data);
    },
    async editRoomReferences(data: any) {
      return request.post("/room-reference/update", data);
    },
    async removeRoomReferences(id: string) {
      return request.post("/room-reference/remove", { id });
    },
  },

  getters: {
    getRoomReferencesSelect: (state): ControlItem[] =>
      state.roomReference.data.map((item) => ({
        value: item.id,
        label: item.code,
      })),
  },
});
