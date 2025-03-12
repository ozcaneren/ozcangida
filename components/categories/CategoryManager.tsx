"use client";
import { useState } from "react";

interface Category {
  _id: string;
  name: string;
  userId: string;
}

interface CategoryManagerProps {
  categories: Category[];
  onCategoryAdd: (name: string) => Promise<void>;
  onCategoryDelete: (id: string) => Promise<void>;
}

export default function CategoryManager({
  categories,
  onCategoryAdd,
  onCategoryDelete,
}: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onCategoryAdd(newCategory.trim());
      setNewCategory("");
    }
  };

  return (
    <div className="bg-background/50 rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-background/80 transition-colors"
      >
        <span className="font-medium">Kategoriler ({categories.length})</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="p-3 border-t border-border">
          <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Yeni kategori ekle..."
                className="w-full pl-3 pr-10 py-2 text-sm rounded-md border border-border bg-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-button text-white text-sm rounded-md hover:bg-button/90 transition-colors"
            >
              Ekle
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <div
                key={category._id}
                className="group flex items-center gap-2 px-3 py-1.5 bg-background rounded-md border border-border hover:border-primary/50 transition-colors"
              >
                <span className="text-sm">{category.name}</span>
                <button
                  onClick={() => onCategoryDelete(category._id)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
