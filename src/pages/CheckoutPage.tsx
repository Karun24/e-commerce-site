import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader } from 'lucide-react';

const API_BASE = 'http://localhost:8080/api';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<any>({ paymentMethod: 'credit_card' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');

      const res = await fetch(`${API_BASE}/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ cart, ...formData }),
      });

      if (!res.ok) throw new Error('Checkout failed');

      const order = await res.json();
      localStorage.removeItem('cart');
      navigate(`/orders/${order.id}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-xl mx-auto text-white">
      {error && (
        <div className="bg-red-900/30 p-4 rounded mb-4">
          <AlertCircle /> {error}
        </div>
      )}

      <button disabled={loading} className="w-full bg-blue-600 p-3 rounded">
        {loading ? <Loader className="animate-spin" /> : 'Complete Order'}
      </button>
    </form>
  );
};
