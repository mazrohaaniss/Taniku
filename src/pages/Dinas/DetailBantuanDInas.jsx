import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import DinasSidebar from '../../components/dinas/DinasSidebar';
import DinasHeader from '../../components/dinas/DinasHeader';
import DinasFooter from '../../components/dinas/Footer';
import { ChevronLeft, Check, X, Send } from 'lucide-react';

export default function DetailBantuanDinas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pengajuan, setPengajuan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [catatan, setCatatan] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('pengajuan_bantuan')
          .select('*, users(nama_lengkap, email)')
          .eq('id', id)
          .single();
        if (fetchError) throw fetchError;
        setPengajuan(data);
      } catch (err) {
        setError(`Gagal memuat data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('pengajuan_bantuan')
        .update({ status: newStatus, catatan_dinas: catatan })
        .eq('id', id);
      if (updateError) throw updateError;
      alert(`Pengajuan telah ${newStatus.toLowerCase()}.`);
      navigate('/dinas/bantuan');
    } catch (err) {
      setError(`Gagal memperbarui status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Memuat detail...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DinasSidebar />
      <div className="flex-1 flex flex-col">
        <DinasHeader />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <Link to="/dinas/bantuan" className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-800 font-semibold mb-6">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Kembali ke Daftar Pengajuan
            </Link>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{pengajuan.jenis_bantuan}</h1>
                <p className="text-gray-500">Diajukan oleh: <span className="font-semibold">{pengajuan.users.nama_lengkap}</span> ({pengajuan.users.email})</p>
              </div>
              
              <div className="border-t border-b border-gray-200 py-4">
                <h3 className="font-semibold text-gray-800 mb-2">Deskripsi Kebutuhan</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{pengajuan.deskripsi}</p>
              </div>

              {pengajuan.jumlah && (
                <p>Jumlah: <span className="font-bold">{pengajuan.jumlah} {pengajuan.satuan}</span></p>
              )}

              {pengajuan.foto_url && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Foto Pendukung</h3>
                  <img src={pengajuan.foto_url} alt="Foto Pendukung" className="max-w-md w-full h-auto object-cover rounded-lg border border-gray-200" />
                </div>
              )}

              {pengajuan.status === 'Diajukan' && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-2">Tindakan Verifikasi</h3>
                  <textarea 
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Tambahkan catatan untuk petani (opsional)..."
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-emerald-500 focus:border-emerald-500"
                    rows="3"
                  />
                  <div className="flex gap-4">
                    <button onClick={() => handleUpdateStatus('Disetujui')} disabled={loading} className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50">
                      <Check className="w-5 h-5 mr-2" /> Setujui
                    </button>
                    <button onClick={() => handleUpdateStatus('Ditolak')} disabled={loading} className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50">
                      <X className="w-5 h-5 mr-2" /> Tolak
                    </button>
                  </div>
                </div>
              )}

              {pengajuan.status !== 'Diajukan' && (
                 <div className="pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-2">Status Akhir</h3>
                    <p className={`font-bold text-lg ${pengajuan.status === 'Disetujui' ? 'text-green-600' : 'text-red-600'}`}>{pengajuan.status}</p>
                    {pengajuan.catatan_dinas && <p className="text-gray-600 mt-1">Catatan: {pengajuan.catatan_dinas}</p>}
                 </div>
              )}
            </div>
          </div>
          <DinasFooter />
        </main>
      </div>
    </div>
  );
}
