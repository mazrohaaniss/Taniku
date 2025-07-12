import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function TambahBantuan() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jenis_bantuan: '',
    deskripsi: '',
    jumlah: '',
    satuan: 'kg',
    foto: null,
  });
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login', { replace: true });
      } else {
        setUser(user);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'foto' && files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Sesi tidak valid. Silakan login ulang.');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);

    try {
      let fotoUrl = null;
      if (formData.foto) {
        const filePath = `${user.id}/${Date.now()}_${formData.foto.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('bantuan-photos')
          .upload(filePath, formData.foto);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('bantuan-photos')
          .getPublicUrl(filePath);
        
        fotoUrl = urlData.publicUrl;
      }
      
      const dataToInsert = {
        petani_id: user.id,
        jenis_bantuan: formData.jenis_bantuan,
        deskripsi: formData.deskripsi,
        jumlah: formData.jumlah ? parseFloat(formData.jumlah) : null,
        satuan: (formData.jenis_bantuan === 'Pupuk' || formData.jenis_bantuan === 'Bibit') ? formData.satuan : null,
        status: 'Diajukan',
        foto_url: fotoUrl,
      };
      
      const { error: insertError } = await supabase.from('pengajuan_bantuan').insert([dataToInsert]);
      
      if (insertError) throw insertError;

      alert('Pengajuan bantuan berhasil dikirim!');
      navigate('/petani/bantuan');

    } catch (err) {
      setError(`Gagal: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return <div className="text-center py-10">Memverifikasi sesi...</div>
  }

  return (
    <div>
      <Link to="/petani/bantuan" className="text-emerald-500 hover:underline mb-6 inline-block">← Kembali ke Halaman Bantuan</Link>
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Formulir Ajuan Bantuan</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="jenis_bantuan" className="block text-sm font-medium text-gray-300">Jenis Bantuan</label>
            <select
              id="jenis_bantuan"
              name="jenis_bantuan"
              value={formData.jenis_bantuan}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-600 rounded-lg text-white bg-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              <option value="">-- Pilih Jenis Bantuan --</option>
              <option value="Pupuk">Pupuk Subsidi</option>
              <option value="Bibit">Bibit Unggul</option>
              <option value="Alat">Sewa Alat Pertanian</option>
              <option value="Pelatihan">Pelatihan Pertanian</option>
            </select>
          </div>
          <div>
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-300">Deskripsi Kebutuhan</label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              placeholder="Jelaskan kebutuhan Anda secara rinci..."
              className="mt-1 w-full p-3 border border-gray-600 rounded-lg text-white bg-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
              rows="3"
              required
            />
          </div>
          {(formData.jenis_bantuan === 'Pupuk' || formData.jenis_bantuan === 'Bibit') && (
            <div>
              <label htmlFor="jumlah" className="block text-sm font-medium text-gray-300">Jumlah (kg)</label>
              <input
                id="jumlah"
                type="number"
                name="jumlah"
                value={formData.jumlah}
                onChange={handleChange}
                placeholder="Contoh: 50"
                className="mt-1 w-full p-3 border border-gray-600 rounded-lg text-white bg-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="foto" className="block text-sm font-medium text-gray-300">Foto Pendukung (Opsional)</label>
            <input
              id="foto"
              type="file"
              name="foto"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-900 file:text-emerald-300 hover:file:bg-emerald-800"
            />
          </div>
          {error && <p className="text-red-400 text-center text-sm">{error}</p>}
          <div className="pt-4 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 text-white p-3 rounded-lg font-bold hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors"
            >
              {isSubmitting ? 'Mengirim...' : 'Ajukan Bantuan'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/petani/bantuan')}
              className="w-full bg-gray-600 text-white p-3 rounded-lg font-bold hover:bg-gray-500 transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}