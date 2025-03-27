import { IFile } from "./common.model";

interface request {
  explanation: string;
  files: IFile;
  type: string;
}

export interface IGradingSystemExport {
  from_semester: number;
  to_semester: number;
  level: number;
  program_id: string;
}
export interface IassignedCourseIdWithRetake {
  assigned_course_id: string;
  retake: boolean;
}
export interface IGradingSystemMainList extends IassignedCourseIdWithRetake {
  student_uid: string | null;
  page: number;
  limit: number;
}
export interface IGradingSystemList extends IassignedCourseIdWithRetake {
  component_id: string;
}

export interface IimportMainGradingSystem extends IGradingSystemList {
  file_id: string;
  request: any;
}
export interface IGradingSystemRemove extends IassignedCourseIdWithRetake {
  is_published?: boolean;
  component_id: string;
  request: any;
}
export interface IGradingSystemGenerate extends IassignedCourseIdWithRetake {}
export interface IgradingSystemMainGradeRemove
  extends IassignedCourseIdWithRetake {
  is_published?: boolean;
}

export interface ISystemgradeSingleRemove {
  id: string;
  request: request;
}
export interface IGradingSystemCreate extends IassignedCourseIdWithRetake {
  component_id: string;
  student_id: string;
  score: number;
  request: request;
}

export interface IEditSingleGrade {
  id: string;
  score: number;
  request: request;
}
