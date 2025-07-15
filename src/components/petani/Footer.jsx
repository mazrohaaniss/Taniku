import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-20">
      <div className="container mx-auto px-8 py-8">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Logo dan Nama Aplikasi */}
          <Link to="/petani/dashboard" className="flex items-center space-x-2 mb-4">
            <Leaf className="w-7 h-7 text-emerald-400" />
            <span className="text-xl font-bold text-white">Taniku</span>
          </Link>
          {/* Teks Hak Cipta */}
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Taniku. Semua Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
