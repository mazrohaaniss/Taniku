import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import DinasSidebar from '../../components/dinas/DinasSidebar';
import DinasHeader from '../../components/dinas/DinasHeader';
import DinasFooter from '../../components/dinas/Footer';
import { ChevronLeft, Send } from 'lucide-react';

export default function TambahPengumuman() {
    const [formData, setFormData] = useState({ judul: '', isi: '', tanggal_berakhir: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const dataToInsert = { ...formData };
            if (!dataToInsert.tanggal_berakhir) {
                dataToInsert.tanggal_berakhir = null;
            }
            const { error } = await supabase.from('pengumuman').insert([dataToInsert]);
            if (error) throw error;
            alert('Pengumuman berhasil dipublikasikan!');
            navigate('/dinas/pengumuman');
        } catch (err) {
            alert(`Gagal memublikasikan: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <DinasSidebar />
            <div className="flex-1 flex flex-col">
                <DinasHeader />
                <main className="flex-1 p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        <Link to="/dinas/pengumuman" className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-800 font-semibold mb-4">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Kembali ke Daftar Pengumuman
                        </Link>
                        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                            <h1 className="text-2xl font-bold text-gray-800 mb-6">Buat Pengumuman Baru</h1>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-1">Judul Pengumuman</label>
                                    <input type="text" name="judul" id="judul" value={formData.judul} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg" />
                                </div>
                                <div>
                                    <label htmlFor="isi" className="block text-sm font-medium text-gray-700 mb-1">Isi Pengumuman</label>
                                    <textarea name="isi" id="isi" value={formData.isi} onChange={handleChange} rows="8" required className="w-full p-2 border border-gray-300 rounded-lg"></textarea>
                                </div>
                                <div>
                                    <label htmlFor="tanggal_berakhir" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Berakhir (Opsional)</label>
                                    <input type="date" name="tanggal_berakhir" id="tanggal_berakhir" value={formData.tanggal_berakhir} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
                                </div>
                                <div className="text-right">
                                    <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50">
                                        <Send className="w-5 h-5 mr-2" />
                                        {isSubmitting ? 'Memublikasikan...' : 'Publikasikan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
                <DinasFooter />
            </div>
        </div>
    );
}
