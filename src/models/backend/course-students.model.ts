import type { IFilter } from "./common.model";

export interface ICourseStudentsFilter extends IFilter {
  course_id: string;
  student_uid?: null;
}

export interface ICourseStudents {
  total: number;
  id: string;
  student_id: string;
  student_uid: number;
  student_email: string;
  student_name: string;
  grade: string;
  gpa: number;
  total_score: number;
  scores: {
    score: number;
    function_name: string;
  }[];
  is_verified: boolean;
  is_failed: boolean;
  is_custom: boolean;
  calc_type: string;
  created_at: string;
}
export interface IEditCourseStudents {
  id: string;
  grade: string;
  gpa: number;
  total: number;
  is_verified: boolean;
  is_published: boolean;
  is_custom: boolean;
}
export interface IRemoveCourseSingleStudent {
  course_id: string;
  student_id: string;
}
