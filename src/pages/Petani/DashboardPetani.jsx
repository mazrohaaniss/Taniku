import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/petani/SIdebar';

function DashboardPetani() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          console.error('Error fetching user:', error);
          navigate('/login', { replace: true });
          return;
        }

        // Periksa peran pengguna
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError || userProfile?.role !== 'petani') {
          console.error('Invalid role or profile error:', profileError);
          navigate('/login', { replace: true });
          return;
        }

        setUser(user);
        setLoading(false);
      } catch (error) {
        console.error('Error in fetchUser:', error);
        navigate('/login', { replace: true });
      }
    };
    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-semibold">Memuat data pengguna...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Kolom Kiri: Sidebar */}
      <Sidebar />

      {/* Kolom Kanan: Konten Utama Dashboard */}
      <main className="flex-grow p-6 md:p-8">
        <div style={{ fontFamily: 'sans-serif' }}>
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Petani</h1>
          </header>
          <hr className="my-4 border-gray-300" />
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg font-medium text-gray-700">
              Selamat datang di dashboard Anda,{' '}
              <strong>{user?.user_metadata?.nama_lengkap || user?.email || 'Petani'}</strong>!
            </p>
            <p className="text-gray-600 mt-2">
              Di sini Anda bisa mengelola lahan, laporan, dan penjualan panen.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPetani;