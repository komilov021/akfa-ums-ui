import type { IFile } from "./common.model";
export interface IScholarship {
  id: string;
  title: string;
  description: string;
  percentage: number;
}
export interface IScholarshipListByStudent extends IScholarship {
  semester: string;
  assigner: string;
  created_at: string;
  files: IFile;
}

export interface IScholarshipAttach {
  criteria_id: string;
  student_id: string;
  semester: string;
  files: IFile;
}
export interface IScholarshipCreate extends Omit<IScholarship, "id"> {}
