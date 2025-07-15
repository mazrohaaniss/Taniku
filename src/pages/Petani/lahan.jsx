import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link, useLocation } from 'react-router-dom';
import PetaniNavbar from '../../components/petani/PetaniNavbar';
import Footer from '../../components/petani/Footer';
import { Plus, Map, MapPin, Ruler, Wheat, ArrowRight, TrendingUp } from 'lucide-react';

// Komponen InfoItem yang diperbarui dengan warna emerald
const InfoItem = ({ icon, label, value, accent = false }) => (
  <div className={`flex items-center ${accent ? 'text-emerald-300' : 'text-slate-300'}`}>
    <div className={`mr-3 ${accent ? 'text-emerald-400' : 'text-slate-400'}`}>{icon}</div>
    <span>
      {label}: <span className={`font-medium ${accent ? 'text-emerald-200' : 'text-slate-100'}`}>{value}</span>
    </span>
  </div>
);

// Komponen StatusBadge baru untuk warna dinamis sesuai referensi
const StatusBadge = ({ status }) => {
  const getStatusColor = (currentStatus) => {
    const lowerStatus = currentStatus?.toLowerCase() || 'tersedia';
    switch (lowerStatus) {
      case 'aktif':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      case 'pending':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      default: // Tersedia atau Kosong
        return 'bg-teal-500/20 text-teal-300 border-teal-500/50';
    }
  };

  return (
    <div className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(status)}`}>
      {status || 'Tersedia'}
    </div>
  );
};

export default function Lahan() {
  const [lahanList, setLahanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUserAndLahan = async () => {
      if (lahanList.length === 0) setLoading(true);
      setError(null);
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) throw new Error('Pengguna tidak terautentikasi.');
        setUser(authUser);

        const { data, error: fetchError } = await supabase
          .from('lahan')
          .select('*')
          .eq('petani_id', authUser.id)
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

  if (loading) return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">
        Memuat data lahan...
    </div>
  );

  if (error) return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center text-red-400">
        {error}
    </div>
  );

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <PetaniNavbar />
      <main className="container mx-auto px-4 py-12 pt-28 md:pt-32">
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-400">
                Selamat Datang, {user?.user_metadata.nama_lengkap || 'Petani'}!
            </h1>
            <p className="text-slate-300 mt-4 max-w-2xl mx-auto text-lg">
                Semua lahan Anda dalam satu tempat. Pantau, kelola, dan tingkatkan produktivitas dengan mudah.
            </p>
        </div>

        <div className="mb-10 flex justify-center">
            <Link 
              to="/petani/tambahlahan" 
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-800/30"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              <span>Tambah Lahan Baru</span>
            </Link>
        </div>

        {lahanList.length === 0 ? (
          <div className="text-center py-24 bg-slate-800 rounded-2xl border border-dashed border-slate-700">
            <Map className="w-16 h-16 text-slate-600 mx-auto mb-6" />
            <p className="text-slate-300 font-semibold text-xl mb-2">Anda belum memiliki lahan terdaftar.</p>
            <p className="text-sm text-slate-500">Mari mulai dengan menambahkan lahan pertama Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lahanList.map((lahan) => (
              <Link 
                to={`/petani/lahan/${lahan.id}`} 
                key={lahan.id} 
                className="group relative bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500 hover:-translate-y-2 transition-all duration-300 shadow-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-white">
                      {lahan.nama_lahan}
                    </h2>
                    <StatusBadge status={lahan.status} />
                  </div>
                  <div className="space-y-3 text-sm mb-6">
                    <InfoItem icon={<Ruler />} label="Luas" value={`${lahan.luas_lahan_hektar} Hektar`} accent={true} />
                    <InfoItem icon={<MapPin />} label="Lokasi" value={lahan.lokasi} />
                    <InfoItem icon={<Wheat />} label="Tanaman" value={lahan.tanaman_sekarang || 'Belum ditanami'} />
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700 flex justify-end">
                      <div className="inline-flex items-center text-emerald-400 font-semibold group-hover:gap-2 transition-all">
                          Lihat Detail <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
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
