import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import DinasSidebar from '../../components/dinas/DinasSidebar';
import DinasHeader from '../../components/dinas/DinasHeader';
import DinasFooter from '../../components/dinas/Footer';
import { Megaphone, Plus, Trash2 } from 'lucide-react';

// Pastikan menggunakan 'export default' di sini
export default function PengumumanDinas() {
  const [pengumumanList, setPengumumanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPengumuman = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('pengumuman').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setPengumumanList(data || []);
    } catch (err) {
      setError(`Gagal memuat pengumuman: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengumuman();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
      try {
        const { error } = await supabase.from('pengumuman').delete().eq('id', id);
        if (error) throw error;
        fetchPengumuman();
      } catch (err) {
        alert(`Gagal menghapus pengumuman: ${err.message}`);
      }
    }
  };
  
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DinasSidebar />
      <div className="flex-1 flex flex-col">
        <DinasHeader />
        <main className="flex-1 p-6 lg:p-8">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Pengumuman Dinas</h1>
                <p className="text-gray-500">Buat dan kelola pengumuman untuk semua petani.</p>
              </div>
              <Link to="/dinas/pengumuman/tambah" className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
                <Plus className="w-5 h-5 mr-2" /> Buat Pengumuman
              </Link>
            </div>
            <div className="space-y-4">
              {loading ? <p className="text-center py-10">Memuat...</p> : error ? <p className="text-center py-10 text-red-500">{error}</p> : pengumumanList.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">{item.judul}</h2>
                      <p className="text-sm text-gray-500">Dipublikasikan: {formatDate(item.created_at)}</p>
                    </div>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="mt-3 text-gray-600">{item.isi}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
        <DinasFooter />
      </div>
    </div>
  );
}
