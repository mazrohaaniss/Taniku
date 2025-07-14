import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import DinasSidebar from '../../components/dinas/DinasSidebar';
import DinasHeader from '../../components/dinas/DinasHeader';
import DinasFooter from '../../components/dinas/Footer';
import { ShieldCheck, Filter, ChevronRight } from 'lucide-react';

// Komponen untuk Status Badge
const StatusBadge = ({ status }) => {
  const baseClasses = "px-2.5 py-1 text-xs font-semibold rounded-full";
  let specificClasses = "bg-yellow-100 text-yellow-800"; // Default: Diajukan

  if (status === 'Disetujui') {
    specificClasses = "bg-green-100 text-green-800";
  } else if (status === 'Ditolak') {
    specificClasses = "bg-red-100 text-red-800";
  }
  
  return <span className={`${baseClasses} ${specificClasses}`}>{status}</span>;
};

export default function BantuanDinas() {
  const [pengajuanList, setPengajuanList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Semua');

  const filters = ['Semua', 'Diajukan', 'Disetujui', 'Ditolak'];

  useEffect(() => {
    const fetchPengajuan = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('pengajuan_bantuan')
          .select('id, jenis_bantuan, status, created_at, users(nama_lengkap)')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setPengajuanList(data || []);
        setFilteredList(data || []);
      } catch (err) {
        setError(`Gagal memuat data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPengajuan();
  }, []);

  useEffect(() => {
    if (activeFilter === 'Semua') {
      setFilteredList(pengajuanList);
    } else {
      setFilteredList(pengajuanList.filter(p => p.status === activeFilter));
    }
  }, [activeFilter, pengajuanList]);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DinasSidebar />
      <div className="flex-1 flex flex-col">
        <DinasHeader />
        <main className="flex-1 p-6 lg:p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Manajemen Bantuan</h1>
              <p className="text-gray-500">Verifikasi dan kelola pengajuan bantuan dari petani.</p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
              <Filter className="w-5 h-5 text-gray-500" />
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeFilter === filter ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Tabel Pengajuan */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Petani</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Bantuan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Pengajuan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-10 text-gray-500">Memuat data...</td></tr>
                  ) : filteredList.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-10 text-gray-500">Tidak ada pengajuan ditemukan.</td></tr>
                  ) : (
                    filteredList.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{item.users.nama_lengkap}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.jenis_bantuan}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatDate(item.created_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Link to={`/dinas/bantuan/${item.id}`} className="inline-flex items-center text-emerald-600 hover:text-emerald-800 font-semibold text-sm">
                            Tinjau <ChevronRight className="w-4 h-4 ml-1" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <DinasFooter />
        </main>
      </div>
    </div>
  );
}
