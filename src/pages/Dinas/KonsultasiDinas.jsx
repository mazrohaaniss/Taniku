import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import DinasSidebar from '../../components/dinas/DinasSidebar';
import DinasHeader from '../../components/dinas/DinasHeader';
import DinasFooter from '../../components/dinas/Footer';
import { MessageSquare, Search, ChevronRight } from 'lucide-react';

export default function KonsultasiDinas() {
  const [topikList, setTopikList] = useState([]);
  const [filteredTopik, setFilteredTopik] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTopik = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('topik_diskusi')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setTopikList(data || []);
        setFilteredTopik(data || []);
      } catch (err) {
        setError(`Gagal memuat data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchTopik();
  }, []);

  useEffect(() => {
    const results = topikList.filter(topik =>
      topik.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topik.isi.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTopik(results);
  }, [searchTerm, topikList]);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DinasSidebar />
      <div className="flex-1 flex flex-col">
        <DinasHeader />
        <main className="flex-1 p-6 lg:p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Forum Konsultasi</h1>
              <p className="text-gray-500">Lihat dan jawab pertanyaan dari para petani di wilayah Anda.</p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari judul atau isi pertanyaan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-4">
              {loading ? (
                <p className="text-center py-10 text-gray-500">Memuat data forum...</p>
              ) : error ? (
                <p className="text-center py-10 text-red-500">{error}</p>
              ) : filteredTopik.length === 0 ? (
                <p className="text-center py-10 text-gray-500">Tidak ada topik diskusi ditemukan.</p>
              ) : (
                filteredTopik.map(topik => (
                  <Link to={`/dinas/konsultasi/${topik.id}`} key={topik.id} className="block bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">{topik.judul}</h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Ditanyakan oleh <span className="font-semibold">{topik.penanya_nama || 'Petani'}</span> pada {formatDate(topik.created_at)}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                    <p className="text-gray-600 mt-3 line-clamp-2">{topik.isi}</p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </main>
        <DinasFooter />
      </div>
    </div>
  );
}
