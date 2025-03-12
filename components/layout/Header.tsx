"use client";
import Link from "next/link";
import { useSearch } from "@/contexts/SearchContext";
import { usePathname } from 'next/navigation';

export default function Header() {
  const { searchQuery, setSearchQuery, clearSearch } = useSearch();
  const pathname = usePathname();
  const showSearch = pathname.startsWith('/products'); // Sadece ürünler sayfasında arama göster

  return (
    <header className="w-full bg-background border-b border-border border-dashed">
      <div className="p-4 container mx-auto bg-background border-r border-l border-border border-dashed">
        <div className="flex justify-between items-center gap-4">
          <Link href="/">
            <h1 className="text-2xl font-bold text-text">Ozcan Gida</h1>
          </Link>
          
          {showSearch && (
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ürün ara..."
                  className="w-full h-10 rounded-md border border-border bg-transparent px-3 py-1 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-10 top-1/2 -translate-y-1/2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          
        </div>
      </div>
    </header>
  );
}