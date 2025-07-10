import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

function DashboardDinas() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { data: { user } } = supabase.auth.getUser().then(({ data: { user } }) => {
        if(user) setUser(user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // onAuthStateChange di App.jsx akan menangani redirect ke /login
  };

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

export default DashboardDinas;