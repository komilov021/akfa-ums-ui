import { ICreateSection, ISection } from "@/models/backend";
import request from "@/utils/request";
import { defineStore } from "pinia";

export const useSectionStore = defineStore("section", {
  state: () => ({
    sections: [] as ICreateSection[],
  }),
  actions: {
    async getSections() {
      const sections = await request.get<ICreateSection[]>("sections/list");
      this.sections = sections;
    },
    async createSection(section: ICreateSection) {
      return await request.post<ISection>("sections/create", section);
    },
    async changeSection(id: string, section: ICreateSection) {
      return await request.patch<ICreateSection>(`sections/${id}`, section);
    },
    async deleteSection(id: string) {
      return await request.delete<void>(`sections/${id}`);
    },
  },
});
