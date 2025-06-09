'use client';

import { useMutation } from '@tanstack/react-query';

import { postImportHabitTrack } from '../api/postImportHabitTrack';

export function usePostImportHabitTrack() {
  return useMutation({
    mutationFn: postImportHabitTrack,
  });
}
