import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LayoutDashboard, Map, Tractor, MessageSquare, BookOpen, Warehouse, User, LogOut } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Redirect akan ditangani oleh App.jsx, tapi kita tambahkan navigate
    // untuk memastikan pengguna langsung pindah halaman.
    navigate('/', { replace: true });
  };

  const linkClass = "flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200";
  const activeLinkClass = "flex items-center px-4 py-3 bg-green-600 text-white rounded-lg font-bold";

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-gray-800 text-white p-4">
      <div className="flex items-center mb-8">
        <span className="text-xl font-bold">Taniku</span>
      </div>
      
      {/* Bagian Navigasi yang Diperbaiki */}
      <nav className="flex-grow space-y-2">
        <NavLink 
          to="/petani/dashboard" 
          end 
          className={({ isActive }) => isActive ? activeLinkClass : linkClass}
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Dashboard
        </NavLink>
        <NavLink 
          to="/petani/lahan" 
          className={({ isActive }) => isActive ? activeLinkClass : linkClass}
        >
          <Map className="w-5 h-5 mr-3" />
          Manajemen Lahan
        </NavLink>
        <NavLink 
          to="/petani/bantuan" 
          className={({ isActive }) => isActive ? activeLinkClass : linkClass}
        >
          <Tractor className="w-5 h-5 mr-3" />
          Bantuan
        </NavLink>
        <NavLink 
          to="/petani/konsultasi" 
          className={({ isActive }) => isActive ? activeLinkClass : linkClass}
        >
          <MessageSquare className="w-5 h-5 mr-3" />
          Konsultasi
        </NavLink>
        <NavLink 
          to="/petani/pasar" 
          className={({ isActive }) => isActive ? activeLinkClass : linkClass}
        >
          <Warehouse className="w-5 h-5 mr-3" />
          Pasar Panen
        </NavLink>
        <NavLink 
          to="/petani/edukasi" 
          className={({ isActive }) => isActive ? activeLinkClass : linkClass}
        >
          <BookOpen className="w-5 h-5 mr-3" />
          Edukasi
        </NavLink>
      </nav>
      
      {/* Bagian Bawah Sidebar */}
      <div className="mt-auto">
        {/* Tambahkan link untuk profil jika diperlukan nanti */}
        {/* <NavLink to="/petani/profil" ... > ... </NavLink> */}
        <button onClick={handleLogout} className={`${linkClass} w-full text-left`}>
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
}