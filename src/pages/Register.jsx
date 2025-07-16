import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, CheckCircle, AlertTriangle, ArrowLeft, ChevronDown } from 'lucide-react';

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
    setLoading(true);
    setError('');
    setSuccessMessage('');
  
    try {
      const { data, error: authError } = await supabase.auth.signUp({
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
  
      if (authError) throw authError;
  
      const { user } = data;
      if (user && user.email) {
        const { error: insertError } = await supabase.from('users').insert({
          id: user.id,
          email: user.email,
          nama_lengkap: formData.namaLengkap,
          role: formData.role,
          no_wa: formData.no_wa,
        });
  
        if (insertError) throw insertError;
      } else {
        throw new Error('Data pengguna tidak lengkap dari autentikasi.');
      }
  
      setSuccessMessage('Registrasi berhasil! Silakan verifikasi email Anda.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(`Gagal registrasi: ${err.message}`);
      console.error('Error lengkap:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-emerald-900 p-4 relative">
        {/* Tombol kembali yang responsif */}
        <Link to="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 inline-flex items-center text-slate-300 hover:text-white transition-colors z-20 group p-2 sm:p-0 rounded-full sm:rounded-none bg-slate-800/50 sm:bg-transparent">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium hidden sm:inline ml-2">Kembali ke Beranda</span>
        </Link>

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
              id="namaLengkap"
              type="text"
              name="namaLengkap"
              placeholder="Nama Lengkap"
              value={formData.namaLengkap}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Alamat Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password (min. 6 karakter)"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <input
              id="no_wa"
              type="tel"
              name="no_wa"
              placeholder="Nomor WhatsApp (Opsional)"
              value={formData.no_wa}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <div className="relative">
                <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
                >
                <option value="petani">Saya seorang Petani</option>
                <option value="dinas">Saya dari Dinas Pertanian</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <ChevronDown className="w-5 h-5" />
                </div>
            </div>

            {successMessage && (
              <div className="flex items-center space-x-3 text-center text-sm text-green-300 bg-green-900/50 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
            {error && (
              <div className="flex items-center space-x-3 text-center text-sm text-red-400 bg-red-900/50 p-3 rounded-lg">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || successMessage}
              className={`w-full py-3 px-4 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 ${
                loading || successMessage
                  ? 'opacity-50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
              }`}
            >
              {loading ? 'Mendaftarkan...' : 'Register'}
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
