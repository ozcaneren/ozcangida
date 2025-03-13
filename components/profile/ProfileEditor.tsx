'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

interface ProfileEditorProps {
  onClose: () => void;
}

export default function ProfileEditor({ onClose }: ProfileEditorProps) {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (avatarUrl) {
      try {
        const response = await fetch(avatarUrl, { method: 'HEAD' });
        if (!response.ok) {
          setError('Geçersiz resim URL\'i');
          setLoading(false);
          return;
        }
      } catch {
        setError('Resim URL\'i erişilebilir değil');
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          avatarUrl: avatarUrl.trim() || 'https://picsum.photos/200.jpg'
        }),
      });

      if (!res.ok) {
        throw new Error('Profil güncellenemedi');
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      onClose();
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Profil güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full max-w-4xl">
        {/* Form Box */}
        <div className="bg-background border border-border rounded-2xl p-6 md:p-8 w-full md:w-1/2 shadow-xl">
          <h2 className="text-2xl text-text font-bold mb-6">Profili Düzenle</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                İsim
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl text-text-secondary focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                Profil Fotoğrafı URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl text-text-secondary focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                disabled={loading}
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                disabled={loading}
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Box */}
        <div className="bg-background border border-border rounded-2xl p-6 md:p-8 w-full md:w-1/2 shadow-xl flex flex-col items-center justify-center">
          <h2 className="text-2xl text-text font-bold mb-8">Önizleme</h2>
          <div className="relative w-32 h-32 mb-6">
            <Image
              src={avatarUrl}
              alt="Profile"
              fill
              className="rounded-full object-cover shadow-md border-2 border-border"
            />
          </div>
          <div className="text-xl font-semibold text-text">
            {name || 'İsim girilmemiş'}
          </div>
        </div>
      </div>
    </div>
  );
} 