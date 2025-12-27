import React, { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { Order } from '../types';

const API_BASE = 'http://localhost:8080/api';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders/my`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch orders');

      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/20 text-yellow-300 border-yellow-500/30';
      case 'confirmed':
        return 'bg-blue-900/20 text-blue-300 border-blue-500/30';
      case 'processing':
        return 'bg-purple-900/20 text-purple-300 border-purple-500/30';
      case 'shipped':
        return 'bg-cyan-900/20 text-cyan-300 border-cyan-500/30';
      case 'delivered':
        return 'bg-green-900/20 text-green-300 border-green-500/30';
      case 'cancelled':
        return 'bg-red-900/20 text-red-300 border-red-500/30';
      default:
        return 'bg-slate-900/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>

        {loading ? (
          <div className="text-center text-slate-400">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
            <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No orders yet</h2>
            <p className="text-slate-400">Start shopping to place your first order</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-white">{order.order_number}</h3>
                    <p className="text-slate-400 text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full border text-sm ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="text-xl font-bold text-white mt-2">
                      ${order.total_amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
