export interface TrustedStore {
  _id: number;
  name: string;
  rating: number;
  numberOfRating: number;
}

export interface GetTrustedStoreParams {
  optionSeller?: number;
  select?: string;
}
