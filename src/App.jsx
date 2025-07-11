import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';

import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import DashboardPetani from './pages/petani/DashboardPetani';
import DashboardDinas from './pages/dinas/DashboardDinas';


import PetaniLayout from './pages/Petani/PetaniLayout';
import Lahan from './pages/Petani/lahan';
import Bantuan from './pages/Petani/bantuan';
import Pasar from './pages/Petani/pasar';
import Konsultasi from './pages/Petani/konsultasi';
import Edukasi from './pages/Petani/edukasi';

function App() {
  const navigate = useNavigate();

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
        // PERUBAHAN DI SINI: Arahkan ke landing page ('/') setelah logout
        navigate('/', { replace: true });
      }
    });
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    
      <Route path="/petani" element={<PetaniLayout />}>
        {/* Rute anak akan muncul di dalam <Outlet /> PetaniLayout */}
        <Route path="/petani/dashboard" element={<DashboardPetani />} />
        <Route path="lahan" element={<Lahan />} />
        <Route path="bantuan" element={<Bantuan />} />
        <Route path="konsultasi" element={<Konsultasi />} />
        <Route path="pasar" element={<Pasar />} />
        <Route path="edukasi" element={<Edukasi />} />
      </Route>
      <Route path="/dinas/dashboard" element={<DashboardDinas />} />
    </Routes>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;