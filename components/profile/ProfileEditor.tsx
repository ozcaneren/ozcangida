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

    // URL kontrolü
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="flex gap-8 max-w-4xl w-full">
        {/* Form Box */}
        <div className="bg-white rounded-lg p-8 w-1/2 shadow-lg">
          <h2 className="text-2xl text-black font-semibold mb-6">Profili Düzenle</h2>
          
          {error && (
            <div className="mb-4 text-red-500 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İsim
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profil Fotoğrafı URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-black"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800"
                disabled={loading}
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Box */}
        <div className="bg-white rounded-lg p-8 w-1/2 shadow-lg flex flex-col items-center justify-center">
          <h2 className="text-2xl text-black font-semibold mb-6">Önizleme</h2>
          <Image
            src={avatarUrl || 'https://ui-avatars.com/api/?background=random'}
            alt="Profil Önizleme"
            width={128}
            height={128}
            className="rounded-full object-cover w-32 h-32 mb-4"
            onError={(e) => {
              e.currentTarget.src = 'https://ui-avatars.com/api/?background=random';
            }}
          />
          <div className="text-lg font-medium text-gray-900">
            {name || 'İsim girilmemiş'}
          </div>
        </div>
      </div>
    </div>
  );
} 