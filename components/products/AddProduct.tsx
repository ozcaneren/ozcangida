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
  onAdd: (title: string, price: number, categoryId: string, brandId: string) => void;
  categories: Category[];
  brands: Brand[];
}

export default function AddProduct({ onAdd, categories, brands }: AddProductProps) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && categoryId) {
      onAdd(title.trim(), price, categoryId, brandId);
      setTitle("");
      setPrice(0);
      setCategoryId("");
      setBrandId("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row flex-wrap justify-center w-full gap-2">

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Yeni urun ekle... (örn: Ulker Çikolatali Gofret)"
            className="flex-1 text-text rounded-md border border-border bg-transparent px-3 py-1 text-base shadow-sm transition-colors"
          />
          
          <div className="relative w-24 flex">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text">
              ₺
            </span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(+e.target.value)}
              placeholder="Fiyat"
              className="w-full pl-7 text-text rounded-md border border-border bg-transparent px-3 py-1 text-base shadow-sm transition-colors"
            />
          </div>
          
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="bg-background text-text px-2 rounded-lg border border-border"
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
            className="bg-background text-text px-2 rounded-lg border border-border"
          >
            <option value="">Marka seç</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-button text-white rounded-lg"
          >
            Ekle
          </button>
        </div>
      </div>
    </form>
  );
}
