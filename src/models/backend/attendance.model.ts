import type { IFilter } from "./common.model";
export interface IDetailHeader {
  id: string;
  name: string;
  lesson?: number[];
}

export interface IAttendanceStudent {
  id: string;
  student_name: string;
  program_name: string;
  study_year: number;
  present_in_class: boolean;
  changed_at: Date;
  changed_by_json: {
    id: string;
    role: string;
    email: string;
    last_name: string;
    first_name: string;
  };
}

export interface IStudentGrade {
  is_published: boolean;
  student_id: string;
  score?: number;
  uid: string;
  changed_by_json: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    id: string;
  };
}
export interface IAttendanceTeachingWeekFilter {
  assigned_course_id: string;
  semester?: string;
  limit: number;
  page: number;
}
export interface IcreateTeachingWeek {
  assigned_course_id: string;
  semester: string;
  title: string;
}

export interface IStudents {
  teaching_week_id: string;
  program_id: string | string[];
  lesson_id: string;
  semester?: string;
  search?: string;
  lesson: number;
  limit: number;
  page: number;
}
export interface IStudentAttendace {
  assigned_course_id: string;
  semester_id: string;
  student_id: string;
}
export interface ILowAttendanceStudents {
  assigned_course_id: string;
  is_midterm?: string;
  limit: number;
  page: number;
}
