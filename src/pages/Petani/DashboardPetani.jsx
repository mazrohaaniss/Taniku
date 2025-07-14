import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import PetaniNavbar from '../../components/petani/PetaniNavbar';
import Footer from '../../components/petani/Footer';
import { Plus, MapPin, Calendar, Wheat, Edit2, Trash2, TrendingUp, X, Wind, Sun, Ruler } from 'lucide-react';

// --- Komponen-komponen Kecil untuk Membangun Halaman ---

// Kartu Statistik
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

// Kartu untuk setiap data tanaman
const TanamanCard = ({ item, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Baru Tanam': return 'bg-blue-900/50 text-blue-300 border-blue-700/50';
      case 'Tumbuh': return 'bg-green-900/50 text-green-300 border-green-700/50';
      case 'Berbunga': return 'bg-yellow-900/50 text-yellow-300 border-yellow-700/50';
      case 'Siap Panen': return 'bg-purple-900/50 text-purple-300 border-purple-700/50';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800 group relative">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{item.jenisTanaman}</h3>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
          {item.status}
        </span>
      </div>
      <div className="space-y-2 text-sm text-slate-400 mb-4">
        <p><MapPin className="inline w-4 h-4 mr-2" />Lokasi: <span className="font-medium text-slate-200">{item.lokasi}</span></p>
        <p><Ruler className="inline w-4 h-4 mr-2" />Luas: <span className="font-medium text-slate-200">{item.luasLahan} Ha</span></p>
        <p><Calendar className="inline w-4 h-4 mr-2" />Tanam: <span className="font-medium text-slate-200">{new Date(item.tanggalTanam).toLocaleDateString('id-ID')}</span></p>
        <p><Calendar className="inline w-4 h-4 mr-2 text-emerald-400" />Panen: <span className="font-medium text-emerald-300">{new Date(item.estimasiPanen).toLocaleDateString('id-ID')}</span></p>
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
  const [user, setUser] = useState({ name: 'Petani Hebat' });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
    jenisTanaman: '', luasLahan: '', estimasiPanen: '', tanggalTanam: '', lokasi: ''
  });

  const [tanamanData, setTanamanData] = useState([
    { id: 1, jenisTanaman: 'Padi Pandan Wangi', luasLahan: 2.5, estimasiPanen: '2024-12-15', tanggalTanam: '2024-09-01', lokasi: 'Sawah Timur', status: 'Tumbuh' },
    { id: 2, jenisTanaman: 'Jagung Manis', luasLahan: 1.2, estimasiPanen: '2024-11-20', tanggalTanam: '2024-08-15', lokasi: 'Ladang Utara', status: 'Berbunga' }
  ]);

  const totalLuas = tanamanData.reduce((sum, item) => sum + item.luasLahan, 0);
  const totalTanaman = tanamanData.length;

  const openForm = (item = null) => {
    if (item) {
      setFormData({
        jenisTanaman: item.jenisTanaman,
        luasLahan: item.luasLahan.toString(),
        estimasiPanen: item.estimasiPanen,
        tanggalTanam: item.tanggalTanam,
        lokasi: item.lokasi
      });
      setEditingItem(item);
    } else {
      setFormData({ jenisTanaman: '', luasLahan: '', estimasiPanen: '', tanggalTanam: '', lokasi: '' });
      setEditingItem(null);
    }
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logika submit Anda akan ada di sini
    console.log("Form submitted", formData);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if(window.confirm('Anda yakin ingin menghapus data tanaman ini?')) {
        setTanamanData(prev => prev.filter(item => item.id !== id));
    }
  };


  if (loading) {
    return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">Memuat data...</div>;
  }

  return (
    <div className="bg-slate-900 min-h-screen">
      <PetaniNavbar />
      <main className="container mx-auto px-4 py-12 pt-28 md:pt-32">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Selamat Datang, {user.name}!</h1>
          <p className="text-slate-400 mt-2 text-lg">Berikut adalah ringkasan aktivitas pertanian Anda.</p>
        </div>

        {/* Kartu Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<Wheat className="w-6 h-6 text-emerald-400"/>} title="Total Tanaman" value={totalTanaman} unit="Plot" color="emerald" />
          <StatCard icon={<MapPin className="w-6 h-6 text-blue-400"/>} title="Total Luas Lahan" value={totalLuas.toFixed(1)} unit="Ha" color="blue" />
          <StatCard icon={<Sun className="w-6 h-6 text-purple-400"/>} title="Cuaca Hari Ini" value="Cerah" unit="29°C" color="purple" />
          <StatCard icon={<TrendingUp className="w-6 h-6 text-emerald-400"/>} title="Produktivitas" value="85" unit="%" color="emerald" />
        </div>

        {/* Daftar Tanaman */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Tanaman Anda Saat Ini</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tanamanData.map(item => (
              <TanamanCard key={item.id} item={item} onEdit={openForm} onDelete={handleDelete} />
            ))}
            <button onClick={() => openForm()} className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-700 text-slate-500 hover:bg-slate-800 hover:border-emerald-500 hover:text-emerald-400 transition-all">
              <Plus className="w-10 h-10 mb-2" />
              <span className="font-semibold">Tambah Plot Tanaman</span>
            </button>
          </div>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">{editingItem ? 'Edit Tanaman' : 'Tambah Tanaman Baru'}</h2>
                  <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                {/* Isi form Anda di sini, dengan styling yang sesuai */}
                <div className="space-y-4">
                    {/* Contoh 1 input */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Jenis Tanaman</label>
                        <input type="text" value={formData.jenisTanaman} onChange={e => setFormData({...formData, jenisTanaman: e.target.value})} className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg" required/>
                    </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg">Batal</button>
                  <button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold">{editingItem ? 'Update' : 'Simpan'}</button>
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
