import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, BarChart3, Users, Shield, Target, Award, ChevronRight } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  // Data untuk slider di Hero Section
  const heroSlides = [
    {
      title: "Transformasi Digital Pertanian",
      subtitle: "Memberdayakan Petani Indonesia dengan Teknologi Terdepan",
      bg: "bg-gradient-to-br from-slate-900 via-indigo-900 to-emerald-900"
    },
    {
      title: "Kolaborasi dengan Dinas Pertanian",
      subtitle: "Sinergi Pemerintah dan Petani untuk Ketahanan Pangan",
      bg: "bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900"
    },
    {
      title: "Smart Farming Solution",
      subtitle: "Teknologi IoT dan AI untuk Pertanian Berkelanjutan",
      bg: "bg-gradient-to-br from-slate-900 via-emerald-900 to-green-900"
    }
  ];

  // Data untuk bagian statistik
  const stats = [
    { number: "10,000+", label: "Petani Terdaftar", icon: Users },
    { number: "500+", label: "Daerah Terlayani", icon: Target },
    { number: "95%", label: "Tingkat Kepuasan", icon: Award },
    { number: "24/7", label: "Dukungan Sistem", icon: Shield }
  ];

  // Logika & Efek
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(slideInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <Navbar scrollY={scrollY} />

      {/* Hero Section */}
      <section id="beranda" className="relative h-screen flex flex-col justify-center items-center text-white overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${slide.bg} ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-gray-200">
            {heroSlides[currentSlide].subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/login" className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
              <span>Masuk Sekarang</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/register" className="group bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Daftar Gratis</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-emerald-400' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-50/50 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 min-h-0">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group transform hover:scale-105 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl mb-4 group-hover:shadow-lg group-hover:rotate-3 transition-all duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-2">{stat.number}</h3>
                  <p className="text-slate-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Fitur Unggulan</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Teknologi terdepan untuk mendukung pertanian modern Indonesia</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="group bg-gradient-to-br from-white to-slate-50 p-8 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-100">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Smart Farming</h3>
              <p className="text-slate-600 leading-relaxed">Teknologi IoT dan AI untuk monitoring tanaman real-time, prediksi cuaca, dan optimalisasi hasil panen.</p>
            </div>
            {/* Feature Card 2 */}
            <div className="group bg-gradient-to-br from-white to-slate-50 p-8 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-100">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Data Analytics</h3>
              <p className="text-slate-600 leading-relaxed">Analisis mendalam untuk pengambilan keputusan berbasis data bersama Dinas Pertanian daerah.</p>
            </div>
            {/* Feature Card 3 */}
            <div className="group bg-gradient-to-br from-white to-slate-50 p-8 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-100">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Kolaborasi</h3>
              <p className="text-slate-600 leading-relaxed">Platform terintegrasi untuk kolaborasi petani, penyuluh, dan Dinas Pertanian dalam satu ekosistem.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section id="tentang" className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Kemitraan Strategis</h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Taniku bekerja sama dengan Dinas Pertanian di seluruh Indonesia untuk menciptakan ekosistem pertanian digital yang berkelanjutan dan inklusif.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-lg">Integrasi Data Pemerintah</h4>
                    <p className="text-slate-600 mt-1">Sinkronisasi data dengan sistem Dinas Pertanian untuk pelaporan yang akurat</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-lg">Program Subsidi Digital</h4>
                    <p className="text-slate-600 mt-1">Akses mudah ke program bantuan pemerintah melalui platform digital</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl">
                <h3 className="text-2xl font-bold mb-4">Komitmen Bersama</h3>
                <p className="text-lg mb-6 text-slate-200 leading-relaxed">
                  "Menciptakan pertanian Indonesia yang modern, berkelanjutan, dan berdaya saing global melalui transformasi digital yang inklusif."
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Terpercaya & Aman</p>
                    <p className="text-sm text-slate-300">Sertifikasi keamanan tingkat enterprise</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Bergabung dengan Revolusi Pertanian Digital</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-slate-300 leading-relaxed">
            Jadilah bagian dari transformasi pertanian Indonesia bersama Taniku.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
              <span>Daftar Sekarang</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="group bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Login</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}