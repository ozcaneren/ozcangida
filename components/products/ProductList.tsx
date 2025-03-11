"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProductItem from "./ProductItem";
import AddProduct from "./AddProduct";
import CategoryManager from "../categories/CategoryManager";
import BrandManager from "../brands/BrandManager";

interface Product {
  _id: string;
  title: string;
  price: number;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Filtreleme state'leri
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showStats, setShowStats] = useState<boolean>(false);

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
    category: string,
    brand: string
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
          category,
          brand,
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

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const matchesBrand = !selectedBrand || product.brand === selectedBrand;
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesBrand && matchesSearch;
  });

  if (authLoading || loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  return (
    <div className="">
      {/* Filtreleme Arayüzü */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-row flex-wrap gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-[54px] px-2 border border-border bg-background rounded-lg text-text"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="h-[54px] px-2 border border-border bg-background rounded-lg text-text"
          >
            <option value="">Tüm Markalar</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-4">
            {/* <div className="flex items-center gap-2 px-2 py-3.5 border border-border bg-background rounded-lg text-text">
              <input
                type="checkbox"
                id="hideCompleted"
                checked={hideCompleted}
                onChange={(e) => setHideCompleted(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <label htmlFor="hideCompleted" className="text-text font-medium">
                Tamamlananları Gizle
              </label>
            </div> */}

            <button
              onClick={() => setShowStats(!showStats)}
              className={`flex items-center border border-border gap-1 px-2 py-3.5 rounded-lg transition-colors ${
                showStats
                  ? "bg-background text-text"
                  : "bg-background text-text"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              İstatistikler
            </button>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Urun ara..."
            className="flex-1 text-text rounded-md border border-border bg-transparent px-3 py-1 text-base shadow-sm transition-colors"
          />
        </div>
      </div>

      {/* İstatistikler (Koşullu Render) */}
      {showStats && (
        <div className="mb-6 p-4 bg-background rounded-lg border border-border text-text">
          <h3 className="text-lg font-semibold mb-2">İstatistikler</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-textSecondary">Toplam Urun</p>
              <p className="text-xl font-bold">{products.length}</p>
            </div>
            <div>
              <p className="text-sm text-textSecondary">Kategoriler</p>
              <p className="text-xl font-bold">{categories.length}</p>
            </div>

            <div>
              <p className="text-sm text-textSecondary">Markalar</p>
              <p className="text-xl font-bold">{brands.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Kategori Yönetimi */}
      <CategoryManager
        categories={categories}
        onCategoryAdd={addCategory}
        onCategoryDelete={deleteCategory}
      />

      {/* Marka Yönetimi */}
      <BrandManager
        brands={brands}
        onBrandAdd={addBrand}
        onBrandDelete={deleteBrand}
      />

      <div className="border border-border rounded-lg p-4">
        <AddProduct
          onAdd={addProduct}
          categories={categories}
          brands={brands}
        />

        {loading ? (
          <div className="text-center">Yükleniyor...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500">Görev bulunamadı</div>
        ) : (
          <div className="flex flex-row flex-wrap gap-4">
            {filteredProducts.map((product) => (
              <ProductItem
                key={product._id}
                id={product._id}
                title={product.title}
                price={product.price}
                category={product.category}
                categories={categories}
                brand={product.brand}
                brands={brands}
                createdAt={product.createdAt}
                updatedAt={product.updatedAt}
                onDelete={deleteProduct}
                onEdit={editProducts}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
