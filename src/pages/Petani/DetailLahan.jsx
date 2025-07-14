import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PetaniNavbar from '../../components/petani/PetaniNavbar';
import Footer from '../../components/petani/Footer';
import { Leaf, Sprout, Droplet, Bug, Package, ChevronLeft, Plus, MapPin, Ruler, Wheat, Edit, Trash2, X, AlertTriangle } from 'lucide-react';

// Atur ikon default untuk Leaflet agar muncul dengan benar
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// --- Komponen-komponen Kecil untuk Halaman ---

// Ikon untuk setiap jenis aktivitas
const getIconForActivity = (jenis) => {
  const iconProps = { className: "w-5 h-5" };
  const containerProps = { className: "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" };

  switch (jenis) {
    case 'Tanam': return <div {...containerProps} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}><Sprout {...iconProps} style={{ color: '#10b981' }} /></div>;
    case 'Pupuk': return <div {...containerProps} style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)' }}><Package {...iconProps} style={{ color: '#eab308' }} /></div>;
    case 'Air': return <div {...containerProps} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}><Droplet {...iconProps} style={{ color: '#3b82f6' }} /></div>;
    case 'Hama': return <div {...containerProps} style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}><Bug {...iconProps} style={{ color: '#ef4444' }} /></div>;
    case 'Panen': return <div {...containerProps} style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}><Leaf {...iconProps} style={{ color: '#22c55e' }} /></div>;
    default: return <div {...containerProps} style={{ backgroundColor: 'rgba(100, 116, 139, 0.1)' }}><Leaf {...iconProps} style={{ color: '#64748b' }} /></div>;
  }
};

// Item info dengan ikon
const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start">
        <div className="text-slate-500 mt-1 mr-3 flex-shrink-0">{icon}</div>
        <div>
            <p className="text-xs text-slate-400">{label}</p>
            <p className="font-semibold text-white">{value}</p>
        </div>
    </div>
);

// --- Komponen Utama Halaman Detail Lahan ---

