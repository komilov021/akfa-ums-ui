import { defineStore } from "pinia";

import request from "@/utils/request";
import type { IFile } from "@/models/backend";

interface IupsertUniversityInfo {
  id?: string;
  name?: string;
  email?: string;
  logo: IFile;
}
interface IGeneralInfo {
  university: {
    id?: string;
    name: string;
    email: string;
    logo: IFile;
  } | null;
  logo: string | null;
}

export const useGeneralInfoStore = defineStore("general-info", {
  state: (): IGeneralInfo => ({
    university: null,
    logo: null,
  }),

  actions: {
    async fetchUniversityInfo() {
      this.university = await request.post("/university-info/list");
      const file = (await request.post(
        "/file/download",
        { file_id: this.university?.logo.id },
        {
          responseType: "blob",
        } as any
      )) as any;
      this.logo = URL.createObjectURL(file);
    },
    async upsertUniversityInfo(formData: IupsertUniversityInfo) {
      await request.post("/university-info/upsert", formData);
      this.fetchUniversityInfo();
    },
  },

  getters: {
    getUniversity: (state) => state.university,
    getLogo: (state) => state.logo,
  },
});
