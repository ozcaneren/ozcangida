"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        router.push("/products");
      } else {
        setError(data.error || "Giriş başarısız");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Bir hata oluştu");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/products");
    }
  }, [router]);

  return (
    <div className="flex-1 flex justify-center items-center container mx-auto px-4 md:px-0">
      <div className="max-w-md w-full p-8 bg-background border border-border rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-left text-2xl font-extrabold text-text">
            Giriş Yap
          </h2>
          <p className="mt-2 text-left text-sm text-textSecondary">
            Hesabınıza giriş yapmak için aşağıya e -postanızı girin
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-medium text-text text-sm">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="flex-1 text-text rounded-md border border-border bg-transparent px-3 py-1 text-base shadow-sm transition-colors"
                placeholder="Email adresi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="font-medium text-text text-sm"
              >
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="flex-1 text-text rounded-md border border-border bg-transparent px-3 py-1 text-base shadow-sm transition-colors"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-background bg-text "
            >
              Giriş Yap
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-text">
            Hesabınız yok mu?{" "}
            <Link href="/register" className="underline">
              Hemen kaydolun
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
