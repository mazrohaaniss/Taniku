import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import PetaniNavbar from '../../components/petani/PetaniNavbar';
import Footer from '../../components/petani/Footer';
import { User, Mail, Phone, Edit, Save, X, Loader } from 'lucide-react';

// Komponen untuk menampilkan item info
const InfoItem = ({ icon, label, value }) => (
    <div>
        <label className="text-xs text-slate-400">{label}</label>
        <div className="flex items-center gap-3 mt-1">
            <div className="text-slate-500">{icon}</div>
            <p className="font-semibold text-white">{value || '-'}</p>
        </div>
    </div>
);

// Komponen untuk input form saat mode edit
const EditInput = ({ name, label, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input 
            type="text" 
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2 bg-slate-800/70 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
    </div>
);

export default function Profil() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ nama_lengkap: '', no_wa: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Ambil data dari tabel 'users' yang kita buat, bukan 'user_metadata'
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('nama_lengkap, no_wa')
          .eq('id', user.id)
          .single();

        if (profileError) {
          setError('Gagal memuat profil.');
          console.error(profileError);
        } else {
          setProfile(profileData);
          setEditData(profileData || { nama_lengkap: '', no_wa: '' });
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: updateError } = await supabase
      .from('users')
      .update({
        nama_lengkap: editData.nama_lengkap,
        no_wa: editData.no_wa,
      })
      .eq('id', user.id);

    if (updateError) {
      setError('Gagal memperbarui profil.');
      console.error(updateError);
    } else {
      setProfile(editData);
      setIsEditing(false);
    }
    setLoading(false);
  };

  if (loading && !profile) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">Memuat profil...</div>;

  return (
    <div className="bg-slate-900 min-h-screen">
      <PetaniNavbar />
      <main className="container mx-auto px-4 py-12 pt-28 md:pt-32">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-slate-800">
                <User className="w-12 h-12 text-emerald-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">{profile?.nama_lengkap || user?.email}</h1>
            <p className="text-slate-400">Petani Terverifikasi</p>
          </div>

          {/* Konten Profil */}
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-800">
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Edit Profil</h2>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setIsEditing(false)} className="p-2 rounded-md bg-slate-700 hover:bg-slate-600"><X className="w-5 h-5"/></button>
                        <button type="submit" disabled={loading} className="p-2 rounded-md bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50">
                            {loading ? <Loader className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>}
                        </button>
                    </div>
                </div>
                <EditInput name="nama_lengkap" label="Nama Lengkap" value={editData.nama_lengkap} onChange={(e) => setEditData({...editData, nama_lengkap: e.target.value})} />
                <EditInput name="no_wa" label="Nomor WhatsApp" value={editData.no_wa} onChange={(e) => setEditData({...editData, no_wa: e.target.value})} />
                {error && <p className="text-sm text-red-400">{error}</p>}
              </form>
            ) : (
              <div>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Informasi Akun</h2>
                  <button onClick={() => setIsEditing(true)} className="inline-flex items-center text-sm bg-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 mr-2" /> Edit Profil
                  </button>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem icon={<User className="w-5 h-5"/>} label="Nama Lengkap" value={profile?.nama_lengkap} />
                  <InfoItem icon={<Mail className="w-5 h-5"/>} label="Email" value={user?.email} />
                  <InfoItem icon={<Phone className="w-5 h-5"/>} label="Nomor WhatsApp" value={profile?.no_wa} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
