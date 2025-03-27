import type { IFile } from "./common.model";

export interface ITranscript {
  id: string;
  student_uid: 190006;
  student_id: string;
  created_at: string;
  created_by: string;
  pdf: IFile;
}
interface ITranscriptRequest {
  explanation: string;
  files: IFile;
  type: string;
}
interface ITranscriptRplCourses {
  subject: string;
  credit: number;
  grade: string;
}
interface GetTranscript {
  courses: ITranscriptRplCourses[];
  all_credits: number;
  ts: number;
  overall_gpa: number;
  request: ITranscriptRequest;
}
export interface ITranscriptRpl extends GetTranscript {
  id: string;
  title: string;
}
export interface ITranscriptRplList {
  courses: ITranscriptRplCourses[];
  all_credits: number;
  ts: number;
  overall_gpa: number;
}
export interface ITranscriptRplCreate extends GetTranscript {
  student_id: string;
  semester_id: string;
}
export interface ITranscriptRplUpdate extends ITranscriptRplCreate {
  id: string;
}
export interface ITranscriptRplDelete {
  id: string;
  request: ITranscriptRequest;
}
