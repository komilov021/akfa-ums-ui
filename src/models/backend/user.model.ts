export interface ILoginInfo {
  email: string;
  password: string;
}
export interface IAcceptInvite {
  code: string;
  confirm_password: string;
  password: string;
}

export interface ISigninForm {
  email: string;
  first_name: string;
  last_name: string;
  confirm_password: string;
  password: string;
}
export interface IResetInvite {
  code: string;
  otp?: string;
  confirm_password: string;
  password: string;
}
export interface IResetPassword {
  confirm_new_password: string;
  new_password: string;
}

export interface IUserRole {
  id: string;
  name: { ru: string; uz: string };
}

export interface IUser {
  id: string;
  email: string;
  phone?: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  country: { code: string };
  role: UserRoles;
  is_verified: boolean;
  teacher_id: string;
}

export enum UserRoles {
  super_admin = "super_admin",
  admin = "admin",
  academic_director = "academic_director",
  head_admission = "head_admission",
  academic_manager = "academic_manager",
  admission_specialist = "admission_specialist",
  finance_manager = "finance_manager",
  teacher = "teacher",
}

export interface IMenu {
  id: string;
  type: string;
  path: string;
  label: string;
  position: number;
  icon: string;
  roles: UserRoles[];
  parent_id?: number;
  background?: string;
  sidebar_visible: boolean;
  menu_type: string;
  group_parent_id?: number;
  description: string;
}
