"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center mx-auto min-h-screen w-full max-w-7xl px-4">
      <div className="w-full flex flex-col gap-4 justify-center items-center py-8">
        <div className="flex flex-col justify-center items-center gap-2 mt-2">
          <h1 className="text-4xl font-bold text-text">To Do List</h1>
          <p className="text-textSecondary mt-1 text-center">
            Yapilacaklarinizi burada ekleyebilir ve duzenleyebilirsiniz.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => router.push("/login")}
              className="text-sm px-4 py-2 bg-primary text-background rounded-lg"
            >
              Giriş Yap
            </button>
            <div>Dahasini Ogren {"->"}</div>
          </div>
          <div className="flex flex-col items-center gap-4 mt-2">
            <h1 className="">
              Denemek icin asagidaki bilgileri kullanabilirsiniz.
            </h1>
            <div className="flex flex-row gap-4">
              <span className="text-sm">Email: demo@gmail.com</span>
              <span className="text-sm">Sifre: demo123</span>
            </div>
          </div>
        </div>
        <div className="w-full mt-4 p-2 sm:p-4 border border-border rounded-lg overflow-hidden">
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[600px]">
            <Image
              src="/landing.png"
              alt="To do list"
              fill
              priority
              className="rounded-lg object-contain"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}