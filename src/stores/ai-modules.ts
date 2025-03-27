import { defineStore } from "pinia";
import request from "@/utils/request";
import axios from "axios";
import { AI_BASE_URL } from "@/utils/constants";

interface AiModuleFilesState {
  aiModuleFiles: any;
  aiModuleFile: any;
}

interface QuestionAnswer {
  question: string;
  answer: string;
}

export const useAiModuleFilesStore = defineStore("ai-module-files", {
  state: (): AiModuleFilesState => ({
    aiModuleFiles: null,
    aiModuleFile: null,
  }),

  actions: {
    createAiModuleFiles(data: any) {
      return request.post("/ai-module-files/create", data);
    },

    createTimeCode(data: any) {
      return request.post("/ai-module-files/create/time-code", data);
    },

    async fetchAiModuleFiles() {
      const response = await request.get("/ai-module-files/find-all");

      this.aiModuleFiles = response;
    },

    async fetchAiModuleFile(id: string) {
      const response = await request.get(`/ai-module-files/find/${id}`);

      this.aiModuleFile = response;
    },

    async updateAiModuleFile(id: string, body: any) {
      request.patch(`/ai-module-files/update/${id}`, body);
    },

    deleteAiModuleFile(id: string) {
      return request.delete(`/ai-module-files/delete/${id}`);
    },

    async createFlashcards(
      sub_module_id: string,
      script: string
    ): Promise<QuestionAnswer[]> {
      try {
        const response = await axios.post(AI_BASE_URL + "/v1/flashcards", {
          submodule_id: sub_module_id,
          script,
        });
        return response.data?.flashcards ?? [];
      } catch (error) {
        return [];
      }
    },
  },
});
