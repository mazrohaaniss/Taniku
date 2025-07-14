import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogOut, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/login');
    } else {
      console.error('Logout error:', error);
      alert('Gagal logout. Silakan coba lagi.');
    }
  };

  return (
    <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Kiri */}
        <Link to="/petani/dashboard" className="flex items-center space-x-3">
          <Leaf className="w-8 h-8 text-emerald-400" />
          <span className="text-2xl font-bold">Taniku</span>
        </Link>

        {/* Tombol Profil dan Logout Kanan */}
        <div className="flex items-center space-x-4">
          <Link to="/petani/profile" className="hover:text-emerald-400 transition-colors">
            <User className="w-6 h-6" />
          </Link>
          <button onClick={handleLogout} className="hover:text-red-400 transition-colors">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}