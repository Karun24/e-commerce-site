import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Product, Category } from '../types';

const API_BASE = 'http://localhost:8080/api';

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState(params.get('category') || '');
  const [search, setSearch] = useState(params.get('search') || '');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then(res => res.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [category, search, sort, page]);

  const fetchProducts = async () => {
    setLoading(true);

    const query = new URLSearchParams({
      category,
      search,
      sort,
      page: page.toString(),
    });

    const res = await fetch(`${API_BASE}/products?${query}`);
    const data = await res.json();

    setProducts(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8 text-white">
      <h1 className="text-3xl font-bold mb-8">Discover Products</h1>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {products.map(p => (
            <div
              key={p.id}
              onClick={() => navigate(`/products/${p.id}`)}
              className="bg-slate-800 p-4 rounded cursor-pointer hover:border-blue-500 border border-slate-700"
            >
              <ShoppingBag className="mb-4" />
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-slate-400 text-sm">{p.short_description}</p>
              <p className="text-xl font-bold mt-2">${p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
