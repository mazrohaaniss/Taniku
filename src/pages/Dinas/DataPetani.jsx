import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import DinasSidebar from '../../components/dinas/DinasSidebar';
import DinasHeader from '../../components/dinas/DinasHeader';
import DinasFooter from '../../components/dinas/Footer';
import { Users, Search, ChevronRight } from 'lucide-react';

export default function DataPetani() {
  const [petaniList, setPetaniList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPetani = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'petani')
          .order('nama_lengkap', { ascending: true });

        if (fetchError) throw fetchError;
        setPetaniList(data || []);
        setFilteredList(data || []);
      } catch (err) {
        setError(`Gagal memuat data petani: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPetani();
  }, []);

  useEffect(() => {
    const results = petaniList.filter(petani =>
      petani.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      petani.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredList(results);
  }, [searchTerm, petaniList]);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DinasSidebar />
      <div className="flex-1 flex flex-col">
        <DinasHeader />
        <main className="flex-1 p-6 lg:p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Data Petani Terdaftar</h1>
              <p className="text-gray-500">Lihat dan kelola data semua petani yang terdaftar di sistem.</p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama atau email petani..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. WhatsApp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Bergabung</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-10 text-gray-500">Memuat data...</td></tr>
                  ) : error ? (
                    <tr><td colSpan="5" className="text-center py-10 text-red-500">{error}</td></tr>
                  ) : filteredList.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-10 text-gray-500">Tidak ada petani ditemukan.</td></tr>
                  ) : (
                    filteredList.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{item.nama_lengkap}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.no_wa || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatDate(item.created_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Link to={`/dinas/data-petani/${item.id}`} className="inline-flex items-center text-emerald-600 hover:text-emerald-800 font-semibold text-sm">
                            Detail <ChevronRight className="w-4 h-4 ml-1" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
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
