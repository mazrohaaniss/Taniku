import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import PetaniNavbar from '../../components/petani/PetaniNavbar';
import Footer from '../../components/petani/Footer';
import { ChevronLeft, Loader, AlertTriangle, CheckCircle, UploadCloud, Send } from 'lucide-react';

// --- Komponen Pembantu ---

// Form Input yang bisa digunakan ulang dan lebih baik
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
  const baseClasses = "flex items-center space-x-3 text-center text-sm p-3 rounded-lg";
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

// --- Komponen Utama Halaman Tambah Bantuan ---

export default function TambahBantuan() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jenis_bantuan: '',
    deskripsi: '',
    jumlah: '',
    satuan: 'kg',
    foto: null,
  });
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login', { replace: true });
      } else {
        setUser(user);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'foto' && files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setFileName(files[0].name);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Sesi tidak valid. Silakan login ulang.');
      return;
    }
    
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      let fotoUrl = null;
      if (formData.foto) {
        const filePath = `${user.id}/${Date.now()}_${formData.foto.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('bantuan-photos')
          .upload(filePath, formData.foto);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('bantuan-photos')
          .getPublicUrl(filePath);
        
        fotoUrl = urlData.publicUrl;
      }
      
      const dataToInsert = {
        petani_id: user.id,
        jenis_bantuan: formData.jenis_bantuan,
        deskripsi: formData.deskripsi,
        jumlah: formData.jumlah ? parseFloat(formData.jumlah) : null,
        satuan: (formData.jenis_bantuan === 'Pupuk' || formData.jenis_bantuan === 'Bibit') ? formData.satuan : null,
        status: 'Diajukan',
        foto_url: fotoUrl,
      };
      
      const { error: insertError } = await supabase.from('pengajuan_bantuan').insert([dataToInsert]);
      
      if (insertError) throw insertError;

      setSuccess('Pengajuan bantuan berhasil dikirim! Mengalihkan...');
      setTimeout(() => navigate('/petani/bantuan'), 2000);

    } catch (err) {
      setError(`Gagal: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">Memverifikasi sesi...</div>
  }

  return (
    <div className="bg-slate-900 min-h-screen">
      <PetaniNavbar />
      <main className="container mx-auto px-4 py-12 pt-28 md:pt-32">
        <div className="max-w-2xl mx-auto">
            {/* Header Halaman */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
                    Formulir Pengajuan Bantuan
                </h1>
                <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                    Lengkapi formulir di bawah ini untuk mengajukan permohonan bantuan kepada dinas terkait.
                </p>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="bg-slate-800/50 p-8 rounded-2xl border border-slate-800 space-y-6">
                <FormInput type="select" name="jenis_bantuan" label="Jenis Bantuan" value={formData.jenis_bantuan} onChange={handleChange} required>
                    <option value="">-- Pilih Jenis Bantuan --</option>
                    <option value="Pupuk">Pupuk Subsidi</option>
                    <option value="Bibit">Bibit Unggul</option>
                    <option value="Alat">Sewa Alat Pertanian</option>
                    <option value="Pelatihan">Pelatihan Pertanian</option>
                </FormInput>

                <FormInput type="textarea" name="deskripsi" label="Deskripsi Kebutuhan" value={formData.deskripsi} onChange={handleChange} placeholder="Jelaskan kebutuhan Anda secara rinci..." required />

                {(formData.jenis_bantuan === 'Pupuk' || formData.jenis_bantuan === 'Bibit') && (
                    <FormInput type="number" name="jumlah" label="Jumlah (kg)" value={formData.jumlah} onChange={handleChange} placeholder="Contoh: 50" required />
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Foto Pendukung (Opsional)</label>
                    <label htmlFor="foto" className="w-full flex items-center justify-center px-4 py-6 bg-slate-800/70 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800">
                        <div className="text-center">
                            <UploadCloud className="w-8 h-8 mx-auto text-slate-500" />
                            <p className="mt-2 text-sm text-slate-400">
                                <span className="font-semibold text-emerald-400">Klik untuk mengunggah</span> atau seret file
                            </p>
                            {fileName ? (
                                <p className="text-xs text-emerald-300 mt-1">{fileName}</p>
                            ) : (
                                <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF hingga 5MB</p>
                            )}
                        </div>
                        <input id="foto" type="file" name="foto" accept="image/*" onChange={handleChange} className="hidden" />
                    </label>
                </div>

                <div className="pt-6 border-t border-slate-700/50">
                    {error && <Notification type="error" message={error} />}
                    {success && <Notification type="success" message={success} />}

                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <Link to="/petani/bantuan" className="w-full sm:w-auto flex-1 text-center px-6 py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors font-semibold">
                            Batal
                        </Link>
                        <button type="submit" disabled={isSubmitting || success} className="w-full sm:w-auto flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-800/20 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? <Loader className="animate-spin w-5 h-5 mr-2" /> : <Send className="w-5 h-5 mr-2"/>}
                            {isSubmitting ? 'Mengirim...' : (success ? 'Berhasil Terkirim!' : 'Kirim Pengajuan')}
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
