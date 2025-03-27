import { ListData } from "@/models/backend";
import {
  IApiResponse,
  ICreateKanban,
  IKanban,
  IUpdateKanban,
} from "@/models/backend/kanban.model";
import request from "@/utils/request";
import { defineStore } from "pinia";

interface KanbanState {
  kanban: IKanban[];
  sections_with_kanban: IApiResponse;
}

export const useKanbanStore = defineStore("kanban", {
  state: (): KanbanState => ({
    kanban: [],
    sections_with_kanban: {
      data: [],
    },
  }),
  actions: {
    async getKanbans() {
      const kanbans = await request.get("kanban/list");
      this.kanban = kanbans;
    },
    async getSectionsWithKanban() {
      const kanbansWithSections = await request.get(
        "/kanban/list-section-with-kanban"
      );
      this.sections_with_kanban = kanbansWithSections;
    },
    async createKanban(kanban: ICreateKanban) {
      return await request.post("kanban/create", kanban);
    },
    async updateKanban(id: string, kanban: IUpdateKanban) {
      return await request.patch(`kanban/${id}`, kanban);
    },
    async deleteKanban(id: string) {
      return await request.delete(`kanban/${id}`);
    },
  },
});
