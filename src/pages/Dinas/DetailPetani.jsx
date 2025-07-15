import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import DinasSidebar from '../../components/dinas/DinasSidebar';
import DinasHeader from '../../components/dinas/DinasHeader';
import DinasFooter from '../../components/dinas/Footer';
import { ChevronLeft, User, Map, Shield } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const baseClasses = "px-2.5 py-1 text-xs font-semibold rounded-full";
  let specificClasses = "bg-yellow-100 text-yellow-800"; // Diajukan

  if (status === 'Disetujui') {
    specificClasses = "bg-green-100 text-green-800";
  } else if (status === 'Ditolak') {
    specificClasses = "bg-red-100 text-red-800";
  }
  
  return <span className={`${baseClasses} ${specificClasses}`}>{status}</span>;
};

export default function DetailPetaniDinas() {
  const { petaniId } = useParams();
  const [petani, setPetani] = useState(null);
  const [lahanList, setLahanList] = useState([]);
  const [bantuanList, setBantuanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [petaniRes, lahanRes, bantuanRes] = await Promise.all([
          supabase.from('users').select('*').eq('id', petaniId).single(),
          supabase.from('lahan').select('*').eq('petani_id', petaniId),
          supabase.from('pengajuan_bantuan').select('*').eq('petani_id', petaniId).order('created_at', { ascending: false })
        ]);

        if (petaniRes.error) throw petaniRes.error;
        if (lahanRes.error) throw lahanRes.error;
        if (bantuanRes.error) throw bantuanRes.error;

        setPetani(petaniRes.data);
        setLahanList(lahanRes.data || []);
        setBantuanList(bantuanRes.data || []);
      } catch (err) {
        setError(`Gagal memuat detail petani: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [petaniId]);

  if (loading) return <div className="flex min-h-screen bg-gray-50 items-center justify-center">Memuat detail petani...</div>;
  if (error) return <div className="flex min-h-screen bg-gray-50 items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DinasSidebar />
      <div className="flex-1 flex flex-col">
        <DinasHeader />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div>
              <Link to="/dinas/data-petani" className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-800 font-semibold mb-4">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Kembali ke Daftar Petani
              </Link>
              <h1 className="text-3xl font-bold text-gray-800">Detail Petani</h1>
            </div>

            {/* Profil Petani */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <User className="w-8 h-8 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-800">Profil: {petani.nama_lengkap}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p><span className="font-semibold text-gray-600">Email:</span> {petani.email}</p>
                <p><span className="font-semibold text-gray-600">No. WhatsApp:</span> {petani.no_wa || '-'}</p>
                <p><span className="font-semibold text-gray-600">Tanggal Bergabung:</span> {new Date(petani.created_at).toLocaleDateString('id-ID')}</p>
              </div>
            </div>

            {/* Daftar Lahan */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <Map className="w-8 h-8 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-800">Daftar Lahan ({lahanList.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Nama Lahan</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Luas (Ha)</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Lokasi</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Tanaman Saat Ini</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {lahanList.length > 0 ? lahanList.map(lahan => (
                      <tr key={lahan.id}>
                        <td className="px-4 py-2 font-semibold">{lahan.nama_lahan}</td>
                        <td className="px-4 py-2">{lahan.luas_lahan_hektar}</td>
                        <td className="px-4 py-2">{lahan.lokasi}</td>
                        <td className="px-4 py-2">{lahan.tanaman_sekarang || '-'}</td>
                      </tr>
                    )) : <tr><td colSpan="4" className="text-center py-4 text-gray-500">Petani ini belum mendaftarkan lahan.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Riwayat Bantuan */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <Shield className="w-8 h-8 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-800">Riwayat Pengajuan Bantuan ({bantuanList.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Jenis Bantuan</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Tanggal Pengajuan</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {bantuanList.length > 0 ? bantuanList.map(bantuan => (
                      <tr key={bantuan.id}>
                        <td className="px-4 py-2 font-semibold">{bantuan.jenis_bantuan}</td>
                        <td className="px-4 py-2">{new Date(bantuan.created_at).toLocaleDateString('id-ID')}</td>
                        <td className="px-4 py-2"><StatusBadge status={bantuan.status} /></td>
                      </tr>
                    )) : <tr><td colSpan="3" className="text-center py-4 text-gray-500">Tidak ada riwayat pengajuan bantuan.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
        <DinasFooter />
      </div>
    </div>
  );
}
