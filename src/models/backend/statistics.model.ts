import type { ILanguage } from "./common.model";

export interface ISemestrFilter {
  from_semester?: number;
  to_semester?: number;
}
export interface IStrategicMetrics {
  number_of_students: number;
  average_gpa: number;
  number_of_teachers: number;
  proxy_for_situation: {
    "2019": number;
    "2020": number;
    "2021": number;
    "2022": number;
    "2023": number;
    "2024": number;
    semester: string;
  }[];
}

export interface ITopStudentByGpa {
  id: string;
  first_name: string;
  last_name: string;
  avg_gpa: string;
  school_info: {
    id: string;
    name: string;
  };
}

export interface IStudentByGender {
  // id: string;
  // title: string;
  // count: number;
  // male: number;
  // female: number;
  // gender_not_set: number;
  male: {
    sum: number;
    programs: { total: number; school_name: string }[];
  };
  female: {
    sum: number;
    programs: { total: number; school_name: string }[];
  };
  not_set: {
    sum: number;
    programs: { total: number; school_name: string }[];
  };
}
export interface IStudentRetakeRatio {
  fail_count_number: number;
  total_fails_count: number;
  // programs: {
  //   name: string;
  //   count: number;
  // }[];
}
[];

export interface IPassFailRate {
  id: string;
  title: string;
  programs: {
    id: string;
    fail: number;
    pass: number;
    program: string;
  }[];
}

export interface IApplicationByNumber {
  total_applications: number;
  percentage: {
    accepts: {
      total: number;
      percentage: number;
    };
    rejects: {
      total: number;
      percentage: number;
    };
    pendings: {
      total: number;
      percentage: number;
    };
  };
}
export interface IApplicationByPerson {
  total_applications: number;
  one_application: {
    total: number;
    percentage: number;
  };
  two_applications: {
    total: number;
    percentage: number;
  };
  three_applications: {
    total: number;
    percentage: number;
  };
  four_applications: {
    total: number;
    percentage: number;
  };
}

export interface IApplicationBySchool {
  total_count: number;
  schools: {
    name: string;
    count: number;
    programs: {
      name: string;
      count: number;
    }[];
    percentage: number;
  }[];
}

export interface IApplicationByAge {
  total_applicants: number;
  average_age: number;
  applicants_under_18: {
    total: number;
    percentage: number;
  };
  applicants_18_to_20: {
    total: number;
    percentage: number;
  };
  applicants_20_to_22: {
    total: number;
    percentage: number;
  };
  applicants_over_22: {
    total: number;
    percentage: number;
  };
}
export interface IApplicationForeignToLocal {
  total_applications: number;
  locals: {
    total: number;
    percentage: number;
  };
  foreigns: {
    total: number;
    percentage: number;
  };
  unknowns: {
    total: number;
    percentage: number;
  };
}
export interface IApplicationByRegion {
  total: number;
  regions: [
    {
      name: ILanguage;
      count: number;
      percentage: number;
    }
  ];
}
export interface IApplicationByIelts {
  total_certificates: number;
  ielts: {
    total: number;
    percentage: number;
  };
  duolingo: {
    total: number;
    percentage: number;
  };
  toefl: {
    total: number;
    percentage: number;
  };
  iepte: {
    total: number;
    percentage: number;
  };
  unknowns: {
    total: number;
    percentage: number;
  };
}

export interface IApplication {
  application_by_number: IApplicationByNumber;
  ielts_and_internal_exam: IApplicationByIelts;
  foreign_to_local_applicants: IApplicationForeignToLocal;
  applications_by_age: IApplicationByAge;
  accepted_applications_by_regions: IApplicationByRegion;
  applications_per_person: IApplicationByPerson;
  accepted_applications_by_school: IApplicationBySchool;
}

export interface ITotalStudentNumber {
  total_count: number;
  semesters: {
    name: string;
    count: number;
    percentage: number;
  }[];
}

export interface ITotalStudentByGender {
  semesters: {
    name: string;
    male_count: number;
    female_count: number;
    gender_not_set: number;
  }[];
}
export interface IStudentBySchool {
  name: string;
  schools: {
    name: string;
    count: string;
    programs: [
      {
        name: string;
        count: number;
      }
    ];
    percentage: number;
  }[];
}
export interface IProgramsAvgFee {
  total_applicants_count: number;
  avg: number;
  admission_programs: [
    {
      title: string;
      contract_price: number;
      applied_applicant_count: number;
    }
  ];
}

export interface IGeneralStatistic {
  total_students_number: ITotalStudentNumber;
  students_by_gender: ITotalStudentByGender;
  students_by_school: IStudentBySchool[];
}

export interface IAvarageGpa {
  average: number;
  average_gpa: string;
  title: string;
  semester: number;
  semester_id: number;
}

export interface IStudentQuantityBySchool {
  id: string;
  title: string;
  programs: {
    count: number;
    program: string;
  }[];
  student_count: string;
}
export interface IAvarageAttendanceBySchool {
  id: string;
  title: string;
  programs: {
    count: number;
    title: string;
  }[];
  sum: string;
}
export interface IStudentByProgram {
  name: string;
  count: number;
  id: string;
}
export interface IGpaDistribution {
  semester_id: string;
  semester: string;
  school_id: string;
  level: number;
  "0-1.99": number;
  "2-2.99": number;
  "3-3.99": number;
  "4-4.3": number;
}

export interface IExamFailRate {
  semester_id: string;
  semester: string;
  fail: number;
  pass: number;
}
export interface IProxyForStatistic {
  "2019": number | null;
  "2020": number | null;
  "2021": number | null;
  "2022": number | null;
  "2023": number | null;
  "2024": number | null;
  semester: string;
  semester_id: string;
}

export interface IDistributionByLevel {
  level: number;
  semesters: {
    count: number;
    semester: string;
  }[];
}

export interface IStudentStatistic {
  average_gpa: IAvarageGpa[];
  students_by_program: IStudentByProgram[];
  gpa_distribution: IGpaDistribution[];
  exam_fail_rate: IExamFailRate[];
  proxy_for_satisfaction: IProxyForStatistic[];
  distribution_by_level: IDistributionByLevel[];
}

export interface ILatestStatistic {
  number_of_general_students: {
    total: number;
  };
  average_gpa_for_latest_year: {
    semester_id: string;
    semester: string;
    average: number;
  };
  number_of_applicants: {
    total: number;
  };
}
