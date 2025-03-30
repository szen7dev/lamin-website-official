/**
 * Area levels constants
 */
export enum AREA_LEVELS {
  PROVINCE = 1,
  DISTRICT = 2,
  WARD = 3,
}

/**
 * Base area interface representing a geographical area
 */
export interface Area {
  childs: AreaChild[];
  _id: string;
  name: string;
  level: number;
  parent: Area | null;
  sign?: string;
}

export interface AreaChild {
  _id: string;
  name: string;
  level: number;
  parent: AreaParent;
  sign: string;
  childs: AreaChild[];
}

/**
 * Parent area information
 */
export interface AreaParent {
  _id: string;
  level: number;
  name: string;
  sign: string;
  parent?: AreaParent;
}

/**
 * Parameters for getting area list
 */
export interface GetAreaListParams {
  keyword?: string;
}

/**
 * Response from getAreaList API
 */
export interface AreaResponse {
  error: boolean;
  data: Area[];
  status: number;
}
