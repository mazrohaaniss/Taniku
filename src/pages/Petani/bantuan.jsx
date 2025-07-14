import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import PetaniNavbar from '../../components/petani/PetaniNavbar';
import Footer from '../../components/petani/Footer';
import { Plus, Bell, Package, Tractor, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';

// --- Komponen-komponen Kecil untuk Halaman ---

// Komponen untuk Status Badge yang stylish
const StatusBadge = ({ status }) => {
  const baseClasses = "absolute top-4 right-4 px-2.5 py-1 text-xs font-semibold rounded-full";
  let specificClasses = "bg-yellow-900/50 text-yellow-300 border border-yellow-700/50"; // Default: Diajukan

  if (status === 'Disetujui') {
    specificClasses = "bg-green-900/50 text-green-300 border border-green-700/50";
  } else if (status === 'Ditolak') {
    specificClasses = "bg-red-900/50 text-red-300 border border-red-700/50";
  }
  
  return <span className={`${baseClasses} ${specificClasses}`}>{status}</span>;
};

// Komponen untuk Ikon Jenis Bantuan
const BantuanIcon = ({ jenis }) => {
    const iconProps = { className: "w-6 h-6 text-emerald-400" };
    switch(jenis) {
        case 'Pupuk': return <Package {...iconProps} />;
        case 'Bibit': return <CheckCircle {...iconProps} />;
        case 'Alat': return <Tractor {...iconProps} />;
        case 'Pelatihan': return <BookOpen {...iconProps} />;
        default: return null;
    }
}

// --- Komponen Utama Halaman Bantuan ---

export default function Bantuan() {
  const [pengajuanList, setPengajuanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Fungsi untuk mengambil data pengajuan dari Supabase
  useEffect(() => {
    const fetchPengajuan = async () => {
      if (pengajuanList.length === 0) setLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Pengguna tidak terautentikasi.');

        const { data, error: fetchError } = await supabase
          .from('pengajuan_bantuan')
          .select('*')
          .eq('petani_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setPengajuanList(data || []);
      } catch (error) {
        setError(`Gagal memuat data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPengajuan();

    // Listener realtime untuk perubahan data
    const channel = supabase
      .channel('pengajuan-bantuan-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pengajuan_bantuan' }, 
        (payload) => {
          fetchPengajuan();
          setNotification(`Data bantuan telah diperbarui!`);
          setTimeout(() => setNotification(null), 4000);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  // Tampilan saat loading
  if (loading) return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">
          Memuat data pengajuan...
      </div>
  );

  // Tampilan saat error
  if (error) return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center text-red-400">
          {error}
      </div>
  );

  return (
    <div className="bg-slate-900 min-h-screen">
      <PetaniNavbar />
      <main className="container mx-auto px-4 py-12 pt-28 md:pt-32">
        {/* Hero Section Halaman */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 leading-tight">
            Pusat Bantuan Petani
          </h1>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-lg">
            Ajukan bantuan dan pantau statusnya dengan mudah. Kami siap mendukung kesuksesan pertanian Anda.
          </p>
        </div>

        {/* Tombol Aksi dan Notifikasi */}
        <div className="mb-8 flex justify-end">
          <Link 
              to="/petani/bantuan/tambah" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-bold hover:scale-105 transition-transform shadow-2xl shadow-emerald-800/30"
          >
            <Plus className="w-5 h-5" />
            <span>Ajukan Bantuan Baru</span>
          </Link>
        </div>
        {notification && (
          <div className="bg-emerald-900/70 border border-emerald-700 text-emerald-300 p-3 rounded-lg mb-6 flex items-center space-x-3">
              <Bell className="w-5 h-5"/>
              <span>{notification}</span>
          </div>
        )}

        {/* Konten Utama: Daftar Pengajuan */}
        {pengajuanList.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-dashed border-slate-700">
            <p className="text-slate-300 font-semibold text-xl">Belum ada riwayat pengajuan.</p>
            <p className="text-sm text-slate-500 mt-2">Klik tombol "Ajukan Bantuan Baru" untuk memulai.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pengajuanList.map((pengajuan) => (
              <Link 
                to={`/petani/bantuan/${pengajuan.id}`}
                key={pengajuan.id}
                className="relative block bg-slate-800/50 p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 group"
              >
                <StatusBadge status={pengajuan.status} />
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                      <BantuanIcon jenis={pengajuan.jenis_bantuan} />
                  </div>
                  <div>
                      <h2 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">{pengajuan.jenis_bantuan}</h2>
                      <p className="text-xs text-slate-500">
                          Diajukan: {formatDate(pengajuan.created_at)}
                      </p>
                  </div>
                </div>
                <p className="text-sm text-slate-300 line-clamp-3 h-[60px]">
                  {pengajuan.deskripsi}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-end">
                    <div className="inline-flex items-center text-emerald-400 font-semibold group-hover:gap-3 transition-all text-sm">
                        Lihat Detail <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
