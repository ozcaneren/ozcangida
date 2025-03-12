"use client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="flex flex-col justify-between min-h-screen h-full w-full bg-background text-text">
        <Header />
        <main className="h-full flex-1 flex border-l border-r border-dashed border-border container mx-auto">
          {children}
        </main>
        <Footer />
      </div>
    </Providers>
  );
} 