export interface IStudentProgression {
  id: string;
  student_id: string;
  student_uid: string;
  student_name: string;
  fail_count: number;
  status: string;
  fails?: FailsEntity[] | null;
  curriculum_id: string;
  created_at: string;
}
export interface FailsEntity {
  id: string;
  code: string;
  required: boolean;
}
