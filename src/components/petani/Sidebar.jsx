import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Tractor, 
  MessageSquare, 
  BookOpen, 
  Warehouse 
} from 'lucide-react';

export default function Sidebar() {
  // Kelas untuk link navigasi
  const linkClass = "flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors duration-200";
  const activeLinkClass = "flex items-center px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold shadow-lg shadow-emerald-900/30";

  return (
    <aside className="flex flex-col w-64 h-[calc(100vh-4rem)] bg-slate-900 text-white p-4 border-r border-slate-800 sticky top-16">
      {/* Navigasi Utama (logo sudah dipindah ke header) */}
      <nav className="flex-grow space-y-2">
        <NavLink to="/petani/dashboard" end className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/petani/lahan" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
          <Map className="w-5 h-5 mr-3" />
          Manajemen Lahan
        </NavLink>
        <NavLink to="/petani/bantuan" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
          <Tractor className="w-5 h-5 mr-3" />
          Bantuan
        </NavLink>
        <NavLink to="/petani/konsultasi" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
          <MessageSquare className="w-5 h-5 mr-3" />
          Konsultasi
        </NavLink>
        <NavLink to="/petani/pasar" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
          <Warehouse className="w-5 h-5 mr-3" />
          Pasar Panen
        </NavLink>
        <NavLink to="/petani/edukasi" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
          <BookOpen className="w-5 h-5 mr-3" />
          Edukasi
        </NavLink>
      </nav>
      
      {/* Bagian footer sidebar (kosong atau bisa ditambahkan info lain) */}
      <div className="mt-auto">
        {/* Opsional: Tambahkan info versi atau link lain */}
      </div>
    </aside>
  );
}