import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import L from 'leaflet';

export default function TambahLahan() {
  const [formData, setFormData] = useState({
    nama_lahan: '',
    luas_lahan_hektar: '',
    lokasi: '',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const mapRef = useRef(null); // Referensi ke elemen map
  const mapInstanceRef = useRef(null); // Referensi ke instance peta
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) navigate('/login');
      else setUser(user);
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (!mapRef.current || !user) return; // Hentikan jika elemen atau user belum ada

    // Inisialisasi peta hanya jika elemen ada
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([-6.2, 106.8], 10); // Default Jakarta
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      const marker = L.marker([0, 0], { draggable: true }).addTo(mapInstanceRef.current);
      marker.on('dragend', () => {
        const { lat, lng } = marker.getLatLng();
        setFormData((prev) => ({ ...prev, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }));
      });

      mapInstanceRef.current.on('click', (e) => {
        marker.setLatLng(e.latlng);
        setFormData((prev) => ({ ...prev, latitude: e.latlng.lat.toFixed(6), longitude: e.latlng.lng.toFixed(6) }));
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove(); // Cleanup saat unmount
        mapInstanceRef.current = null;
      }
    };
  }, [user]); // Hanya jalankan saat user berubah

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Sesi Anda tidak valid, silakan login ulang.");
      return;
    }

    const luas = parseFloat(formData.luas_lahan_hektar);
    if (isNaN(luas) || luas <= 0) {
      setError('Luas lahan harus berupa angka positif.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('lahan')
        .insert({
          petani_id: user.id,
          nama_lahan: formData.nama_lahan,
          luas_lahan_hektar: luas,
          lokasi: formData.lokasi,
          status: 'Kosong',
          latitude: formData.latitude || null,
          longitude: formData.longitude || null,
        });

      if (error) throw error;

      alert('Lahan baru berhasil ditambahkan!');
      navigate('/petani/lahan');
    } catch (error) {
      setError(`Gagal menambahkan lahan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center py-10 text-gray-600">Memuat...</div>;

  return (
    <div className="p-6">
      <Link to="/petani/lahan" className="text-emerald-500 hover:underline mb-6 inline-block">← Batal dan Kembali</Link>
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Tambah Lahan Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
            type="text"
            name="nama_lahan"
            placeholder="Nama Lahan (e.g., Sawah Irigasi Desa)"
            value={formData.nama_lahan || ''}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
            type="number"
            step="0.1"
            name="luas_lahan_hektar"
            placeholder="Luas (Hektar)"
            value={formData.luas_lahan_hektar || ''}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
            type="text"
            name="lokasi"
            placeholder="Lokasi (Kecamatan/Desa)"
            value={formData.lokasi || ''}
            onChange={handleChange}
            required
          />
          <div ref={mapRef} style={{ height: '200px', width: '100%', marginBottom: '1rem' }}></div>
          <p className="text-gray-400 text-sm">Klik peta untuk menentukan lokasi lahan. Koordinat: {formData.latitude}, {formData.longitude}</p>
          <button
            type="submit"
            disabled={loading || !formData.latitude || !formData.longitude}
            className="w-full bg-emerald-600 hover:bg-emerald-700 px-4 py-3 rounded text-white font-bold"
          >
            {loading ? 'Menyimpan...' : 'Simpan Lahan'}
          </button>
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}