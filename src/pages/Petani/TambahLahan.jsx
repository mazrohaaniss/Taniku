import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Geocoding menggunakan Nominatim OpenStreetMap
const geocodeLocation = async (location) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
  );
  const data = await response.json();
  if (data && data.length > 0) {
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  }
  return null;
};

export default function TambahLahan() {
  const [formData, setFormData] = useState({
    nama_lahan: '',
    luas_lahan_hektar: '',
    lokasi: '',
    tanaman_sekarang: '',
    status: 'Kosong',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
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
    if (!mapRef.current || !user) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([-6.2, 106.8], 13); // Default Jakarta
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      const marker = L.marker([-6.2, 106.8], { draggable: true }).addTo(mapInstanceRef.current);
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
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'lokasi' && value) {
      geocodeLocation(value).then((coords) => {
        if (coords && mapInstanceRef.current) {
          mapInstanceRef.current.setView(coords, 13);
          const marker = mapInstanceRef.current.getBounds().getCenter();
          setFormData((prev) => ({ ...prev, latitude: coords[0].toFixed(6), longitude: coords[1].toFixed(6) }));
          L.marker(coords, { draggable: true }).addTo(mapInstanceRef.current).on('dragend', () => {
            const { lat, lng } = marker.getLatLng();
            setFormData((prev) => ({ ...prev, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }));
          });
        }
      }).catch(() => setError('Lokasi tidak ditemukan, silakan masukkan lokasi yang valid.'));
    }
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
          tanaman_sekarang: formData.tanaman_sekarang || null,
          status: formData.status,
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
            placeholder="Nama Lahan (e.g., Sawah Blok A)"
            value={formData.nama_lahan}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
            type="number"
            step="0.1"
            name="luas_lahan_hektar"
            placeholder="Luas (Hektar)"
            value={formData.luas_lahan_hektar}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
            type="text"
            name="lokasi"
            placeholder="Lokasi (e.g., Kecamatan Sukoharjo, Jawa Tengah)"
            value={formData.lokasi}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
            type="text"
            name="tanaman_sekarang"
            placeholder="Tanaman Saat Ini (opsional)"
            value={formData.tanaman_sekarang}
            onChange={handleChange}
          />
          <div ref={mapRef} style={{ height: '200px', width: '100%', marginBottom: '1rem' }}></div>
          <p className="text-gray-400 text-sm">Koordinat: {formData.latitude}, {formData.longitude}</p>
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