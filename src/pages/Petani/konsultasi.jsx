import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import PetaniNavbar from '../../components/petani/PetaniNavbar';
import Footer from '../../components/petani/Footer';
import { Plus, MessageSquare, User, Clock } from 'lucide-react';

const TopikCard = ({ topik }) => (
  <Link 
    to={`/petani/konsultasi/${topik.id}`}
    className="block bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500/80 hover:-translate-y-1 transition-all duration-300 group"
  >
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center flex-shrink-0">
        <User className="w-6 h-6 text-emerald-400" />
      </div>
      <div className="flex-grow">
        <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors mb-1">{topik.judul}</h3>
        <p className="text-sm text-slate-400">
          Ditanyakan oleh <span className="font-semibold text-slate-300">{topik.penanya_nama || 'Anonim'}</span>
        </p>
      </div>
    </div>
    <p className="text-slate-300 text-sm mt-4 line-clamp-2 h-[40px]">
      {topik.isi}
    </p>
    <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-500">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        <span>{topik.jawaban_count} Jawaban</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4" />
        <span>{new Date(topik.created_at).toLocaleDateString('id-ID')}</span>
      </div>
    </div>
  </Link>
);

export default function Konsultasi() {
  const [topikList, setTopikList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopik = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: rpcError } = await supabase.rpc('get_all_topik_with_answer_count');
        
        if (rpcError) throw rpcError;
        setTopikList(data || []);
      } catch (err) {
        setError(`Gagal memuat data forum: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopik();

    const channel = supabase.channel('topik-diskusi-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'topik_diskusi' }, 
        (payload) => {
          setTopikList(currentList => [{ ...payload.new, jawaban_count: 0 }, ...currentList]);
        }
      ).subscribe();

    return () => supabase.removeChannel(channel);

  }, []);

  if (loading) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">Memuat forum...</div>;
  if (error) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-red-400">{error}</div>;

  return (
    <div className="bg-slate-900 min-h-screen">
      <PetaniNavbar />
      <main className="container mx-auto px-4 py-12 pt-28 md:pt-32">
        <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-400 leading-tight mb-4">
            Ruang Diskusi Petani Hebat
          </h1>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-lg">
            Temukan solusi, bagikan pengalaman, dan bertanya langsung kepada para ahli dan sesama petani.
          </p>
        </div>

        <div className="mb-10 flex justify-center">
            <Link 
              to="/petani/konsultasi/tambah" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-bold hover:scale-105 transition-transform shadow-2xl shadow-emerald-800/30"
            >
              <Plus className="w-5 h-5" />
              <span>Mulai Diskusi Baru</span>
            </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {topikList.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-dashed border-slate-700">
              <p className="text-slate-300 font-semibold text-xl">Belum ada diskusi.</p>
              <p className="text-sm text-slate-500 mt-2">Jadilah yang pertama memulai diskusi!</p>
            </div>
          ) : (
            topikList.map((topik) => (
              <TopikCard key={topik.id} topik={topik} />
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
