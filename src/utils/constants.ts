import type { INavigationItem, NavigationType } from "@/models/frontend";
import {
  Admission,
  Students,
  General,
  Academic,
  Calendar,
  Semestr,
  Subjects,
  Courses,
  Ranking,
  Applicant,
  ByPrograms,
  More,
  Key,
  ExamYear,
  Bar,
  Finance,
  Payment,
} from "@/assets/svgs";
import { UserRoles } from "@/models/backend";
import AdmissionIcon from "../assets/images/admission.svg";
import OperationIcon from "../assets/images/operating.svg";
import Strategic from "../assets/svgs/strategicIcon.svg";
import ActiveStrategicIcon from "../assets/svgs/ActiveStrategic.svg";
import ActiveAdmissionIcon from "../assets/svgs/ActiveAdmission.svg";
import ActiveOperationIcon from "../assets/svgs/ActiveOperation.svg";
import ActiveStaff from "../assets/svgs/ActiveStaff.svg";
import teachingStaff from "../assets/svgs/teachingStaff.svg";
export const navigationItems: Record<NavigationType, INavigationItem[]> = {
  dashboard: [
    // {
    //   title: "General dashboard",
    //   route: "/dashboard/general",
    //   icon: General,
    // },
    {
      title: "Strategic metrics",
      route: "/dashboard/strategic",
      icon: Strategic,
      activeIcon: ActiveStrategicIcon,
    },
    // {
    //   title: "Operational metrics",
    //   route: "/dashboard/general",
    // }
    {
      title: "Operational metrics",
      route: "/dashboard/operational",
      icon: OperationIcon,
      activeIcon: ActiveOperationIcon,
    },
    {
      title: "Professors",
      route: "/dashboard/staff",
      icon: teachingStaff,
      activeIcon: ActiveStaff,
    },
    // {
    //   title: "Students",
    //   route: "/dashboard/student",
    //   icon: Students,
    // },
    // {
    //   title: "Admission metrics",
    //   route: "/dashboard/admission",
    //   icon: AdmissionIcon,
    //   activeIcon: ActiveAdmissionIcon,
    // },
  ],
  academic: [
    // {
    //   title: "Dashboard",
    //   route: "/academic/dashboard",
    // },
    {
      title: "Academic management",
      route: "/academic/managment",
    },
    {
      title: "Course enrollment",
      route: "/academic/course-enrollment",
    },
    // {
    //   title: "Groups",
    //   route: "/academic/groups",
    // },
    // {
    //   title: "Scholarship",
    //   route: "/academic/scholarship",
    // },
    // {
    //   title: "Academic",
    //   route: "/academic/academic",
    //   icon: Academic,
    //   childrens: [
    //     {
    //       title: "Academic Year",
    //       route: "/academic/academic/year",
    //       icon: Calendar,
    //     },
    //     {
    //       title: "Semestrs",
    //       route: "/academic/academic/semestrs",
    //       icon: Semestr,
    //     },
    //   ],
    // },
    // {
    //   title: "Subjects",
    //   route: "/academic/subjects",
    //   icon: Subjects,
    // },
    // {
    //   title: "Courses",
    //   route: "/academic/courses",
    //   icon: Courses,
    // },
    // {
    //   title: "Students",
    //   route: "/academic/students",
    //   icon: Students,
    // },
    {
      title: "Ranking",
      route: "/academic/ranking",
      // icon: Ranking,
    },
    {
      title: "PAB",
      route: "/academic/pab",
    },
  ],
  admission: [
    {
      title: "Applicants",
      route: "/admission/applicants",
      icon: Applicant,
      childrens: [
        {
          title: "By students",
          route: "/admission/applicants",
          icon: Students,
        },
        {
          title: "By programs",
          route: "/admission/applicants-programs",
          icon: ByPrograms,
        },
        {
          title: "Kanban",
          route: "/admission/kanban",
          icon: Bar,
        },
      ],
    },
    {
      title: "More",
      route: "/admission/exam-years",
      icon: More,
      childrens: [
        {
          title: "Exam Years",
          route: "/admission/exam-years",
          icon: ExamYear,
        },
        // {
        //   title: "Exam Dates",
        //   route: "/admission/exam-dates",
        //   icon: ExamYear,
        // },
        {
          title: "Admission metrics",
          route: "/admission/metrics",
          icon: AdmissionIcon,
        },
        {
          title: "Additional metrics",
          route: "/admission/additional-metrics",
          icon: Key,
        },
        // {
        //   title: "Programs management",
        //   route: "/admission/departments",
        //   icon: Key,
        // },
      ],
    },
  ],
  finance: [
    // {
    //   title: "Dashboard",
    //   route: "/finance/dashboard",
    // icon: Bar,
    // },
    {
      title: "Status",
      route: "/finance/status",
      // icon: Finance,
    },
    {
      title: "Payment history",
      route: "/finance/history",
      // icon: Payment,
    },
    {
      title: "Scholarship Configuration",
      route: "/finance/scholarship",
    },
    {
      title: "Programs",
      route: "/finance/programs",
    },
  ],
  administrative: [
    {
      title: "Access and users",
      route: "/administrative/access-roles",
      // icon: Bar,
    },
    {
      title: "Permissions",
      route: "/administrative/permissions",
      // icon: Finance,
    },
  ],
  timetable: [
    {
      title: "Timetable",
      route: "/timetable/calendar",
    },
    // {
    //   title: "Faculty",
    //   route: "/timetable/faculty",
    // },
    // {
    //   title: "Classrooms",
    //   route: "/timetable/classrooms",
    // },
    // {
    //   title: "Courses",
    //   route: "/timetable/courses",
    // },
    {
      title: "Groups",
      route: "/timetable/groups",
    },
    // {
    //   title: "Reports",
    //   route: "/timetable/reports",
    // },
  ],
  "ai-modules": [
    {
      title: "Contents",
      route: "/ai-modules/contents",
    },
  ],
  default: [],
};

