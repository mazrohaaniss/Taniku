import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import PetaniNavbar from '../../components/petani/PetaniNavbar';
import Footer from '../../components/petani/Footer';
import { ChevronLeft, User, Calendar, FileText, Video } from 'lucide-react';

// Komponen untuk merender video YouTube secara aman
const YouTubeEmbed = ({ url }) => {
  const getEmbedUrl = (videoUrl) => {
    try {
      const urlObj = new URL(videoUrl);
      let videoId = urlObj.searchParams.get('v');
      if (urlObj.hostname === 'youtu.be') {
        videoId = urlObj.pathname.substring(1);
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch (e) {
      return null;
    }
  };

  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) {
    return <p className="text-red-400">URL video tidak valid.</p>;
  }

  return (
    <div className="aspect-video w-full">
      <iframe
        width="100%"
        height="100%"
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-lg"
      ></iframe>
    </div>
  );
};

export default function DetailMateri() {
  const { materiId } = useParams();
  const [materi, setMateri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMateri = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('materi_edukasi')
          .select('*')
          .eq('id', materiId)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error("Materi tidak ditemukan.");
        
        setMateri(data);
      } catch (err) {
        setError(`Gagal memuat materi: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMateri();
  }, [materiId]);

  if (loading) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">Memuat materi...</div>;
  if (error) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-red-400">{error}</div>;
  if (!materi) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">Materi tidak ditemukan.</div>;

  return (
    <div className="bg-slate-900 min-h-screen">
      <PetaniNavbar />
      <main className="container mx-auto px-4 py-12 pt-28 md:pt-32">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link to="/petani/edukasi" className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 mb-6">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Kembali ke Pusat Edukasi
            </Link>
            <p className="text-emerald-400 font-semibold mb-2">{materi.kategori}</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">{materi.judul}</h1>
            <div className="flex items-center gap-6 text-sm text-slate-400 mt-4 border-t border-b border-slate-800 py-3">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4"/>
                    <span>Oleh: {materi.penulis}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4"/>
                    <span>Diterbitkan: {new Date(materi.created_at).toLocaleDateString('id-ID')}</span>
                </div>
            </div>
          </div>

          {/* Konten Materi */}
          <article className="prose prose-invert prose-lg max-w-none prose-p:text-slate-300 prose-headings:text-white prose-a:text-emerald-400 hover:prose-a:text-emerald-300">
            {materi.tipe === 'Video' ? (
              <YouTubeEmbed url={materi.video_url} />
            ) : (
              // Menggunakan dangerouslySetInnerHTML jika konten Anda berupa HTML, atau cukup {materi.konten} jika teks biasa
              <div dangerouslySetInnerHTML={{ __html: materi.konten }} />
            )}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
