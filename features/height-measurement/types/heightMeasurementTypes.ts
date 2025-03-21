// Types cho tính năng đo cao
export interface HeightMeasurementFormData {
  name: string;
  birthDate: Date;
  weight: string | number;
  height: string | number;
  phone: string;
  gender: number;
  note?: string;
  optionSeller?: number;
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
  error: boolean;
  data: {
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
  };
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
    hdfs: any;
    whoHS: any;
    wdfs: any;
    whoWS: any;
  };
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
