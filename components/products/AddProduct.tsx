"use client";
import { useState } from "react";

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface AddProductProps {
  onAdd: (
    title: string,
    price: number,
    stock: number,
    categoryId: string,
    brandId: string
  ) => void;
  categories: Category[];
  brands: Brand[];
}

export default function AddProduct({
  onAdd,
  categories,
  brands,
}: AddProductProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && categoryId) {
      onAdd(
        title.trim(), 
        parseFloat(price) || 0, 
        parseInt(stock) || 0, 
        categoryId, 
        brandId
      );
      setTitle("");
      setPrice("");
      setStock("");
      setCategoryId("");
      setBrandId("");
      setIsOpen(false);
    }
  };

  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-background/50 border-b border-border"
      >
        <div className="w-full flex flex-row items-center justify-between gap-2">
          <span className="font-medium">Yeni Ürün Ekle</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text/70">
              {isOpen ? "Formu gizle" : "Ürün eklemek için tıklayın"}
            </span>
            <svg
              className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      <div className={`${isOpen ? 'block' : 'hidden'} p-4`}>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Yeni ürün ekle... (örn: Ülker Çikolatalı Gofret)"
                className="w-full text-text rounded-md border border-border bg-transparent px-3 py-2.5 text-base shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative flex">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text/70">
                  ₺
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Fiyat"
                  step="0.01"
                  min="0"
                  className="w-full pl-7 text-text rounded-md border border-border bg-transparent px-3 py-2.5 text-base shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="relative flex">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text/70">
                  📦
                </span>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Stok adedi"
                  min="0"
                  className="w-full pl-9 text-text rounded-md border border-border bg-transparent px-3 py-2.5 text-base shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-background text-text px-3 py-2.5 rounded-md border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Kategori seç</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full bg-background text-text px-3 py-2.5 rounded-md border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Marka seç</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-button text-white rounded-md hover:bg-button/90 transition-colors duration-200 font-medium"
              >
                Ürün Ekle
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
