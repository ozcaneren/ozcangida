"use client";
import { useState } from "react";

interface ProductItemProps {
  id: string;
  title: string;
  price: number;
  stock: number;
  category: string;
  categories: Array<{ _id: string; name: string }>;
  brand: string;
  brands: Array<{ _id: string; name: string }>;
  createdAt: string;
  updatedAt: string;
  onDelete: (id: string) => void;
  onEdit: (
    id: string,
    newTitle: string,
    newPrice: number,
    newStock: number,
    newCategory: string,
    newBrand: string
  ) => void;
}

export default function ProductItem({
  id,
  title,
  price,
  stock,
  category,
  categories,
  brand,
  brands,
  createdAt,
  updatedAt,
  onDelete,
  onEdit,
}: ProductItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedPrice, setEditedPrice] = useState(price);
  const [editedStock, setEditedStock] = useState(stock);
  const [editedCategory, setEditedCategory] = useState(category);
  const [editedBrand, setEditedBrand] = useState(brand);

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "";

      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      return new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  };

  const isEdited = createdAt !== updatedAt;
  const dateToShow = isEdited ? updatedAt : createdAt;
  const dateLabel = isEdited ? "Düzenlendi:" : "Oluşturuldu:";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTitle.trim()) {
      onEdit(id, editedTitle, editedPrice, editedStock, editedCategory, editedBrand);
      setIsEditing(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Kategori Yok";
  };

  const getBrandName = (brandId: string) => {
    const brand = brands.find((brand) => brand._id === brandId);
    return brand ? brand.name : "Marka Yok";
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-[calc(50%-0.5rem)] p-4 bg-background border border-border rounded-lg shadow-sm hover:shadow-md transition-all"
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-text/70 mb-1 block">
              Ürün Adı
            </label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-background transition-colors"
              autoFocus
              placeholder="Ürün adını girin"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-text/70 mb-1 block">
                Fiyat
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text/70">
                  ₺
                </span>
                <input
                  type="number"
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(+e.target.value)}
                  className="w-full rounded-lg border border-border bg-background pl-7 pr-3 py-2 text-sm text-text placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text/70 mb-1 block">
                Stok
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text/70">
                  📦
                </span>
                <input
                  type="number"
                  value={editedStock}
                  onChange={(e) => setEditedStock(+e.target.value)}
                  className="w-full rounded-lg border border-border bg-background pl-7 pr-3 py-2 text-sm text-text placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-text/70 mb-1 block">
                Kategori
              </label>
              <select
                value={editedCategory}
                onChange={(e) => setEditedCategory(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-text/70 mb-1 block">
                Marka
              </label>
              <select
                value={editedBrand}
                onChange={(e) => setEditedBrand(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors appearance-none"
              >
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-text/70 hover:text-text transition-colors rounded-lg border border-border hover:border-text/20"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white border border-border hover:bg-button/90 transition-colors rounded-lg"
            >
              Kaydet
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div
      className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.33%-0.75rem)] flex flex-col p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors duration-200"
    >
      <div className="flex justify-between items-start mb-3 pb-3 border-b border-border">
        <h3 className="font-medium text-lg text-text line-clamp-2 flex-1 mr-2">
          {title}
        </h3>
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors"
            title="Düzenle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
            title="Sil"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {getCategoryName(category)}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            {getBrandName(brand)}
          </span>
        </div>

        <div className="flex justify-between items-center mt-auto pt-3 border-t border-border">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-semibold text-text">{price.toFixed(2)}</span>
            <span className="text-sm text-text/70">₺</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-text/70">Stok:</span>
            <span className={`text-sm font-medium ${
              stock === 0 
                ? 'text-red-500' 
                : stock < 10 
                  ? 'text-yellow-500' 
                  : 'text-green-500'
            }`}>
              {stock}
            </span>
          </div>
        </div>

        <div className="text-[11px] text-text/50 mt-2">
          {dateLabel} {formatDate(dateToShow)}
        </div>
      </div>
    </div>
  );
}
