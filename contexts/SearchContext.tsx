"use client";
import { createContext, useContext, useState, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchContextType {
  searchQuery: string;
  debouncedQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300); // 300ms debounce

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <SearchContext.Provider value={{ 
      searchQuery, 
      debouncedQuery,
      setSearchQuery,
      clearSearch 
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
} 