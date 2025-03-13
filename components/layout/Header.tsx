"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSearch } from "@/contexts/SearchContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ProfileEditor from "../profile/ProfileEditor";

export default function Header() {
  const { searchQuery, setSearchQuery, clearSearch } = useSearch();
  const pathname = usePathname();
  const showSearch = pathname.startsWith("/products");

  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Mobil arama açıldığında otomatik odaklanma için ref kullanımı
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showMobileSearch && mobileSearchRef.current) {
      mobileSearchRef.current.focus();
    }
  }, [showMobileSearch]);

  return (
    <header className="w-full bg-background border-b border-border border-dashed">
      <div className="container mx-auto bg-background border-r border-l border-border border-dashed">
        <div className="p-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="shrink-0">
              <h1 className="text-xl md:text-2xl font-bold text-text">Ozcan Gida</h1>
            </Link>

            {/* Search Bar - Desktop */}
            {showSearch && (
              <div className="hidden md:block flex-1 max-w-xl mx-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ürün ara..."
                    className="w-full h-10 rounded-md border border-border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    autoComplete="off"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        clearSearch();
                      }}
                      className="absolute right-10 top-1/2 -translate-y-1/2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-text-secondary"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-text-secondary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 shrink-0">
              {showSearch && (
                <button
                  onClick={() => setShowMobileSearch(!showMobileSearch)}
                  className="md:hidden p-2 hover:bg-accent/10 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-text"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              )}

              {user ? (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowProfileEditor(true)}
                    className="flex items-center gap-2"
                  >
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-border"
                    />
                    <span className="hidden md:inline text-text">{user.name}</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="text-text-secondary hover:text-text px-3 py-1.5 text-sm rounded-md hover:bg-accent/10 transition-colors"
                  >
                    Çıkış
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login"
                  className="text-text-secondary hover:text-text px-3 py-1.5 text-sm rounded-md hover:bg-accent/10 transition-colors"
                >
                  Giriş Yap
                </Link>
              )}
            </div>
          </div>

          {/* Search Bar - Mobile */}
          {showSearch && showMobileSearch && (
            <div className="md:hidden w-full mt-4">
              <div className="relative">
                <input
                  ref={mobileSearchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ürün ara..."
                  className="w-full h-10 rounded-md border border-border bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      clearSearch();
                    }}
                    className="absolute right-10 top-1/2 -translate-y-1/2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-text-secondary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-text-secondary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showProfileEditor && (
        <ProfileEditor onClose={() => setShowProfileEditor(false)} />
      )}
    </header>
  );
}
