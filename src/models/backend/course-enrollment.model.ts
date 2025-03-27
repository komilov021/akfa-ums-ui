import type { IFilter } from "./common.model";

export interface IEnrollment {
  id: string;
  study_year: number | null;
  deadline: string;
  academic_year: string;
  semester: string;
  is_published: Boolean;
  is_enrolled: Boolean;
}
export interface ISummary {
  id: string;
  title: string;
  code: string;
  program: string;
  offered: string;
  enrolled: string;
  waiting: string;
  rejected: number;
}
export interface IStudentEnroll {
  total: number;
  id: string;
  uid: string;
  name: string;
  offered: number;
  enrolled: number;
  is_enroll_completed: Boolean;
}
export interface IEnrolledCourses {
  courses:
    | {
        code: string;
        title: string;
        credits: number;
        is_retake: Boolean;
        is_elective: Boolean;
        assigned_course_id: string;
      }[]
    | null;
  credit_total: number | null;
  credit_limit: number | null;
  additional_payment: number | null;
  student_enroll: {
    id: string;
    is_enroll_completed: Boolean;
  } | null;
}
export interface IcreateCourseEnrollment {
  study_year: number;
  academic_year: string;
  semester: string;
}

export interface publishCourseEnrollment {
  enrollment_id: string;
  deadline: string;
}
export interface getEnrollmentStudents {
  enrollment_id: string;
  program_id?: string;
  student_uid?: string;
  page: number;
  limit: number;
}
export interface IAddStudentsEnrolledCourse {
  assigned_course_id: string;
  student_id: string;
  group_type: string;
}
