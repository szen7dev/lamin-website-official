import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength) + '...';
}

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export function sanitizeUrl(url: string): string {
  if (!url) return '';

  if (!/^https?:\/\//i.test(url) && !url.startsWith('/')) {
    url = '/' + url;
  }

  return url;
}

export function getMineTypeExcel(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();

  if (extension === 'xlsx') {
    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  } else if (extension === 'xls') {
    return 'application/vnd.ms-excel';
  } else if (extension === 'csv') {
    return 'text/csv';
  } else if (extension === 'xlsm') {
    return 'application/vnd.ms-excel.sheet.macroEnabled.12';
  } else {
    return 'application/octet-stream'; // Default for unknown types
  }
}

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getGenderColor = (gender: number) => {
  switch (gender) {
    case 1:
      return 'bg-blue-100 text-blue-800';
    case 2:
      return 'bg-pink-100 text-pink-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
