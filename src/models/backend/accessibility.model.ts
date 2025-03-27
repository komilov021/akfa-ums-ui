export interface IRole {
  id: string;
  name: string;
  code: string;
  permissions: string[];
}

export interface IPermission {
  id: string;
  name: {
    en: string;
  };
  code: string;
  active: boolean;
}
