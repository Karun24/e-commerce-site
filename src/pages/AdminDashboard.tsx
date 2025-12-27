import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, Users, ShoppingCart, MessageCircle, TrendingUp } from 'lucide-react';

interface Stats {
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  activeChatRooms: number;
  recentOrders: any[];
}

const API_BASE = 'http://localhost:8080/api';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchStats();
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch stats');
      setStats(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>;
  }

  const StatCard = ({ icon: Icon, label, value }: any) => (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <p className="text-slate-400">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      <Icon className="w-8 h-8 text-blue-500 opacity-50" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-5 gap-6 mb-8">
        <StatCard icon={ShoppingCart} label="Orders" value={stats.totalOrders} />
        <StatCard icon={Users} label="Users" value={stats.totalUsers} />
        <StatCard icon={TrendingUp} label="Revenue" value={`$${stats.totalRevenue}`} />
        <StatCard icon={MessageCircle} label="Chats" value={stats.activeChatRooms} />
        <StatCard icon={BarChart3} label="Avg Order" value={`$${(stats.totalRevenue / Math.max(stats.totalOrders, 1)).toFixed(2)}`} />
      </div>
    </div>
  );
};
