export interface ISubject {
  id: string;
  title: string;
  code: string;
  credits: number;
  retake: number;
  grading: string;
  program_id: string;
}
export interface IcreateSubjects extends Omit<ISubject, "id"> {}
