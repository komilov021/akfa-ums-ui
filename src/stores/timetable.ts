import {
  ListData,
  IEvent,
  ICalendar,
  ICalendarFilter,
  IEventFilter,
  ICreateCalendar,
  TimetableListData,
  ICreateHolidayCalendar,
  ICreateClassCalendar,
  ICreatePracticeCalendar,
  ITaskCreateEvent,
  IEventCountHoliday,
  ILessonsByFlowGroupId,
} from "@/models/backend";
import axios from "axios";
import request from "@/utils/request";
import { defineStore } from "pinia";
import { AI_BASE_URL } from "@/utils/constants";

interface CalendarState {
  calendar: TimetableListData<ICalendar>;
  events: {
    success: boolean;
    data: {
      allDay: boolean;
      display: "block" | "background";
      end: string;
      event_date: string;
      event_id: string;
      others: any;
      resourceId: string | null;
      start: string;
      task_id: string;
      title: string;
    }[];
    timestamp: string;
    error: any;
    pagination: null;
  };
  eventsOne: any;
  calendarGetOne: any;
  eventStudentList: {
    success: boolean;
    data: [
      {
        total: number;
        uid: string;
        id: string;
        full_name: string;
        email: string;
        type: string;
        study_year: string;
        group_info: {
          id: string;
          name: string;
          short_name: string;
        };
        program_info: {
          id: string;
          name: string;
        };
      }
    ];
    timestamp: string;
    error: null;
    pagination: {
      total_items: number;
      total_pages: number;
      current_page: number;
      limit: number;
      offset: number;
    };
  };
  errorTaskCreatePractice: any;
  holidayEventCount: {
    class: number;
    event: number;
    practice: number;
    exam: number;
  };
  lessonsByFlowGroupId: ILessonsByFlowGroupId[];
  lessonSubModules: any;
  lessonSubModule: any;
}

export const useTimetableStore = defineStore("timetable", {
  state: (): CalendarState => ({
    calendar: {
      success: true,
      data: [],
      timestamp: "",
      error: null,
      pagination: {
        total_items: 2,
        total_pages: 1,
        current_page: 1,
        limit: 10,
        offset: 0,
      },
    },
    events: {
      success: false,
      data: [],
      timestamp: "",
      error: "",
      pagination: null,
    },
    eventsOne: [],
    calendarGetOne: [],
    eventStudentList: {
      success: true,
      data: [
        {
          total: 0,
          uid: "",
          id: "",
          full_name: "",
          email: "",
          type: "",
          study_year: "",
          group_info: {
            id: "",
            name: "",
            short_name: "",
          },
          program_info: {
            id: "",
            name: "",
          },
        },
      ],
      timestamp: "",
      error: null,
      pagination: {
        total_items: 2,
        total_pages: 1,
        current_page: 1,
        limit: 10,
        offset: 0,
      },
    },
    errorTaskCreatePractice: {
      success: false,
      data: null,
      timestamp: "",
      error: {
        statusCode: 409,
        message: "",
        error: "",
      },
      pagination: null,
    },
    holidayEventCount: {
      class: 0,
      event: 0,
      practice: 0,
      exam: 0,
    },
    lessonsByFlowGroupId: [],
    lessonSubModules: [],
    lessonSubModule: null,
  }),
  actions: {
    async fetchCalendar(params: any) {
      const response = await request.get<TimetableListData<ICalendar>>(
        "/calendar/list",
        { params }
      );
      this.calendar = response;
    },
    async fetchCalendarEvents(
      params: IEventFilter,
      data: { room_ids: string[] }
    ) {
      const response = await request.post(
        "/calendar/list-for-calendar-v3",
        data,
        {
          params,
        }
      );
      this.events = response;
    },
    async createCalendar(data: ICreateCalendar) {
      return request.post("/calendar/create", data);
    },
    async updateCalendar(id: string, data: ICalendar) {
      return request.patch(`/calendar/update/${id}`, data);
    },
    async deleteCalendar(id: string) {
      return request.delete(`/calendar/delete/${id}`);
    },
    async getDetailCalendar(id: string) {
      const response = await request.get(`/calendar/getOne/${id}`);
      this.calendarGetOne = response;
    },
    async fetchCalendarEventId(event_id: string) {
      const response = await request.get(`/task/get-one/${event_id}`);
      this.eventsOne = response;
    },
    async createClassCalendar(data: ICreateClassCalendar) {
      return request.post("/task/create-class", data);
    },
    async createPracticeCalendar(data: ICreatePracticeCalendar) {
      return request.post("/task/create-practice", data);
    },
    async createHolidayCalendar(data: ICreateHolidayCalendar) {
      return request.post("/task/create-holiday", data);
    },
    async fetchTaskEventStudentList(task_id: string, filter: any) {
      const urlParams = new URLSearchParams({
        ...filter,
      });
      const res = await request.get(
        `/task/event-of-student-list/${task_id}?${urlParams}`
      );
      this.eventStudentList = res;
    },
    async fetchCreateTaskEvent(data: ITaskCreateEvent) {
      return request.post("/task/create-event", data);
    },
    async fetchCreateTaskexam(data: ITaskCreateEvent) {
      return request.post("/task/create-exam", data);
    },
    async fetchTaskCreatePractice(data: ITaskCreateEvent) {
      request.post("/task/create-practice", data);
    },
    async fetchHolidayEventCount(params: any) {
      const response = await request.get<IEventCountHoliday>(
        "/task/get-date-all-event-counts",
        {
          params,
        }
      );
      this.holidayEventCount = response.data;
    },
    async fetchStudentDonwloadEnrollCourse(data: any) {
      return request.post(
        "/export-reports/student-not-enrol-course-list",
        data,
        { responseType: "blob" } as any
      ) as any;
    },
    async deleteCalendarEvent(event_id: string) {
      return request.delete(`/task/${event_id}`);
    },
    async editCalendarTask(event_id: string, data: any) {
      return request.patch(`/task/update/${event_id}`, data);
    },
    async updateIntroVideoOfEvent(event_id: string, data: any) {
      return request.patch(`/task/update-ai-event/${event_id}`, data);
    },
    async fetchLessonsByFlowGroupId(flow_group_id: string) {
      const response = await request.get(`/task/lessons/${flow_group_id}`);

      this.lessonsByFlowGroupId = response;
    },
    async createLessonSubModule(data: any) {
      return request.post("/lesson-sub-modules/create", data);
    },
    async fetchLessonSubModules(lesson_id: string) {
      const response = await request.get(
        `/lesson-sub-modules/find-sub-modules/${lesson_id}`
      );

      this.lessonSubModules = response;
    },

    async fetchLessonSubModule(sub_module_id: string) {
      const response = await request.get(
        `/lesson-sub-modules/find/${sub_module_id}`
      );

      this.lessonSubModule = response;
    },

    async updateSubModule(sub_module_id: string, data: any) {
      return request.patch(`/lesson-sub-modules/update/${sub_module_id}`, data);
    },

    deleteLessonSubModule(id: string) {
      return request.delete(`/lesson-sub-modules/delete/${id}`);
    },

    async createNote(lesson_id: string, script: string): Promise<string> {
      try {
        const response = await axios.post(AI_BASE_URL + "/v1/notes", {
          lesson_id,
          script,
        });
        return response.data?.content ?? "";
      } catch (error) {
        return "";
      }
    },
  },
});
