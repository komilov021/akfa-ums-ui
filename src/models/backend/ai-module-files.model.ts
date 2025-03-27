export enum FileUploadJobStatus {
  completed = "completed",
  failed = "failed",
  progress = "progress",
}

export interface IElectiveModulesListFilter {
  page: number;
  limit: number;
  semester: string;
}
