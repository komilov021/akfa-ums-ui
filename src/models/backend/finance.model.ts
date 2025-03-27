import type { IFilter } from "./common.model";
export interface IPayment {
  total: string;
  id: string;
  semester_id: string;
  student_uid: number;
  student_name: string;
  program_name: string;
  study_year: string;
  payment_total: number;
  paid: number;
  debt: number;
  deadline: string;
  created_at: string;
  status: string;
  is_blocked: boolean;
  blocked_at: string;
}
export interface IPaymentFilter extends IFilter {
  semester_id: string | undefined;
  status?: string | undefined;
  program_id?: string | undefined;
  student_uid?: number | null;
  level: number | undefined;
}
export interface IPaymentHistoryFilter extends IFilter {
  student_uid: number | null;
  semester_id: string | null;
  program_id: string | null;
  level: number | null;
  from_date: string | undefined;
  to_date: string | undefined;
}
export interface IPaymentHistoryForm {
  student_uid: number;
  semester_id: string;
  amount: number;
  payment_date: string;
}
export interface IPaymentHistory {
  total: number;
  id: string;
  student_uid: number;
  full_name: string;
  created_at: string;
  payment_date: string;
  amount: number;
  is_foreign: boolean;
  currency: string;
  semester_id: string;
  level: number;
}
export interface IPaymentStudent {
  id: string;
  semester: string;
  tuition: number;
  paid: number;
  dept: number;
}
export interface IPaymentForm {
  student_uid: number;
  semester_id: string;
  payment_deadline: string;
  total_tuition_fee: string;
}

export interface IFinanceProgram {
  program_id: string;
  program: string;
  school: string;
}
export interface IupdatePayment {
  payment_id: string;
  deadline: string;
}

export interface IPaymentImport {
  semester_id: string;
  file_id: string | null;
}
