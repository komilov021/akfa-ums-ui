import { IColumn, ICreateColumn } from "@/models/backend/kanban.model";
import request from "@/utils/request";
import { defineStore } from "pinia";

export const useColumnStore = defineStore("columns", {
  state: () => ({
    columns: [] as IColumn[],
  }),
  actions: {
    async getColumns(kanban_id: string) {
      const columns = await request.get<IColumn[]>(`columns/list/${kanban_id}`);
      this.columns = columns;
    },
    async createColumn(section: ICreateColumn) {
      return await request.post<IColumn>("columns/create", section);
    },
    async changeColumn(id: string, section: ICreateColumn) {
      return await request.patch<IColumn>(`columns/${id}`, section);
    },
    async deleteColumn(id: string) {
      return await request.delete<void>(`columns/${id}`);
    },
  },
});
