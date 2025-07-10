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
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nama_lengkap: formData.namaLengkap,
            no_wa: formData.no_wa,
            role: formData.role,
          },
        },
      });
      if (error) throw error;
      alert('Pendaftaran berhasil! Silakan login.');
      navigate('/login');
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Register Akun Taniku</h2>
      <form onSubmit={handleRegister}>
        <input style={{width: '95%', padding: '8px', marginBottom: '10px'}} type="text" name="namaLengkap" placeholder="Nama Lengkap" onChange={handleChange} required />
        <input style={{width: '95%', padding: '8px', marginBottom: '10px'}} type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input style={{width: '95%', padding: '8px', marginBottom: '10px'}} type="password" name="password" placeholder="Password (min. 6 karakter)" onChange={handleChange} required />
        <input style={{width: '95%', padding: '8px', marginBottom: '10px'}} type="tel" name="no_wa" placeholder="Nomor WhatsApp (Opsional)" onChange={handleChange} />
        <select style={{width: '100%', padding: '8px', marginBottom: '10px'}} name="role" value={formData.role} onChange={handleChange}>
          <option value="petani">Petani</option>
          <option value="dinas">Dinas Pertanian</option>
        </select>
        <button style={{width: '100%', padding: '10px'}} type="submit" disabled={loading}>
          {loading ? 'Mendaftar...' : 'Register'}
        </button>
      </form>
      <p>Sudah punya akun? <Link to="/login">Login</Link></p>
    </div>
  );
}