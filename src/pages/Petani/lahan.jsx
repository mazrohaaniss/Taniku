import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Map, MapPin, Ruler, Wheat } from 'lucide-react';

export default function Lahan() {
  const [lahanList, setLahanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation(); // Untuk memicu ulang useEffect saat navigasi

  useEffect(() => {
    let mounted = true;

    const fetchUserAndLahan = async () => {
      if (!mounted) return;
      
      // HANYA tampilkan loading screen jika data belum ada sama sekali.
      if (lahanList.length === 0) {
        setLoading(true);
      }
      setError(null);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('Pengguna tidak terautentikasi. Silakan login ulang.');
        }
        if (mounted) setUser(user);

        const { data, error: fetchError } = await supabase
          .from('lahan')
          .select('*')
          .eq('petani_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        if (mounted) setLahanList(data || []);
      } catch (error) {
        if (mounted) setError(`Gagal memuat data lahan: ${error.message}`);
        console.error('Error fetching lahan data:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUserAndLahan();
    return () => {
      mounted = false;
    };
  }, [location]);

  if (loading) return <div className="text-center py-10 text-slate-400">Memuat data lahan...</div>;
  if (error) return <div className="text-center py-10 bg-red-900/50 text-red-400 p-4 rounded-lg">{error}</div>;

  return (
    <div className="text-white">
      {/* Header Halaman */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald-600">Manajemen Lahan</h1>
          <p className="text-slate-400">Kelola semua lahan pertanian Anda di sini.</p>
        </div>
        <Link 
          to="/petani/tambahlahan" 
          className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform shadow-lg shadow-emerald-800/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Lahan
        </Link>
      </div>

      {/* Konten Utama */}
      {lahanList.length === 0 && !loading ? ( // Tambahkan !loading untuk mencegah tampilan "kosong" saat masih memuat
        <div className="text-center py-16 bg-slate-900 rounded-xl border border-slate-800">
          <Map className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-semibold">Anda belum memiliki lahan terdaftar.</p>
          <p className="text-sm text-slate-500">Klik tombol "Tambah Lahan" untuk memulai.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lahanList.map((lahan) => (
            <Link 
              to={`/petani/lahan/${lahan.id}`} 
              key={lahan.id} 
              className="block bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 group"
            >
              <h2 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">{lahan.nama_lahan}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-slate-400">
                  <Ruler className="w-4 h-4 mr-3 text-slate-500" />
                  <span>Luas: <span className="font-medium text-slate-300">{lahan.luas_lahan_hektar} Hektar</span></span>
                </div>
                <div className="flex items-center text-slate-400">
                  <MapPin className="w-4 h-4 mr-3 text-slate-500" />
                  <span>Lokasi: <span className="font-medium text-slate-300">{lahan.lokasi}</span></span>
                </div>
                <div className="flex items-center text-slate-400">
                  <Wheat className="w-4 h-4 mr-3 text-slate-500" />
                  <span>Tanaman: <span className="font-medium text-slate-300">{lahan.tanaman_sekarang || 'Belum ditanami'}</span></span>
                </div>
              </div>
               <div className="mt-4 pt-4 border-t border-slate-800">
                  <p className="text-xs text-slate-500">Status Lahan</p>
                  <p className="font-semibold text-emerald-400">{lahan.status || 'Tersedia'}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
