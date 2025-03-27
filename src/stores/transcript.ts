import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  ITranscript,
  ITranscriptRpl,
  ITranscriptRplCreate,
  ITranscriptRplUpdate,
  ITranscriptRplDelete,
} from "@/models/backend";

interface TranscriptState {
  transcript: ITranscript | null;
  transcriptRplList: ITranscriptRpl[] | null;
}

export const useTranscriptStore = defineStore("transcript", {
  state: (): TranscriptState => ({
    transcript: null,
    transcriptRplList: [],
  }),

  actions: {
    async getTranscript(student_id: string) {
      const response = await request.post("/transcript/get-one", {
        student_id,
      });
      this.transcript = response;
      return response;
    },
    async generate(student_id: string) {
      return request.post("/transcript/generate-version-2", { student_id });
    },
    async generateOld(student_id: string) {
      return request.post("/transcript/generate", { student_id });
    },
    async withDrawTranscript(student_id: string) {
      return request.post("/transcript/generate-for-withdrawal-students", {
        student_id,
      });
    },
    async generateMaSuka(data: { student_id: string; award_date: string }) {
      return request.post("/transcript/generate-for-graduate-students", data);
    },
    async createTranscriptRpl(data: ITranscriptRplCreate) {
      return request.post("/transcript-rpl/create", data);
    },
    async removeTranscriptRpl(data: ITranscriptRplDelete) {
      return request.post("/transcript-rpl/delete", data);
    },
    async updateTranscriptRpl(data: ITranscriptRplUpdate) {
      await request.post("transcript-rpl/update", data);
    },
    async fetchListRpl(student_id: string) {
      try {
        const response = await request.post("/transcript-rpl/list", {
          student_id,
        });
        this.transcriptRplList = response;
      } catch (error) {
        console.log(error);
      }
    },
  },
  getters: {},
});
