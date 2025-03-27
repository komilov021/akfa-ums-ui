export interface ILanguage {
  cr: string;
  en: string;
  qq: string;
  ru: string;
  uz: string;
}

export interface ListData<T> {
  page: number;
  limit: number;
  total: number;
  data: T[];
}
export interface TimetableListData<T> {
  success: boolean;
  data: T[];
  timestamp: string;
  error: null;
  pagination: {
    total_items: number;
    total_pages: number;
    current_page: number;
    limit: number;
    offset: number;
  };
}

export type Gender = "MALE" | "FEMALE";

export interface IFile {
  id: string;
  name: string;
  size: number;
  type: string;
  created_at: Date;
  bucket_name: string;
}

export interface IFilter {
  limit: number;
  page: number;
  search?: string;
}

export enum RequestTypeEnum {
  course_general = "course_general",
  course_prerequisites = "course_prerequisites",
  course_grading = "course_grading",
  course_course_leader = "course_course_leader",
  assigned_course_component_edit = "assigned_course_component_edit",
  course_grade_main = "course_grade_main",
  course_grade_retake = "course_grade_retake",
  course_grade_components = "course_grade_components",
  course_lessons = "course_lessons",
  // assigned_courses = "assigned_courses",
  assigned_semester1 = "assigned_semester1",
  assigned_semester1_remove = "assigned_semester1_remove",
  assigned_semester2 = "assigned_semester2",
  assigned_semester2_remove = "assigned_semester2_remove",
  assigned_student_progression = "assigned_student_progression",
  assigned_grading_credits = "assigned_grading_credits",
  assigned_retake_grading_credits = "assigned_retake_grading_credits",
  assigned_grading_leader = "assigned_grading_leader",
  assigned_lessons = "assigned_lessons",
  grade_appeal_edit = "grade_appeal_edit",
  course_grading_remove = "course_grading_remove",
  course_grading_insert = "course_grading_insert",
  course_grading_edit = "course_grading_edit",
  rpl_insert = "rpl_insert",
  rpl_edit = "rpl_edit",
  rpl_remove = "rpl_remove",
  pab_one_edit = "pab_one_edit",
  pab_two_edit = "pab_two_edit",
  pab_three_edit = "pab_three_edit",
  pab_final_edit = "pab_final_edit",
  student_status = "student_status",
  group_edit = "group_edit",
  student_from_group_remove = "student_from_group_remove",
  publish_component_course_edit = "publish_component_course_edit",
  unpublish_component_course_edit = "unpublish_component_course_edit",
  component_grade_remove = "component_grade_remove",
  component_grade_import_with_excel = "component_grade_import_with_excel",
}

export enum Semester {
  SPRING = "SPRING",
  FALL = "FALL",
}
