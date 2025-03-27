export interface IGroupCourse {
  total: number;
  course_reference_id: string;
  course_codes: string;
  title: string;
}

export interface IGroup {
  id: string;
  semester: string;
  title: string;
  teacher_id?: string;
  study_year: number;
  component_id?: number;
  student_count: number;
  teacher: {
    id?: string;
    last_name?: string;
    first_name?: string;
  };
}

export interface IGroupStudent {
  total: number;
  id: string;
  student_id: string;
  student_uid: number;
  study_year: number;
  first_name: string;
  last_name: string;
  email: string;
  program: string;
}
export interface IgroupsCourseList {
  study_year: number;
  semester: string;
  page: number;
  limit: number;
}
export type IGroupsList = IgroupsCourseList & {
  course_reference_id: string;
};
export interface IGroupsCreate {
  course_reference_id: string;
  study_year: number;
  semester: string;
  title: string;
}
export type IGroupsStudentList = {
  group_id: string;
  page: number;
  limit: number;
};
export type IGroupsAttachTeacher = {
  teacher_id: string;
  group_id: string;
};
export interface IgroupsImport {
  course_reference_id?: string;
  file_id: string;
  group_id?: string;
  semester?: string;
  study_year?: number;
}
export interface IgroupsStudentCreate extends Omit<IgroupsImport, "file_id"> {
  student_id: string;
}
