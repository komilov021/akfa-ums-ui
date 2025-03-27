import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  IFilter,
  ILessonType,
  IcreateLessonTypes,
  IeditLessonTypes,
  ListData,
} from "@/models/backend";
import type { ControlItem } from "@/models/frontend";

interface StoreState {
  lessonTypes: ListData<ILessonType>;
}

export const useLessonTypeStore = defineStore("lesson-types", {
  state: (): StoreState => ({
    lessonTypes: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
  }),

  actions: {
    async fetchLessonTypes(
      filters: IFilter & { title?: string } = { page: 1, limit: 100 }
    ) {
      const response = await request.post("/lesson-type/list", filters);
      this.lessonTypes = response;
    },
    async createLessonTypes(data: IcreateLessonTypes) {
      return request.post("/lesson-type/create", data);
    },
    async editLessonTypes(data: IeditLessonTypes) {
      return request.post("/lesson-type/update", data);
    },
    async removeLessonTypes(id: string) {
      return request.post("/lesson-type/remove", { id });
    },
    changeEditable(id: string) {
      const degree = this.lessonTypes.data.find((item) => item.id === id);
      if (degree) {
        degree.editable = !degree.editable;
      }
    },
  },

  getters: {
    getLessonTypesSelect: (state): (ControlItem & { editable: boolean })[] =>
      state.lessonTypes.data.map((subject) => ({
        value: subject.id,
        label: subject.name,
        editable: !!subject.editable,
      })),
  },
});
