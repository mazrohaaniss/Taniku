import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    password: '',
    no_wa: '',
    role: 'petani',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      alert('Password minimal harus 6 karakter.');
      return;
    }

    setLoading(true);
    console.log("--- MEMULAI PROSES REGISTRASI ---");
    console.log("1. Data yang akan dikirim:", formData);

    try {
      console.log("2. Mengirim permintaan ke Supabase...");
      
      // Permintaan ke Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nama_lengkap: formData.namaLengkap,
            role: formData.role,
            no_wa: formData.no_wa,
          },
        },
      });

      console.log("3. Permintaan ke Supabase SELESAI.");
      console.log("   - Data yang diterima:", data);
      console.log("   - Error yang diterima:", error);

      if (error) {
        console.error("4. Ditemukan error, proses dihentikan.");
        throw error; // Lemparkan error untuk ditangkap oleh catch block
      }
      
      console.log("5. Tidak ada error, pendaftaran berhasil.");
      alert('Pendaftaran berhasil! Anda akan diarahkan ke halaman Login.');
      navigate('/login');

    } catch (error) {
      console.error("6. Terjadi kesalahan di dalam blok catch:", error);
      alert("Gagal mendaftar: " + (error.error_description || error.message));
    } finally {
      console.log("7. Proses selesai, loading dihentikan.");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Register Akun Taniku (Mode Debug)</h2>
      <form onSubmit={handleRegister}>
        <input type="text" name="namaLengkap" placeholder="Nama Lengkap" onChange={handleChange} required />
        <input type="text" name="no_wa" placeholder="Nomor WhatsApp (Opsional)" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password (min. 6 karakter)" onChange={handleChange} required />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="petani">Petani</option>
          <option value="dinas">Dinas Pertanian</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Mendaftar...' : 'Register'}
        </button>
      </form>
      <p>Sudah punya akun? <Link to="/login">Login di sini</Link></p>
    </div>
  );
}