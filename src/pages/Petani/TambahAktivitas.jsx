import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams, useNavigate } from 'react-router-dom';

export default function TambahAktivitas() {
  const { lahanId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jenis_aktivitas: '',
    tanggal_aktivitas: '',
    deskripsi: '',
    jumlah: '', // Tetap string untuk input awal
    satuan: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validasi data berdasarkan jenis aktivitas
    let validatedData = { lahan_id: lahanId, jenis_aktivitas: formData.jenis_aktivitas, tanggal_aktivitas: formData.tanggal_aktivitas };
    let jumlahValue = formData.jumlah ? parseFloat(formData.jumlah) : null;

    if (formData.jenis_aktivitas === 'Tanam') {
      if (!formData.tanggal_aktivitas || !formData.deskripsi) {
        setError('Tanggal Tanam dan Jenis Tanaman wajib diisi.');
        setLoading(false);
        return;
      }
      validatedData.deskripsi = `Tanam: ${formData.deskripsi}`;
    } else if (formData.jenis_aktivitas === 'Pupuk') {
      if (!formData.tanggal_aktivitas || !formData.deskripsi || !formData.jumlah) {
        setError('Tanggal, Jenis Pupuk, dan Jumlah wajib diisi.');
        setLoading(false);
        return;
      }
      if (isNaN(jumlahValue) || jumlahValue <= 0) {
        setError('Jumlah harus berupa angka positif.');
        setLoading(false);
        return;
      }
      validatedData.deskripsi = `Pupuk: ${formData.deskripsi}`;
      validatedData.jumlah = jumlahValue;
      validatedData.satuan = 'kg';
    } else if (formData.jenis_aktivitas === 'Air') {
      if (!formData.tanggal_aktivitas || !formData.deskripsi) {
        setError('Tanggal dan Catatan wajib diisi.');
        setLoading(false);
        return;
      }
      validatedData.deskripsi = formData.deskripsi;
    } else if (formData.jenis_aktivitas === 'Hama') {
      if (!formData.tanggal_aktivitas || !formData.deskripsi) {
        setError('Tanggal dan Deskripsi Gejala wajib diisi.');
        setLoading(false);
        return;
      }
      validatedData.deskripsi = formData.deskripsi;
    } else if (formData.jenis_aktivitas === 'Panen') {
      if (!formData.tanggal_aktivitas || !formData.jumlah) {
        setError('Tanggal Panen dan Jumlah Hasil wajib diisi.');
        setLoading(false);
        return;
      }
      if (isNaN(jumlahValue) || jumlahValue <= 0) {
        setError('Jumlah harus berupa angka positif.');
        setLoading(false);
        return;
      }
      validatedData.jumlah = jumlahValue;
      validatedData.satuan = 'kg';
    }

    try {
      const { error } = await supabase
        .from('aktivitas_lahan')
        .insert(validatedData);

      if (error) throw error;

      alert('Aktivitas berhasil ditambahkan!');
      navigate(`/petani/lahan/${lahanId}`);
    } catch (error) {
      setError(`Gagal menambahkan aktivitas: ${error.message}`);
      console.error('Error inserting activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    navigate(`/petani/lahan/${lahanId}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Tambah Catatan Aktivitas</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              className="w-full p-3 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              name="jenis_aktivitas"
              value={formData.jenis_aktivitas}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Jenis Aktivitas</option>
              <option value="Tanam">Tanam Bibit</option>
              <option value="Pupuk">Pemupukan</option>
              <option value="Air">Pengairan</option>
              <option value="Hama">Laporan Hama/Penyakit</option>
              <option value="Panen">Panen</option>
            </select>
            <input
              className="w-full p-3 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              type="date"
              name="tanggal_aktivitas"
              value={formData.tanggal_aktivitas}
              onChange={handleChange}
              required
            />
            {formData.jenis_aktivitas === 'Tanam' && (
              <input
                className="w-full p-3 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                type="text"
                name="deskripsi"
                placeholder="Jenis Tanaman/Varietas"
                value={formData.deskripsi}
                onChange={handleChange}
                required
              />
            )}
            {formData.jenis_aktivitas === 'Pupuk' && (
              <>
                <input
                  className="w-full p-3 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  type="text"
                  name="deskripsi"
                  placeholder="Jenis Pupuk (Urea, NPK, Kompos)"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  required
                />
                <input
                  className="w-full p-3 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  type="number"
                  step="0.1"
                  name="jumlah"
                  placeholder="Jumlah (kg)"
                  value={formData.jumlah}
                  onChange={handleChange}
                  required
                />
              </>
            )}
            {formData.jenis_aktivitas === 'Air' && (
              <input
                className="w-full p-3 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                type="text"
                name="deskripsi"
                placeholder="Catatan Singkat"
                value={formData.deskripsi}
                onChange={handleChange}
                required
              />
            )}
            {formData.jenis_aktivitas === 'Hama' && (
              <input
                className="w-full p-3 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                type="text"
                name="deskripsi"
                placeholder="Deskripsi Gejala"
                value={formData.deskripsi}
                onChange={handleChange}
                required
              />
            )}
            {formData.jenis_aktivitas === 'Panen' && (
              <input
                className="w-full p-3 rounded bg-gray-100 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                type="number"
                step="0.1"
                name="jumlah"
                placeholder="Jumlah Hasil (kg)"
                value={formData.jumlah}
                onChange={handleChange}
                required
              />
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 px-4 py-3 rounded text-white font-bold"
            >
              {loading ? 'Menyimpan...' : 'Simpan Aktivitas'}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="w-full mt-2 bg-gray-300 hover:bg-gray-400 px-4 py-3 rounded text-gray-900"
            >
              Batal
            </button>
            {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}