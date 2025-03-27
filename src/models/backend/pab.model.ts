export interface IPabRequest {
  semester: string;
  level: number;
  program_id: string;
  pab_number: number;
}
export interface IPabFinalRequest {
  level: number;
  program_id: string;
  fall_semester: string;
  spring_semester: string;
}
export interface IPabUpdate {
  pab_one_id: string;
  pab_one_decision: string;
  modules: {
    reset: boolean;
    course: string;
    credits: number;
    reset_grade: number;
    retake_grade: number;
    overall_grade: number;
    module_attempt: number;
    pab_one_module_decision: string;
    components: {
      id: string;
      weight: number;
    }[];
  }[];
}
interface Info {
  n: number;
  aa: number;
  cf: number;
  cp: number;
  mc: boolean;
  ms: string[];
  nf: number;
  nm: number;
  og: number;
}

export interface PabComponent {
  score: number;
  component: string;
}

export interface PabModule {
  reset: boolean;
  course: string;
  credits: number;
  components: PabComponent[];
  reset_grade: number;
  retake_grade: number;
  overall_grade: number | undefined;
  module_attempt: number;
  pab_one_module_decision: string;
  module_pab_decision: string | undefined;
}
export interface IPabModuleTwo extends PabModule {
  overall_grade_after_reset: number | undefined;
  overall_grade_after_resit: number;
  pab_two_decision_module: string;
  reset: boolean;
}
export interface IPabOne {
  id: string;
  student_uid: string;
  student_id: string;
  pab_one_decision: string;
  info: Info;
  modules: PabModule[];
  level: string;
  first_name: string;
  last_name: string;
  created_at: string;
  semester: string;
}
export interface IPabTwo extends IPabOne {
  pab_two_decision: string;
  modules: IPabModuleTwo[];
}
