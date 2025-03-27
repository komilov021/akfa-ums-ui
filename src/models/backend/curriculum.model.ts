import { IFilter, IFile } from "./common.model";

interface Program {
  en: string;
  ru: string;
  uz: string;
}

interface AcademicYear {
  name: string;
  to_date: string;
  from_date: string;
  is_actual: boolean;
}

interface RequiredCourse {
  id: string;
  code: string;
  title: string;
  retake_code: string;
}

export interface ICurriculum {
  total: number;
  id: string;
  program_id: string;
  program: Program;
  study_year: number;
  activated: boolean;
  max_fails: number;
  created_at: string;
  semester1: string;
  semester2: string;
  academic_year: AcademicYear;
  required_courses: RequiredCourse[];
  is_closed?: boolean;
}

export interface ICurriculumFilter extends IFilter {
  program_id?: string | null;
  academic_year_id?: string | null;
}

export interface ICurriculumCourse {
  total: number;
  id: string;
  courses_reference_id: string;
  title: string;
  code: string;
  prerequisites: string[];
  is_elective: boolean;
  related_courses_codes: string[];
}

interface Grade {
  gpa: number;
  grade: string;
  proportion: number;
}

interface DepartmentLesson {
  id: string;
  name: string;
  rooms: Room[];
  duration: number;
  per_week: number;
  max_students: number;
}

interface Room {
  id: string;
  code: string;
  name: null;
  seats: number;
  lessons: RoomLesson[];
  limitations: null;
}

interface RoomLesson {
  id: string;
  name: string;
}

export interface IAssignedCourse {
  id: string;
  courses_reference_id: string;
  title: string;
  code: string;
  retake_code: string;
  credits: number;
  retake_credits: number;
  grading_type: string;
  prerequisite_ids: any[];
  chief_id: string;
  school_id: string;
  program_id: null;
  tests: any;
  grade: Grade[];
  lessons: DepartmentLesson[];
  is_elective: boolean;
  related_courses_reference_ids: string[];
  related_courses_reference_codes: string[];
  curriculum_id: string;
  semester: string;
  is_grade_calculated: boolean;
  has_retake: boolean;
}

export interface ICurriculumYear {
  id: string;
  name: string;
  status: string;
}

export interface ICurriculumLevel {
  title: string;
  study_year: number;
  curriculum_id: string;
  total_course: number;
  not_published_course: number;
}

export interface IAttachedProfessor {
  id: string;
  can_put_grade: Boolean;
  is_leader: Boolean;
  lessons: [
    {
      id: string;
      name: string;
    }
  ];
  professor: {
    id: string;
    last_name: string;
    first_name: string;
  };
}
export interface IProfessor {
  teacher_id: string;
  total: number;
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface ICreateCurriculum {
  program_id?: string;
  study_year?: number;
  academic_year?: string;
}
export interface ICurriculumPopulate extends ICreateCurriculum {
  curriculum_id: string;
  semester?: string;
}
export interface IAssignCoursesFilter {
  curriculum_id?: string | null;
  semester?: string | null;
  page: number;
  limit: number;
  semester_id?: string;
  department_id?: string | null;
  level?: number | null;
}
export interface ICurriculumLevels {
  curriculum_year_id: string | string[];
  program_id: string | string[];
}
export interface IAssignCourses {
  curriculum_id: string;
  semester: string;
  courses_reference_id: string;
  is_elective: boolean;
  related_courses_reference_ids: string[];
  component_ids: string[];
  retake_component_ids: string[];
}
interface request {
  explanation: string;
  files: IFile;
  type: string;
}
export interface editAssignCourses extends IAssignCourses {
  assigned_course_id: string;
  request: request;
}
export interface IupdateAssignCoursesComponents {
  assigned_course_id: string;
  components: [
    {
      id: string;
      weight: number;
    }
  ];
  request: request;
}
export interface IeditAssignCourseGradingLeader {
  assigned_course_id: string;
  chief_id?: string;
  school_id?: string;
  request: request;
}
export interface IeditAssignCourseGradingCredits {
  assigned_course_id: string;
  grading_type: string;
  credits: number;
  request: request;
}
export interface IeditAssignCourseRetakeGradingCredits {
  assigned_course_id: string;
  retake_grading_type: string;
  retake_credits: number;
  request: request;
}
export interface IeditAssignCourseLessons {
  assigned_course_id: string;
  lessons: {
    id: string;
    per_week: number;
    duration: number;
    max_students: number;
    room_ids: string[];
  }[];
  request: request;
}
export interface IdeleteAssignCourses {
  curriculum_id: string;
  id: string;
  request: request;
  semester?: string;
}
export interface IsaveProgressionRule {
  curriculum_id: string;
  max_fails: number;
  courses_ids: string[];
}
export interface IeditProgressionRule extends IsaveProgressionRule {
  request: request;
}
export interface IProfessorsFilter {
  page: number;
  limit: number;
}
export interface IcreateAttachProfessor {
  assigned_course_id: string;
  curriculum_id: string;
  professors: {
    professor_id: string;
    can_put_grade: boolean;
    is_leader: boolean;
    lessons: [
      {
        id: string;
        name: string;
      }
    ];
  }[];
}
export interface IAssignCoursesGetGroupsList {
  assigned_course_id: string;
  semester: string;
}
export interface Ilist_by_levels {
  study_year: number;
  program_id: string;
  id: string;
  activated: boolean;
}

export interface IGroupsInfo {
  id: string;
  title: string;
  short_name: string;
}

export interface IElectiveModulesWithGroups {
  assigned_course_id: string;
  courser_reference_id: string;
  title: string;
  code: string;
  flow_group_id: string;
  groups: IGroupsInfo[];
}
