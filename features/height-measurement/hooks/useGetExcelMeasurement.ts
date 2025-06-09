'use client';

import { useMutation } from '@tanstack/react-query';

import { getExcelMeasurement } from '../api/getExcelMeasurement';

export function useGetExcelMeasurement() {
  return useMutation({
    mutationKey: ['GET_EXCEL_MEASUREMENT'],
    mutationFn: getExcelMeasurement,
  });
}
