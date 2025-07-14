import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import PetaniNavbar from '../../components/petani/PetaniNavbar';
import Footer from '../../components/petani/Footer';
import { Plus, MapPin, Calendar, Wheat, Edit2, Trash2, TrendingUp, X, Sun, Ruler, AlertTriangle, Loader } from 'lucide-react';

// --- Komponen-komponen Kecil untuk Halaman ---

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

const LahanCard = ({ item, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Ditanami': return 'bg-green-900/50 text-green-300 border-green-700/50';
      case 'Panen': return 'bg-purple-900/50 text-purple-300 border-purple-700/50';
      default: return 'bg-slate-700 text-slate-300 border-slate-600'; // Tersedia
    }
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800 group relative">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{item.nama_lahan}</h3>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
          {item.status}
        </span>
      </div>
      <div className="space-y-2 text-sm text-slate-400 mb-4">
        <p><MapPin className="inline w-4 h-4 mr-2" />Lokasi: <span className="font-medium text-slate-200">{item.lokasi}</span></p>
        <p><Ruler className="inline w-4 h-4 mr-2" />Luas: <span className="font-medium text-slate-200">{item.luas_lahan_hektar} Ha</span></p>
        <p><Wheat className="inline w-4 h-4 mr-2" />Tanaman: <span className="font-medium text-slate-200">{item.tanaman_sekarang || 'Kosong'}</span></p>
      </div>
      <div className="absolute top-4 right-16 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(item)} className="p-1.5 rounded-md bg-slate-700 hover:bg-emerald-600"><Edit2 className="w-4 h-4" /></button>
        <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-md bg-slate-700 hover:bg-red-600"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

// --- Komponen Utama Halaman Dashboard ---

export default function DashboardPetani() {
  const [user, setUser] = useState(null);
  const [lahanData, setLahanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    nama_lahan: '', luas_lahan_hektar: '', tanaman_sekarang: '', lokasi: '', status: 'Tersedia'
  });

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

  const openForm = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        nama_lahan: item.nama_lahan,
        luas_lahan_hektar: item.luas_lahan_hektar,
        tanaman_sekarang: item.tanaman_sekarang || '',
        lokasi: item.lokasi,
        status: item.status,
      });
    } else {
      setEditingItem(null);
      setFormData({
        nama_lahan: '', luas_lahan_hektar: '', tanaman_sekarang: '', lokasi: '', status: 'Tersedia'
      });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit = {
        ...formData,
        luas_lahan_hektar: parseFloat(formData.luas_lahan_hektar),
        petani_id: user.id
      };

      if (editingItem) {
        // Update data
        const { error: updateError } = await supabase
          .from('lahan')
          .update(dataToSubmit)
          .eq('id', editingItem.id);
        if (updateError) throw updateError;
      } else {
        // Insert data baru
        const { error: insertError } = await supabase
          .from('lahan')
          .insert(dataToSubmit);
        if (insertError) throw insertError;
      }
      setShowForm(false);
      fetchData(); // Ambil data terbaru setelah submit
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Anda yakin ingin menghapus data lahan ini? Semua aktivitas terkait juga akan terhapus.')) {
      setLoading(true);
      try {
        const { error } = await supabase.from('lahan').delete().eq('id', id);
        if (error) throw error;
        fetchData(); // Ambil data terbaru setelah hapus
      } catch (err) {
        alert(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

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
              <LahanCard key={item.id} item={item} onEdit={openForm} onDelete={handleDelete} />
            ))}
            <button onClick={() => openForm()} className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-700 text-slate-500 hover:bg-slate-800 hover:border-emerald-500 hover:text-emerald-400 transition-all">
              <Plus className="w-10 h-10 mb-2" />
              <span className="font-semibold">Tambah Lahan</span>
            </button>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">{editingItem ? 'Edit Lahan' : 'Tambah Lahan Baru'}</h2>
                  <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4">
                    <input name="nama_lahan" placeholder="Nama Lahan" value={formData.nama_lahan} onChange={(e) => setFormData({...formData, nama_lahan: e.target.value})} className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg" required/>
                    <input name="lokasi" placeholder="Lokasi (Contoh: Desa Sukamaju)" value={formData.lokasi} onChange={(e) => setFormData({...formData, lokasi: e.target.value})} className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg" required/>
                    <input name="luas_lahan_hektar" type="number" placeholder="Luas (Hektar)" value={formData.luas_lahan_hektar} onChange={(e) => setFormData({...formData, luas_lahan_hektar: e.target.value})} className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg" required/>
                    <input name="tanaman_sekarang" placeholder="Tanaman Saat Ini (Contoh: Padi)" value={formData.tanaman_sekarang} onChange={(e) => setFormData({...formData, tanaman_sekarang: e.target.value})} className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg"/>
                    <select name="status" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg">
                        <option>Tersedia</option>
                        <option>Ditanami</option>
                        <option>Panen</option>
                    </select>
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg">Batal</button>
                  <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold disabled:opacity-50">{loading ? 'Menyimpan...' : 'Simpan'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
