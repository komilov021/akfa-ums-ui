import { defineStore } from "pinia";
import request from "@/utils/request";
import type { ControlItem } from "@/models/frontend";
import type {
  IDegree,
  Department,
  IProgram,
  ListData,
  Position,
  IProgramCreate,
  IprogramUpdate,
  IApplicationRegions,
  IProgramIist,
  IProgramGetOne,
  IRegions,
  Ilangs,
} from "@/models/backend";

interface GuideState {
  programs: IProgram[];
  tuitions: IProgramIist[];
  currentTuition: IProgramGetOne;
  examDates: any[];
  regions: IRegions[];
  langs: Ilangs[];
  departments: ListData<Department>;
  positions: ListData<Position>;
  degree: ListData<IDegree>;
}

export const useGuideStore = defineStore("guide", {
  state: (): GuideState => ({
    programs: [],
    tuitions: [],
    currentTuition: {
      id: "",
      program: "",
      per_semester: 0,
      fee_foreign_student: 0,
      duration: "",
      degree_id: "",
      icon: "",
      lang: [],
      title: {
        en: "",
        ru: "",
        uz: "",
      },
      has_scholarship: false,
      is_active: false,
      degree: {
        id: "",
        name: "",
      },
      school: {
        id: "",
        title: "",
      },
      chief: {
        id: "",
        last_name: "",
        first_name: "",
      },
    },
    regions: [],
    langs: [],
    examDates: [],
    departments: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    positions: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
    degree: {
      page: 1,
      limit: 30,
      total: 0,
      data: [],
    },
  }),

  actions: {
    async fetchPrograms() {
      const response = await request.post("/subject/program");
      this.programs = response;
    },
    async fetchTuitions(data = {}) {
      const tuitions = await request.post("/program/list", data);
      this.tuitions = tuitions;
    },
    async getTuitionById(id: string) {
      const currentTuition = await request.post("/program/get-one", { id });
      this.currentTuition = currentTuition;
    },
    async fetchTuitionsLang() {
      const langs = await request.post("/program/list-languages");
      this.langs = langs;
    },
    async createTuition(Tuition: IProgramCreate) {
      await request.post("/program/create", Tuition);
    },

    async editTuition(Tuition: IprogramUpdate) {
      await request.post("/program/update", Tuition);
    },

    async removeTuition(id: string) {
      await request.post("/program/remove", { id });
    },
    async fetchExamDates() {
      const examDates = await request.post("/application/exam-dates");
      this.examDates = examDates;
    },
    async fetchRegions(data: IApplicationRegions) {
      const regions = await request.post("/application/regions", data);
      this.regions = regions;
    },
    async fetchDepartments(filters = { page: 1, limit: 100 }) {
      const departments = await request.post("/department/list", filters);
      this.departments = departments;
    },
    async fetchPositions(filters = { page: 1, limit: 100 }) {
      const positions = await request.post("/position/list", filters);
      this.positions = positions;
    },
    async fetchDegree(filters = { page: 1, limit: 100 }) {
      const degree = await request.post("/degree/list", filters);
      this.degree = degree;
    },
  },

  getters: {
    getProgramsSelct: (state): ControlItem[] =>
      state.programs.map((tution) => ({
        value: tution.id,
        label: tution.program,
      })),
    getExamDates: (state): ControlItem[] =>
      state.examDates.map((date) => ({ value: date.id, label: date.duration })),
    getRegions: (state): ControlItem[] =>
      state.regions
        .filter((region) => region.type === "province")
        .map((region) => ({
          value: region.id,
          label: region.name,
        })),
    getTuitions: (state): any[] =>
      state.tuitions.map((tution) => ({
        value: tution.id,
        label: tution.program,
        lang: tution.lang || [],
        has_scholarship: tution.has_scholarship,
      })),
    getDepartmentsSelect: (state): ControlItem[] =>
      state.departments.data.map((tution) => ({
        value: tution.id,
        label: tution.name,
      })),
    getPositionSelect: (state): ControlItem[] =>
      state.positions.data.map((position) => ({
        value: position.id,
        label: position.name,
      })),
    getDegreeSelect: (state): ControlItem[] =>
      state.degree.data.map((position) => ({
        value: position.id,
        label: position.reference,
      })),
  },
});
