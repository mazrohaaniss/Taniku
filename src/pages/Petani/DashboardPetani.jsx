import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import PetaniNavbar from '../../components/petani/PetaniNavbar';
import Footer from '../../components/petani/Footer';
import { Plus, MapPin, Calendar, Wheat, Edit2, Trash2, TrendingUp, Sun, Ruler, ArrowRight } from 'lucide-react';

// Komponen StatCard (tidak diubah, sudah bagus)
const StatCard = ({ icon, title, value, unit, color }) => {
  const colors = {
    emerald: 'from-emerald-500/10 to-slate-900/0',
    blue: 'from-blue-500/10 to-slate-900/0',
    purple: 'from-purple-500/10 to-slate-900/0',
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} p-6 rounded-2xl border border-slate-800`}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-slate-800 rounded-lg">{icon}</div>
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-white">
            {value} <span className="text-base font-medium text-slate-400">{unit}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Komponen LahanCard dengan desain yang disesuaikan
const LahanCard = ({ item, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    const lowerStatus = status?.toLowerCase() || 'tersedia';
    switch (lowerStatus) {
      case 'ditanami':
      case 'aktif':
        return 'bg-green-900/50 text-green-300 border-green-700/50';
      case 'panen':
        return 'bg-purple-900/50 text-purple-300 border-purple-700/50';
      default: // Tersedia, Kosong, dll.
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    // Menggunakan gaya dari halaman Lahan yang sudah disetujui
    <Link 
      to={`/petani/lahan/${item.id}`}
      className="group bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{item.nama_lahan}</h3>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
          {item.status || 'Tersedia'}
        </span>
      </div>
      <div className="space-y-2 text-sm text-slate-400 mb-6">
        <p><Ruler className="inline w-4 h-4 mr-2 text-slate-500" />Luas: <span className="font-medium text-slate-200">{item.luas_lahan_hektar} Ha</span></p>
        <p><MapPin className="inline w-4 h-4 mr-2 text-slate-500" />Lokasi: <span className="font-medium text-slate-200">{item.lokasi}</span></p>
        <p><Wheat className="inline w-4 h-4 mr-2 text-slate-500" />Tanaman: <span className="font-medium text-slate-200">{item.tanaman_sekarang || 'Kosong'}</span></p>
      </div>
       <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-end">
          <div className="inline-flex items-center text-emerald-400 font-semibold">
              Lihat Detail <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
      </div>
    </Link>
  );
};

// Komponen Utama Halaman Dashboard
export default function DashboardPetani() {
  const [user, setUser] = useState(null);
  const [lahanData, setLahanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fungsi untuk mengambil semua data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Pengguna tidak ditemukan");
      setUser(user);

      const { data: lahan, error: lahanError } = await supabase
        .from('lahan')
        .select('*')
        .eq('petani_id', user.id)
        .order('created_at', { ascending: false });

      if (lahanError) throw lahanError;
      setLahanData(lahan || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalLuas = lahanData.reduce((sum, item) => sum + Number(item.luas_lahan_hektar), 0);
  const totalLahan = lahanData.length;

  if (loading && lahanData.length === 0) {
    return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">Memuat data...</div>;
  }

  return (
    <div className="bg-slate-900 min-h-screen">
      <PetaniNavbar />
      <main className="container mx-auto px-4 py-12 pt-28 md:pt-32">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Selamat Datang, {user?.user_metadata.nama_lengkap || 'Petani'}!</h1>
          <p className="text-slate-400 mt-2 text-lg">Berikut adalah ringkasan lahan pertanian Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<MapPin className="w-6 h-6 text-emerald-400"/>} title="Total Lahan" value={totalLahan} unit="Plot" color="emerald" />
          <StatCard icon={<Ruler className="w-6 h-6 text-blue-400"/>} title="Total Luas" value={totalLuas.toFixed(1)} unit="Ha" color="blue" />
          <StatCard icon={<Sun className="w-6 h-6 text-purple-400"/>} title="Cuaca Hari Ini" value="Cerah" unit="29°C" color="purple" />
          <StatCard icon={<TrendingUp className="w-6 h-6 text-emerald-400"/>} title="Produktivitas" value="85" unit="%" color="emerald" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Lahan Anda Saat Ini</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lahanData.map(item => (
              // Menggunakan LahanCard yang sudah didesain ulang
              <LahanCard key={item.id} item={item} />
            ))}
            <button 
              onClick={() => navigate('/petani/tambahlahan')} 
              className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-700 text-slate-500 hover:bg-slate-800 hover:border-emerald-500 hover:text-emerald-400 transition-all"
            >
              <Plus className="w-10 h-10 mb-2" />
              <span className="font-semibold">Tambah Lahan</span>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
