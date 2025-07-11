import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

function DashboardPetani() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          navigate('/login');
        } else {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    // Panggil fetchUser saat komponen dimount
    fetchUser();

    // Tambahkan listener autentikasi untuk menangani logout atau perubahan status
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        setUser(null);
        navigate('/login');
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });

    // Cleanup listener saat komponen unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return <div className="text-center py-10">Memuat data pengguna...</div>;
  }

  if (!user) {
    return null; // Atau redirect langsung, tapi ini ditangani di useEffect
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-emerald-500 mb-4">Dashboard Utama</h1>
      <p>Selamat datang di dashboard Anda, <strong>{user.email}</strong>!</p>
      <p className="mt-4">Di sini Anda akan bisa mengelola lahan, laporan, dan penjualan panen.</p>
    </div>
  );
}

export default DashboardPetani;