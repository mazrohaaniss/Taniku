import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase'; // Pastikan path ini benar
import { useNavigate } from 'react-router-dom';

function DashboardPetani() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Tambahkan state loading

  useEffect(() => {
    // Buat fungsi async di dalam useEffect
    const fetchUser = async () => {
      // Ambil data user dengan cara yang lebih aman
      const { data, error } = await supabase.auth.getUser();

      // 1. Cek jika ada error saat pengambilan data
      if (error) {
        console.error("Error fetching user:", error);
        navigate('/login');
        return;
      }

      // 2. Cek jika data.user benar-benar ada sebelum digunakan
      // Tanda tanya (?) adalah 'optional chaining', mencegah error jika 'data' kosong
      if (data?.user) {
        setUser(data.user);
      } else {
        // Jika tidak ada user dalam sesi, arahkan ke login
        navigate('/login');
      }

      setLoading(false); // Set loading selesai setelah semua pengecekan
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Redirect akan ditangani otomatis oleh listener di App.jsx
  };

  // Tampilkan pesan loading selagi data diambil
  if (loading) {
    return <div>Memuat data pengguna...</div>;
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard Petani</h1>
        <button onClick={handleLogout} style={{ padding: '8px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
      </header>
      <hr/>
      <main>
        <p>Selamat datang di dashboard Anda, <strong>{user ? user.email : 'Petani'}</strong>!</p>
        <p>Di sini Anda akan bisa mengelola lahan, laporan, dan penjualan panen.</p>
      </main>
    </div>
  );
}

export default DashboardPetani;