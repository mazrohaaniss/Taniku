import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck, MessageSquare, BookOpen, Megaphone, Leaf, BarChart3 } from 'lucide-react';

export default function DinasSidebar() {
  const linkClass = "flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-lg transition-colors duration-200";
  const activeLinkClass = "flex items-center px-4 py-3 bg-emerald-600 text-white rounded-lg font-semibold shadow-lg shadow-emerald-900/30";

  const navLinks = [
    { to: "/dinas/dashboard", text: "Dashboard", icon: <LayoutDashboard className="w-5 h-5 mr-3" /> },
    // Tautan baru untuk Analisis Pertanian
    { to: "/dinas/analisis", text: "Analisis Pertanian", icon: <BarChart3 className="w-5 h-5 mr-3" /> },
    { to: "/dinas/bantuan", text: "Manajemen Bantuan", icon: <ShieldCheck className="w-5 h-5 mr-3" /> },
    { to: "/dinas/konsultasi", text: "Forum Konsultasi", icon: <MessageSquare className="w-5 h-5 mr-3" /> },
    { to: "/dinas/edukasi", text: "Pusat Edukasi", icon: <BookOpen className="w-5 h-5 mr-3" /> },
    { to: "/dinas/pengumuman", text: "Pengumuman", icon: <Megaphone className="w-5 h-5 mr-3" /> },
  ];

  return (
    <aside className="flex flex-col w-64 h-screen bg-slate-800 text-white p-4 border-r border-slate-700 sticky top-0">
      <Link to="/dinas/dashboard" className="flex items-center space-x-3 mb-10 px-4">
        <Leaf className="w-8 h-8 text-emerald-400" />
        <span className="text-2xl font-bold text-white">Taniku</span>
      </Link>
      
      <nav className="flex-grow space-y-2">
        {navLinks.map(link => (
          <NavLink key={link.to} to={link.to} end className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
            {link.icon}
            {link.text}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
