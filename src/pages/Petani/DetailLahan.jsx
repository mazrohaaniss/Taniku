import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Leaf, Sprout, Droplet, Bug, Package } from 'lucide-react';

const getIconForActivity = (jenis) => {
  switch (jenis) {
    case 'Tanam': return <Sprout className="w-5 h-5 text-emerald-500" />;
    case 'Pupuk': return <Package className="w-5 h-5 text-yellow-500" />;
    case 'Air': return <Droplet className="w-5 h-5 text-blue-500" />;
    case 'Hama': return <Bug className="w-5 h-5 text-red-500" />;
    case 'Panen': return <Leaf className="w-5 h-5 text-green-500" />;
    default: return null;
  }
};

export default function DetailLahan() {
  const { lahanId } = useParams();
  const [lahan, setLahan] = useState(null);
  const [aktivitas, setAktivitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: lahanData, error: lahanError } = await supabase
          .from('lahan')
          .select('*')
          .eq('id', lahanId)
          .single();
        if (lahanError) throw lahanError;

        const { data: aktivitasData, error: aktivitasError } = await supabase
          .from('aktivitas_lahan')
          .select('*')
          .eq('lahan_id', lahanId)
          .order('tanggal_aktivitas', { ascending: false });
        if (aktivitasError) throw aktivitasError;

        setLahan(lahanData);
        setAktivitas(aktivitasData || []);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lahanId]);

  useEffect(() => {
    if (!mapRef.current || !lahan || !lahan.latitude || !lahan.longitude) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([lahan.latitude, lahan.longitude], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      L.marker([lahan.latitude, lahan.longitude], { draggable: false }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lahan]);

  if (loading) return <div className="text-center py-10 text-gray-600">Memuat detail lahan...</div>;
  if (!lahan) return <div className="text-center py-10 bg-gray-800 text-white">Lahan tidak ditemukan.</div>;

  return (
    <div className="p-6">
      <Link to="/petani/lahan" className="text-emerald-500 hover:underline mb-4 inline-block">← Kembali ke Daftar Lahan</Link>

      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold text-emerald-500 mb-2">{lahan.nama_lahan}</h1>
        <p className="text-gray-400">Luas: {lahan.luas_lahan_hektar} Hektar</p>
        <p className="text-gray-400">Lokasi: {lahan.lokasi}</p>
        <p className="text-gray-400">Tanaman: {lahan.tanaman_sekarang || 'Tidak ada'}</p>
        <p className="text-gray-400">Status: {lahan.status}</p>
      </div>

      <div ref={mapRef} style={{ height: '200px', width: '100%', marginBottom: '1rem', borderRadius: '4px' }}></div>

      <Link to={`/petani/lahan/${lahanId}/tambahaktivitas`} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 mb-6">
        + Tambah Catatan Aktivitas
      </Link>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Buku Harian Lahan</h2>
        {aktivitas.length === 0 ? (
          <p className="text-gray-400">Belum ada aktivitas untuk lahan ini. Mulai tambahkan aktivitas!</p>
        ) : (
          <div className="space-y-4">
            {aktivitas.map((act) => (
              <div key={act.id} className="flex items-start space-x-4">
                {getIconForActivity(act.jenis_aktivitas)}
                <div>
                  <h3 className="text-white font-semibold">{act.jenis_aktivitas} - {act.deskripsi || 'Tanpa deskripsi'}</h3>
                  <p className="text-gray-400">{new Date(act.tanggal_aktivitas).toLocaleDateString()}</p>
                  {act.jumlah && <p className="text-gray-400">{act.jumlah} {act.satuan || 'unit'}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}