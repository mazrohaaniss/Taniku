import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const navLinks = [
    { to: "/petani/dashboard", text: "Dashboard" },
    { to: "/petani/lahan", text: "Lahan Saya" },
    { to: "/petani/bantuan", text: "Bantuan" },
    { to: "/petani/konsultasi", text: "Konsultasi" },
    { to: "/petani/pasar", text: "Pasar" },
    { to: "/petani/edukasi", text: "Edukasi" },
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-20">
      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kolom 1: Logo dan Deskripsi */}
          <div className="md:col-span-1">
            <Link to="/petani/dashboard" className="flex items-center space-x-2 mb-4">
              <Leaf className="w-8 h-8 text-emerald-400" />
              <span className="text-2xl font-bold text-white">Taniku</span>
            </Link>
            <p className="text-slate-400 text-sm max-w-xs">
              Platform digital untuk memberdayakan petani Indonesia melalui teknologi, data, dan kolaborasi.
            </p>
          </div>

          {/* Kolom 2: Link Navigasi */}
          <div>
            <h3 className="font-semibold text-white mb-4">Navigasi</h3>
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak */}
          <div>
             <h3 className="font-semibold text-white mb-4">Hubungi Kami</h3>
             <p className="text-slate-400 text-sm">
                Jl. Pertanian No. 123, Jakarta, Indonesia
             </p>
             <p className="text-slate-400 text-sm mt-1">
                info@taniku.com
             </p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Taniku. Semua Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
