"use client";
import { AuthProvider } from "@/contexts/AuthContext";
import { SearchProvider } from "@/contexts/SearchContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SearchProvider>
        {children}
      </SearchProvider>
    </AuthProvider>
  );
} 