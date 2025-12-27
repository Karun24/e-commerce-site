import React, { useEffect, useState } from 'react';
import { AlertCircle, Loader } from 'lucide-react';

const API_BASE = 'http://localhost:8080/api';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/users/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(setProfile);
  }, []);

  const handleChange = (e: any) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error('Update failed');
      setSuccess('Profile updated successfully');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div className="text-white p-8">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-8 text-white">
      {error && <div className="bg-red-900/30 p-3 mb-4"><AlertCircle /> {error}</div>}
      {success && <div className="bg-green-900/30 p-3 mb-4">{success}</div>}

      <input name="fullName" value={profile.fullName || ''} onChange={handleChange} className="w-full mb-3 p-2 bg-slate-700 rounded" />
      <input name="phone" value={profile.phone || ''} onChange={handleChange} className="w-full mb-3 p-2 bg-slate-700 rounded" />
      <input name="city" value={profile.city || ''} onChange={handleChange} className="w-full mb-3 p-2 bg-slate-700 rounded" />
      <textarea name="bio" value={profile.bio || ''} onChange={handleChange} className="w-full mb-3 p-2 bg-slate-700 rounded" />

      <button disabled={loading} className="bg-blue-600 px-4 py-2 rounded w-full">
        {loading ? <Loader className="animate-spin" /> : 'Save'}
      </button>
    </form>
  );
};
