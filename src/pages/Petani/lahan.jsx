import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link, useLocation } from 'react-router-dom';
import PetaniNavbar from '../../components/petani/PetaniNavbar';
import Footer from '../../components/petani/Footer';
import { Plus, Map, MapPin, Ruler, Wheat, ArrowRight } from 'lucide-react';

// Komponen untuk menampilkan info item dengan ikon
const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-center text-slate-400">
        <div className="mr-3 text-slate-500">{icon}</div>
        <span>{label}: <span className="font-medium text-slate-200">{value}</span></span>
    </div>
);

export default function Lahan() {
  const [lahanList, setLahanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Logika untuk mengambil data lahan dari Supabase
  useEffect(() => {
    const fetchUserAndLahan = async () => {
      if (lahanList.length === 0) setLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Pengguna tidak terautentikasi.');

        const { data, error: fetchError } = await supabase
          .from('lahan')
          .select('*')
          .eq('petani_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setLahanList(data || []);
      } catch (error) {
        setError(`Gagal memuat data lahan: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndLahan();
  }, [location]);

  // Tampilan saat loading
  if (loading) return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">
          Memuat data lahan...
      </div>
  );

  // Tampilan saat terjadi error
  if (error) return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center text-red-400">
          {error}
      </div>
  );

  return (
    <div className="bg-slate-900 min-h-screen">
      <PetaniNavbar />
      <main className="container mx-auto px-4 py-12 pt-28 md:pt-32">
        {/* Hero Section Halaman */}
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 leading-tight">
                Kelola Surga Pertanian Anda
            </h1>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-lg">
                Semua lahan Anda dalam satu tempat. Pantau, kelola, dan tingkatkan produktivitas dengan mudah.
            </p>
        </div>

        {/* Tombol Aksi Utama */}
        <div className="mb-10 flex justify-center">
            <Link 
              to="/petani/tambahlahan" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl shadow-emerald-800/30"
            >
              <Plus className="w-6 h-6" />
              <span>Tambah Lahan Baru</span>
            </Link>
        </div>

        {/* Konten Utama: Daftar Lahan atau Tampilan Kosong */}
        {lahanList.length === 0 ? (
          <div className="text-center py-24 bg-slate-800/50 rounded-2xl border border-dashed border-slate-700">
            <Map className="w-16 h-16 text-slate-600 mx-auto mb-6" />
            <p className="text-slate-300 font-semibold text-xl">Anda belum memiliki lahan terdaftar.</p>
            <p className="text-sm text-slate-500 mt-2">Mari mulai dengan menambahkan lahan pertama Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lahanList.map((lahan) => (
              <Link 
                to={`/petani/lahan/${lahan.id}`} 
                key={lahan.id} 
                className="block bg-slate-800/50 p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/50 hover:-translate-y-2 transition-all duration-300 group shadow-lg"
              >
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-white mb-4 transition-colors">{lahan.nama_lahan}</h2>
                    <div className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-900/50 text-emerald-300 border border-emerald-700/50">
                        {lahan.status || 'Tersedia'}
                    </div>
                </div>
                <div className="space-y-3 text-sm mb-6">
                  <InfoItem icon={<Ruler />} label="Luas" value={`${lahan.luas_lahan_hektar} Hektar`} />
                  <InfoItem icon={<MapPin />} label="Lokasi" value={lahan.lokasi} />
                  <InfoItem icon={<Wheat />} label="Tanaman" value={lahan.tanaman_sekarang || 'Belum ditanami'} />
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-end">
                    <div className="inline-flex items-center text-emerald-400 font-semibold group-hover:gap-3 transition-all">
                        Lihat Detail <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
