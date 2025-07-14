import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, CheckCircle, AlertTriangle, Loader, ChevronDown } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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
    setError('');
    setSuccessMessage('');

    if (formData.password.length < 6) {
      setError('Password minimal harus 6 karakter.');
      return;
    }
    
    setLoading(true);
    
    // Buat pengguna di sistem otentikasi Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        // Data ini akan diteruskan ke trigger di database
        data: {
          nama_lengkap: formData.namaLengkap,
          role: formData.role,
          no_wa: formData.no_wa,
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Jika semua berhasil, tampilkan pesan sukses dan redirect ke login
    setSuccessMessage('Pendaftaran berhasil! Anda akan dialihkan ke halaman login...');
    setTimeout(() => {
        navigate('/login');
    }, 2500); // Redirect setelah 2.5 detik
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-emerald-900 p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex justify-center items-center mb-6 space-x-3">
          <Leaf className="w-10 h-10 text-emerald-400" />
          <span className="text-3xl font-bold text-white">Taniku</span>
        </Link>
        
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-white mb-2">Buat Akun Baru</h2>
          <p className="text-center text-slate-300 mb-8">Bergabung dengan revolusi pertanian digital.</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              id="namaLengkap" type="text" name="namaLengkap"
              placeholder="Nama Lengkap" onChange={handleChange} required
              className="w-full px-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <input
              id="email" type="email" name="email"
              placeholder="Alamat Email" onChange={handleChange} required
              className="w-full px-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <input
              id="password" type="password" name="password"
              placeholder="Password (min. 6 karakter)" onChange={handleChange} required
              className="w-full px-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <input
              id="no_wa" type="tel" name="no_wa"
              placeholder="Nomor WhatsApp (Opsional)" onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <div className="relative">
              <select
                id="role" name="role" value={formData.role} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
              >
                <option value="petani" className="bg-slate-800">Saya seorang Petani</option>
                <option value="dinas" className="bg-slate-800">Saya dari Dinas Pertanian</option>
              </select>
              <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            
            {successMessage && (
              <div className="flex items-center space-x-3 text-center text-sm text-green-300 bg-green-900/50 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 flex-shrink-0"/>
                <span>{successMessage}</span>
              </div>
            )}
            {error && (
              <div className="flex items-center space-x-3 text-center text-sm text-red-400 bg-red-900/50 p-3 rounded-lg">
                <AlertTriangle className="w-5 h-5 flex-shrink-0"/>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !!successMessage}
              className={`w-full py-3 px-4 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 ${loading || successMessage ? 'opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'}`}
            >
              {loading ? <Loader className="animate-spin w-5 h-5 mx-auto" /> : 'Register'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
