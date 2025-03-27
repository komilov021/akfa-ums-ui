interface tests {
  id: string;
  min: number;
  max: number;
}
interface component_retakeGrade {
  id: string;
  weight: number;
}
interface grade {
  gpa: number;
  grade: string;
  proportion: number;
}
interface lesson {
  id: string;
  per_week: number;
  duration: number;
  max_students: number;
  room_ids?: string[];
}
export interface ICourseReferance {
  total: number;
  id: string;
  title: string;
  code: string;
  retake_code: string;
  credits: number;
  retake_credits: number;
  grading_type: string;
  prerequisite_ids: string;
  tests: {
    id: string;
    max: string;
    min: string;
    name: string;
  }[];
  grade: grade[];
  retake_grade: grade;
  components: component_retakeGrade[];
  retake_components?: component_retakeGrade[];
  lessons: any;
  created_at: Date;
  program_id?: string;
  school_id?: string;
  chief_id?: string;
}
export type ICourseReferances = {
  page: number;
  limit: number;
  semester?: string;
  study_year?: string;
  search?: string | null;
};

export interface ICreateCourseReferance {
  title: string;
  code: string;
  chief_id: string;
  prerequisite_ids: string[];
  tests: tests[];
  school_id: string;
  credits: number;
  retake_credits: number;
  grading_type: string;
  grade: grade[];
  retake_grade: grade;
  components: component_retakeGrade[];
  retake_components: component_retakeGrade[];
  lessons: lesson[];
}
