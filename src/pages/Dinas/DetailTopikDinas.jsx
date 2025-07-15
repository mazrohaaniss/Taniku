import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import DinasSidebar from '../../components/dinas/DinasSidebar';
import DinasHeader from '../../components/dinas/DinasHeader';
import DinasFooter from '../../components/dinas/Footer';
import { ChevronLeft, Send, User, CheckCircle } from 'lucide-react';

const JawabanCard = ({ jawaban }) => {
    const isDinas = jawaban.penjawab_role === 'dinas';
    return (
        <div className={`p-4 rounded-lg ${isDinas ? 'bg-emerald-50 border-l-4 border-emerald-500' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-full ${isDinas ? 'bg-emerald-500' : 'bg-gray-500'}`}>
                        {isDinas ? <CheckCircle className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">{jawaban.penjawab_nama}</p>
                        <p className="text-xs text-gray-500 capitalize">{jawaban.penjawab_role}</p>
                    </div>
                </div>
                <p className="text-xs text-gray-400">{new Date(jawaban.created_at).toLocaleString('id-ID')}</p>
            </div>
            <p className="text-gray-700 mt-3 whitespace-pre-wrap">{jawaban.isi}</p>
        </div>
    );
};

export default function DetailTopikDinas() {
  const { topikId } = useParams();
  const [topik, setTopik] = useState(null);
  const [jawabanList, setJawabanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jawabanBaru, setJawabanBaru] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAllData = async () => {
      try {
        const { data: topikData, error: topikError } = await supabase
          .from('topik_diskusi')
          .select('*')
          .eq('id', topikId)
          .single();
        if (topikError) throw topikError;
        setTopik(topikData);

        const { data: jawabanData, error: jawabanError } = await supabase
          .from('jawaban_diskusi')
          .select('*')
          .eq('topik_id', topikId)
          .order('created_at', { ascending: true });
        if (jawabanError) throw jawabanError;
        setJawabanList(jawabanData || []);
      } catch (err) {
        setError(`Gagal memuat data: ${err.message}`);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchAllData();
  }, [topikId]);

  const handleJawabanSubmit = async (e) => {
    e.preventDefault();
    if (!jawabanBaru.trim()) return;

    setIsSubmitting(true);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Anda harus login untuk menjawab.');

        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('nama_lengkap, role')
            .eq('id', user.id)
            .single();
        if (profileError) throw profileError;

        const dataToInsert = {
            isi: jawabanBaru,
            topik_id: topikId,
            penjawab_id: user.id,
            penjawab_nama: userProfile.nama_lengkap,
            penjawab_role: userProfile.role,
        };

        const { error: insertError } = await supabase.from('jawaban_diskusi').insert([dataToInsert]);
        if (insertError) throw insertError;

        setJawabanBaru('');
        await fetchAllData(); // Muat ulang semua data setelah berhasil mengirim
    } catch (err) {
        alert(`Gagal mengirim jawaban: ${err.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex min-h-screen bg-gray-50 items-center justify-center">Memuat detail topik...</div>;
  if (error) return <div className="flex min-h-screen bg-gray-50 items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DinasSidebar />
      <div className="flex-1 flex flex-col">
        <DinasHeader />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <Link to="/dinas/konsultasi" className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-800 font-semibold mb-4">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Kembali ke Forum
              </Link>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">{topik.judul}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Oleh {topik.penanya_nama} pada {new Date(topik.created_at).toLocaleDateString('id-ID')}
                </p>
                <div className="border-t my-4"></div>
                <p className="text-gray-700 whitespace-pre-wrap">{topik.isi}</p>
                {topik.foto_url && <img src={topik.foto_url} alt="Foto Pendukung" className="mt-4 rounded-lg max-w-md w-full" />}
              </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Jawaban ({jawabanList.length})</h2>
                {jawabanList.length > 0 ? (
                    jawabanList.map(jawaban => <JawabanCard key={jawaban.id} jawaban={jawaban} />)
                ) : (
                    <p className="text-center text-gray-500 py-4">Belum ada jawaban.</p>
                )}
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Beri Jawaban Anda</h2>
                <form onSubmit={handleJawabanSubmit}>
                    <textarea
                        value={jawabanBaru}
                        onChange={(e) => setJawabanBaru(e.target.value)}
                        placeholder="Tulis jawaban Anda sebagai perwakilan dinas..."
                        rows="5"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        required
                    />
                    <button type="submit" disabled={isSubmitting} className="mt-4 w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                        <Send className="w-5 h-5 mr-2" />
                        {isSubmitting ? 'Mengirim...' : 'Kirim Jawaban'}
                    </button>
                </form>
            </div>

          </div>
        </main>
        <DinasFooter />
      </div>
    </div>
  );
}
