import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Bell, User, LogOut, ChevronDown } from 'lucide-react';

export default function DinasHeader() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/', { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40 px-6 py-3">
      <div className="flex justify-end items-center">
        {/* User Menu */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-slate-700 transition-colors">
            <Bell className="w-5 h-5 text-slate-300" />
          </button>
          <div className="w-px h-6 bg-slate-700"></div>
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-3 p-1 rounded-lg">
              <div className="w-9 h-9 bg-slate-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-white">Nama Dinas</p>
                <p className="text-xs text-slate-400">Admin</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-md shadow-lg py-1 border border-slate-600">
                <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/50 transition-colors">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
