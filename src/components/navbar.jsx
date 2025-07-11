import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react';

const Navbar = ({ scrollY }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className={`w-8 h-8 transition-colors ${scrollY > 50 ? 'text-emerald-600' : 'text-sky-700'}`} />
            <span className={`text-2xl font-bold transition-colors ${scrollY > 50 ? 'text-gray-800' : 'text-sky-700'}`}>Taniku</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#beranda" className={`hover:text-emerald-600 transition-colors ${scrollY > 50 ? 'text-gray-800' : 'text-sky-700'}`}>Beranda</a>
            <a href="#fitur" className={`hover:text-emerald-600 transition-colors ${scrollY > 50 ? 'text-gray-800' : 'text-sky-700'}`}>Fitur</a>
            <a href="#tentang" className={`hover:text-emerald-600 transition-colors ${scrollY > 50 ? 'text-gray-800' : 'text-sky-700'}`}>Tentang</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className={`px-6 py-2 rounded-full font-semibold transition-colors ${scrollY > 50 ? 'text-gray-800 hover:text-emerald-600' : 'text-sky-700 hover:bg-sky-100'}`}>
              Masuk
            </Link>
            <Link to="/register" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Daftar
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? 
              <X className={`w-6 h-6 ${scrollY > 50 ? 'text-gray-800' : 'text-sky-700'}`} /> : 
              <Menu className={`w-6 h-6 ${scrollY > 50 ? 'text-gray-800' : 'text-sky-700'}`} />
            }
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col space-y-2 px-4">
              <a href="#beranda" onClick={() => setIsMenuOpen(false)} className="text-gray-800 hover:text-emerald-600 py-2">Beranda</a>
              <a href="#fitur" onClick={() => setIsMenuOpen(false)} className="text-gray-800 hover:text-emerald-600 py-2">Fitur</a>
              <a href="#tentang" onClick={() => setIsMenuOpen(false)} className="text-gray-800 hover:text-emerald-600 py-2">Tentang</a>
              <hr className="border-gray-200" />
              <Link to="/login" className="text-center bg-gray-100 text-gray-800 w-full px-6 py-3 rounded-lg font-semibold">Masuk</Link>
              <Link to="/register" className="text-center bg-emerald-500 text-white w-full px-6 py-3 rounded-lg font-semibold">Daftar</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;