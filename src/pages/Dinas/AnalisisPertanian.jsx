import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import DinasSidebar from '../../components/dinas/DinasSidebar';
import DinasHeader from '../../components/dinas/DinasHeader';
import DinasFooter from '../../components/dinas/Footer';
import { Users, Map, Tractor, Wheat, Search, ArrowDownAZ, ArrowUpZA } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Komponen Kartu Statistik
const StatCard = ({ title, value, icon, unit = '' }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start space-x-4">
    <div className="bg-emerald-100 p-3 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">
        {value} <span className="text-lg font-medium text-gray-600">{unit}</span>
      </p>
    </div>
  </div>
);

export default function AnalisisPertanian() {
  const [lahanData, setLahanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State baru untuk search dan sort
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' atau 'desc'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: lahan, error: lahanError } = await supabase.from('lahan').select('*');
        if (lahanError) throw lahanError;
        setLahanData(lahan || []);
      } catch (err) {
        setError(`Gagal memuat data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    if (lahanData.length === 0) {
      return { totalPetani: 0, totalLuas: 0, komoditasDominan: 'N/A', sebaranKecamatan: {} };
    }

    const totalPetani = new Set(lahanData.map(l => l.petani_id)).size;
    const totalLuas = lahanData.reduce((acc, curr) => acc + parseFloat(curr.luas_lahan_hektar), 0);

    const komoditasCount = lahanData.reduce((acc, curr) => {
      if (curr.tanaman_sekarang) {
        acc[curr.tanaman_sekarang] = (acc[curr.tanaman_sekarang] || 0) + 1;
      }
      return acc;
    }, {});
    const komoditasDominan = Object.keys(komoditasCount).length > 0
      ? Object.keys(komoditasCount).reduce((a, b) => komoditasCount[a] > komoditasCount[b] ? a : b)
      : 'N/A';

    const sebaranKecamatan = lahanData.reduce((acc, curr) => {
        const kecamatan = curr.lokasi || 'Tidak Diketahui';
        if (!acc[kecamatan]) {
            acc[kecamatan] = new Set();
        }
        if(curr.tanaman_sekarang) {
            acc[kecamatan].add(curr.tanaman_sekarang);
        }
        return acc;
    }, {});

    return {
      totalPetani,
      totalLuas: totalLuas.toFixed(2),
      komoditasDominan,
      sebaranKecamatan
    };
  }, [lahanData]);

  // Logika untuk filter dan sort daftar lokasi
  const filteredAndSortedLokasi = useMemo(() => {
    return Object.entries(stats.sebaranKecamatan)
      .filter(([lokasi]) => lokasi.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort(([a], [b]) => {
        if (sortOrder === 'asc') {
          return a.localeCompare(b);
        } else {
          return b.localeCompare(a);
        }
      });
  }, [stats.sebaranKecamatan, searchTerm, sortOrder]);
  
  const lahanDenganKoordinat = lahanData.filter(l => l.latitude && l.longitude);

  if (loading) return <div className="flex min-h-screen bg-gray-50 items-center justify-center">Memuat data analisis...</div>;
  if (error) return <div className="flex min-h-screen bg-gray-50 items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DinasSidebar />
      <div className="flex-1 flex flex-col">
        <DinasHeader />
        <main className="flex-1 p-6 lg:p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Analisis & Statistik Pertanian</h1>
              <p className="text-gray-500">Pantau gambaran besar kondisi pertanian di wilayah Anda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard title="Total Petani Terdata" value={stats.totalPetani} icon={<Users className="w-6 h-6 text-emerald-600" />} unit="Petani" />
              <StatCard title="Total Luas Lahan" value={stats.totalLuas} icon={<Map className="w-6 h-6 text-emerald-600" />} unit="Hektar" />
              <StatCard title="Komoditas Unggulan" value={stats.komoditasDominan} icon={<Wheat className="w-6 h-6 text-emerald-600" />} />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Peta Sebaran Lahan & Komoditas</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 h-96 bg-gray-200 rounded-lg z-0">
                  <MapContainer center={[-2.548926, 118.0148634]} zoom={5} style={{ height: '100%', width: '100%' }} className="rounded-lg">
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {lahanDenganKoordinat.map(lahan => (
                      <Marker key={lahan.id} position={[lahan.latitude, lahan.longitude]}>
                        <Popup>
                          <b>{lahan.nama_lahan}</b><br />
                          Komoditas: {lahan.tanaman_sekarang || 'N/A'}<br />
                          Luas: {lahan.luas_lahan_hektar} ha
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
                <div className="lg:col-span-1">
                  <h3 className="font-semibold text-gray-700 mb-3">Komoditas per Lokasi</h3>
                  {/* Fitur Search & Sort */}
                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Cari lokasi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                      title={sortOrder === 'asc' ? 'Urutkan Z-A' : 'Urutkan A-Z'}
                    >
                      {sortOrder === 'asc' ? <ArrowDownAZ className="w-5 h-5 text-gray-600" /> : <ArrowUpZA className="w-5 h-5 text-gray-600" />}
                    </button>
                  </div>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {filteredAndSortedLokasi.length > 0 ? (
                      filteredAndSortedLokasi.map(([lokasi, komoditasSet]) => (
                        <div key={lokasi} className="p-3 bg-gray-50 rounded-md">
                          <p className="font-bold text-gray-800">{lokasi}</p>
                          <p className="text-sm text-gray-600">{Array.from(komoditasSet).join(', ') || 'Tidak ada komoditas'}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">Lokasi tidak ditemukan.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <DinasFooter />
      </div>
    </div>
  );
}
