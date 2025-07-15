import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import DinasSidebar from '../../components/dinas/DinasSidebar';
import DinasHeader from '../../components/dinas/DinasHeader';
import DinasFooter from '../../components/dinas/Footer';
import { ChevronLeft, Check, X, MessageSquare } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const baseClasses = "px-2.5 py-1 text-xs font-semibold rounded-full inline-block";
  let specificClasses = "bg-yellow-100 text-yellow-800";

  if (status === 'Disetujui') {
    specificClasses = "bg-green-100 text-green-800";
  } else if (status === 'Ditolak') {
    specificClasses = "bg-red-100 text-red-800";
  }
  
  return <span className={`${baseClasses} ${specificClasses}`}>{status}</span>;
};

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
          .select('*, users(nama_lengkap, email, no_wa)')
          .eq('id', id)
          .single();
        if (fetchError) throw fetchError;
        setPengajuan(data);
        if (data && data.catatan) {
          setCatatan(data.catatan);
        }
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
        .update({ status: newStatus, catatan: catatan })
        .eq('id', id);
        
      if (updateError) throw updateError;

      const noWaPetani = pengajuan?.users?.no_wa;
      if (noWaPetani) {
        const statusText = newStatus === 'Disetujui' ? 'DISETUJUI' : 'DITOLAK';
        let pesan = `Yth. Bpk/Ibu ${pengajuan.users.nama_lengkap},\n\n`;
        pesan += `Pengajuan bantuan *${pengajuan.jenis_bantuan}* Anda telah kami verifikasi dengan status: *${statusText}*.\n\n`;
        if (catatan) {
          pesan += `Catatan dari kami:\n_"${catatan}"_\n\n`;
        }
        pesan += `Terima kasih atas perhatiannya.\n\n- Dinas Pertanian`;

  
        let formattedNoWa = noWaPetani.replace(/\D/g, '');
        if (formattedNoWa.startsWith('0')) {
          formattedNoWa = '62' + formattedNoWa.substring(1);
        }
        
        const waUrl = `https://wa.me/${formattedNoWa}?text=${encodeURIComponent(pesan)}`;
        
        window.open(waUrl, '_blank');
      }

      alert(`Pengajuan telah ${newStatus.toLowerCase()}. Notifikasi WhatsApp sedang disiapkan.`);
      navigate('/dinas/bantuan');

    } catch (err) {
      setError(`Gagal memperbarui status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex min-h-screen bg-gray-50 items-center justify-center">Memuat detail...</div>;
  if (error) return <div className="flex min-h-screen bg-gray-50 items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DinasSidebar />
      <div className="flex-1 flex flex-col">
        <DinasHeader />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <Link to="/dinas/bantuan" className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-800 font-semibold mb-4">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Kembali ke Daftar Pengajuan
              </Link>
              <h1 className="text-3xl font-bold text-gray-800">Detail Pengajuan Bantuan</h1>
              <p className="text-gray-500">Tinjau dan verifikasi detail pengajuan dari petani.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 lg:p-8 space-y-6">
                {/* Header Detail */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{pengajuan.jenis_bantuan}</h2>
                  <p className="text-gray-500 mt-1">
                    Diajukan oleh: <span className="font-semibold text-gray-700">{pengajuan.users.nama_lengkap}</span> ({pengajuan.users.email})
                  </p>
                   {pengajuan.users?.no_wa && (
                    <p className="text-sm text-gray-500 mt-1">
                      No. WhatsApp: <span className="font-semibold text-gray-700">{pengajuan.users.no_wa}</span>
                    </p>
                  )}
                </div>

                <div className="border-t border-gray-200"></div>

  
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Status Saat Ini</h3>
                    <StatusBadge status={pengajuan.status} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Deskripsi Kebutuhan</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{pengajuan.deskripsi}</p>
                  </div>
                  {pengajuan.jumlah && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Jumlah Diajukan</h3>
                      <p className="text-gray-600">{pengajuan.jumlah} {pengajuan.satuan}</p>
                    </div>
                  )}
                </div>

    
                {pengajuan.foto_url && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-700 mb-2">Foto Pendukung</h3>
                    <img src={pengajuan.foto_url} alt="Foto Pendukung" className="max-w-md w-full h-auto object-cover rounded-lg border border-gray-200" />
                  </div>
                )}
              </div>


              {pengajuan.status === 'Diajukan' && (
                <div className="bg-gray-50 p-6 lg:p-8 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3">Tindakan Verifikasi</h3>
                  <div className="space-y-4">
                    <textarea 
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      placeholder="Tambahkan catatan untuk petani (opsional)..."
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition"
                      rows="3"
                    />
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button onClick={() => handleUpdateStatus('Disetujui')} disabled={loading || !pengajuan.users?.no_wa} className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
                        <MessageSquare className="w-5 h-5 mr-2" /> Setujui & Kirim WA
                      </button>
                      <button onClick={() => handleUpdateStatus('Ditolak')} disabled={loading || !pengajuan.users?.no_wa} className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
                        <X className="w-5 h-5 mr-2" /> Tolak & Kirim WA
                      </button>
                    </div>
                     { !pengajuan.users?.no_wa && (
                        <p className="text-xs text-center text-red-600">Nomor WhatsApp petani tidak ditemukan. Tombol dinonaktifkan.</p>
                    )}
                  </div>
                </div>
              )}


              {pengajuan.status !== 'Diajukan' && pengajuan.catatan && (
                <div className="bg-gray-50 p-6 lg:p-8 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-2">Catatan dari Dinas</h3>
                  <p className="text-gray-600">{pengajuan.catatan}</p>
                </div>
              )}
            </div>
          </div>
        </main>
        <DinasFooter />
      </div>
    </div>
  );
}
