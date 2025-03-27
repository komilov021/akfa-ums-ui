import { IFilter } from "./common.model";

export interface ICalendar {
  name: string;
  duration_in_minutes: string;
  id: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  status?: string;
}
export interface ICreateCalendar {
  name: string;
  simester_id: string;
  duration_in_minutes: number;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
}
export interface ICreateClassCalendar {
  teacher_ids: string[];
  assigned_course_id: string;
  lesson_type_id: string | null;
  room_id: string;
  group_ids: string[];
  date: string | null;
  start_time: string;
  end_time: string;
  recurring_days: number[] | any;
  recurring_dates: string[] | null;
  is_recurring: boolean;
}
export interface ICreatePracticeCalendar {
  teacher_ids: string[];
  room_id: string;
  group_ids: string[];
  date: string | undefined;
  start_time: string;
  end_time: string;
  recurring_days: number[] | any;
  recurring_dates: string[] | null;
  is_recurring: boolean;
  description: string | null;
  name: string | null;
}

export interface ICreateHolidayCalendar {
  name: string;
  description?: string | null;
  date: string;
  calendar_id: string;
}
export interface IEventCountHoliday {
  data: {
    class: number;
    event: number;
    practice: number;
    exam: number;
  };
}
export interface ICalendarFilter extends IFilter {
  search?: string | undefined;
  status?: string | undefined;
  simester_id?: string | undefined;
}
export interface IEventFilter extends IFilter {
  calendar_id: string;
  from_date?: string | undefined;
  to_date?: string | undefined;
  type: string;
  teacher_id: string | undefined;
  course_reference_id: string | undefined;
  lesson_type_id?: string | undefined;
}
export interface IEvent {}
export interface ITaskCreateEvent {
  name: string;
  description: string;
  teacher_ids: string[];
  room_id: string;
  group_ids: string[];
  calendar_id: string;
  start_time: string;
  end_time: string;
  date: string;
}

export interface ILessonsByFlowGroupId {
  lesson_id: string;
  lesson_name: string;
  event_date: string;
  task_type: string;
  event_start: string;
  event_end: string;
  semester: string;
}
