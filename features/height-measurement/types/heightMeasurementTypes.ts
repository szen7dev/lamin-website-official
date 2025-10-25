// Types cho tính năng đo cao
export interface HeightMeasurementFormData {
  name: string;
  birthDate: string | Date;
  weight: string | number;
  height: string | number;
  phone?: string;
  gender: number | string;
  note?: string;
  optionSeller?: number;
  contactID?: string;
  parentName?: string;
  email?: string;
  fatherHeight?: string | number;
  motherHeight?: string | number;
  date?: Date | string;
  desiredHeight?: string | number;
  routine?: string;
  boneAge?: string | number;
  pubertyOnsetDate?: string | Date;
}

export interface HeightMeasurementResultData {
  status: number;
  type: number;
  gender: number;
  height: number;
  weight: number;
  images: any[];
  state: number;
  _id: string;
  company: string;
  userCreate: string;
  birthday: string;
  name: string;
  phone: string;
  namecv: string;
  modifyAt: string;
  createAt: string;
  __v: number;
}

// export interface HeightMeasurementService {
//   submitHeightMeasurement(
//     data: HeightMeasurementFormData,
//   ): Promise<HeightMeasurementResult>;
//   getHeightMeasurementById(id: string): Promise<HeightMeasurementResult>;
//   getHeightMeasurementsByContact(
//     contactID: string,
//   ): Promise<HeightMeasurementResult[]>;
// }

// API Response Types
export interface GrowTrackApiResponse {
  _id: string;
  type: number;
  status: number;
  fatherHeight: number;
  motherHeight: number;
  gender: number;
  height: number;
  percentile: number;
  predictedAdultHeight: number;
  desiredHeight: number;
  weight: number;
  images: any[];
  state: number;
  company: string;
  userCreate: string;
  phone: string;
  birthday: string;
  date: Date;
  note: string;
  email: string;
  routine: string;
  parentName: string;
  namecv: string;
  modifyAt: string;
  createAt: string;
  __v: number;
  name?: string;
  userUpdate?: string;
}

export interface GrowTrackInformation {
  growTrack: {
    ageHeightNow: Array<{ age: number; height: number }>;
    ageHeightP3: Array<{ age: number; height: number }>;
    ageHeightP5: Array<{ age: number; height: number }>;
    ageHeightP10: Array<{ age: number; height: number }>;
    ageHeightP25: Array<{ age: number; height: number }>;
    ageHeightP50: Array<{ age: number; height: number }>;
    ageHeightP75: Array<{ age: number; height: number }>;
    ageHeightP90: Array<{ age: number; height: number }>;
    ageHeightP95: Array<{ age: number; height: number }>;
    ageHeightP97: Array<{ age: number; height: number }>;
  };
  ageInMonths: number;
  Z: number;
  P: number;
  hdfs: number;
  whoHS: number;
  noticeH: string;
  wdfs: number;
  whoWS: number;
  noticeW: string;
  predictedAdultHeight: number;
}

export interface GrowTrackListApiResponse {
  error: boolean;
  data: {
    listRecords: Array<{
      _id: string;
      status: number;
      gender: number;
      height: number;
      weight: number;
      files: any[];
      state: number;
      company: string;
      userCreate: string;
      phone: string;
      birthday: string;
      note: string;
      namecv: string;
      modifyAt: string;
      createAt: string;
      __v: number;
      name?: string;
      userUpdate?: string;
    }>;
    limit: number;
    totalRecord: number;
    totalPage: number;
    nextCursor: null | string;
  };
  status: number;
}

export interface HeightHistoryParams {
  limit?: number;
  phone?: string;
  contactID?: string;
  keyword?: string;
}

export interface HeightHistory {
  _id: string;
  status: number;
  type: number;
  fatherHeight: number;
  motherHeight: number;
  gender: number;
  height: number;
  percentile: number;
  predictedAdultHeight: number;
  desiredHeight: number;
  weight: number;
  boneAge: string;
  pubertyOnsetDate: string;
  images: string[];
  state: number;
  company: string;
  userCreate: string;
  birthday: string;
  date: string;
  name: string;
  phone: string;
  email: string;
  routine: string;
  note: string;
  parentName: string;
  namecv: string;
  modifyAt: string;
  createAt: string;
  __v: number;
}
