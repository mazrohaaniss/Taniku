import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import PetaniNavbar from '../../components/petani/PetaniNavbar';
import Footer from '../../components/petani/Footer';
import { BookOpen, Megaphone, ArrowRight, Video, FileText } from 'lucide-react';

// --- Komponen-komponen Kecil ---

const MateriCard = ({ materi }) => (
  <Link 
    to={`/petani/edukasi/${materi.id}`}
    className="block bg-slate-800/50 rounded-2xl border border-slate-800 overflow-hidden group transition-all duration-300 hover:border-emerald-500/50 hover:-translate-y-1"
  >
    <div className="aspect-video overflow-hidden relative">
      <img 
        src={materi.thumbnail_url || 'https://placehold.co/600x400/0f172a/10b981?text=Taniku'} 
        alt={materi.judul}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded-full bg-slate-900/70 backdrop-blur-sm flex items-center gap-1.5">
        {materi.tipe === 'Video' ? <Video className="w-3 h-3 text-emerald-400" /> : <FileText className="w-3 h-3 text-emerald-400" />}
        <span>{materi.tipe}</span>
      </div>
    </div>
    <div className="p-5">
      <p className="text-sm text-emerald-400 font-semibold mb-1">{materi.kategori}</p>
      <h3 className="font-bold text-lg text-white mb-3 h-14 line-clamp-2">{materi.judul}</h3>
      <div className="flex justify-between items-center text-xs text-slate-400">
        <span>Oleh: {materi.penulis}</span>
        <span>{new Date(materi.created_at).toLocaleDateString('id-ID')}</span>
      </div>
    </div>
  </Link>
);

const PengumumanItem = ({ item }) => (
    <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-800 flex items-start gap-4">
        <div className="p-3 bg-slate-700 rounded-lg mt-1">
            <Megaphone className="w-5 h-5 text-emerald-400"/>
        </div>
        <div>
            <h4 className="font-bold text-white">{item.judul}</h4>
            <p className="text-sm text-slate-300 mt-1">{item.isi}</p>
            <p className="text-xs text-slate-500 mt-2">Diterbitkan: {new Date(item.created_at).toLocaleDateString('id-ID')}</p>
        </div>
    </div>
);


// --- Komponen Utama Halaman Edukasi ---

export default function Edukasi() {
  const [materiList, setMateriList] = useState([]);
  const [pengumumanList, setPengumumanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: materiData, error: materiError } = await supabase
          .from('materi_edukasi')
          .select('*')
          .order('created_at', { ascending: false });
        if (materiError) throw materiError;

        const { data: pengumumanData, error: pengumumanError } = await supabase
          .from('pengumuman')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3); // Ambil 3 pengumuman terbaru
        if (pengumumanError) throw pengumumanError;

        setMateriList(materiData || []);
        setPengumumanList(pengumumanData || []);
      } catch (err) {
        setError(`Gagal memuat data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  if (loading) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">Memuat Pusat Edukasi...</div>;
  if (error) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-red-400">{error}</div>;

  return (
    <div className="bg-slate-900 min-h-screen">
      <PetaniNavbar />
      <main className="container mx-auto px-4 py-12 pt-28 md:pt-32">
        {/* Hero Section */}
        <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-400 leading-tight mb-4">
            Pusat Edukasi Taniku
          </h1>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-lg">
            Tingkatkan pengetahuan dan keterampilan Anda dengan panduan dan informasi terpercaya dari para ahli.
          </p>
        </div>

        {/* Pengumuman */}
        <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Megaphone className="text-emerald-400"/> Pengumuman Terbaru</h2>
            <div className="space-y-4">
                {pengumumanList.length > 0 ? (
                    pengumumanList.map(item => <PengumumanItem key={item.id} item={item} />)
                ) : (
                    <p className="text-slate-500">Belum ada pengumuman.</p>
                )}
            </div>
        </div>

        {/* Materi Edukasi */}
        <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><BookOpen className="text-emerald-400"/> Materi Pembelajaran</h2>
            {materiList.length === 0 ? (
                <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-dashed border-slate-700">
                    <p className="text-slate-300 font-semibold text-xl">Materi belum tersedia.</p>
                    <p className="text-sm text-slate-500 mt-2">Nantikan artikel dan video panduan dari kami.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {materiList.map((materi) => (
                        <MateriCard key={materi.id} materi={materi} />
                    ))}
                </div>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
