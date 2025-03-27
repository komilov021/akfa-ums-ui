import { defineStore } from "pinia";

import request from "@/utils/request";
import type {} from "@/models/backend";
import type {
  IStrategicMetrics,
  ITopStudentByGpa,
  IStudentByGender,
  IStudentRetakeRatio,
  IGpaDistribution,
  IAvarageGpa,
  IStudentQuantityBySchool,
  IPassFailRate,
  IAvarageAttendanceBySchool,
  ISemestrFilter,
  IApplication,
  IProgramsAvgFee,
} from "@/models/backend/statistics.model";
import { format } from "date-fns";
import { useAcademicStore } from "./academic";

interface StatisticState {
  // profit: any | null;
  application: IApplication | null;
  studentsByGender: IStudentByGender | null;
  studentRetakeRatio: IStudentRetakeRatio[] | null;
  strategicMetrics: IStrategicMetrics | null;
  topStudentsByGpa: ITopStudentByGpa[] | null;
  gpaDistribution: IGpaDistribution[] | null;
  studentQuantityBySchool: IStudentQuantityBySchool[] | null;
  avarageAttendanceBySchool: IAvarageAttendanceBySchool[] | null;
  passFailRate: IPassFailRate[] | null;
  gpaAvarage: IAvarageGpa[] | null;
  gpaAvarageYearly: any;
  teacherPerStudent: any;
  loading: boolean;
  filter: {
    dates: Date[];
    program?: string | null;
    semestrs?: {
      from: number | null;
      to: number | null;
    };
  };
  admission: {
    average_in_usd: number;
    programs: {
      title: string;
      id: string;
    }[];
  };
  gpaMetrics:
    | {
        average_gpa: number;
      }
    | any;
  studentMetrics:
    | {
        count_total: number;
      }
    | any;
  teacherMetrics:
    | {
        count: number;
      }
    | any;
  paymentMetrics: {
    total: number;
    payment: number;
    currency: "USD" | "UZS";
  } | null;
  financeMetrics: {
    no_debt: number;
    no_data: number;
    paid_more_than_50_percent: number;
    paid_less_than_50_percent: number;
  } | null;
  turnRate: any;
  examDate:
    | {
        duration: string;
        count: string;
      }
    | any;
  applicantsCountByDay:
    | {
        apply_date: string;
        total_registered_student: number | null;
      }[]
    | null;
  programsAvarageFee: IProgramsAvgFee | null;
  avgTimeSpendStudent: any;
  avgTimeSpendTeacher: any;
  activeStudentCount: any;
  teacherPerStudentRadio: any;
  staffPerStudentRadio: any;
  pointLeaders: any;
  facilityUtilizations: any;
  studentStatuses: any;
  projectBudgetPercentages: any;
  studentEmployStatistic: any;
}

