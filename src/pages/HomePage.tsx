import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

const API_BASE = 'http://localhost:8080/api';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/products/featured`)
      .then(r => r.json())
      .then(setProducts);
  }, []);

  return (
    <div className="p-12 bg-slate-900 text-white">
      <h1 className="text-4xl mb-8">Featured Products</h1>

      <div className="grid grid-cols-3 gap-6">
        {products.map(p => (
          <div
            key={p.id}
            onClick={() => navigate(`/products/${p.id}`)}
            className="bg-slate-800 p-4 rounded cursor-pointer"
          >
            <ShoppingBag />
            <h3>{p.name}</h3>
            <p>${p.price}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/products')}
        className="mt-8 bg-blue-600 px-6 py-3 rounded"
      >
        Browse All <ArrowRight />
      </button>
    </div>
  );
};