export default function DetailLahan() {
  const { lahanId } = useParams();
  const navigate = useNavigate();
  const [lahan, setLahan] = useState(null);
  const [aktivitas, setAktivitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: lahanData, error: lahanError } = await supabase
          .from('lahan')
          .select('*')
          .eq('id', lahanId)
          .single();
        if (lahanError) throw new Error(`Gagal memuat detail lahan: ${lahanError.message}`);
        if (!lahanData) throw new Error('Lahan tidak ditemukan.');

        const { data: aktivitasData, error: aktivitasError } = await supabase
          .from('aktivitas_lahan')
          .select('*')
          .eq('lahan_id', lahanId)
          .order('tanggal_aktivitas', { ascending: false });
        if (aktivitasError) throw new Error(`Gagal memuat aktivitas: ${aktivitasError.message}`);

        setLahan(lahanData);
        setAktivitas(aktivitasData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, [lahanId]);

  useEffect(() => {
    if (!mapRef.current || !lahan || !lahan.latitude || !lahan.longitude || mapInstanceRef.current) {
        return;
    }

    mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false,
    }).setView([lahan.latitude, lahan.longitude], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapInstanceRef.current);

    L.marker([lahan.latitude, lahan.longitude]).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lahan]);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
        const { error: aktivitasError } = await supabase.from('aktivitas_lahan').delete().eq('lahan_id', lahanId);
        if (aktivitasError) throw aktivitasError;

        const { error: lahanError } = await supabase.from('lahan').delete().eq('id', lahanId);
        if (lahanError) throw lahanError;

        alert('Lahan berhasil dihapus.');
        navigate('/petani/lahan');
    } catch (err) {
        setError(`Gagal menghapus lahan: ${err.message}`);
        setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  if (loading && !lahan) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">Memuat detail lahan...</div>;
  if (error) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-red-400">{error}</div>;
  if (!lahan) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">Lahan tidak ditemukan.</div>;

  return (
    <div className="bg-slate-900 min-h-screen">
        <PetaniNavbar />
        <main className="container mx-auto px-4 py-12 pt-28 md:pt-32">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">{lahan.nama_lahan}</h1>
                <p className="text-slate-400 mt-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> {lahan.lokasi}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => setShowEditModal(true)} className="inline-flex items-center text-sm bg-slate-800 text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors"><Edit className="w-4 h-4 mr-2" /> Edit</button>
                <button onClick={() => setShowDeleteModal(true)} className="inline-flex items-center text-sm bg-red-900/50 text-red-400 hover:bg-red-900 px-3 py-2 rounded-lg transition-colors"><Trash2 className="w-4 h-4 mr-2" /> Hapus</button>
                <Link to="/petani/lahan" className="inline-flex items-center text-sm bg-slate-800 text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Kembali
                </Link>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom Kiri: Detail dan Aktivitas */}
            <div className="lg:col-span-2 space-y-8">
            {/* Detail Card */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800">
                <h2 className="text-xl font-bold text-white mb-4">Detail Lahan</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <InfoItem icon={<Ruler />} label="Luas" value={`${lahan.luas_lahan_hektar} Hektar`} />
                    <InfoItem icon={<Wheat />} label="Tanaman Saat Ini" value={lahan.tanaman_sekarang || 'Belum ditanami'} />
                    <InfoItem icon={<MapPin />} label="Koordinat" value={`${parseFloat(lahan.latitude).toFixed(4)}, ${parseFloat(lahan.longitude).toFixed(4)}`} />
                    <InfoItem icon={<Leaf />} label="Status" value={lahan.status} />
                </div>
            </div>

            {/* Aktivitas Card */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">Buku Harian Lahan</h2>
                    <Link to={`/petani/lahan/${lahanId}/tambahaktivitas`} className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-colors">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Aktivitas
                    </Link>
                </div>
                {aktivitas.length === 0 ? (
                <p className="text-slate-400 text-center py-12">Belum ada aktivitas tercatat.</p>
                ) : (
                <div className="divide-y divide-slate-800">
                    {aktivitas.map((act) => (
                    <div key={act.id} className="flex items-center space-x-4 p-6 hover:bg-slate-800/50">
                        {getIconForActivity(act.jenis_aktivitas)}
                        <div className="flex-grow">
                        <p className="font-semibold text-white">{act.jenis_aktivitas}</p>
                        <p className="text-sm text-slate-300">{act.deskripsi || 'Tidak ada deskripsi'}</p>
                        </div>
                        <div className="text-right text-sm">
                            <p className="text-slate-400">{formatDate(act.tanggal_aktivitas)}</p>
                            {act.jumlah && <p className="text-slate-500">{act.jumlah} {act.satuan || ''}</p>}
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
            </div>

            {/* Kolom Kanan: Peta */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800">
                <h2 className="text-xl font-bold text-white mb-4">Lokasi Peta</h2>
                <div ref={mapRef} className="h-80 w-full rounded-lg border border-slate-700 z-0"></div>
            </div>
        </div>
        {showEditModal && <EditLahanModal lahan={lahan} onClose={() => setShowEditModal(false)} onSaved={fetchData} />}
        {showDeleteModal && <DeleteConfirmationModal onConfirm={handleDelete} onCancel={() => setShowDeleteModal(false)} loading={loading} />}
        </main>
        <Footer />
    </div>
  );
}

// Modal untuk Edit Lahan
function EditLahanModal({ lahan, onClose, onSaved }) {
    const [formData, setFormData] = useState({ ...lahan });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { error: updateError } = await supabase
                .from('lahan')
                .update({
                    nama_lahan: formData.nama_lahan,
                    luas_lahan_hektar: parseFloat(formData.luas_lahan_hektar),
                    lokasi: formData.lokasi,
                    tanaman_sekarang: formData.tanaman_sekarang,
                    status: formData.status,
                })
                .eq('id', lahan.id);
            if (updateError) throw updateError;
            onSaved();
            onClose();
        } catch (err) {
            setError(`Gagal memperbarui: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Edit Lahan</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="space-y-4">
                        <input name="nama_lahan" placeholder="Nama Lahan" value={formData.nama_lahan} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg" />
                        <input name="luas_lahan_hektar" placeholder="Luas (Hektar)" type="number" value={formData.luas_lahan_hektar} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg" />
                        <input name="lokasi" placeholder="Lokasi" value={formData.lokasi} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg" />
                        <input name="tanaman_sekarang" placeholder="Tanaman Saat Ini" value={formData.tanaman_sekarang} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg" />
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg">
                            <option>Tersedia</option>
                            <option>Ditanami</option>
                            <option>Panen</option>
                        </select>
                    </div>
                    {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
                    <div className="flex gap-4 pt-6">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg">Batal</button>
                        <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold disabled:opacity-50">{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Modal untuk Konfirmasi Hapus
function DeleteConfirmationModal({ onConfirm, onCancel, loading }) {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Anda Yakin?</h2>
                <p className="text-slate-400 mb-6 text-sm">Aksi ini tidak dapat dibatalkan. Semua data aktivitas terkait lahan ini juga akan terhapus secara permanen.</p>
                <div className="flex gap-4">
                    <button onClick={onCancel} disabled={loading} className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg">Batal</button>
                    <button onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold disabled:opacity-50">{loading ? 'Menghapus...' : 'Ya, Hapus'}</button>
                </div>
            </div>
        </div>
    );
}
