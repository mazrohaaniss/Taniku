import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';

// Halaman Utama
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';

// Layout & Halaman Petani (pastikan path huruf kecil konsisten)
import PetaniLayout from './pages/petani/PetaniLayout';
import DashboardPetani from './pages/Petani/DashboardPetani';
import Lahan from './pages/Petani/lahan';
import TambahLahan from './pages/Petani/TambahLahan';
import DetailLahan from './pages/Petani/DetailLahan';
import TambahAktivitas from './pages/Petani/TambahAktivitas';
import Bantuan from './pages/petani/bantuan';
import TambahBantuan from './pages/Petani/TambahBantuan'; 
import DetailPengajuan from './pages/Petani/DetailPengajuan';
import Pasar from './pages/petani/pasar';
import Konsultasi from './pages/Petani/konsultasi';
import Edukasi from './pages/Petani/edukasi';

// Halaman Dinas
import DashboardDinas from './pages/Dinas/DashboardDinas';

function App() {
  const navigate = useNavigate();

  // useEffect untuk onAuthStateChange tidak perlu diubah, sudah benar.
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        const { data: userProfile } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (userProfile?.role === 'petani') {
          navigate('/petani/dashboard', { replace: true });
        } else if (userProfile?.role === 'dinas') {
          navigate('/dinas/dashboard', { replace: true });
        }
      } else if (event === 'SIGNED_OUT') {
        navigate('/', { replace: true });
      }
    });
  }, [navigate]);

  return (
    <Routes>
      {/* --- Rute Publik --- */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* --- Rute untuk Petani (Menggunakan Layout) --- */}
      <Route path="/petani" element={<PetaniLayout />}>
        {/* Semua rute ini akan muncul di dalam <Outlet/> dari PetaniLayout */}
        <Route path="dashboard" element={<DashboardPetani />} />
        <Route path="lahan" element={<Lahan />} />
        <Route path="tambahlahan" element={<TambahLahan />} />
        <Route path="lahan/:lahanId" element={<DetailLahan />} />
        <Route path="/petani/lahan/:lahanId/tambahaktivitas" element={<TambahAktivitas />} />
        <Route path="bantuan" element={<Bantuan />} />
        <Route path="bantuan/tambah" element={<TambahBantuan />} />
        <Route path="bantuan/:id" element={<DetailPengajuan />} /> 
        <Route path="konsultasi" element={<Konsultasi />} />
        <Route path="pasar" element={<Pasar />} />
        <Route path="edukasi" element={<Edukasi />} />
      </Route>

      {/* --- Rute untuk Dinas --- */}
      <Route path="/dinas/dashboard" element={<DashboardDinas />} />
    </Routes>
  );
}



export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
