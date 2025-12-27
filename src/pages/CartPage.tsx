import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CartItem, Product } from '../types';

const API_BASE = 'http://localhost:8080/api';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Map<string, Product>>(new Map());

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCartItems(parsed);
      fetchProducts(parsed);
    }
  }, []);

  const fetchProducts = async (items: CartItem[]) => {
    const ids = items.map(i => i.product_id).join(',');
    const res = await fetch(`${API_BASE}/products?ids=${ids}`);
    const data = await res.json();
    setProducts(new Map(data.map((p: Product) => [p.id, p])));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeItem(id);
    const updated = cartItems.map(i => i.product_id === id ? { ...i, quantity } : i);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter(i => i.product_id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  if (!isAuthenticated) {
    return <div className="text-center text-white">Please login</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <button onClick={() => navigate('/products')} className="text-blue-400 flex gap-2">
        <ArrowLeft /> Back
      </button>
      {/* UI rendering remains SAME */}
    </div>
  );
};
