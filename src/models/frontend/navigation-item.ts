export interface INavigationItem {
  route: string;
  title: string;
  icon?: any;
  activeIcon?: any;
  description?: string;
  shortName?: string;
  childrens?: INavigationItem[];
}

export interface ISidebarItem {
  route: string;
  title: string;
  icon?: any;
  children?: ISidebarItem[];
}
export interface ICardItem {
  route: string;
  title: string;
  icon?: any;
  description?: string;
  size?: string;
}

export type NavigationType =
  | "dashboard"
  | "academic"
  | "admission"
  | "finance"
  | "administrative"
  | "timetable"
  | "ai-modules"
  | "default";
