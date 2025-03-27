import type { IFilter, IFile } from "./common.model";
// T =>Timetable
export interface TGroupsCreate {
  group_leader_id: string;
  program_id: string;
  name: string;
  short_name: string;
  color_info: {
    name: string;
    hex_code: string;
  };
  student_ids: string[];
}
export interface IGroupsTimetable {
  abbreviation: string;
  color_info: {
    hex_code: string;
    name: string;
  };
  id: string;
  name: string;
  program_info: {
    id: string;
    title: {
      en: string;
      ru: string;
      uz: string;
    };
  };
  leader_info: {
    first_name: string;
    last_name: string;
    id: string;
  };
}
export interface IGroupOneStudentList {
  data: {
    total: string;
    uid: string;
    full_name: string;
    email: string;
    type: string;
    study_year: string;
    group_info: {
      id: string;
      name: string;
      short_name: string;
    };
    program_info: {
      id: string;
      name: string;
    };
  };
  pagination: {
    total_items: number;
    total_pages: number;
    current_page: number;
    limit: number;
    offset: number;
  };
}
export interface IGroupOneTimeTable {
  data: {
    id: string;
    name: string;
    abbreviation: string;
    leader_info: {
      id: string;
      first_name: string;
      last_name: string;
    };
    color_info: {
      name: string;
      hex_code: string;
    };
    program_info: {
      id: string;
      title: {
        en: string;
        ru: string;
        uz: string;
      };
    };
  };
}
export interface TGroupsAddStudent {
  group_id: string;
  student_participation: {
    student_id: string;
    participation: string;
  }[];
}
export interface TGroupsUpdate extends Omit<TGroupsCreate, "student_ids"> {}
interface LeaderInfo {
  id: string;
  first_name: string;
  last_name: string;
}

interface ColorInfo {
  name: string;
  hex_code: string;
}

interface ProgramTitle {
  en: string;
  ru: string;
  uz: string;
}
interface ProgramInfo {
  id: string;
  title: ProgramTitle;
}

export interface TimetableGroup {
  id: string;
  name: string;
  abbreviation: string;
  leader_info: LeaderInfo;
  color_info: ColorInfo;
  program_info: ProgramInfo;
}

export interface Pagination {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
  offset: number;
}
export interface TGroupAddStudent {
  group_id: string;
  student_participation: {
    student_id: string;
    participation: string;
  }[];
}

export interface IstudentListWithStudent {
  total: number;
  uid: string;
  first_name: string;
  last_name: string;
  email: string;
  study_year: string;
  group_info: {
    id: string;
    name: string;
    short_name: string;
  };
  program_info: {
    id: string;
    name: string;
  };
}
export interface IStudentListWithGroups {
  search?: string;
  program_id?: string;
  level?: number;
  page: number;
  limit: number;
}
