import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PetaniNavbar from '../../components/petani/PetaniNavbar';
import Footer from '../../components/petani/Footer';
import { ChevronLeft, Loader, AlertTriangle, CheckCircle, Sprout, Package, Droplet, Bug, Leaf } from 'lucide-react';

// --- Komponen Pembantu ---

// Form Input yang bisa digunakan ulang
const FormInput = ({ name, type = 'text', label, placeholder, value, onChange, required, children }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
    {type === 'select' ? (
      <select id={name} name={name} value={value} onChange={onChange} required={required} className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all">
        {children}
      </select>
    ) : type === 'textarea' ? (
      <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} rows="4" className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
    ) : (
      <input id={name} name={name} type={type} step={type === 'number' ? '0.1' : undefined} placeholder={placeholder} value={value} onChange={onChange} required={required} className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
    )}
  </div>
);

// Notifikasi untuk error dan sukses
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

// --- Komponen Utama Halaman Tambah Aktivitas ---

export default function TambahAktivitas() {
  const { lahanId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jenis_aktivitas: '',
    tanggal_aktivitas: '',
    deskripsi: '',
    jumlah: '',
    satuan: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { jenis_aktivitas, tanggal_aktivitas, deskripsi, jumlah } = formData;
    let dataToInsert = { lahan_id: lahanId, jenis_aktivitas, tanggal_aktivitas, deskripsi, jumlah: null, satuan: null };

    try {
        if (!jenis_aktivitas || !tanggal_aktivitas) {
            throw new Error("Jenis aktivitas dan tanggal wajib diisi.");
        }

        if (['Pupuk', 'Panen'].includes(jenis_aktivitas)) {
            if (!jumlah) throw new Error("Jumlah wajib diisi untuk aktivitas ini.");
            dataToInsert.jumlah = parseFloat(jumlah);
            if (isNaN(dataToInsert.jumlah) || dataToInsert.jumlah <= 0) throw new Error("Jumlah harus angka positif.");
            dataToInsert.satuan = 'kg';
        }

        const { error: insertError } = await supabase.from('aktivitas_lahan').insert(dataToInsert);
        if (insertError) throw insertError;

        setSuccess('Aktivitas berhasil ditambahkan! Mengalihkan...');
        setTimeout(() => navigate(`/petani/lahan/${lahanId}`), 2000);

    } catch (err) {
        setError(`Gagal: ${err.message}`);
        console.error('Error submitting activity:', err);
    } finally {
        setLoading(false);
    }
  };

  const getConditionalFields = () => {
    switch (formData.jenis_aktivitas) {
      case 'Tanam':
        return <FormInput name="deskripsi" type="textarea" label="Jenis/Varietas Tanaman" placeholder="Contoh: Padi Pandan Wangi" value={formData.deskripsi} onChange={handleChange} required />;
      case 'Pupuk':
        return (
          <>
            <FormInput name="deskripsi" label="Jenis Pupuk" placeholder="Contoh: Urea, NPK, Kompos" value={formData.deskripsi} onChange={handleChange} required />
            <FormInput name="jumlah" type="number" label="Jumlah (kg)" placeholder="Contoh: 50" value={formData.jumlah} onChange={handleChange} required />
          </>
        );
      case 'Air':
        return <FormInput name="deskripsi" type="textarea" label="Catatan Pengairan" placeholder="Contoh: Pengairan pagi hari selama 30 menit" value={formData.deskripsi} onChange={handleChange} required />;
      case 'Hama':
        return <FormInput name="deskripsi" type="textarea" label="Deskripsi Hama/Penyakit & Penanganan" placeholder="Contoh: Ditemukan wereng, disemprot pestisida X" value={formData.deskripsi} onChange={handleChange} required />;
      case 'Panen':
        return <FormInput name="jumlah" type="number" label="Jumlah Hasil Panen (kg)" placeholder="Contoh: 1500" value={formData.jumlah} onChange={handleChange} required />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen">
      <PetaniNavbar />
      <main className="container mx-auto px-4 py-12 pt-28 md:pt-32">
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
                    Catat Aktivitas Lahan
                </h1>
                <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                    Mencatat setiap aktivitas akan membantu Anda memantau perkembangan lahan dengan lebih baik.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-slate-800/50 p-8 rounded-2xl border border-slate-800 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput name="jenis_aktivitas" type="select" label="Jenis Aktivitas" value={formData.jenis_aktivitas} onChange={handleChange} required>
                        <option value="">-- Pilih Jenis --</option>
                        <option value="Tanam">Tanam Bibit</option>
                        <option value="Pupuk">Pemupukan</option>
                        <option value="Air">Pengairan</option>
                        <option value="Hama">Laporan Hama/Penyakit</option>
                        <option value="Panen">Panen</option>
                    </FormInput>
                    <FormInput name="tanggal_aktivitas" type="date" label="Tanggal Aktivitas" value={formData.tanggal_aktivitas} onChange={handleChange} required />
                </div>
                
                {getConditionalFields()}

                <div className="pt-6 border-t border-slate-700/50">
                    {error && <Notification type="error" message={error} />}
                    {success && <Notification type="success" message={success} />}

                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <Link to={`/petani/lahan/${lahanId}`} className="w-full sm:w-auto flex-1 text-center px-6 py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors font-semibold">
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-800/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader className="animate-spin w-5 h-5 mr-2" /> : <Sprout className="w-5 h-5 mr-2"/>}
                            {loading ? 'Menyimpan...' : (success ? 'Berhasil!' : 'Simpan Aktivitas')}
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
