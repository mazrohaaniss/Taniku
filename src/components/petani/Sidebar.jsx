import { NavLink } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LayoutDashboard, Map, Tractor, MessageSquare, BookOpen, Warehouse, User, LogOut } from 'lucide-react';

export default function Sidebar() {
  // Hapus useNavigate dari sini
  
  const handleLogout = async () => {
    // FUNGSI INI HANYA MEMANGGIL signOut, TIDAK ADA NAVIGATE
    await supabase.auth.signOut();
  };

  const linkClass = "flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200";
  const activeLinkClass = "flex items-center px-4 py-3 bg-green-600 text-white rounded-lg font-bold";

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-gray-800 text-white p-4">
      <div className="flex items-center mb-8">
        <span className="text-xl font-bold">Taniku</span>
      </div>
      <nav className="flex-grow space-y-2">
        <a href="#" className={activeLinkClass}>
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Dashboard
        </a>
        <a href="#" className={linkClass}>
          <Map className="w-5 h-5 mr-3" />
          Manajemen Lahan
        </a>
        <a href="#" className={linkClass}>
          <Tractor className="w-5 h-5 mr-3" />
          Bantuan
        </a>
      </nav>
      <div className="mt-auto">
        {/* Tombol ini sekarang memanggil handleLogout yang sudah disederhanakan */}
        <button onClick={handleLogout} className={`${linkClass} w-full text-left`}>
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
}