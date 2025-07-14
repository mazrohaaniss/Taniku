import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PetaniNavbar from '../../components/petani/PetaniNavbar';
import Footer from '../../components/petani/Footer';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, Send, UploadCloud, Loader, AlertTriangle, CheckCircle } from 'lucide-react';

// Komponen Notifikasi
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

// Komponen Input Form
const FormInput = ({ name, type = 'text', label, placeholder, value, onChange, required, children, rows }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
    {type === 'select' ? (
      <select id={name} name={name} value={value} onChange={onChange} required={required} className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all">
        {children}
      </select>
    ) : type === 'textarea' ? (
      <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} rows={rows || 8} className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
    ) : (
      <input id={name} name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} required={required} className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
    )}
  </div>
);

export default function TambahTopik() {
  const navigate = useNavigate();
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [tags, setTags] = useState('');
  const [foto, setFoto] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) navigate('/login');
        else setUser(user);
    };
    fetchUser();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Fungsionalitas submit tidak diubah
    if (!user) {
        setError("Anda harus login untuk membuat topik.");
        return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      let fotoUrl = null;
      if (foto) {
        const filePath = `${user.id}/${Date.now()}_${foto.name}`;
        const { error: uploadError } = await supabase.storage.from('topik-photos').upload(filePath, foto);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('topik-photos').getPublicUrl(filePath);
        fotoUrl = urlData.publicUrl;
      }
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const { error: insertError } = await supabase.from('topik_diskusi').insert({
        judul,
        isi,
        tags: tagsArray.length > 0 ? tagsArray : null,
        foto_url: fotoUrl,
        penanya_id: user.id,
        penanya_nama: user.user_metadata?.nama_lengkap || user.email,
      });
      if (insertError) throw insertError;
      setSuccess("Topik berhasil dibuat! Mengalihkan...");
      setTimeout(() => navigate('/petani/konsultasi'), 2000);
    } catch (err) {
      setError(`Gagal membuat topik: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">Memverifikasi sesi...</div>;

  return (
    <div className="bg-slate-900 min-h-screen">
      <PetaniNavbar />
      <main className="container mx-auto px-4 py-12 pt-28 md:pt-32">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link to="/petani/konsultasi" className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 mb-4">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Batal dan Kembali ke Forum
            </Link>
            <h1 className="text-4xl font-bold text-white">Mulai Diskusi Baru</h1>
            <p className="text-slate-400 mt-2">
              Jelaskan pertanyaan atau masalah Anda secara rinci agar mendapatkan jawaban terbaik.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-slate-800/50 p-8 rounded-2xl border border-slate-800 space-y-6">
            <FormInput name="judul" label="Judul Pertanyaan" value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Contoh: Bagaimana cara mengatasi hama wereng?" required />
            <FormInput name="tags" label="Kategori / Tags (pisahkan dengan koma)" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Contoh: padi, hama, pupuk" />
            <FormInput name="isi" type="textarea" label="Isi Pertanyaan" value={isi} onChange={(e) => setIsi(e.target.value)} placeholder="Jelaskan detail masalah Anda di sini..." required />
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Unggah Foto (Opsional)</label>
              <label htmlFor="foto" className="w-full flex items-center justify-center px-4 py-6 bg-slate-800/70 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800">
                <div className="text-center">
                  <UploadCloud className="w-8 h-8 mx-auto text-slate-500" />
                  <p className="mt-2 text-sm text-slate-400"><span className="font-semibold text-emerald-400">Klik untuk mengunggah</span></p>
                  {fileName ? <p className="text-xs text-emerald-300 mt-1">{fileName}</p> : <p className="text-xs text-slate-500 mt-1">PNG atau JPG</p>}
                </div>
                <input id="foto" type="file" name="foto" accept="image/*" onChange={(e) => { setFoto(e.target.files[0]); setFileName(e.target.files[0].name); }} className="hidden" />
              </label>
            </div>
            <div className="pt-4">
                {error && <Notification type="error" message={error} />}
                {success && <Notification type="success" message={success} />}
                <div className="flex justify-end">
                    <button type="submit" disabled={loading || success} className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg disabled:opacity-50">
                        {loading ? <Loader className="animate-spin w-4 h-4" /> : <Send className="w-5 h-5" />}
                        {loading ? 'Mengirim...' : (success ? 'Berhasil!' : 'Kirim Pertanyaan')}
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
