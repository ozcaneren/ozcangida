"use client";
import { useState } from 'react';
import CategoryManager from "../categories/CategoryManager";
import BrandManager from "../brands/BrandManager";

interface SortOption {
  label: string;
  value: string;
  direction: 'asc' | 'desc';
}

interface FilterPanelProps {
  categories: any[];
  brands: any[];
  products: {
    _id: string;
    title: string;
    price: number;
    stock: number;
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
  onSort: (field: string, direction: 'asc' | 'desc') => void;
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;
  stockFilter: 'all' | 'inStock' | 'lowStock' | 'outOfStock';
  setStockFilter: (filter: 'all' | 'inStock' | 'lowStock' | 'outOfStock') => void;
  itemsPerPage: number;
  setItemsPerPage: (itemsPerPage: number) => void;
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
}

export default function FilterPanel({
  categories,
  brands,
  products,
  selectedCategory,
  selectedBrand,
  setSelectedCategory,
  setSelectedBrand,
  generalStats,
  onCategoryAdd,
  onCategoryDelete,
  onBrandAdd,
  onBrandDelete,
  onSort,
  priceRange,
  setPriceRange,
  stockFilter,
  setStockFilter,
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'filters' | 'management' | 'stats'>('filters');
  const [selectedSort, setSelectedSort] = useState<string>('');

  const calculateStats = () => {
    const brandStats = brands.map(brand => ({
      ...brand,
      productCount: products.filter(p => p.brand === brand._id).length,
      totalValue: products
        .filter(p => p.brand === brand._id)
        .reduce((sum, p) => sum + p.price, 0),
      totalStock: products
        .filter(p => p.brand === brand._id)
        .reduce((sum, p) => sum + p.stock, 0)
    }));

    const categoryStats = categories.map(cat => ({
      ...cat,
      productCount: products.filter(p => p.category === cat._id).length,
      totalValue: products
        .filter(p => p.category === cat._id)
        .reduce((sum, p) => sum + p.price, 0),
      totalStock: products
        .filter(p => p.category === cat._id)
        .reduce((sum, p) => sum + p.stock, 0)
    }));

    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentProducts = products.filter(p => 
      new Date(p.createdAt) > lastWeek
    ).length;

    const averagePrice = products.length > 0 
      ? products.reduce((sum, p) => sum + p.price, 0) / products.length 
      : 0;

    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const averageStock = products.length > 0 
      ? totalStock / products.length 
      : 0;

    return {
      brandStats,
      categoryStats,
      recentProducts,
      averagePrice,
      totalStock,
      averageStock
    };
  };

  const stats = calculateStats();

  const sortOptions: SortOption[] = [
    { label: 'Fiyat (Artan)', value: 'price_asc', direction: 'asc' },
    { label: 'Fiyat (Azalan)', value: 'price_desc', direction: 'desc' },
    { label: 'Stok (Artan)', value: 'stock_asc', direction: 'asc' },
    { label: 'Stok (Azalan)', value: 'stock_desc', direction: 'desc' },
    { label: 'İsim (A-Z)', value: 'title_asc', direction: 'asc' },
    { label: 'İsim (Z-A)', value: 'title_desc', direction: 'desc' },
    { label: 'Yeni Eklenenler', value: 'date_desc', direction: 'desc' },
    { label: 'Eski Eklenenler', value: 'date_asc', direction: 'asc' },
  ];

  const handleSort = (value: string) => {
    const option = sortOptions.find(opt => opt.value === value);
    if (option) {
      const [field] = option.value.split('_');
      onSort(field, option.direction);
      setSelectedSort(value);
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

  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden">
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

      <div className={`${isOpen ? 'block' : 'hidden'}`}>
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

        <div className="p-4">
          {activeTab === 'filters' && (
            <div className="space-y-4">
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

              <div>
                <label className="text-sm font-medium block mb-2">Sıralama</label>
                <select
                  value={selectedSort}
                  onChange={(e) => handleSort(e.target.value)}
                  className="w-full h-10 px-2 border border-border bg-background rounded-lg text-sm"
                >
                  <option value="">Varsayılan Sıralama</option>
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Fiyat Aralığı</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text/70">₺</span>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: +e.target.value })}
                      placeholder="Min"
                      className="w-full h-10 pl-7 pr-2 border border-border bg-background rounded-lg text-sm"
                    />
                  </div>
                  <span className="text-text/70">-</span>
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text/70">₺</span>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: +e.target.value })}
                      placeholder="Max"
                      className="w-full h-10 pl-7 pr-2 border border-border bg-background rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Stok Durumu</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setStockFilter('all')}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      stockFilter === 'all' 
                        ? 'bg-button text-white' 
                        : 'bg-background border border-border hover:bg-background/80'
                    }`}
                  >
                    Tümü
                  </button>
                  <button
                    onClick={() => setStockFilter('inStock')}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      stockFilter === 'inStock' 
                        ? 'bg-button text-white' 
                        : 'bg-background border border-border hover:bg-background/80'
                    }`}
                  >
                    Stokta Var
                  </button>
                  <button
                    onClick={() => setStockFilter('lowStock')}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      stockFilter === 'lowStock' 
                        ? 'bg-button text-white' 
                        : 'bg-background border border-border hover:bg-background/80'
                    }`}
                  >
                    Az Stok
                  </button>
                  <button
                    onClick={() => setStockFilter('outOfStock')}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      stockFilter === 'outOfStock' 
                        ? 'bg-button text-white' 
                        : 'bg-background border border-border hover:bg-background/80'
                    }`}
                  >
                    Stokta Yok
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Sayfa Başına Ürün</label>
                <div className="relative">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full h-10 pl-3 pr-10 text-sm rounded-lg border border-border bg-background appearance-none focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  >
                    {[12, 24, 48, 96].map(option => (
                      <option key={option} value={option}>
                        {option} ürün göster
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-text/70">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-text/70">
                  Bir sayfada görüntülenecek ürün sayısını seçin
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <label className="text-sm font-medium block mb-2">Aktif Filtreler</label>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                      {getCategoryName(selectedCategory)}
                      <button 
                        onClick={() => setSelectedCategory('')}
                        className="ml-1 hover:text-primary/80"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedBrand && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                      {getBrandName(selectedBrand)}
                      <button 
                        onClick={() => setSelectedBrand('')}
                        className="ml-1 hover:text-primary/80"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {stockFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                      {stockFilter === 'inStock' ? 'Stokta Var' : 
                      stockFilter === 'lowStock' ? 'Az Stok' : 'Stokta Yok'}
                      <button 
                        onClick={() => setStockFilter('all')}
                        className="ml-1 hover:text-primary/80"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {(priceRange.min > 0 || priceRange.max > 0) && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                      {`${priceRange.min}₺ - ${priceRange.max}₺`}
                      <button 
                        onClick={() => setPriceRange({ min: 0, max: 0 })}
                        className="ml-1 hover:text-primary/80"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {itemsPerPage !== 24 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                      Sayfa başına: {itemsPerPage}
                      <button 
                        onClick={() => {
                          setItemsPerPage(24);
                          setCurrentPage(1);
                        }}
                        className="ml-1 hover:text-primary/80"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
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
                  <div className="p-4 bg-background/50 rounded-lg border border-border">
                    <p className="text-sm text-textSecondary mb-1">Toplam Stok</p>
                    <p className="text-2xl font-bold">{stats.totalStock}</p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg border border-border">
                    <p className="text-sm text-textSecondary mb-1">Ortalama Stok</p>
                    <p className="text-2xl font-bold">{stats.averageStock.toFixed(1)}</p>
                  </div>
                </div>
              </div>

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
                          <span className="ml-2">•</span>
                          <span className="ml-2">Stok: {brand.totalStock}</span>
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
                          <span className="ml-2">•</span>
                          <span className="ml-2">Stok: {category.totalStock}</span>
                        </div>
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