'use client';

import React, { useState } from 'react';

import { Input } from '@/components/ui/input';
import { SearchIcon } from '@/components/icons';

interface PageHeaderProps {
  title: string;
  placeholder: string;
  onSearch: (keyword: string) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  placeholder,
  onSearch,
}) => {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    onSearch(keyword);
  };

  return (
    <div className="flex justify-between items-center gap-2 px-4">
      <div className="text-heading-sm font-semibold text-primary">{title}</div>
      <div className="text-white relative">
        <Input
          className="rounded-full pr-12 border-grayscale-20 min-w-[500px] h-12 text-black"
          placeholder={placeholder}
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <button
          aria-label="Search"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-2 bg-primary rounded-full cursor-pointer"
          type="button"
          onClick={handleSearch}>
          <SearchIcon size={20} />
        </button>
      </div>
    </div>
  );
};
