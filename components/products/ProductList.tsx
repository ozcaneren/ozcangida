"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProductItem from "./ProductItem";
import AddProduct from "./AddProduct";
import CategoryManager from "../categories/CategoryManager";
import BrandManager from "../brands/BrandManager";
import Header from "../layout/Header";
import { useSearch } from "@/contexts/SearchContext";
import FilterPanel from './FilterPanel';
import Pagination from "../common/Pagination";

interface Product {
  _id: string;
  title: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: string;
  userId: string;
}

interface Brand {
  _id: string;
  name: string;
  userId: string;
}

export default function ProductList() {
  const { searchQuery } = useSearch();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'lowStock' | 'outOfStock'>('all');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPageOptions = [12, 24, 48, 96];
  const [itemsPerPage, setItemsPerPage] = useState(24);

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch categories");

      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  const addCategory = async (name: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to add category");

      const newCategory = await res.json();
      setCategories([...categories, newCategory]);
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Kategori eklenirken bir hata oluştu");
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete category");

      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      setError("Kategori silinirken bir hata oluştu");
    }
  };

  const fetchBrands = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/brands", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch brands");

      const data = await res.json();
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  }, []);

  const addBrand = async (name: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to add brand");

      const newBrand = await res.json();
      setBrands([...brands, newBrand]);
    } catch (error) {
      console.error("Error adding brand:", error);
      setError("Marka eklenirken bir hata oluştu");
    }
  };

  const deleteBrand = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/brands/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete brand");

      setBrands(brands.filter((brand) => brand._id !== id));
    } catch (error) {
      console.error("Error deleting brand:", error);
      setError("Marka silinirken bir hata oluştu");
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      fetchProducts();
      fetchCategories();
      fetchBrands();
    }
  }, [fetchProducts, fetchCategories, fetchBrands, user, router, authLoading]);

  const addProduct = async (
    title: string,
    price: number,
    stock: number,
    categoryId: string,
    brandId: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          price,
          stock,
          category: categoryId,
          brand: brandId,
        }),
      });

      if (!res.ok) throw new Error("Failed to add product");

      const newProduct = await res.json();
      setProducts([newProduct, ...products]);
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Todo eklenirken bir hata oluştu");
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete product");

      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const editProducts = async (
    id: string,
    newTitle: string,
    newPrice: number,
    newStock: number,
    newCategory: string,
    newBrand: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle,
          price: newPrice,
          stock: newStock,
          category: newCategory,
          brand: newBrand,
        }),
      });

      if (!res.ok) throw new Error("Failed to update product");

      const updatedProducts = await res.json();
      setProducts(
        products.map((product) =>
          product._id === id ? updatedProducts : product
        )
      );
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Product güncellenirken bir hata oluştu");
    }
  };

  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesBrand = !selectedBrand || product.brand === selectedBrand;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = (!priceRange.min || product.price >= priceRange.min) && (!priceRange.max || product.price <= priceRange.max);
    
    const matchesStock = stockFilter === 'all' ||
      (stockFilter === 'inStock' && product.stock > 10) ||
      (stockFilter === 'lowStock' && product.stock > 0 && product.stock <= 10) ||
      (stockFilter === 'outOfStock' && product.stock === 0);

    return matchesCategory && matchesBrand && matchesSearch && matchesPrice && matchesStock;
  }).sort((a, b) => {
    if (!sortField) return 0;

    let comparison = 0;
    switch (sortField) {
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'stock':
        comparison = a.stock - b.stock;
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'date':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, searchQuery, stockFilter]);

  if (authLoading || loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-80 shrink-0">
          <FilterPanel
            categories={categories}
            brands={brands}
            products={products}
            selectedCategory={selectedCategory}
            selectedBrand={selectedBrand}
            setSelectedCategory={setSelectedCategory}
            setSelectedBrand={setSelectedBrand}
            generalStats={{
              totalProducts: products.length,
              totalCategories: categories.length,
              totalBrands: brands.length
            }}
            onCategoryAdd={addCategory}
            onCategoryDelete={deleteCategory}
            onBrandAdd={addBrand}
            onBrandDelete={deleteBrand}
            onSort={handleSort}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            stockFilter={stockFilter}
            setStockFilter={setStockFilter}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>

        <div className="flex-1">
          <div className="mb-6">
            <AddProduct
              onAdd={addProduct}
              categories={categories}
              brands={brands}
            />
          </div>

          {loading ? (
            <div className="text-center">Yükleniyor...</div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-gray-500">Ürün bulunamadı</div>
          ) : (
            <>
              <div className="flex flex-row flex-wrap gap-4">
                {paginatedProducts.map((product) => (
                  <ProductItem
                    key={product._id}
                    id={product._id}
                    {...product}
                    categories={categories}
                    brands={brands}
                    onDelete={deleteProduct}
                    onEdit={editProducts}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={filteredProducts.length}
                  itemsPerPage={itemsPerPage}
                />
              )}

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-background p-2 border border-border rounded-lg mt-4 w-24"
              >
                {itemsPerPageOptions.map(option => (
                  <option key={option} value={option}>
                    {option} ürün
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
