import { useWatch } from 'react-hook-form';
import { useMemo } from 'react';

import { AREA_LEVELS } from '../types/areaTypes';

import { useGetAreaList } from './useGetAreaList';

export function useAreaSelector(form: any, provinces: any[]) {
  const provinceValue = useWatch({ control: form.control, name: 'province' });
  const districtValue = useWatch({ control: form.control, name: 'district' });

  const { areas, isLoading: isLoadingAreas } = useGetAreaList(
    provinceValue
      ? { keyword: provinces.find(p => p._id === provinceValue)?.name }
      : {},
  );

  const provinceData = useMemo(() => {
    return areas.find(area => area.level === AREA_LEVELS.PROVINCE);
  }, [areas]);

  const districts = useMemo(() => {
    if (!provinceData) return [];

    return Array.isArray(provinceData.childs) ? provinceData.childs : [];
  }, [provinceData]);

  const selectedDistrict = useMemo(() => {
    return districts.find((d: any) => d._id === districtValue) || null;
  }, [districts, districtValue]);

  const wards = useMemo(() => {
    if (!selectedDistrict) return [];

    return Array.isArray(selectedDistrict.childs)
      ? selectedDistrict.childs
      : [];
  }, [selectedDistrict]);

  return {
    provinceValue,
    districtValue,
    selectedDistrict,
    districts,
    wards,
    isLoadingAreas,
  };
}
