import { defineStore } from "pinia";

import request from "@/utils/request";
import type {
  IGroupOneStudentList,
  IGroupOneTimeTable,
  IGroupsTimetable,
  IStudentListWithGroups,
  IstudentListWithStudent,
  TGroupAddStudent,
  TGroupsCreate,
  TimetableGroup,
  TimetableListData,
} from "@/models/backend";

interface TimetableGroupType {
  groups: TimetableListData<IGroupsTimetable>;
  timetableGroupList: TimetableListData<TimetableGroup>;
  groupOne: IGroupOneTimeTable;
  tstudentListWithGroups: TimetableListData<IstudentListWithStudent>;
  groupOneStudentList: IGroupOneStudentList;
}
export const useTimeTableGroups = defineStore("timetable-group", {
  state: (): TimetableGroupType => ({
    timetableGroupList: {
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
    groups: {
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
    tstudentListWithGroups: {
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
    groupOne: {
      data: [] as any,
    },
    groupOneStudentList: {
      data: [] as any,
      pagination: {
        total_items: 7,
        total_pages: 1,
        current_page: 1,
        limit: 10,
        offset: 0,
      },
    },
  }),

  actions: {
    async fetchTimetableGroupList(params: any = {}) {
      const response = await request.get("/group/list", { params });
      this.groups = response;
    },
    async fetchTimetableGroupsCreate(data: TGroupsCreate) {
      return request.post("/group/create", data);
    },
    // agar group/list da muomo bo'sa o'zimi group/listga o'tqizaman
    // async group/list(data: any) {
    //   const mazgiroute = new URLSearchParams({
    //     level: data?.level.toString(),
    //     page: data?.page.toString(),
    //     limit: data?.limit.toString(),
    //   }).toString();
    //   const response = await request.get(`/group/list?${mazgiroute}`);
    //   if (response.success) {
    //     this.timetableGroupList = response.data;
    //   }
    // },
    async fetchTGroupAddStudent(data: TGroupAddStudent) {
      await request.post("/group/add-student", data);
    },
    async fetchGroupUpdateId(id: string, data: any) {
      return request.patch(`/group/update/${id}`, data);
    },
    // async fetchGroupGetOneId(id: string) {
    //   const response = await request.get(`/group/get-one/${id}`);
    // },
    async fetchTStudentListWithGroups(data: IStudentListWithGroups) {
      const response = await request.get(
        `/group/student-list-with-groups?${data}`
      );
      this.tstudentListWithGroups = response;
    },
    async removeGroupStudent(data: any) {
      await request.post(`/group/remove-student`, data);
    },
    async fetchgetOneGroup(id: string) {
      const response = await request.get<IGroupOneTimeTable>(
        `/group/get-one/${id}`
      );
      this.groupOne = response;
    },
    async fetchgetOneGroupStudent(group_id: string, params: any) {
      const response = await request.get(
        `/group/group-of-student-list/${group_id}`,
        { params }
      );
      this.groupOneStudentList = response;
    },
    async fetchRemoveGroupOne(data: any) {
      return request.post(`/task/remove-group-from-event`, data);
    },
    async fetchAddGroupToEvent(data: any) {
      return request.post("/task/add-group-to-event", data);
    },
  },

  getters: {
    getTimetableGroupList: (state): any =>
      state.groups.data.map((item) => ({
        value: item.id,
        label: item.name,
        title: item.abbreviation,
      })),
  },
});
