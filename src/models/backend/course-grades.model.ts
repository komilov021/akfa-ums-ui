import { IStudentGrade } from "./attendance.model";
import type { IFilter } from "./common.model";

export interface ICourseGrade {
  id: string;
  student_uid: number;
  student_email: string;
  student_name: string;
  score: number;
  is_verified: boolean;
}
export interface ICourseGradeFilter extends IFilter {
  course_id: string;
  function_id: string;
}

export interface IGradeStudent {
  id: string;
  student_id: string;
  student_uid: number;
  student_name: string;
  grade: string;
  gpa: number;
  total_score: number;
  scores: [
    {
      score: number;
      component: string;
    }
  ];
  is_failed: boolean;
  grading_type: string;
}

export interface ICreateGrade {
  score: number;
  student_id: string;
  function_id: string;
  course_id: string;
}
export interface IEditGrade {
  course_id: string;
  function_id: string;
  student_id: string;
  score: number;
  id: string;
}
export interface IimportTemplate {
  course_id: string;
  function_id: string;
  file_id: string;
}
export interface IRemoveFunctionGrade {
  course_id: string;
  function_id: string;
}
export interface IgradeRatioList {
  total_proportion: number;
  id: string;
  grade: string;
  student_proportion: number;
  gpa: number;
}
export interface IAttendanceOfgeneralGrades {
  semester: string;
  acceptable: number;
  student_total: number;
  present_in_class: number;
  assigned_course_id: string;
}
export interface gradingOfGeneralGrades {
  id: string;
  name: string;
  weight: string;
  is_published: boolean | null;
  assigned_course_id: string;
}
export interface IGradeRatioCreate {
  grade: string;
  student_proportion: number;
  gpa: number;
  course_id: string;
}
export interface IGradeRatioUpdate extends IGradeRatioCreate {
  id: string;
}
