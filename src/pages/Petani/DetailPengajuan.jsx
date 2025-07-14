import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Edit, Trash2, X, AlertTriangle, CheckCircle, Package, Tractor, BookOpen } from 'lucide-react';

// Komponen untuk Status Badge
const StatusBadge = ({ status }) => {
  const baseClasses = "px-2.5 py-1 text-xs font-semibold rounded-full";
  let specificClasses = "bg-yellow-900/50 text-yellow-300"; // Default: Diajukan

  if (status === 'Disetujui') {
    specificClasses = "bg-green-900/50 text-green-300";
  } else if (status === 'Ditolak') {
    specificClasses = "bg-red-900/50 text-red-300";
  }
  
  return <span className={`${baseClasses} ${specificClasses}`}>{status}</span>;
};

const getIconForBantuan = (jenis) => {
    const iconProps = { className: "w-8 h-8 text-emerald-400" };
    switch(jenis) {
        case 'Pupuk': return <Package {...iconProps} />;
        case 'Bibit': return <CheckCircle {...iconProps} />;
        case 'Alat': return <Tractor {...iconProps} />;
        case 'Pelatihan': return <BookOpen {...iconProps} />;
        default: return null;
    }
}

export default function DetailPengajuan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pengajuan, setPengajuan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchPengajuan = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('pengajuan_bantuan')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error("Pengajuan tidak ditemukan.");
        
        setPengajuan(data);
      } catch (error) {
        setError(`Gagal memuat detail pengajuan: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPengajuan();
  }, [id]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from('pengajuan_bantuan')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      alert('Pengajuan berhasil dihapus.');
      navigate('/petani/bantuan');
    } catch (error) {
      setError(`Gagal menghapus pengajuan: ${error.message}`);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };


  if (loading) return <div className="text-center py-10 text-slate-400">Memuat detail pengajuan...</div>;
  if (error) return <div className="text-center py-10 bg-red-900/50 text-red-400 p-4 rounded-lg">{error}</div>;
  if (!pengajuan) return <div className="text-center py-10 text-slate-400">Pengajuan tidak ditemukan.</div>;

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald-600">Detail Pengajuan</h1>
          <p className="text-slate-400">#{pengajuan.id}</p>
        </div>
        <Link to="/petani/bantuan" className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Kembali ke Riwayat Bantuan
        </Link>
      </div>

      {/* Konten Detail */}
      <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start gap-8">
            <div className="p-4 bg-slate-800 rounded-lg">
                {getIconForBantuan(pengajuan.jenis_bantuan)}
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-400 text-sm">Jenis Bantuan</p>
                        <h2 className="text-2xl font-bold text-white mb-2">{pengajuan.jenis_bantuan}</h2>
                    </div>
                    <StatusBadge status={pengajuan.status} />
                </div>
                
                <p className="text-slate-400 text-sm mt-4">Deskripsi Kebutuhan:</p>
                <p className="text-slate-200 whitespace-pre-wrap">{pengajuan.deskripsi}</p>

                {pengajuan.jumlah && (
                    <p className="text-slate-400 text-sm mt-4">Jumlah Diajukan: <span className="font-semibold text-slate-200">{pengajuan.jumlah} {pengajuan.satuan}</span></p>
                )}
                
                <p className="text-slate-400 text-sm mt-4">Tanggal Pengajuan:</p>
                <p className="text-slate-200">{formatDate(pengajuan.created_at)}</p>

            </div>
        </div>

        {pengajuan.foto_url && (
            <div className="mt-6 pt-6 border-t border-slate-800">
                <p className="text-slate-400 text-sm mb-2">Foto Pendukung:</p>
                <img src={pengajuan.foto_url} alt="Foto Pendukung" className="max-w-sm w-full h-auto object-cover rounded-lg border border-slate-700" />
            </div>
        )}

        {pengajuan.catatan && (
            <div className="mt-6 pt-6 border-t border-slate-800 bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm mb-2">Catatan dari Dinas:</p>
                <p className="text-slate-200 whitespace-pre-wrap">{pengajuan.catatan}</p>
            </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
             <button 
                onClick={() => setShowDeleteModal(true)} 
                disabled={pengajuan.status !== 'Diajukan'}
                className="inline-flex items-center px-4 py-2 bg-red-600/20 text-red-400 rounded-lg font-semibold text-sm hover:bg-red-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus Pengajuan
            </button>
        </div>
      </div>
      {showDeleteModal && <DeleteConfirmationModal onConfirm={handleDelete} onCancel={() => setShowDeleteModal(false)} loading={loading} />}
    </div>
  );
}


// Modal untuk Konfirmasi Hapus
function DeleteConfirmationModal({ onConfirm, onCancel, loading }) {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Hapus Pengajuan?</h2>
                <p className="text-slate-400 mb-6 text-sm">Aksi ini tidak dapat dibatalkan. Data pengajuan ini akan dihapus secara permanen.</p>
                <div className="flex gap-4">
                    <button onClick={onCancel} disabled={loading} className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg">Batal</button>
                    <button onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold disabled:opacity-50">{loading ? 'Menghapus...' : 'Ya, Hapus'}</button>
                </div>
            </div>
        </div>
    );
}
