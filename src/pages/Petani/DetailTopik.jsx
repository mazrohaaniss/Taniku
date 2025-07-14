import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PetaniNavbar from '../../components/petani/PetaniNavbar';
import Footer from '../../components/petani/Footer';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, User, MessageSquare, CheckCircle, Send, Loader } from 'lucide-react';

// --- Komponen-komponen Kecil untuk Halaman ---

const AnswerCard = ({ answer }) => {
  const isPenyuluh = answer.penjawab_role === 'penyuluh';
  return (
    <div className={`flex items-start gap-4 p-6 rounded-2xl ${isPenyuluh ? 'bg-emerald-900/50 border border-emerald-700' : 'bg-slate-800/50 border border-slate-800'}`}>
      <div className={`w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 ${isPenyuluh && 'bg-emerald-800'}`}>
        <User className={`w-6 h-6 ${isPenyuluh ? 'text-emerald-300' : 'text-slate-400'}`} />
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <p className="font-bold text-white">{answer.penjawab_nama}</p>
          {isPenyuluh && <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-600">Penyuluh</span>}
        </div>
        <p className="text-sm text-slate-400 mb-2">Menjawab pada {new Date(answer.created_at).toLocaleString('id-ID')}</p>
        <p className="text-slate-200 whitespace-pre-wrap">{answer.isi}</p>
      </div>
    </div>
  );
};

// --- Komponen Utama Halaman Detail Topik ---

export default function DetailTopik() {
  const { topikId } = useParams();
  const [topik, setTopik] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fungsionalitas tidak diubah
    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
    };
    fetchUser();

    const fetchTopikAndAnswers = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: topikData, error: topikError } = await supabase.from('topik_diskusi').select('*').eq('id', topikId).single();
            if (topikError) throw topikError;

            const { data: answersData, error: answersError } = await supabase.from('jawaban_diskusi').select('*').eq('topik_id', topikId).order('created_at', { ascending: true });
            if (answersError) throw answersError;

            setTopik(topikData);
            setAnswers(answersData || []);
        } catch(err) {
            setError(`Gagal memuat data: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    fetchTopikAndAnswers();

    const channel = supabase.channel(`jawaban-topik-${topikId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'jawaban_diskusi', filter: `topik_id=eq.${topikId}` },
            (payload) => {
                setAnswers(currentAnswers => [...currentAnswers, payload.new]);
            }
        ).subscribe();

    return () => supabase.removeChannel(channel);

  }, [topikId]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim() || !user) return;
    setIsSubmitting(true);
    try {
        const { data: userProfile } = await supabase.from('users').select('role, nama_lengkap').eq('id', user.id).single();
        const { error } = await supabase.from('jawaban_diskusi').insert({
            isi: newAnswer,
            topik_id: topikId,
            penjawab_id: user.id,
            penjawab_nama: userProfile?.nama_lengkap || user.email,
            penjawab_role: userProfile?.role || 'petani'
        });
        if (error) throw error;
        setNewAnswer('');
    } catch (err) {
        alert(`Gagal mengirim jawaban: ${err.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">Memuat diskusi...</div>;
  if (error) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-red-400">{error}</div>;
  if (!topik) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">Topik tidak ditemukan.</div>;

  return (
    <div className="bg-slate-900 min-h-screen">
      <PetaniNavbar />
      <main className="container mx-auto px-4 py-12 pt-28 md:pt-32">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/petani/konsultasi" className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 mb-4">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Kembali ke Semua Diskusi
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{topik.judul}</h1>
            <p className="text-sm text-slate-400 mt-2">
              Ditanyakan oleh <span className="font-semibold text-slate-300">{topik.penanya_nama}</span> pada {new Date(topik.created_at).toLocaleDateString('id-ID')}
            </p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800 mb-10">
            <p className="text-slate-200 whitespace-pre-wrap">{topik.isi}</p>
            {topik.foto_url && <img src={topik.foto_url} alt="Foto pendukung" className="mt-4 rounded-lg max-w-sm border border-slate-700"/>}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">{answers.length} Jawaban</h2>
          </div>

          <div className="space-y-6">
            {answers.map(answer => <AnswerCard key={answer.id} answer={answer} />)}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4">Ikut Berdiskusi</h3>
            <form onSubmit={handleAnswerSubmit} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800">
              <textarea value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} placeholder="Tulis jawaban Anda di sini..." rows="5" className="w-full px-4 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg mb-4"></textarea>
              <div className="flex justify-end">
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 disabled:opacity-50">
                  {isSubmitting ? <Loader className="animate-spin w-4 h-4"/> : <Send className="w-4 h-4" />}
                  {isSubmitting ? 'Mengirim...' : 'Kirim Jawaban'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
