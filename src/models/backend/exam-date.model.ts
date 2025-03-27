export interface IExamYear {
  id: string;
  to_char: string;
  year: number;
  is_active: boolean;
}
export interface IExamSemestr {
  id: string;
  to_char: string;
  name: string;
  year: number;
  row_number: number;
}
export interface IExamDate {
  id: string;
  year_id: string;
  duration: string;
}
export interface IExamCreateYear {
  year: string;
  admission_date: string;
}
export interface IExamYearUpdate extends IExamCreateYear {
  id: string;
}
export interface ISemesterCreate {
  name: string;
  academic_year_id: string;
}
export interface ISemesterUpdate extends ISemesterCreate {
  id: string;
}

export interface ICreateExamDates {
  exam_at: string;
  location: string;
  exam_type: string;
  year_id: string;
}
// export interface ICreateExamDates {
//   year_id: string;
//   duration: string;
//   is_online: boolean;
//   is_offline: boolean;
// }
export interface IEditExamDates extends ICreateExamDates {
  id: string;
}
