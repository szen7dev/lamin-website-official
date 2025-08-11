type ApiMode = 'mock' | 'real';

export const API_MODE: ApiMode =
  (process.env.NEXT_PUBLIC_API_MODE as ApiMode) || 'mock';

export const isMockApi = () => {
  const mode = API_MODE === 'mock';

  return mode;
};
