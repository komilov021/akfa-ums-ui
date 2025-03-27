import type { IFilter } from "./common.model";

export interface IRankingsFilter extends IFilter {
  program_id: string | undefined;
}

export interface IRankingsStudents {
  fails: string;
  rank: number;
  student_email: string;
  student_id: string;
  student_name: string;
  total: number;
  total_score: number;
}
export interface IcurrentRankGetOne {
  courses: {
    semester: string;
    id: string;
    code: string;
    title: string;
  }[];
  level: number;
  created_at: string;
  id: string;
  is_published: boolean;
  program: {
    id: string;
    name: string;
  };
  semester: {
    id: string;
    title: string;
  };
  title: string;
}
export interface IgradeRanking {
  title: string;
  total: number;
  grade: string;
  gpa: number;
  is_retake: boolean;
}
export interface IRankingsList {
  student_id: string;
  course_id: string;
  student_uid: number;
  title: string;
  code: string;
  credits: number;
  semester: string;
  grade: number;
  score: string;
  gpa: number;
}
export interface IRankingCreate {
  title: string;
  program_id: string;
  semester_id: string;
  level: number;
  course_ids: string[];
}
export type TRankingUpdate = IRankingCreate & {
  id: string;
};
export interface IgetRankingByStudents {
  id: string;
  page: number;
  limit: number;
  program_id: string;
  level: number;
}

export interface IsetScholarship {
  student_id: string;
  rank_id: string;
  aes: number;
  eps: number;
}

export interface IgetRankingGrade {
  student_id: string;
  rank_id: string;
}
