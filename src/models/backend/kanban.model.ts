export interface IKanban {
  id: string;
  name: string;
  kanban_type: string;
}
export interface IUpdateKanban {
  section_id: string;
  name: string;
}

export interface ISection {
  section_id: string;
  section: string;
  kanbans: IKanban[];
}

export interface IApiResponse {
  data: ISection[];
}

export interface Kanban {
  section_id: string;
  section: string;
  kanbans: { id: string; name: string; kanban_type: string }[];
}

export interface ICreateKanban {
  section_id: string;
  name: string;
}

export interface IColumn {
  id: string;
  kanban_id: string;
  name: string;
  order_index: number;
}

export interface ICreateColumn {
  kanban_id: string;
  name: string;
  order_index: number;
}

export interface ICreateSection {
  id?: string;
  name: string;
  description: string;
}

export interface ITask {
  id: string;
  column_id: string;
  title: string;
  description: string;
  dynamic_fields: Record<string, string>;
  order_index: number;
  name?: string;
  surname?: string;
  date_of_birth?: string | null;
  email?: string;
  passport_id?: string;
  pnfl?: string;
  first_phone_number?: string;
  second_phone_number?: string;
  certificate?: object;
  country?: string;
  region?: string;
  city_or_town?: string;
  street?: string;
  house?: string;
  address?: string;
  mothers_full_name?: string;
  fathers_full_name?: string;
  passport_f: object;
  passport_b: object;
  diploma: object;
  extra_document: object;
  proof: object;
}

export interface ICreateTask {
  column_id: string;
  title: string;
  description: string;
  dynamic_fields: Record<string, string>;
  order_index: number;
  name?: string;
  surname?: string;
  date_of_birth?: string | null;
  email?: string;
  passport_id?: string;
  pnfl?: string;
  first_phone_number?: string;
  certificate?: object;
  second_phone_number?: string;
  country?: string;
  region?: string;
  city_or_town?: string;
  street?: string;
  house?: string;
  address?: string;
  mothers_full_name?: string;
  fathers_full_name?: string;
}

export interface IColumnWithTasks {
  column_id: string;
  column: string;
  tasks: ITask[];
}

export interface IBoardData {
  data: IColumnWithTasks[];
}

export interface ICreateDynamicField {
  newKey: string;
}

export interface IUpdateDynamicField {
  oldKey: string;
  newKey: string;
}

export interface IDeleteDynamicField {
  key: string;
}
