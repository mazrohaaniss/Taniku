import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams, useNavigate } from 'react-router-dom';

export default function TambahAktivitas() {
  const { lahanId } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    jenis_aktivitas: '',
    tanggal_aktivitas: '',
    deskripsi: '',
    jumlah: '',
    satuan: '',
    foto_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let validatedData = { ...formData, lahan_id: lahanId };
    if (formData.jenis_aktivitas === 'Tanam') {
      if (!formData.tanggal_aktivitas || !formData.deskripsi) {
        setError('Tanggal Tanam dan Jenis Tanaman wajib diisi.');
        setLoading(false);
        return;
      }
      validatedData = { ...validatedData, deskripsi: `Tanam: ${formData.deskripsi}` };
    } else if (formData.jenis_aktivitas === 'Pupuk') {
      if (!formData.tanggal_aktivitas || !formData.deskripsi || !formData.jumlah) {
        setError('Tanggal, Jenis Pupuk, dan Jumlah wajib diisi.');
        setLoading(false);
        return;
      }
      validatedData = { ...validatedData, deskripsi: `Pupuk: ${formData.deskripsi}`, satuan: 'kg' };
    } else if (formData.jenis_aktivitas === 'Air') {
      if (!formData.tanggal_aktivitas || !formData.deskripsi) {
        setError('Tanggal dan Catatan wajib diisi.');
        setLoading(false);
        return;
      }
    } else if (formData.jenis_aktivitas === 'Hama') {
      if (!formData.tanggal_aktivitas || !formData.deskripsi) {
        setError('Tanggal dan Deskripsi Gejala wajib diisi.');
        setLoading(false);
        return;
      }
    } else if (formData.jenis_aktivitas === 'Panen') {
      if (!formData.tanggal_aktivitas || !formData.jumlah) {
        setError('Tanggal Panen dan Jumlah Hasil wajib diisi.');
        setLoading(false);
        return;
      }
      validatedData = { ...validatedData, satuan: 'kg' };
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
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    navigate(`/petani/lahan/${lahanId}`);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white text-center">Tambah Catatan Aktivitas</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
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
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
            type="date"
            name="tanggal_aktivitas"
            value={formData.tanggal_aktivitas}
            onChange={handleChange}
            required
          />
          {formData.jenis_aktivitas === 'Tanam' && (
            <input
              className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
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
                className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
                type="text"
                name="deskripsi"
                placeholder="Jenis Pupuk (Urea, NPK, Kompos)"
                value={formData.deskripsi}
                onChange={handleChange}
                required
              />
              <input
                className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
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
              className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
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
              className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
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
              className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
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
            className="w-full mt-2 bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded text-white"
          >
            Batal
          </button>
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}