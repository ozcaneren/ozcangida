"use client";
import { useState } from 'react';
import CategoryManager from "../categories/CategoryManager";
import BrandManager from "../brands/BrandManager";

interface FilterPanelProps {
  categories: any[];
  brands: any[];
  products: {  // Ürünleri de props olarak alalım
    _id: string;
    title: string;
    price: number;
    category: string;
    brand: string;
    createdAt: string;
    updatedAt: string;
  }[];
  selectedCategory: string;
  selectedBrand: string;
  setSelectedCategory: (category: string) => void;
  setSelectedBrand: (brand: string) => void;
  generalStats: {
    totalProducts: number;
    totalCategories: number;
    totalBrands: number;
  };
  onCategoryAdd: (name: string) => Promise<void>;
  onCategoryDelete: (id: string) => Promise<void>;
  onBrandAdd: (name: string) => Promise<void>;
  onBrandDelete: (id: string) => Promise<void>;
}

export default function FilterPanel({
  categories,
  brands,
  products,  // Yeni prop
  selectedCategory,
  selectedBrand,
  setSelectedCategory,
  setSelectedBrand,
  generalStats,
  onCategoryAdd,
  onCategoryDelete,
  onBrandAdd,
  onBrandDelete
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'filters' | 'management' | 'stats'>('filters');

  // İstatistik hesaplamaları
  const calculateStats = () => {
    const brandStats = brands.map(brand => ({
      ...brand,
      productCount: products.filter(p => p.brand === brand._id).length,
      totalValue: products
        .filter(p => p.brand === brand._id)
        .reduce((sum, p) => sum + p.price, 0)
    }));

    const categoryStats = categories.map(cat => ({
      ...cat,
      productCount: products.filter(p => p.category === cat._id).length,
      totalValue: products
        .filter(p => p.category === cat._id)
        .reduce((sum, p) => sum + p.price, 0)
    }));

    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentProducts = products.filter(p => 
      new Date(p.createdAt) > lastWeek
    ).length;

    const averagePrice = products.length > 0 
      ? products.reduce((sum, p) => sum + p.price, 0) / products.length 
      : 0;

    return {
      brandStats,
      categoryStats,
      recentProducts,
      averagePrice
    };
  };

  const stats = calculateStats();

  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden">
      {/* Başlık ve Toggle Butonu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-background/50 border-b border-border"
      >
        <div className="w-full flex flex-row items-center justify-between gap-2">
          <span className="font-medium">Filtreler ve Yönetim</span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Panel İçeriği */}
      <div className={`${isOpen ? 'block' : 'hidden'}`}>
        {/* Tab Butonları */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('filters')}
            className={`flex-1 p-3 text-sm font-medium ${
              activeTab === 'filters' 
                ? 'bg-background/50 border-b-2 border-primary' 
                : 'hover:bg-background/30'
            }`}
          >
            Filtreler
          </button>
          <button
            onClick={() => setActiveTab('management')}
            className={`flex-1 p-3 text-sm font-medium ${
              activeTab === 'management' 
                ? 'bg-background/50 border-b-2 border-primary' 
                : 'hover:bg-background/30'
            }`}
          >
            Yönetim
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 p-3 text-sm font-medium ${
              activeTab === 'stats' 
                ? 'bg-background/50 border-b-2 border-primary' 
                : 'hover:bg-background/30'
            }`}
          >
            İstatistikler
          </button>
        </div>

        {/* Tab İçerikleri */}
        <div className="p-4">
          {activeTab === 'filters' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Kategori</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-10 px-2 border border-border bg-background rounded-lg text-sm"
                >
                  <option value="">Tüm Kategoriler</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Marka</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full h-10 px-2 border border-border bg-background rounded-lg text-sm"
                >
                  <option value="">Tüm Markalar</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === 'management' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Kategori Yönetimi</h3>
                <CategoryManager
                  categories={categories}
                  onCategoryAdd={onCategoryAdd}
                  onCategoryDelete={onCategoryDelete}
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Marka Yönetimi</h3>
                <BrandManager
                  brands={brands}
                  onBrandAdd={onBrandAdd}
                  onBrandDelete={onBrandDelete}
                />
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Genel İstatistikler */}
              <div>
                <h3 className="text-sm font-medium mb-3">Genel Bakış</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-background/50 rounded-lg border border-border">
                    <p className="text-sm text-textSecondary mb-1">Toplam Ürün</p>
                    <p className="text-2xl font-bold">{generalStats.totalProducts}</p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg border border-border">
                    <p className="text-sm text-textSecondary mb-1">Son 7 Gün</p>
                    <p className="text-2xl font-bold">{stats.recentProducts}</p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg border border-border">
                    <p className="text-sm text-textSecondary mb-1">Ortalama Fiyat</p>
                    <p className="text-2xl font-bold">₺{stats.averagePrice.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg border border-border">
                    <p className="text-sm text-textSecondary mb-1">Toplam Değer</p>
                    <p className="text-2xl font-bold">
                      ₺{products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Marka İstatistikleri */}
              <div>
                <h3 className="text-sm font-medium mb-3">Marka Analizi</h3>
                <div className="space-y-2">
                  {stats.brandStats
                    .sort((a, b) => b.productCount - a.productCount)
                    .map(brand => (
                      <div key={brand._id} className="p-3 bg-background/50 rounded-lg border border-border">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{brand.name}</span>
                          <span className="text-sm text-textSecondary">
                            {brand.productCount} Ürün
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-textSecondary">
                          Toplam Değer: ₺{brand.totalValue.toFixed(2)}
                        </div>
                        {/* Progress bar */}
                        <div className="mt-2 w-full bg-border rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{
                              width: `${(brand.productCount / generalStats.totalProducts) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Kategori İstatistikleri */}
              <div>
                <h3 className="text-sm font-medium mb-3">Kategori Analizi</h3>
                <div className="space-y-2">
                  {stats.categoryStats
                    .sort((a, b) => b.productCount - a.productCount)
                    .map(category => (
                      <div key={category._id} className="p-3 bg-background/50 rounded-lg border border-border">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm text-textSecondary">
                            {category.productCount} Ürün
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-textSecondary">
                          Toplam Değer: ₺{category.totalValue.toFixed(2)}
                        </div>
                        {/* Progress bar */}
                        <div className="mt-2 w-full bg-border rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{
                              width: `${(category.productCount / generalStats.totalProducts) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 