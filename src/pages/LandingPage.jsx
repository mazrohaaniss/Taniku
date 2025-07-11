import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, BarChart3, Users, Shield, Target, Award, ChevronRight, Menu, X } from 'lucide-react';

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Data untuk slider di Hero Section
  const heroSlides = [
    {
      title: "Transformasi Digital Pertanian",
      subtitle: "Memberdayakan Petani Indonesia dengan Teknologi Terdepan",
      bg: "bg-gradient-to-br from-sky-400 to-emerald-300"
    },
    {
      title: "Kolaborasi dengan Dinas Pertanian",
      subtitle: "Sinergi Pemerintah dan Petani untuk Ketahanan Pangan",
      bg: "bg-gradient-to-br from-blue-300 to-emerald-200"
    },
    {
      title: "Smart Farming Solution",
      subtitle: "Teknologi IoT dan AI untuk Pertanian Berkelanjutan",
      bg: "bg-gradient-to-br from-cyan-300 to-lime-200"
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
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className={`w-8 h-8 transition-colors ${scrollY > 50 ? 'text-emerald-600' : 'text-sky-700'}`} />
              <span className={`text-2xl font-bold transition-colors ${scrollY > 50 ? 'text-gray-800' : 'text-sky-700'}`}>Taniku</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#beranda" className={`hover:text-emerald-600 transition-colors ${scrollY > 50 ? 'text-gray-800' : 'text-sky-700'}`}>Beranda</a>
              <a href="#fitur" className={`hover:text-emerald-600 transition-colors ${scrollY > 50 ? 'text-gray-800' : 'text-sky-700'}`}>Fitur</a>
              <a href="#tentang" className={`hover:text-emerald-600 transition-colors ${scrollY > 50 ? 'text-gray-800' : 'text-sky-700'}`}>Tentang</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className={`px-6 py-2 rounded-full font-semibold transition-colors ${scrollY > 50 ? 'text-gray-800 hover:text-emerald-600' : 'text-sky-700 hover:bg-sky-100'}`}>
                Masuk
              </Link>
              <Link to="/register" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                Daftar
              </Link>
            </div>

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? 
                <X className={`w-6 h-6 ${scrollY > 50 ? 'text-gray-800' : 'text-sky-700'}`} /> : 
                <Menu className={`w-6 h-6 ${scrollY > 50 ? 'text-gray-800' : 'text-sky-700'}`} />
              }
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg">
              <div className="flex flex-col space-y-2 px-4">
                <a href="#beranda" onClick={() => setIsMenuOpen(false)} className="text-gray-800 hover:text-emerald-600 py-2">Beranda</a>
                <a href="#fitur" onClick={() => setIsMenuOpen(false)} className="text-gray-800 hover:text-emerald-600 py-2">Fitur</a>
                <a href="#tentang" onClick={() => setIsMenuOpen(false)} className="text-gray-800 hover:text-emerald-600 py-2">Tentang</a>
                <hr className="border-gray-200" />
                <Link to="/login" className="text-center bg-gray-100 text-gray-800 w-full px-6 py-3 rounded-lg font-semibold">Masuk</Link>
                <Link to="/register" className="text-center bg-emerald-500 text-white w-full px-6 py-3 rounded-lg font-semibold">Daftar</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="beranda" className="relative h-screen flex flex-col justify-center items-center text-gray-800 overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${slide.bg} ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-white bg-opacity-20" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            {heroSlides[currentSlide].subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/login" className="group bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Masuk Sekarang</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/register" className="group bg-transparent border-2 border-emerald-500 hover:bg-emerald-100 text-emerald-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Daftar Gratis</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-emerald-500' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-cyan-100 opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 min-h-0">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center transform hover:scale-105 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-emerald-700 mb-2">{stat.number}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-700 mb-4">Fitur Unggulan</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Teknologi terdepan untuk mendukung pertanian modern Indonesia</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-700 mb-4">Smart Farming</h3>
              <p className="text-gray-600">Teknologi IoT dan AI untuk monitoring tanaman real-time, prediksi cuaca, dan optimalisasi hasil panen.</p>
            </div>
            {/* Feature Card 2 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-700 mb-4">Data Analytics</h3>
              <p className="text-gray-600">Analisis mendalam untuk pengambilan keputusan berbasis data bersama Dinas Pertanian daerah.</p>
            </div>
            {/* Feature Card 3 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-700 mb-4">Kolaborasi</h3>
              <p className="text-gray-600">Platform terintegrasi untuk kolaborasi petani, penyuluh, dan Dinas Pertanian dalam satu ekosistem.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section id="tentang" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-emerald-700 mb-6">Kemitraan Strategis</h2>
              <p className="text-xl text-gray-600 mb-8">
                Taniku bekerja sama dengan Dinas Pertanian di seluruh Indonesia untuk menciptakan ekosistem pertanian digital yang berkelanjutan dan inklusif.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-700">Integrasi Data Pemerintah</h4>
                    <p className="text-gray-600">Sinkronisasi data dengan sistem Dinas Pertanian untuk pelaporan yang akurat</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-700">Program Subsidi Digital</h4>
                    <p className="text-gray-600">Akses mudah ke program bantuan pemerintah melalui platform digital</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Komitmen Bersama</h3>
                <p className="text-lg mb-6">
                  "Menciptakan pertanian Indonesia yang modern, berkelanjutan, dan berdaya saing global melalui transformasi digital yang inklusif."
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Terpercaya & Aman</p>
                    <p className="text-sm opacity-90">Sertifikasi keamanan tingkat enterprise</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-200 via-emerald-100 to-lime-100 text-emerald-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Bergabung dengan Revolusi Pertanian Digital</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700">
            Jadilah bagian dari transformasi pertanian Indonesia bersama Taniku.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="group bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Daftar Sekarang</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="group border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-100 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Login</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontak" className="py-12 bg-emerald-100 text-emerald-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">© 2025 Taniku. Seluruh hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}