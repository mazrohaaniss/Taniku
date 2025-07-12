import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

export default function Bantuan() {
  const [pengajuanList, setPengajuanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  
  const fetchPengajuan = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Pengguna tidak terautentikasi.');

      const { data, error: fetchError } = await supabase
        .from('pengajuan_bantuan')
        .select('*')
        .eq('petani_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPengajuanList(data || []);
    } catch (error) {
      setError(`Gagal memuat data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengajuan(); // Ambil data awal saat komponen dimuat

    const channel = supabase
      .channel('pengajuan-bantuan-realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'pengajuan_bantuan' }, 
        (payload) => {
          console.log('Perubahan terdeteksi!', payload);
          // Panggil ulang fetchPengajuan agar data selalu terupdate
          fetchPengajuan(); 
          setNotification(`Data bantuan telah diperbarui!`);
          setTimeout(() => setNotification(null), 3000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus pengajuan ini?')) {
      try {
        const { error } = await supabase.from('pengajuan_bantuan').delete().eq('id', id);
        if (error) throw error;
        // Data akan otomatis terupdate oleh listener realtime
      } catch (error) {
        setError(`Gagal menghapus pengajuan: ${error.message}`);
      }
    }
  };

  if (loading) return <div className="text-center py-10">Memuat data pengajuan...</div>;
  if (error) return <div className="text-center py-10 bg-red-100 text-red-600">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-400">Riwayat Pengajuan Bantuan</h1>
        <Link to="/petani/bantuan/tambah" className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700">
          + Ajukan Bantuan Baru
        </Link>
      </div>
      {notification && <div className="bg-green-100 text-green-800 p-2 rounded mb-4 text-center">{notification}</div>}
      {pengajuanList.length === 0 ? (
        <p className="text-gray-600 text-center bg-gray-50 p-10 rounded-lg">Belum ada riwayat pengajuan bantuan.</p>
      ) : (
        <ul className="space-y-4">
          {pengajuanList.map((pengajuan) => (
            <li key={pengajuan.id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{new Date(pengajuan.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                <p className="font-bold text-lg text-gray-900">{pengajuan.jenis_bantuan}</p>
                <p className="text-gray-600 mt-1">{pengajuan.deskripsi}</p>
                <p className="text-sm mt-2 font-semibold">
                  Status: 
                  <span className={
                    pengajuan.status === 'Disetujui' ? 'text-green-600' :
                    pengajuan.status === 'Ditolak' ? 'text-red-600' : 'text-yellow-600'
                  }> {pengajuan.status}</span>
                </p>
              </div>
              <div>
                <button onClick={() => handleDelete(pengajuan.id)} className="text-red-500 hover:text-red-700 font-semibold">Hapus</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}