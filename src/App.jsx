import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';

// Import Pages
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import DashboardPetani from './pages/petani/DashboardPetani';
import DashboardDinas from './pages/dinas/DashboardDinas';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Listener ini adalah "otak" dari aplikasi
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          // Hanya bereaksi saat event SIGNED_IN terjadi
          const { data: userProfile } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (userProfile) {
            if (userProfile.role === 'petani') {
              navigate('/petani/dashboard', { replace: true });
            } else if (userProfile.role === 'dinas') {
              navigate('/dinas/dashboard', { replace: true });
            }
          }
        } else if (event === 'SIGNED_OUT') {
          // Jika logout, arahkan ke halaman login
          navigate('/login', { replace: true });
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Kita tidak perlu ProtectedRoute lagi karena App.jsx sudah menangani */}
        <Route path="/petani/dashboard" element={<DashboardPetani />} />
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