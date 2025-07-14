import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Leaf, User, LogOut, ChevronDown, Menu, X } from 'lucide-react';

export default function PetaniNavbar() {
  const [scrollY, setScrollY] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Efek untuk background navbar saat scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efek untuk menutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/', { replace: true });
  };

  const navLinkClass = "px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white transition-colors";
  const activeNavLinkClass = "px-4 py-2 rounded-lg text-sm font-semibold bg-slate-800 text-emerald-400";

  const navLinks = [
    { to: "/petani/dashboard", text: "Dashboard" },
    { to: "/petani/lahan", text: "Lahan Saya" },
    { to: "/petani/bantuan", text: "Bantuan" },
    { to: "/petani/konsultasi", text: "Konsultasi" },
    { to: "/petani/pasar", text: "Pasar" },
    { to: "/petani/edukasi", text: "Edukasi" },
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 30 || isMenuOpen ? 'bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/petani/dashboard" className="flex items-center space-x-2">
            <Leaf className="w-8 h-8 text-emerald-400" />
            <span className="text-2xl font-bold text-white">Taniku</span>
          </Link>

          {/* Navigasi Desktop */}
          <div className="hidden md:flex items-center bg-slate-900/50 border border-slate-800 rounded-full px-2 py-1">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? activeNavLinkClass : navLinkClass}>
                {link.text}
              </NavLink>
            ))}
          </div>

          {/* Profil Dropdown & Tombol Menu Mobile */}
          <div className="flex items-center">
            <div className="hidden md:block relative ml-4" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 p-2 rounded-full hover:bg-slate-800 transition-colors">
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-emerald-400" />
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 border border-slate-700">
                  <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/50">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md hover:bg-slate-800">
                {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Navigasi Mobile */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2 mt-2 bg-slate-900 p-4 rounded-lg border border-slate-800">
              {navLinks.map(link => (
                <NavLink key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? activeNavLinkClass : navLinkClass}>
                  {link.text}
                </NavLink>
              ))}
               <hr className="border-slate-700 my-2"/>
               <button onClick={handleLogout} className="flex items-center w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-900/50 rounded-md">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