export const breadCrumbNames = {
  dashboard: "app.dashboard",
  subjects: "app.subjects",
  grades: "app.grades",
  courses: "app.courses",
  "course-students": "app.course-students",
  "course-functions": "app.course-functions",
  "course-grades": "app.course-grades",
  "student-courses": "app.studentCourses",
  "student-transcript": "app.student-transcript",
  "student-course-details": "app.student-course-details",
  year: "app.year",
  semestrs: "app.semestrs",
  students: "app.students",
  student: "app.student",
  company: "app.company",
  ranking: "app.ranking",
  "ranking-detail": "app.ranking-detail",
  clients: "app.clientsList",
  finance: "app.finance",
  employees: "app.employees",
  "new-employee": "app.new-employee",
  "edit-employee": "app.edit-employee",
  "schedule-employee": "app.schedule-employee",
  "new-client": "app.new-client",
  "new-order": "app.addNewOrder",
  orders: "app.orders",
  applications: "app.applications",
  units: "app.businessUnits",
  tools: "app.managementTools",
  goals: "app.goals",
  templates: "app.templates",
  warehouse: "app.warehouse",
  "new-warehouse": "app.new-warehouse",
  "edit-warehouse": "app.edit-warehouse",
};

export const userRoles: Record<UserRoles, string> = {
  [UserRoles.super_admin]: "Superadmin",
  [UserRoles.admin]: "Admin",
  [UserRoles.academic_director]: "Academic director",
  [UserRoles.academic_manager]: "Academic manager",
  [UserRoles.head_admission]: "Head of admission",
  [UserRoles.admission_specialist]: "Admission specialist",
  [UserRoles.finance_manager]: "Finance manager",
  [UserRoles.teacher]: "Dean",
};

export const gpaGrades = [
  {
    grade: "A+",
    proportion: 5,
    gpa: 4.3,
  },
  {
    grade: "A0",
    proportion: 10,
    gpa: 4,
  },
  {
    grade: "A-",
    proportion: 5,
    gpa: 3.7,
  },
  {
    grade: "B+",
    proportion: 10,
    gpa: 3.3,
  },
  {
    grade: "B0",
    proportion: 10,
    gpa: 3,
  },
  {
    grade: "B-",
    proportion: 10,
    gpa: 2.7,
  },
  {
    grade: "C+",
    proportion: 10,
    gpa: 2.3,
  },
  {
    grade: "C0",
    proportion: 20,
    gpa: 2,
  },
  {
    grade: "C-",
    proportion: 10,
    gpa: 1.7,
  },
  {
    grade: "D+",
    proportion: 2,
    gpa: 1.3,
  },
  {
    grade: "D0",
    proportion: 5,
    gpa: 1,
  },
  {
    grade: "D-",
    proportion: 3,
    gpa: 0.7,
  },
  {
    grade: "F",
    proportion: 10,
    gpa: 0,
  },
];

