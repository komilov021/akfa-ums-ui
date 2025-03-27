import type { ILanguage } from "./common.model";

export interface Ilangs {
  name: string;
  code: string;
}

export interface IRole {
  id: string;
  name: ILanguage;
  slug: string;
}

export interface IProgram {
  id: string;
  program: string;
  per_semester: number;
  fee_foreign_student: number;
  duration: string;
}
export interface ISchool {
  id: string;
  created_at: string;
  title: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  positions?: { id: string; name: string; editable: boolean }[];
  editable?: boolean;
  open?: boolean;
}
export interface Position {
  id: string;
  name: string;
}
export interface ILessonType {
  id: string;
  name: string;
  editable?: boolean;
}
export interface IcreateLessonTypes {
  name: string;
}
export type IeditLessonTypes = IcreateLessonTypes & {
  id: string;
};
export interface IPrequisite {
  id: string;
  name: string;
  editable?: boolean;
}
export interface IFunctionReference {
  id: string;
  name: string;
  editable?: boolean;
}
export interface IDegree {
  id: string;
  name: string;
  reference: string;
  editable?: boolean;
}

export interface IRoomReference {
  total: number;
  id: string;
  name: string;
  code: string;
  seats: number;
  lessons: { id: string; name: string }[];
  limitations: null;
}
export interface IAccessibilityPermissionList {
  id: string;
  name: {
    en: string;
  };
  code: string;
  active: boolean;
}
export interface ICreateDegree {
  name: string;
  reference: string;
  type?: string | null;
}
export interface IEditDegree extends ICreateDegree {
  id: string;
}
export interface ICreateDepartment {
  name: string;
  description?: string | null;
}
export interface IEditDepartment extends ICreateDepartment {
  id?: string;
}
export interface ICreatePosition {
  name: string;
  department_id: string;
}
export interface IEditPosition extends ICreatePosition {
  id: string;
}

export interface IProgramCreate {
  school_id: string;
  program: string;
  per_semester: number;
  fee_foreign_student: number;
  duration: string;
  chief_id: string;
  degree_id: string;
  icon: string;
  lang: string[];
  title: {
    en: string;
    ru: string;
    uz: string;
  };
  has_scholarship: boolean;
  is_active: boolean;
}
export interface IprogramUpdate extends IProgramCreate {
  id: string;
}
export interface IApplicationRegions {
  type?: string | null;
  parent_id?: string | null;
}
export interface IRegions {
  id: string;
  name: {
    cr: string;
    en: string;
    qq: string;
    ru: string;
    uz: string;
  };
  parent_id: null;
  type: string;
}
export interface IProgramIist
  extends Omit<IprogramUpdate, "school_id" | "chief_id"> {
  applicant_program_name: null;
  degree: {
    id: string;
    name: string;
  };
  school: {
    id: string;
    title: string;
  };
  chief: {
    id: string;
    last_name: string;
    first_name: string;
  };
}
export interface IProgramGetOne
  extends Omit<IProgramIist, "applicant_program_name"> {}
export interface ICreateTestType {
  name: string;
}

export type TEditTestType = ICreateTestType & {
  id: string;
};
