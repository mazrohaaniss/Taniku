import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

// Hapus 'import Sidebar' dari sini karena tidak lagi dibutuhkan di file ini

function DashboardDinas() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        navigate('/login');
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  if (loading) {
    return <div>Memuat data pengguna...</div>;
  }

  // UBAH BAGIAN RETURN MENJADI LEBIH SEDERHANA
  // Hapus div flexbox dan pemanggilan <Sidebar />
  return (
    <div>
      <h1 className="text-3xl font-bold text-green-400 mb-4">Dashboard Utama</h1>
      <p>Selamat datang di dashboard Anda, <strong>{user ? user.email : 'Petani'}</strong>!</p>
      <p className="mt-4">Di sini Anda akan bisa mengelola lahan, laporan, dan penjualan panen.</p>
    </div>
  );
}

export default DashboardDinas;