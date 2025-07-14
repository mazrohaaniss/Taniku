import { BarChart, Map, ShieldCheck, Users } from 'lucide-react';
import DinasSidebar from '../../components/dinas/DinasSidebar';
import DinasHeader from '../../components/dinas/DinasHeader';
import DinasFooter from '../../components/dinas/Footer';

// Komponen Kartu Statistik untuk tema terang
const StatCard = ({ icon, title, value, description, color }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-lg bg-${color}-100`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  </div>
);

// Komponen untuk item list untuk tema terang
const ListItem = ({ title, subtitle, status, statusColor }) => (
  <div className="flex justify-between items-center py-3">
    <div>
      <p className="font-semibold text-gray-800">{title}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
    <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${statusColor}-100 text-${statusColor}-700`}>
      {status}
    </span>
  </div>
);

export default function DashboardDinas() {
  // Data dummy untuk desain
  const stats = {
    totalPetani: 1250,
    totalLahan: "875.5 Ha",
    pengajuanBantuan: 8,
    topikBaru: 3,
  };

  const recentBantuan = [
    { id: 1, nama: "Budi Santoso", jenis: "Pupuk Subsidi", status: "Menunggu", color: "yellow" },
    { id: 2, nama: "Siti Aminah", jenis: "Bibit Jagung", status: "Menunggu", color: "yellow" },
    { id: 3, nama: "Eko Prasetyo", jenis: "Sewa Alat", status: "Disetujui", color: "green" },
  ];
  
  const recentTopik = [
      { id: 1, judul: "Cara mengatasi hama wereng?", oleh: "Ahmad Fauzi", status: "Belum Dijawab", color: "red" },
      { id: 2, judul: "Jarak tanam cabai?", oleh: "Joko Susilo", status: "Dijawab", color: "green" },
  ];

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

            {/* Kartu Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={<Users className="w-6 h-6 text-blue-600"/>} title="Total Petani" value={stats.totalPetani} description="+20 bulan ini" color="blue" />
              <StatCard icon={<Map className="w-6 h-6 text-emerald-600"/>} title="Total Luas Lahan" value={stats.totalLahan} description="Terkelola" color="emerald" />
              <StatCard icon={<ShieldCheck className="w-6 h-6 text-yellow-600"/>} title="Pengajuan Bantuan" value={stats.pengajuanBantuan} description="Perlu ditinjau" color="yellow" />
              <StatCard icon={<BarChart className="w-6 h-6 text-purple-600"/>} title="Topik Forum Baru" value={stats.topikBaru} description="Perlu jawaban" color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Daftar Pengajuan Bantuan Terbaru */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="font-bold text-lg text-gray-800 mb-4">Pengajuan Bantuan Terbaru</h2>
                <div className="divide-y divide-gray-200">
                  {recentBantuan.map(item => <ListItem key={item.id} title={item.nama} subtitle={item.jenis} status={item.status} statusColor={item.color} />)}
                </div>
              </div>

              {/* Daftar Topik Forum Terbaru */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="font-bold text-lg text-gray-800 mb-4">Diskusi Forum Terbaru</h2>
                 <div className="divide-y divide-gray-200">
                  {recentTopik.map(item => <ListItem key={item.id} title={item.judul} subtitle={`Oleh: ${item.oleh}`} status={item.status} statusColor={item.color} />)}
                </div>
              </div>
            </div>
          </div>
          <DinasFooter />
        </main>
      </div>
    </div>
  );
}
