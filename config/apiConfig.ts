// API mode configuration
type ApiMode = 'mock' | 'real';

// This can be controlled via environment variable
export const API_MODE: ApiMode =
  (process.env.NEXT_PUBLIC_API_MODE as ApiMode) || 'mock';

// Helper to check if we're using mock API
export const isMockApi = () => {
  const mode = API_MODE === 'real';

  console.log(`🔧 API Mode: ${mode ? 'MOCK' : 'REAL'}`);

  return mode;
};
