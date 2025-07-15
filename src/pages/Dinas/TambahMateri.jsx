import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import DinasSidebar from '../../components/dinas/DinasSidebar';
import DinasHeader from '../../components/dinas/DinasHeader';
import DinasFooter from '../../components/dinas/Footer';
import { ChevronLeft, Send } from 'lucide-react';

export default function TambahMateri() {
    const [formData, setFormData] = useState({
        judul: '',
        tipe: 'Artikel',
        kategori: '',
        konten: '',
        video_url: ''
    });
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
            if (dataToInsert.tipe === 'Artikel') {
                dataToInsert.video_url = null;
            } else {
                dataToInsert.konten = null;
            }

            const { error } = await supabase.from('materi_edukasi').insert([dataToInsert]);
            if (error) throw error;

            alert('Materi berhasil ditambahkan!');
            navigate('/dinas/edukasi');
        } catch (err) {
            alert(`Gagal menambahkan materi: ${err.message}`);
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
                        <Link to="/dinas/edukasi" className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-800 font-semibold mb-4">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Kembali ke Daftar Materi
                        </Link>
                        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                            <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Materi Edukasi Baru</h1>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-1">Judul Materi</label>
                                    <input type="text" name="judul" id="judul" value={formData.judul} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg" />
                                </div>
                                <div>
                                    <label htmlFor="tipe" className="block text-sm font-medium text-gray-700 mb-1">Tipe Materi</label>
                                    <select name="tipe" id="tipe" value={formData.tipe} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg">
                                        <option value="Artikel">Artikel</option>
                                        <option value="Video">Video</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                    <input type="text" name="kategori" id="kategori" value={formData.kategori} onChange={handleChange} placeholder="Contoh: Pemupukan, Hama, dll." required className="w-full p-2 border border-gray-300 rounded-lg" />
                                </div>
                                {formData.tipe === 'Artikel' ? (
                                    <div>
                                        <label htmlFor="konten" className="block text-sm font-medium text-gray-700 mb-1">Isi Artikel</label>
                                        <textarea name="konten" id="konten" value={formData.konten} onChange={handleChange} rows="10" required className="w-full p-2 border border-gray-300 rounded-lg"></textarea>
                                    </div>
                                ) : (
                                    <div>
                                        <label htmlFor="video_url" className="block text-sm font-medium text-gray-700 mb-1">URL Video (YouTube)</label>
                                        <input type="url" name="video_url" id="video_url" value={formData.video_url} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=..." required className="w-full p-2 border border-gray-300 rounded-lg" />
                                    </div>
                                )}
                                <div className="text-right">
                                    <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50">
                                        <Send className="w-5 h-5 mr-2" />
                                        {isSubmitting ? 'Menyimpan...' : 'Simpan Materi'}
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
