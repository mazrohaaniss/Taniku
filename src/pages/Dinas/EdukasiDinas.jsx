import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import DinasSidebar from '../../components/dinas/DinasSidebar';
import DinasHeader from '../../components/dinas/DinasHeader';
import DinasFooter from '../../components/dinas/Footer';
import { BookOpen, Plus, Trash2, FileText, Video } from 'lucide-react';

export default function EdukasiDinas() {
  const [materiList, setMateriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMateri = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('materi_edukasi').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setMateriList(data || []);
    } catch (err) {
      setError(`Gagal memuat materi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMateri();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus materi ini?')) {
      try {
        const { error } = await supabase.from('materi_edukasi').delete().eq('id', id);
        if (error) throw error;
        fetchMateri(); // Refresh list
      } catch (err) {
        alert(`Gagal menghapus materi: ${err.message}`);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DinasSidebar />
      <div className="flex-1 flex flex-col">
        <DinasHeader />
        <main className="flex-1 p-6 lg:p-8">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Pusat Edukasi</h1>
                <p className="text-gray-500">Kelola artikel dan video edukasi untuk petani.</p>
              </div>
              <Link to="/dinas/edukasi/tambah" className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
                <Plus className="w-5 h-5 mr-2" /> Tambah Materi
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr><td colSpan="4" className="text-center py-10 text-gray-500">Memuat...</td></tr>
                  ) : error ? (
                    <tr><td colSpan="4" className="text-center py-10 text-red-500">{error}</td></tr>
                  ) : materiList.map(materi => (
                    <tr key={materi.id}>
                      <td className="px-6 py-4 font-semibold text-gray-800">{materi.judul}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${materi.tipe === 'Artikel' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                          {materi.tipe === 'Artikel' ? <FileText className="w-3 h-3 mr-1" /> : <Video className="w-3 h-3 mr-1" />}
                          {materi.tipe}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{materi.kategori}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDelete(materi.id)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <DinasFooter />
      </div>
    </div>
  );
}
