export interface IProgramByMonth {
  id: string;
  program: string;
  january: number;
  february: number;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  august: number;
  september: number;
  october: number;
  november: number;
  december: number;
  total: number;
}

export interface IApplicationByStatus {
  total: number;
  pending: number;
  accept: number;
  reject: number;
}
export interface IApplicationByGender {
  total: number;
  female: number;
  male: number;
}
interface IImageBucket {
  id: string;
  name: string;
  size: number;
  type: string;
  created_at: Date;
  bucket_name: string;
}
export interface IAplication {
  id: string;
  phone: string;
  graduation_place: string;
  address: string;
  graduation_id: string;
  first_name: string;
  last_name: string;
  passport_serial: string;
  passport_number: string;
  birth_date: string;
  gender: "male" | "female";
  exam_type: "online" | "offline";
  passport: IImageBucket;
  photo: IImageBucket;
  diploma: IImageBucket;
  certificate?: IImageBucket;
  proficiency_certificate?: string;
  certificate_number?: string;
  take_internal_exam: boolean;
  is_scholarship: boolean;
  is_accept: boolean;
  application_year: string;
  status: string;
  created_at: Date;
  creator: {
    id: string;
    email: string;
  };
  region: {
    id: string;
    name: string;
  };
  program: {
    id: string;
    name: string;
  };
  exam_date: {
    id: string;
    name: string;
  };
  responder?: any;
}

export interface IApplicationFilter {
  limit: number;
  page: number;
}

export interface IApplication {
  phone: string;
  city_id: string;
  graduation_place: string;
  address: string;
  graduation_id: string | null;
  first_name: string;
  last_name: string;
  passport_serial: string;
  passport_number: string;
  birth_date: string;
  gender: string;
  proficiency_certificate: string;
  passport: IImageBucket;
  photo: IImageBucket;
  diploma: IImageBucket;
  certificate: IImageBucket;
  certificate_number: string;
  take_internal_exam: boolean;
  program_id: string;
  exam_date_id: string;
  is_scholarship: boolean;
  is_accept: boolean;
  lang: string;
}
