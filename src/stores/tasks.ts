import {
  IBoardData,
  ICreateDynamicField,
  ICreateTask,
  IDeleteDynamicField,
  ITask,
  IUpdateDynamicField,
} from "@/models/backend";
import request from "@/utils/request";
import { defineStore } from "pinia";

export const useTasksStore = defineStore("tasks", {
  state: () => ({
    task: {} as ITask | any,
    tasks: [] as ITask[],
    boardData: null as IBoardData | null,
    dynamicFields: [] as any,
  }),
  actions: {
    async getTasks(column_id: string) {
      const tasks = await request.get<ITask[]>(`tasks/list/${column_id}`);
      this.tasks = tasks;
    },

    async getOneTask(id: string) {
      const task = await request.get<ITask>(`tasks/${id}`);
      this.task = task;
    },

    async getOneApplicationSubject(id: string) {
      const task = await request.get<any>(`tasks/application-get-one/${id}`);
      this.task = task;
    },

    async getColumnsWithTasks(kanban_id: string) {
      const columns_with_tasks = await request.get<IBoardData>(
        `tasks/columns-with-tasks-list/${kanban_id}`
      );
      this.boardData = columns_with_tasks;
    },

    async createTask(task: ICreateTask) {
      return await request.post<ICreateTask>("tasks/create", task);
    },

    async changeTask(id: string, task: Partial<ICreateTask>) {
      return await request.patch<ITask>(`tasks/${id}`, task);
    },

    async updateSubjectProof(id: string, application: any) {
      return await request.post(
        `subjects/proof-certificate/${id}`,
        application
      );
    },

    async changeApplicationTask(id: string, application: any) {
      return await request.post(
        `subjects/update-subject-for-admin/${id}`,
        application
      );
    },

    async rejectCertificateSubject(id: string, application: any) {
      return await request.post(
        `subjects/reject-certificate-for-admin/${id}`,
        application
      );
    },

    async changeApplicationSubject(id: string, task: Partial<ICreateTask>) {
      return await request.post<ITask>(
        `tasks/application_subjects/${id}`,
        task
      );
    },

    async updateGlobal(application: any) {
      return await request.post("tasks/global-update", application);
    },

    async checkTuitionFee() {
      await request.get("tasks/check-tuition-fee-payment");
    },

    async globalApplicationUpdate(application: any) {
      return await request.post("tasks/global-application-update", application);
    },

    async deleteTask(id: string) {
      return await request.delete<void>(`tasks/${id}`);
    },

    async getAllDynamicFields(kanban_id: string) {
      const fields = await request.get(`tasks/get-dynamic-fields/${kanban_id}`);
      this.dynamicFields = Object.keys(fields);
    },
    async createNewDynamicField(
      kanban_id: string,
      newDynamicField: ICreateDynamicField
    ) {
      return await request.post(
        `tasks/add-dynamic-field/${kanban_id}`,
        newDynamicField
      );
    },
    async updateDynamicField(
      kanban_id: string,
      updateDynamicField: IUpdateDynamicField
    ) {
      return await request.post(
        `tasks/update-dynamic-fields/${kanban_id}`,
        updateDynamicField
      );
    },
    async deleteDynamicField(
      kanban_id: string,
      deleteDynamicField: IDeleteDynamicField
    ) {
      return await request.post(
        `tasks/delete-dynamic-field/${kanban_id}`,
        deleteDynamicField
      );
    },
  },
});
