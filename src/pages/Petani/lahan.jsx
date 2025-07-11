import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

export default function Lahan() {
  const [lahanList, setLahanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAndLahan = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Pengguna tidak terautentikasi.');
        setUser(user);

        const { data, error: fetchError } = await supabase
          .from('lahan')
          .select('*')
          .eq('petani_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setLahanList(data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndLahan();
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-600">Memuat data lahan...</div>;
  if (error) return <div className="text-center py-10 bg-red-100 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-500">Manajemen Lahan</h1>
        <Link to="/petani/tambahlahan" className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors">
          + Tambah Lahan Baru
        </Link>
      </div>

      {lahanList.length === 0 ? (
        <div className="text-center py-10 bg-gray-800 rounded-lg">
          <p className="text-white">Anda belum memiliki lahan terdaftar.</p>
          <p className="text-gray-400">Silakan tambahkan lahan baru untuk memulai.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lahanList.map((lahan) => (
            <Link to={`/petani/lahan/${lahan.id}`} key={lahan.id} className="block bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
              <h2 className="text-xl font-bold text-white mb-2">{lahan.nama_lahan}</h2>
              <p className="text-gray-400">Tanaman: {lahan.tanaman_sekarang || 'Tidak ada'}</p>
              <p className="text-gray-400">Status: {lahan.status}</p>
              <p className="text-gray-400">Tanam: {lahan.tanggal_tanam ? new Date(lahan.tanggal_tanam).toLocaleDateString() : 'Belum ditanam'}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}