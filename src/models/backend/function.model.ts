export interface IFunction {
  id: string;
  title: string;
  weight: number;
}
export interface IcreateFunction {
  title: string;
  weight: number;
  course_id: string;
}
export interface IeditFunction extends IcreateFunction {
  id: string;
}
export interface IfunctionGetOne extends IeditFunction {
  created_at: string;
}
