import type { IRole } from "./guide.model";

export interface IStaffList {
  id: string;
  full_name: string;
  salary: number;
  card_number: number;
  pay_type: number;
  work_hour: number;
  phone: string;
  created_at: Date;
}

export interface IStaff {
  id: string;
  name: string;
  surname: string;
  middle_name: string;
  phone: string;
  address: string;
  passport_number: string;
  email: string;
  salary: number;
  card_number: string;
  pay_type: number;
  work_hour: number;
  user_id: string;
  org: { id: string; name: string };
  role: string;
  passport_image: any;
}