export const useStatisticsStore = defineStore("statistics", {
  state: (): StatisticState => ({
    application: null,
    strategicMetrics: null,
    topStudentsByGpa: null,
    studentsByGender: null,
    studentRetakeRatio: null,
    gpaDistribution: null,
    gpaAvarage: null,
    gpaAvarageYearly: null,
    studentQuantityBySchool: null,
    avarageAttendanceBySchool: null,
    teacherPerStudent: null,
    passFailRate: null,
    gpaMetrics: null,
    studentMetrics: null,
    teacherMetrics: null,
    paymentMetrics: null,
    financeMetrics: null,
    loading: false,
    filter: {
      program: null,
      semestrs: {
        from: null,
        to: null,
      },
      dates: [],
    },
    admission: {
      programs: [],
      average_in_usd: 0,
    },
    turnRate: null,
    examDate: null,
    applicantsCountByDay: null,
    programsAvarageFee: null,
    avgTimeSpendStudent: null,
    avgTimeSpendTeacher: null,
    activeStudentCount: null,
    teacherPerStudentRadio: null,
    staffPerStudentRadio: null,
    pointLeaders: null,
    facilityUtilizations: null,
    studentStatuses: null,
    studentEmployStatistic: null,
    projectBudgetPercentages: null,
  }),

  actions: {
    async studentEmployment(data?: any) {
      try {
        const res = await request.post(
          "/v3/analytics/student-employment-statistics",
          data
        );
        this.studentEmployStatistic = res;
      } catch (error) {
        console.log(error);
      }
    },
    async projectBudget(data?: any) {
      const res = await request.post(
        "/v3/analytics/project-salary-percentages",
        data
      );
      this.projectBudgetPercentages = res;
    },
    updateSemestr(semestrs: any) {
      this.filter.semestrs = semestrs;
    },
    setDate(date: Date[]) {
      this.filter.dates = date;
    },
    setProgram(program: string | null) {
      this.filter.program = program;
    },
    async fetchApplicationAnalytic() {
      try {
        this.loading = true;
        this.application = null;
        const application = await request.post(
          "/analytics/application-analytics",
          {
            from_date: format(this.getDate[0], "yyyy-MM-dd"),
            to_date: format(this.getDate[1], "yyyy-MM-dd"),
            program_id: this.filter.program,
          }
        );
        this.application = application;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchGpaMetrics(params?: any) {
      try {
        this.loading = true;
        this.gpaMetrics = null;
        const application = await request.post("/v3/analytics/average-gpa", {
          ...params,
          from_semester: 9,
          to_semester: 9,
        });
        this.gpaMetrics = application;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchStudentsMetrics(data?: any) {
      try {
        this.loading = true;
        this.studentMetrics = null;
        const application = await request.post(
          "/analytics/number-of-students",
          data
        );
        this.studentMetrics = application;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchTeachersMetrics(school_id?: string) {
      try {
        this.loading = true;
        this.teacherMetrics = null;
        const application = await request.post(
          "/v3/analytics/total-teacher-count",
          { school_id, from_semester: 10, to_semester: 10 }
        );
        this.teacherMetrics = application;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchTeacherPerStudent(school_id?: string) {
      try {
        this.loading = true;
        const application = await request.post(
          "/analytics/teacher-per-student-ratio",
          {
            school_id,
          }
        );
        this.teacherPerStudent = application;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchTopTenStudents(
      params: { school_id?: string } & ISemestrFilter = {}
    ) {
      try {
        this.topStudentsByGpa = null;
        const response = await request.post(
          "/v3/analytics/top-student-by-gpa",
          {
            ...params,
            page: 1,
            limit: 10,
          }
        );
        this.topStudentsByGpa = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchStudentsByGender(level?: number) {
      try {
        this.studentsByGender = null;
        const response = await request.post(
          "/analytics/quantity-of-students-by-gender",
          {
            level,
          }
        );
        this.studentsByGender = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchStudentsRetakeRatio(data?: any) {
      try {
        this.studentRetakeRatio = null;
        const response = await request.post(
          "/v3/analytics/student-retakes-ratio",
          {
            ...this.fromToSemestr,
            school_id: data?.school_id,
            level: data?.level,
          }
        );
        this.studentRetakeRatio = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchGpaDistrbution(params?: any) {
      try {
        this.gpaDistribution = null;
        if (
          !params?.from_semester ||
          !params.to_semester ||
          !params.school_id
        ) {
          params = {
            ...params,
            ...this.fromToSemestr,
          };
        }
        const response = await request.post("/v3/analytics/gpa-distribution", {
          ...params,
        });
        this.gpaDistribution = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchGpaAvarage(params?: any) {
      try {
        this.gpaAvarage = null;
        if (!params?.from_semester || !params.to_semester) {
          params = {
            ...params,
            ...this.averagefromToSemestrSchool,
          };
        }
        const response = await request.post(
          "/v3/analytics/average-gpa-by-school",
          {
            ...params,
          }
        );
        this.gpaAvarage = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchGpaAvarageYearly(params?: any) {
      try {
        this.gpaAvarageYearly = null;
        if (!params?.from_semester || !params.to_semester) {
          params = {
            ...params,
            ...this.fromToSemestr,
          };
        }
        const response = await request.post(
          "/v3/analytics/average-gpa-yearly",
          {
            ...params,
          }
        );
        this.gpaAvarageYearly = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchStudentQuantitybySchool(level?: number) {
      try {
        this.studentQuantityBySchool = null;
        const response = await request.post(
          "/analytics/quantity-of-students-by-school-and-programs",
          {
            from_semester: 0,
            to_semester: 15,
            level,
          }
        );
        this.studentQuantityBySchool = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchPassFailRate(params?: any) {
      try {
        this.passFailRate = null;
        if (!params?.from_semester || !params.to_semester) {
          params = {
            ...params,
            ...this.fromToSemestr,
          };
        }
        const response = await request.post("/analytics/exam-and-fail-rates", {
          ...params,
        });
        this.passFailRate = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchAverageAttendanceByGpa(level?: number) {
      try {
        this.avarageAttendanceBySchool = null;
        const response = await request.post(
          "/v3/analytics/average-attendance",
          {
            ...this.fromToSemestr,
            level: level || 1,
          }
        );
        this.avarageAttendanceBySchool = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchPaymentsDebts(custom_rate?: number) {
      try {
        const response = await request.post(
          "/analytics/payments-and-debts-of-students",
          { to_exchange_currency: "USD", custom_rate }
        );
        this.paymentMetrics = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchFinance(data?: any) {
      try {
        this.financeMetrics = null;
        const response = await request.post("/v3/analytics/tuition_fees", data);
        this.financeMetrics = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchTurnRate() {
      try {
        interface TurnRateItem {
          acceptance_year: number;
          total: number;
          study: number;
          withdraw: number;
          percent: string;
        }
        const response = await request.post(
          "/analytics/proxy-for-satisfaction"
        );
        //       const updatedData = response.map((item:TurnRateItem) => {
        //   if (item.acceptance_year === 2019) {
        //     return {
        //       ...item,
        //       study: 76,
        //       withdraw:78,
        //       total: 154,
        //     };
        //   }
        //   return item;
        // });
        this.turnRate = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchAdmission(data?: any) {
      try {
        const response = await request.post("/v3/analytics/avg_spent", data);
        this.admission = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchAdditionalExamDate() {
      try {
        const response = await request.post(
          "/analytics/registered-applicants-count-by-exam-date"
        );
        this.examDate = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchApplicantsPerDate() {
      try {
        const response = await request.post(
          "/analytics/registered-applicants-count-per-day"
        );
        this.applicantsCountByDay = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchProgramAvgFee() {
      try {
        const response = await request.post(
          "/analytics/admission-programs-average-fee"
        );
        this.programsAvarageFee = response;
      } catch (error) {
        this.loading = false;
      }
    },
    // v3
    async fetchAvgSpendStudent(data?: any) {
      try {
        this.avgTimeSpendStudent = null;
        const response = await request.post(
          "/v3/analytics/average-spent-time-per-student",
          data
        );
        this.avgTimeSpendStudent = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchAvgSpendTeacher(data?: any) {
      try {
        this.avgTimeSpendTeacher = null;
        const response = await request.post(
          "/v3/analytics/average-spent-time-per-professor",
          data
        );
        this.avgTimeSpendTeacher = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchActiveStudentCount(data?: any) {
      try {
        const response = await request.post(
          "/v3/analytics/active-students-count",
          data
        );
        this.activeStudentCount = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchTeacherPerStudentRadio(data?: any) {
      try {
        const response = await request.post(
          "/v3/analytics/student-per-teacher-ratio",
          data
        );
        this.teacherPerStudentRadio = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchStaffPerStudentRadio(data?: any) {
      try {
        const response = await request.post(
          "/v3/analytics/staff-per-student-ratio",
          data
        );
        this.staffPerStudentRadio = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchPointLeaders(params?: any) {
      try {
        const response = await request.get(
          "https://eduplus.uz/api/leadership/topListAllSchools",
          { params }
        );
        this.pointLeaders = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchFacilityUtilization(data?: any) {
      try {
        this.facilityUtilizations = null;
        const response = await request.post(
          "/v3/analytics/facility-utilization-per-cabinet",
          data
        );
        this.facilityUtilizations = response;
      } catch (error) {
        this.loading = false;
      }
    },
    async fetchStudentStatuses(data?: any) {
      try {
        const response = await request.post(
          "/v3/analytics/academic-status-count",
          data
        );
        this.studentStatuses = response;
        console.log(this.studentStatuses);
      } catch (error) {
        this.loading = false;
      }
    },
  },

  getters: {
    getFilters: (state) => state.filter,
    fromToSemestr: (state) => {
      const store = useAcademicStore();
      return {
        from_semester: parseInt(store.semestrs[0].row_number as any),
        to_semester: parseInt(
          (+store.semestrs[store.semestrs.length - 1].row_number + 3) as any
        ),
      };
    },
    averagefromToSemestrSchool: (state) => {
      return {
        from_semester: 9,
        to_semester: 9,
      };
    },
    fromToSemestrDefault: (state) => {
      const store = useAcademicStore();
      return {
        from_semester: parseInt(store.semestrs[6].row_number as any),
        to_semester: parseInt(
          store.semestrs[store.semestrs.length - 2].row_number as any
        ),
      };
    },
    getDate: (state) => {
      if (state.filter.dates.length > 0) {
        return state.filter.dates;
      } else {
        const date = new Date();
        return [
          new Date(date.getFullYear(), 0, 1),
          new Date(date.getFullYear(), date.getMonth() + 1, 0),
        ];
      }
    },
  },
});
