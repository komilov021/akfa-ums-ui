import type { IFile } from "./common.model";

export interface IRequest {
  id: string;
  sender_json: any;
  recipient_json: any;
  old_value: any;
  new_value: any;
  status: number;
  created_at: Date;
  is_read: false;
  explanation: string;
  updated_at?: Date;
  files: IFile;
  type: string;
}
