"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatarUrl: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login");
      } else {
        setError(data.error || "Kayıt başarısız");
      }
    } catch {
      setError("Bir hata oluştu");
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center container mx-auto">
      <div className="max-w-md w-full p-8 bg-background border border-border rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-left text-2xl font-extrabold text-text">
            Hesap Oluştur
          </h2>
          <p className="mt-2 text-left text-sm text-textSecondary">
            Hesabınızı oluşturmak için aşağıya bilgilerinizi girin
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-medium text-text text-sm">
                İsim
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="flex-1 text-text rounded-md border border-border bg-transparent px-3 py-1 text-base shadow-sm transition-colors"
                placeholder="İsim"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
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
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="avatarUrl"
                className="font-medium text-text text-sm"
              >
                Profil Fotoğrafı URL
              </label>
              <input
                id="avatarUrl"
                name="avatarUrl"
                type="url"
                className="flex-1 text-text rounded-md border border-border bg-transparent px-3 py-1 text-base shadow-sm transition-colors"
                placeholder="Profil Fotoğrafı URL (isteğe bağlı)"
                value={formData.avatarUrl}
                onChange={(e) =>
                  setFormData({ ...formData, avatarUrl: e.target.value })
                }
              />
              {formData.avatarUrl && (
                <div className="mt-2 flex justify-center">
                  <Image
                    src={formData.avatarUrl}
                    alt="Profil Önizleme"
                    width={64}
                    height={64}
                    className="rounded-full object-cover w-16 h-16"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://ui-avatars.com/api/?background=random";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-background bg-text "
            >
              Kayıt Ol
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-text">
            Zaten hesabınız var mı?{" "}
            <Link href="/login" className="underline">
              Giriş yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
