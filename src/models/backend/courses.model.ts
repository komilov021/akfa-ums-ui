import type { IFilter } from "./common.model";

export interface ICourse {
  subject_id: string;
  course_id: string;
  semestr_id: string;
  subject: string;
  semester: string;
  fails: number;
  programs: {
    id: string;
    name: string;
  }[];
}
export interface ICourseFilter extends IFilter {
  semester_id: string | undefined;
  program_id?: string | undefined;
  retake?: string | undefined;
  search_title?: string | undefined;
}

export enum UpdateRequestTypeEnum {
  course_general = "course_general",
  course_prerequisites = "course_prerequisites",
  course_grading = "course_grading",
  course_course_leader = "course_course_leader",
  course_grade_main = "course_grade_main",
  course_grade_retake = "course_grade_retake",
  course_grade_components = "course_grade_components",
  course_lessons = "course_lessons",
  assigned_course_component_edit = "assigned_course_component_edit",
}

export type GradingType = "PASS/FAIL" | "GPA";
export interface ICourseGetOne {
  id: string;
  programs: [
    {
      id: string;
      name: string;
    }
  ];
  semester: {
    id: string;
    name: string;
    year: number;
  };
  subject: {
    id: string;
    title: string;
  };
}
