import type { IFilter, IFile } from "./common.model";

export interface IStudentsFilter extends IFilter {
  acceptance_year?: number | undefined;
  program_id?: string | undefined;
  phone?: string | null;
  level?: number | null;
  search?: string | undefined;
  email?: string | null;
  is_archived?: boolean | null;
}
export interface IStudent {
  acceptance_year: number;
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  level: number;
  phone: string;
  program: { id: string; name: string };
  total: number;
  uid: string;
  study_year?: string;
}
export interface IResidency {
  id: string;
  name: string;
  dial_code: string;
  code: string;
}
export interface IStudentGetOne extends Omit<IStudent, "total"> {
  avatar: IFile;
  country: IResidency;
  program: {
    id: string;
    name: string;
  };
  group_code: string;
  parent_full_name: string;
  parent_gender: string;
  parent_home_address: string;
  parent_passport: string;
  parent_phone: string;
  parent_pinfl: string;
  parent_work_address: string;
  passport: string;
  pinfl: string;
  birth_date: string;
  gender: string;
  status: boolean;
  currency: string;
}

export interface IStudentSemestrList {
  id: string;
  semester: string;
}

export interface IStudentCourses {
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

export interface IStudentCourseDetails {
  id: string;
  title: string;
  weight: number;
  score: number;
  actual: number;
  total: {
    gpa: number;
    grade: string;
    total: number;
  };
}

export interface IStudentParents {
  student_id: string;
  parent: string;
  fullname: string;
  personal_number: string;
  gender: string;
  passport_number: string;
  phone: string;
  living_address: string;
  workplace: string;
}
export interface IStudentParent extends IStudentParents {
  id: string;
}
export interface IStudentParentUpdate
  extends Omit<IStudentParents, "student_id"> {
  parent_id: string;
}
export interface IForStudentGrade {
  id: string;
  module_name: string;
  status: string;
  module_code: string;
  module_semester: string;
  components: any[];
  credits: number;
  chief_first_name: string;
  chief_last_name: string;
  total: number;
  grade: string;
}
export interface IcreateStudent {
  uid: string;
  program_id: string;
  country_id: string;
  first_name: string;
  last_name: string;
  email: string;
  level: number;
  passport: string;
  pinfl: string;
  acceptance_year: number;
  graduation_year?: number;
  gender: string;
  birth_date: string;
  phone: string;
  study_year: number;
  emergency_contact_type?: string;
  contact_type?: string;
  emergency_contact?: string;
  additional_email?: string;
  avatar: IFile | null;
  address?: string;
  group_code?: string;
}
export interface IeditSubjects extends IcreateStudent {
  id?: string | null;
}
export interface ItutionFeeStudents {
  student_id: string;
  start_year?: string | null;
  last_year?: string | null;
}
export interface ItoggleArchivedStudent {
  uid: string;
  is_archived: boolean;
}
export interface IfetchStudentCourseDetails {
  student_id: string;
  course_id: string;
}
export interface IfetchStudentBlockStatus {
  id: string;
  is_blocked: boolean;
}
export interface IfetchFilterStudentGrade {
  student_id: string;
  semester: string;
  course_id: string;
}