export const options = [
  {
    value: "2020-2021",
    label: "2020-2021",
  },
  {
    value: "2021-2022",
    label: "2021-2022",
  },
  {
    value: "2022-2023",
    label: "2022-2023",
  },
  {
    value: "2024-2025",
    label: "2024-2025",
  },
  {
    value: "2025-2026",
    label: "2025-2026",
  },
  {
    value: "2026-2027",
    label: "2026-2027",
  },
  {
    value: "2027-2028",
    label: "2027-2028",
  },
  {
    value: "2028-2029",
    label: "2028-2029",
  },
  {
    value: "2029-2030",
    label: "2029-2030",
  },
];

export const mockCHartData = [
  {
    department: "PR & Marketing",
    count: 2,
    value1: 354,
    value2: 707.51,
  },
  {
    department: "Laboratory in DS",
    count: 2,
    value1: 176,
    value2: 352,
  },
  {
    department: "Law Department",
    count: 1,
    value1: 354,
    value2: 353.75,
  },
  {
    department: "HR Department",
    count: 1,
    value1: 330,
    value2: 330.17,
  },
  {
    department: "Career Center",
    count: 3,
    value1: 235,
    value2: 706.0,
  },
  {
    department: "Service Department",
    count: 1,
    value1: 235,
    value2: 235,
  },
  {
    department: "Accounting and Finance department",
    count: 1,
    value1: 235,
    value2: 235,
  },
  {
    department: "Eduplus",
    count: 9,
    value1: 389,
    value2: 3498.23,
  },
  {
    department: "Davo",
    count: 8,
    value1: 316,
    value2: 2529.87,
  },
  {
    department: "Edvent",
    count: 9,
    value1: 363,
    value2: 3270.0,
  },
  {
    department: "Bloomberg Lab",
    count: 6,
    value1: 262,
    value2: 1572.26,
  },
  {
    department: "Export Lab",
    count: 14,
    value1: 0,
    value2: 0.0,
  },
  {
    department: "Promad",
    count: 1,
    value1: 300,
    value2: 300.0,
  },
  {
    department: "CAU MEDIA STUDIO",
    count: 2,
    value1: 236,
    value2: 472.0,
  },
  {
    department: "Diagnostics",
    count: 11,
    value1: 275,
    value2: 3025.0,
  },
  {
    department: "Leaders Project",
    count: 6,
    value1: 236,
    value2: 1416.0,
  },
  {
    department: "Nursing School Development",
    count: 2,
    value1: 235,
    value2: 470.0,
  },
  {
    department: "Pre-Foundation Course",
    count: 3,
    value1: 290,
    value2: 870.0,
  },
  {
    department: "Secondary School Development",
    count: 2,
    value1: 235,
    value2: 470.0,
  },
  {
    department: "Grameen Bank",
    count: 2,
    value1: 235,
    value2: 470.0,
  },
  {
    department: "Academic Affairs",
    count: 2,
    value1: 313,
    value2: 625.0,
  },
  {
    department: "HMT",
    count: 1,
    value1: 235,
    value2: 235.0,
  },
];

export const TIME_FORMAT = "yyyy-MM-dd HH:mm";

export const ALLOWED_EMAILS = [
  "izzatulloadmin@gmail.com",
  "cau@admin.uz",
  "a.bashirov@gmail.com",
];

export const TEST_ENVIRONMENT = "https://test-admin.eduplus.uz";

export const AI_BASE_URL = "https://chat.eduplus.uz/api";

export const originUrl = window.location.origin.includes("localhost")
  ? TEST_ENVIRONMENT
  : window.location.origin;
