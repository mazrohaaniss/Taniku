import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { BarChart, Map, ShieldCheck, Users, MessageSquare } from 'lucide-react';
import DinasSidebar from '../../components/dinas/DinasSidebar';
import DinasHeader from '../../components/dinas/DinasHeader';
import DinasFooter from '../../components/dinas/Footer';

// Komponen Kartu Statistik
const StatCard = ({ icon, title, value, description, color, linkTo }) => (
  <Link to={linkTo} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all">
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-lg bg-${color}-100`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  </Link>
);

// Komponen untuk item list
const ListItem = ({ title, subtitle, status, statusColor, linkTo }) => (
  <Link to={linkTo} className="flex justify-between items-center py-3 px-1 hover:bg-gray-50 rounded-md transition-colors">
    <div>
      <p className="font-semibold text-gray-800">{title}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
    <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${statusColor}-100 text-${statusColor}-800`}>
      {status}
    </span>
  </Link>
);

export default function DashboardDinas() {
  const [stats, setStats] = useState({
    totalPetani: 0,
    totalLahan: "0 Ha",
    pengajuanBantuan: 0,
    topikBaru: 0,
  });
  const [recentBantuan, setRecentBantuan] = useState([]);
  const [recentTopik, setRecentTopik] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          petaniRes,
          lahanRes,
          bantuanRes,
          topikRes,
          recentBantuanRes,
          recentTopikRes
        ] = await Promise.all([
          supabase.from('users').select('id', { count: 'exact' }).eq('role', 'petani'),
          supabase.from('lahan').select('luas_lahan_hektar'),
          supabase.from('pengajuan_bantuan').select('id', { count: 'exact' }).eq('status', 'Diajukan'),
          supabase.from('topik_diskusi').select('id, jawaban_diskusi(id)'),
          supabase.from('pengajuan_bantuan').select('id, jenis_bantuan, status, users(nama_lengkap)').order('created_at', { ascending: false }).limit(3),
          supabase.from('topik_diskusi').select('id, judul, penanya_nama, jawaban_diskusi(id)').order('created_at', { ascending: false }).limit(3)
        ]);

        if (petaniRes.error) throw petaniRes.error;
        if (lahanRes.error) throw lahanRes.error;
        if (bantuanRes.error) throw bantuanRes.error;
        if (topikRes.error) throw topikRes.error;
        if (recentBantuanRes.error) throw recentBantuanRes.error;
        if (recentTopikRes.error) throw recentTopikRes.error;
        
        const totalLahan = lahanRes.data?.reduce((sum, l) => sum + Number(l.luas_lahan_hektar), 0).toFixed(1) + " Ha";
        const topikBaru = topikRes.data?.filter(t => t.jawaban_diskusi.length === 0).length || 0;

        setStats({
          totalPetani: petaniRes.count || 0,
          totalLahan: totalLahan,
          pengajuanBantuan: bantuanRes.count || 0,
          topikBaru: topikBaru,
        });

        setRecentBantuan(recentBantuanRes.data.map(item => ({
          id: item.id,
          nama: item.users?.nama_lengkap || 'Petani',
          jenis: item.jenis_bantuan,
          status: item.status,
          color: item.status === 'Diajukan' ? 'yellow' : (item.status === 'Disetujui' ? 'green' : 'red')
        })));
        
        setRecentTopik(recentTopikRes.data.map(item => ({
          id: item.id,
          judul: item.judul,
          oleh: item.penanya_nama,
          status: item.jawaban_diskusi.length > 0 ? 'Dijawab' : 'Belum Dijawab',
          color: item.jawaban_diskusi.length > 0 ? 'green' : 'red'
        })));

      } catch (err) {
        setError("Gagal memuat data dashboard. " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex min-h-screen bg-gray-50 items-center justify-center"><p>Memuat data dashboard...</p></div>;
  }
  if (error) {
    return <div className="flex min-h-screen bg-gray-50 items-center justify-center"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DinasSidebar />
      <div className="flex-1 flex flex-col">
        <DinasHeader />
        <main className="flex-1 p-6 lg:p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard Dinas Pertanian</h1>
              <p className="text-gray-500">Ringkasan data pertanian di wilayah Anda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard linkTo="#" icon={<Users className="w-6 h-6 text-blue-600"/>} title="Total Petani" value={stats.totalPetani} description="Terdaftar di sistem" color="blue" />
              <StatCard linkTo="/dinas/analisis" icon={<Map className="w-6 h-6 text-emerald-600"/>} title="Total Luas Lahan" value={stats.totalLahan} description="Terkelola" color="emerald" />
              <StatCard linkTo="/dinas/bantuan" icon={<ShieldCheck className="w-6 h-6 text-yellow-600"/>} title="Pengajuan Bantuan" value={stats.pengajuanBantuan} description="Perlu ditinjau" color="yellow" />
              <StatCard linkTo="/dinas/konsultasi" icon={<MessageSquare className="w-6 h-6 text-purple-600"/>} title="Topik Belum Dijawab" value={stats.topikBaru} description="Perlu jawaban" color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="font-bold text-lg text-gray-800 mb-4">Pengajuan Bantuan Terbaru</h2>
                <div className="divide-y divide-gray-200">
                  {recentBantuan.length > 0 ? recentBantuan.map(item => 
                    <ListItem key={item.id} linkTo={`/dinas/bantuan/${item.id}`} title={item.nama} subtitle={item.jenis} status={item.status} statusColor={item.color} />
                  ) : <p className="text-sm text-gray-500 text-center py-4">Tidak ada pengajuan baru.</p>}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="font-bold text-lg text-gray-800 mb-4">Diskusi Forum Terbaru</h2>
                <div className="divide-y divide-gray-200">
                  {recentTopik.length > 0 ? recentTopik.map(item => 
                    <ListItem key={item.id} linkTo={`/dinas/konsultasi/${item.id}`} title={item.judul} subtitle={`Oleh: ${item.oleh}`} status={item.status} statusColor={item.color} />
                  ) : <p className="text-sm text-gray-500 text-center py-4">Tidak ada diskusi baru.</p>}
                </div>
              </div>
            </div>
          </div>
        </main>
        <DinasFooter />
      </div>
    </div>
  );
}
