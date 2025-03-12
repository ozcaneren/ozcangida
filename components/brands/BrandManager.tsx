'use client';
import { useState } from 'react';

interface Brand {
  _id: string;
  name: string;
  userId: string;
}

interface BrandManagerProps {
  brands: Brand[];
  onBrandAdd: (name: string) => Promise<void>;
  onBrandDelete: (id: string) => Promise<void>;
}

export default function BrandManager({ brands, onBrandAdd, onBrandDelete }: BrandManagerProps) {
  const [newBrand, setNewBrand] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBrand.trim()) {
      onBrandAdd(newBrand.trim());
      setNewBrand('');
    }
  };

  return (
    <div className="mb-6 p-4 bg-background rounded-lg border border-border">
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-semibold text-text">Markalar</h2>
        <button className="text-text text-xl transition-transform cursor-pointer duration-200" style={{ transform: `rotate(${isOpen ? '180' : '0'}deg)` }}>
          ▼
        </button>
      </div>
      
      {isOpen && (
        <div className="mt-4">
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              placeholder="Yeni marka ekle... (örn: Eti)"
              className="flex-1 text-text rounded-md border border-border bg-transparent px-3 py-1 text-base shadow-sm transition-colors"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-button text-text rounded-lg transition-colors"
            >
              Ekle
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => (
              <div
                key={brand._id}
                className="flex items-center text-text gap-2 px-3 py-1 bg-background rounded-lg border border-border"
              >
                <span className=''>{brand.name}</span>
                <button
                  onClick={() => onBrandDelete(brand._id)}
                  className="text-red-500 hover:text-red-700"
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