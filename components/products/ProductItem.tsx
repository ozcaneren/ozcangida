"use client";
import { useState } from "react";

interface ProductItemProps {
  id: string;
  title: string;
  price: number;
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
    newCategory: string,
    newBrand: string
  ) => void;
}

export default function ProductItem({
  id,
  title,
  price,
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
      onEdit(id, editedTitle, editedPrice, editedCategory, editedBrand);
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
        className="w-full md:w-[calc(50%-0.5rem)] flex flex-col md:flex-row items-center p-4 bg-background border border-border rounded-lg"
      >
        <div className="flex flex-col md:flex-row gap-2 flex-1">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="flex-1 text-text rounded-md border border-border bg-transparent px-3 py-1 text-base transition-colors"
            autoFocus
          />
          <div className="relative w-full md:w-24">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text">
              ₺
            </span>
            <input
              type="number"
              value={editedPrice}
              onChange={(e) => setEditedPrice(+e.target.value)}
              className="w-full pl-7 text-text rounded-md border border-border bg-transparent px-3 py-1 text-base transition-colors"
            />
          </div>
          <label className="sticky md:hidden text-text">Kategori:</label>
          <select
            value={editedCategory}
            onChange={(e) => setEditedCategory(e.target.value)}
            className="border border-border bg-background rounded-lg text-text px-3 py-1"
          >
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <label className="sticky md:hidden text-text">Marka:</label>
          <select
            value={editedBrand}
            onChange={(e) => setEditedBrand(e.target.value)}
            className="border border-border bg-background rounded-lg text-text px-3 py-1"
          >
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-2 md:mt-0 ml-0 md:ml-2 flex gap-2">
          <button
            type="submit"
            className="text-sm bg-button text-white px-3 py-2 md:px-2 md:py-1.5 rounded hover:bg-buttonHover"
          >
            Kaydet
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-sm bg-button text-white px-3 py-2 md:px-2 md:py-1.5 rounded hover:bg-buttonHover"
          >
            İptal
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      className={`w-[calc(50%-0.5rem)] flex items-center p-4 bg-background border border-border rounded-lg`}
    >
      <div className="w-full flex flex-col gap-1">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex items-center gap-3">
            <span className="text-text">{title}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(id)}
              className="text-red-500 hover:text-red-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
        <div className="flex items-center">
          <span className="text-text-secondary text-sm">
            {getCategoryName(category)}
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-text-secondary text-sm">
            {getBrandName(brand)}
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-text">{price} ₺</span>
        </div>

        <span className="text-xs text-text-secondary">
          {dateLabel} {formatDate(dateToShow)}
        </span>
      </div>
    </div>
  );
}
