import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams, useNavigate } from 'react-router-dom';

export default function DetailPengajuan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pengajuan, setPengajuan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

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
        setPengajuan(data);
        setEditData(data);
      } catch (error) {
        setError(`Gagal memuat detail pengajuan: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPengajuan();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('pengajuan_bantuan')
        .update({
          deskripsi: editData.deskripsi,
          jumlah: editData.jumlah ? parseFloat(editData.jumlah) : null,
        })
        .eq('id', id);

      if (error) throw error;

      setPengajuan((prev) => ({ ...prev, deskripsi: editData.deskripsi, jumlah: editData.jumlah }));
      setIsEditing(false);
      alert('Pengajuan berhasil diperbarui!');
    } catch (error) {
      setError(`Gagal memperbarui pengajuan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Yakin ingin menghapus pengajuan ini?')) {
      try {
        const { error } = await supabase
          .from('pengajuan_bantuan')
          .delete()
          .eq('id', id);

        if (error) throw error;

        navigate('/petani/bantuan');
        alert('Pengajuan berhasil dihapus!');
      } catch (error) {
        setError(`Gagal menghapus pengajuan: ${error.message}`);
      }
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-600">Memuat detail pengajuan...</div>;
  if (error) return <div className="text-center py-10 bg-red-100 text-red-600">{error}</div>;
  if (!pengajuan) return <div className="text-center py-10 text-gray-600">Pengajuan tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold text-emerald-500 mb-6">Detail Pengajuan</h1>
      <div className="max-w-md mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
        {isEditing ? (
          <>
            <textarea
              value={editData.deskripsi}
              onChange={(e) => setEditData((prev) => ({ ...prev, deskripsi: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            {(pengajuan.jenis_bantuan === 'Pupuk' || pengajuan.jenis_bantuan === 'Bibit') && (
              <input
                type="number"
                value={editData.jumlah}
                onChange={(e) => setEditData((prev) => ({ ...prev, jumlah: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
            )}
            <button onClick={handleSave} className="w-full bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700">
              Simpan
            </button>
            <button onClick={() => setIsEditing(false)} className="w-full mt-2 bg-gray-300 text-gray-900 p-2 rounded hover:bg-gray-400">
              Batal
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-900 font-medium">Jenis Bantuan: {pengajuan.jenis_bantuan}</p>
            <p className="text-gray-600 mt-2">Deskripsi: {pengajuan.deskripsi}</p>
            {pengajuan.jumlah && <p className="text-gray-600 mt-2">Jumlah: {pengajuan.jumlah} {pengajuan.satuan}</p>}
            {pengajuan.foto_url && <img src={pengajuan.foto_url} alt="Foto Bukti" className="mt-4 w-full h-48 object-cover rounded" />}
            <p className="text-gray-600 mt-2">Status: <span className={pengajuan.status === 'Diajukan' ? 'text-yellow-600' : pengajuan.status === 'Disetujui' ? 'text-green-600' : 'text-red-600'}>{pengajuan.status}</span></p>
            <p className="text-gray-500 mt-2">Diajukan: {new Date(pengajuan.created_at).toLocaleDateString('id-ID')}</p>
            {pengajuan.catatan && <p className="text-gray-600 mt-2">Catatan Dinas: {pengajuan.catatan}</p>}
            <div className="mt-4 space-x-2">
              <button onClick={handleEdit} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Edit</button>
              <button onClick={handleDelete} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Hapus</button>
            </div>
          </>
        )}
        <button
          onClick={() => navigate('/petani/bantuan')}
          className="mt-4 w-full bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}