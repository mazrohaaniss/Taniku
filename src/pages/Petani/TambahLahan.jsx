import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PetaniNavbar from '../../components/petani/PetaniNavbar';
import Footer from '../../components/petani/Footer';
import { ChevronLeft, Loader, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';

// Atur ikon default untuk Leaflet agar muncul dengan benar
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Geocoding menggunakan Nominatim OpenStreetMap
const geocodeLocation = async (location) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1&countrycodes=id`
    );
    if (!response.ok) throw new Error('Gagal mengakses API geocoding');
    const data = await response.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export default function TambahLahan() {
  const [formData, setFormData] = useState({
    nama_lahan: '',
    luas_lahan_hektar: '',
    lokasi: '',
    tanaman_sekarang: '',
    status: 'Tersedia',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [user, setUser] = useState(null);
  
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
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
    if (!mapRef.current || !user || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current).setView([-2.5489, 118.0149], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapInstanceRef.current);

    markerRef.current = L.marker([-2.5489, 118.0149], { draggable: true }).addTo(mapInstanceRef.current);
    
    markerRef.current.on('dragend', () => {
      const { lat, lng } = markerRef.current.getLatLng();
      setFormData((prev) => ({ ...prev, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }));
    });

    mapInstanceRef.current.on('click', (e) => {
      markerRef.current.setLatLng(e.latlng);
      const { lat, lng } = e.latlng;
      setFormData((prev) => ({ ...prev, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }));
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [user]);

  const handleLocationChange = debounce(async (value) => {
    if (value) {
      const coords = await geocodeLocation(value);
      if (coords && mapInstanceRef.current && markerRef.current) {
        mapInstanceRef.current.setView(coords, 13);
        markerRef.current.setLatLng(coords);
        setFormData((prev) => ({
          ...prev,
          latitude: coords[0].toFixed(6),
          longitude: coords[1].toFixed(6),
        }));
      } else {
        setError('Lokasi tidak ditemukan. Coba masukkan alamat yang lebih spesifik.');
      }
    }
  }, 1000);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'lokasi') {
      handleLocationChange(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Sesi Anda tidak valid, silakan login ulang.');
      return;
    }
    const luas = parseFloat(formData.luas_lahan_hektar);
    if (isNaN(luas) || luas <= 0) {
      setError('Luas lahan harus berupa angka positif.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error: insertError } = await supabase
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
      if (insertError) throw insertError;
      setSuccess('Lahan baru berhasil ditambahkan! Mengalihkan...');
      setTimeout(() => navigate('/petani/lahan'), 2000);
    } catch (error) {
      setError(`Gagal menambahkan lahan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">Memuat...</div>;

  return (
    <div className="bg-slate-900 min-h-screen">
      <PetaniNavbar />
      <main className="container mx-auto px-4 py-12 pt-28 md:pt-32">
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
                    Daftarkan Lahan Baru Anda
                </h1>
                <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                    Lengkapi detail lahan Anda dan tandai lokasinya di peta untuk memulai pengelolaan digital.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-slate-800/50 p-8 rounded-2xl border border-slate-800 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Kolom Kiri: Input Data */}
                    <div className="space-y-6">
                        <FormInput name="nama_lahan" label="Nama Lahan" placeholder="e.g., Sawah Blok A" value={formData.nama_lahan} onChange={handleChange} required />
                        <FormInput name="luas_lahan_hektar" type="number" label="Luas (Hektar)" placeholder="e.g., 2.5" value={formData.luas_lahan_hektar} onChange={handleChange} required />
                        <FormInput name="lokasi" label="Alamat / Lokasi" placeholder="e.g., Kec. Semarang, Jawa Tengah" value={formData.lokasi} onChange={handleChange} required />
                        <FormInput name="tanaman_sekarang" label="Tanaman Saat Ini (Opsional)" placeholder="e.g., Padi" value={formData.tanaman_sekarang} onChange={handleChange} />
                    </div>

                    {/* Kolom Kanan: Peta */}
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Tandai Lokasi di Peta</label>
                        <div ref={mapRef} className="flex-grow w-full rounded-lg border border-slate-700 z-0 min-h-[250px]"></div>
                        <p className="text-slate-400 text-xs mt-2 text-center">
                            Koordinat: {formData.latitude || '...'}, {formData.longitude || '...'}
                        </p>
                    </div>
                </div>

                {/* Notifikasi dan Tombol Submit */}
                <div className="pt-6 border-t border-slate-700/50">
                    {error && <Notification type="error" message={error} />}
                    {success && <Notification type="success" message={success} />}

                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <Link to="/petani/lahan" className="w-full sm:w-auto flex-1 text-center px-6 py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors font-semibold">
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-800/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader className="animate-spin w-5 h-5 mr-2" /> : <MapPin className="w-5 h-5 mr-2"/>}
                            {loading ? 'Menyimpan...' : (success ? 'Berhasil!' : 'Simpan Lahan')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Komponen Pembantu
const FormInput = ({ name, type = 'text', label, placeholder, value, onChange, required }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      step={type === 'number' ? '0.1' : undefined}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
    />
  </div>
);

const Notification = ({ type, message }) => {
  const baseClasses = "flex items-center space-x-3 text-center text-sm p-3 rounded-lg mb-4";
  const typeClasses = {
    error: "bg-red-900/50 text-red-400",
    success: "bg-green-900/50 text-green-300",
  };
  const Icon = type === 'error' ? AlertTriangle : CheckCircle;

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};
