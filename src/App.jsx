import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';

// Halaman Utama
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';

// Layout & Halaman Petani (pastikan path huruf kecil konsisten)
import DashboardPetani from './pages/Petani/DashboardPetani';
import Profil from './pages/Petani/profil';
import Lahan from './pages/Petani/lahan';
import TambahLahan from './pages/Petani/TambahLahan';
import DetailLahan from './pages/Petani/DetailLahan';
import TambahAktivitas from './pages/Petani/TambahAktivitas';
import Bantuan from './pages/Petani/bantuan';
import TambahBantuan from './pages/Petani/TambahBantuan'; 
import DetailPengajuan from './pages/Petani/DetailPengajuan';
import Konsultasi from './pages/Petani/konsultasi';
import TambahTopik from './pages/Petani/TambahTopik';
import DetailTopik from './pages/Petani/DetailTopik';
import Edukasi from './pages/Petani/edukasi';
import DetailMateri from './pages/Petani/DetailMateri';


// Halaman Dinas
import DashboardDinas from './pages/Dinas/DashboardDinas';
import AnalisisPertanian from './pages/Dinas/AnalisisPertanian';
import BantuanDinas from './pages/Dinas/BantuanDinas'; 
import DetailBantuanDinas from './pages/Dinas/DetailBantuanDInas';
import KonsultasiDinas from './pages/Dinas/KonsultasiDinas';
import DetailTopikDinas from './pages/Dinas/DetailTopikDinas';
import EdukasiDinas from './pages/Dinas/EdukasiDinas';
import TambahMateri from './pages/Dinas/TambahMateri';
import PengumumanDinas from './pages/Dinas/PengumumanDinas';
import TambahPengumuman from './pages/Dinas/TambahPengumuman';

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
      
       {/* --- Rute untuk Petani --- */}
      <Route path="/petani/dashboard" element={<DashboardPetani />} />
      <Route path="/petani/profil" element={<Profil />} />
      <Route path="/petani/lahan" element={<Lahan />} />
      <Route path="/petani/tambahlahan" element={<TambahLahan />} />
      <Route path="/petani/lahan/:lahanId" element={<DetailLahan />} />
      <Route path="/petani/lahan/:lahanId/tambahaktivitas" element={<TambahAktivitas />} />
      <Route path="/petani/bantuan" element={<Bantuan />} />
      <Route path="/petani/bantuan/tambah" element={<TambahBantuan />} />
      <Route path="/petani/bantuan/:id" element={<DetailPengajuan />} /> 
      <Route path="/petani/konsultasi" element={<Konsultasi />} />
      <Route path="/petani/konsultasi/tambah" element={<TambahTopik />} />
      <Route path="/petani/konsultasi/:topikId" element={<DetailTopik />} />
      <Route path="/petani/edukasi" element={<Edukasi />} />
      <Route path="/petani/edukasi/:materiId" element={<DetailMateri />} />

      {/* --- Rute untuk Dinas --- */}
      <Route path="/dinas/dashboard" element={<DashboardDinas />} />
      <Route path="/dinas/analisis" element={<AnalisisPertanian />} />
      <Route path="/dinas/bantuan" element={<BantuanDinas />} />
      <Route path="/dinas/bantuan/:id" element={<DetailBantuanDinas />} /> 
      <Route path="/dinas/konsultasi" element={<KonsultasiDinas />} />
      <Route path="/dinas/konsultasi/:topikId" element={<DetailTopikDinas />} />
      <Route path="/dinas/edukasi" element={<EdukasiDinas />} />
      <Route path="/dinas/edukasi/tambah" element={<TambahMateri />} />
      <Route path="/dinas/pengumuman" element={<PengumumanDinas />} />
      <Route path="/dinas/pengumuman/tambah" element={<TambahPengumuman />} />
      
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
