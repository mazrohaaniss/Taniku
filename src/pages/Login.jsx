import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Error autentikasi:', authError);
        throw new Error('Gagal login. Periksa email dan password.');
      }

      console.log('Respons login:', data);

    
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (userError) {
        console.error('Error mengambil data pengguna:', userError);
        throw new Error('Gagal mengambil data pengguna.');
      }

      console.log('Data pengguna:', userData);


      if (userData.role === 'petani') {
        navigate('/petani/dashboard'); 
      } else if (userData.role === 'dinas') {
        navigate('/dinas/dashboard');
      } else {
        throw new Error('Role pengguna tidak valid.');
      }
    } catch (error) {
      console.error('Error login:', error);
      setError(error.message || 'Terjadi kesalahan saat login.');
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
          <h2 className="text-3xl font-bold text-center text-white mb-2">Selamat Datang Kembali</h2>
          <p className="text-center text-slate-300 mb-8">Login untuk melanjutkan</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="contoh@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            {error && (
              <div className="flex items-center space-x-3 text-center text-sm text-red-400 bg-red-900/50 p-3 rounded-lg">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
              }`}
            >
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Belum punya akun?{' '}
            <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Daftar di sini
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
