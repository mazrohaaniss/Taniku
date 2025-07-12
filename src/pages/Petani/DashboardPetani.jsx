import { useEffect, useState } from 'react';
import { Plus, MapPin, Calendar, Wheat, Edit2, Trash2, Users, TrendingUp } from 'lucide-react';

function DashboardPetani() {
  const [user, setUser] = useState({ email: 'petani@example.com' });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    jenisTanaman: '',
    luasLahan: '',
    estimasiPanen: '',
    tanggalTanam: '',
    lokasi: ''
  });

  // Data tanaman
  const [tanamanData, setTanamanData] = useState([
    {
      id: 1,
      jenisTanaman: 'Padi',
      luasLahan: 2.5,
      estimasiPanen: '2024-12-15',
      tanggalTanam: '2024-09-01',
      lokasi: 'Sawah Timur',
      status: 'Tumbuh'
    },
    {
      id: 2,
      jenisTanaman: 'Jagung',
      luasLahan: 1.2,
      estimasiPanen: '2024-11-20',
      tanggalTanam: '2024-08-15',
      lokasi: 'Ladang Utara',
      status: 'Berbunga'
    }
  ]);

  const jenisOptions = [
    'Padi', 'Jagung', 'Kedelai', 'Kacang Tanah', 'Singkong', 'Ubi Jalar',
    'Tomat', 'Cabai', 'Bawang Merah', 'Bawang Putih', 'Kangkung', 'Bayam'
  ];

  const handleSubmit = () => {
    
    if (editingItem) {
      // Update existing item
      setTanamanData(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData, luasLahan: parseFloat(formData.luasLahan) }
          : item
      ));
      setEditingItem(null);
    } else {
      // Add new item
      const newItem = {
        id: Date.now(),
        ...formData,
        luasLahan: parseFloat(formData.luasLahan),
        status: 'Baru Tanam'
      };
      setTanamanData(prev => [...prev, newItem]);
    }
    
    // Reset form
    setFormData({
      jenisTanaman: '',
      luasLahan: '',
      estimasiPanen: '',
      tanggalTanam: '',
      lokasi: ''
    });
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setFormData({
      jenisTanaman: item.jenisTanaman,
      luasLahan: item.luasLahan.toString(),
      estimasiPanen: item.estimasiPanen,
      tanggalTanam: item.tanggalTanam,
      lokasi: item.lokasi
    });
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setTanamanData(prev => prev.filter(item => item.id !== id));
  };

  const totalLuas = tanamanData.reduce((sum, item) => sum + item.luasLahan, 0);
  const totalTanaman = tanamanData.length;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Baru Tanam': return 'bg-blue-100 text-blue-800';
      case 'Tumbuh': return 'bg-green-100 text-green-800';
      case 'Berbunga': return 'bg-yellow-100 text-yellow-800';
      case 'Siap Panen': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-10">Memuat data pengguna...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Petani</h1>
              <p className="text-gray-600">Selamat datang, <span className="font-semibold">{user.email}</span></p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Tambah Tanaman
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Wheat className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tanaman</p>
                <p className="text-2xl font-bold text-gray-900">{totalTanaman}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Luas Lahan</p>
                <p className="text-2xl font-bold text-gray-900">{totalLuas.toFixed(1)} Ha</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Produktivitas</p>
                <p className="text-2xl font-bold text-gray-900">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {editingItem ? 'Edit Tanaman' : 'Tambah Tanaman Baru'}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jenis Tanaman
                    </label>
                    <select
                      value={formData.jenisTanaman}
                      onChange={(e) => setFormData({...formData, jenisTanaman: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    >
                      <option value="">Pilih jenis tanaman</option>
                      {jenisOptions.map(jenis => (
                        <option key={jenis} value={jenis}>{jenis}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Luas Lahan (Hektar)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.luasLahan}
                      onChange={(e) => setFormData({...formData, luasLahan: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Contoh: 2.5"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Tanam
                    </label>
                    <input
                      type="date"
                      value={formData.tanggalTanam}
                      onChange={(e) => setFormData({...formData, tanggalTanam: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimasi Panen
                    </label>
                    <input
                      type="date"
                      value={formData.estimasiPanen}
                      onChange={(e) => setFormData({...formData, estimasiPanen: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lokasi Lahan
                    </label>
                    <input
                      type="text"
                      value={formData.lokasi}
                      onChange={(e) => setFormData({...formData, lokasi: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Contoh: Sawah Timur"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingItem(null);
                        setFormData({
                          jenisTanaman: '',
                          luasLahan: '',
                          estimasiPanen: '',
                          tanggalTanam: '',
                          lokasi: ''
                        });
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      {editingItem ? 'Update' : 'Simpan'}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingItem(null);
                      setFormData({
                        jenisTanaman: '',
                        luasLahan: '',
                        estimasiPanen: '',
                        tanggalTanam: '',
                        lokasi: ''
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    {editingItem ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Data Tanaman</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanaman
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Luas Lahan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Tanam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estimasi Panen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tanamanData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.jenisTanaman}</div>
                        <div className="text-sm text-gray-500">{item.lokasi}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.luasLahan} Ha</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(item.tanggalTanam)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(item.estimasiPanen)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-emerald-600 hover:text-emerald-800 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {tanamanData.length === 0 && (
            <div className="text-center py-12">
              <Wheat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada data tanaman</p>
              <p className="text-sm text-gray-400">Klik tombol "Tambah Tanaman" untuk mulai mengelola lahan Anda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPetani;