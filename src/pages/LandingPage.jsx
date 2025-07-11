import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, BarChart3, Users, Shield, Target, Award, ChevronRight, Menu, X } from 'lucide-react';

function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const heroSlides = [
    {
      title: "Transformasi Digital Pertanian",
      subtitle: "Memberdayakan Petani Indonesia dengan Teknologi Terdepan",
      bg: "bg-gradient-to-br from-green-800 via-green-600 to-green-400"
    },
    {
      title: "Kolaborasi dengan Dinas Pertanian",
      subtitle: "Sinergi Pemerintah dan Petani untuk Ketahanan Pangan",
      bg: "bg-gradient-to-br from-green-800 via-green-600 to-green-400"
    },
    {
       title: "Smart Farming Solution",
      subtitle: "Teknologi IoT dan AI untuk Pertanian Berkelanjutan",
      bg: "bg-gradient-to-br from-green-800 via-green-600 to-green-200"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Petani Terdaftar", icon: Users },
    { number: "500+", label: "Daerah Terlayani", icon: Target },
    { number: "95%", label: "Tingkat Kepuasan", icon: Award },
    { number: "24/7", label: "Dukungan Sistem", icon: Shield }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(slideInterval);
    };
  }, []);

  const handleLogin = () => {
    alert('Mengarahkan ke halaman Login...');
  };

  const handleRegister = () => {
    alert('Mengarahkan ke halaman Register...');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Leaf className={`w-8 h-8 ${scrollY > 50 ? 'text-green-600' : 'text-white'}`} />
              <span className={`text-2xl font-bold ${scrollY > 50 ? 'text-gray-800' : 'text-white'}`}>Taniku</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#beranda" className={`hover:text-green-600 transition-colors ${scrollY > 50 ? 'text-gray-800' : 'text-white'}`}>Beranda</a>
              <a href="#fitur" className={`hover:text-green-600 transition-colors ${scrollY > 50 ? 'text-gray-800' : 'text-white'}`}>Fitur</a>
              <a href="#tentang" className={`hover:text-green-600 transition-colors ${scrollY > 50 ? 'text-gray-800' : 'text-white'}`}>Tentang</a>
              <a href="#kontak" className={`hover:text-green-600 transition-colors ${scrollY > 50 ? 'text-gray-800' : 'text-white'}`}>Kontak</a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? 
                <X className={`w-6 h-6 ${scrollY > 50 ? 'text-gray-800' : 'text-white'}`} /> : 
                <Menu className={`w-6 h-6 ${scrollY > 50 ? 'text-gray-800' : 'text-white'}`} />
              }
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg">
              <div className="flex flex-col space-y-2 px-4">
                <a href="#beranda" className="text-gray-800 hover:text-green-600 py-2">Beranda</a>
                <a href="#fitur" className="text-gray-800 hover:text-green-600 py-2">Fitur</a>
                <a href="#tentang" className="text-gray-800 hover:text-green-600 py-2">Tentang</a>
                <a href="#kontak" className="text-gray-800 hover:text-green-600 py-2">Kontak</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="beranda" className="relative h-screen flex flex-col justify-center items-center text-white overflow-hidden">
        <div className="absolute inset-0 transition-all duration-1000">
          <div className={`absolute inset-0 ${heroSlides[currentSlide].bg}`} />
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="absolute top-40 right-20 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-white bg-opacity-10 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl">
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {heroSlides[currentSlide].title}
          </h1>
          <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {heroSlides[currentSlide].subtitle}
          </p>
          
          <div className={`flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Link
              to="/login"
              className="group bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-2"
            >
              <span>Masuk Sekarang</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register"
              className="group bg-transparent border-2 border-white hover:bg-white hover:text-gray-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-2"
            >
              <span>Daftar Gratis</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-green-100 opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-105 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-green-400 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Fitur Unggulan</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Teknologi terdepan untuk mendukung pertanian modern Indonesia</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Smart Farming</h3>
              <p className="text-gray-600 mb-6">Teknologi IoT dan AI untuk monitoring tanaman real-time, prediksi cuaca, dan optimalisasi hasil panen.</p>
              <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700">
                <span>Pelajari lebih lanjut</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Data Analytics</h3>
              <p className="text-gray-600 mb-6">Analisis mendalam untuk pengambilan keputusan berbasis data bersama Dinas Pertanian daerah.</p>
              <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700">
                <span>Pelajari lebih lanjut</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Kolaborasi</h3>
              <p className="text-gray-600 mb-6">Platform terintegrasi untuk kolaborasi petani, penyuluh, dan Dinas Pertanian dalam satu ekosistem.</p>
              <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700">
                <span>Pelajari lebih lanjut</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section id="tentang" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Kemitraan Strategis</h2>
              <p className="text-xl text-gray-600 mb-8">
                Taniku bekerja sama dengan Dinas Pertanian di seluruh Indonesia untuk menciptakan ekosistem pertanian digital yang berkelanjutan dan inklusif.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Integrasi Data Pemerintah</h4>
                    <p className="text-gray-600">Sinkronisasi data dengan sistem Dinas Pertanian untuk pelaporan yang akurat</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Program Subsidi Digital</h4>
                    <p className="text-gray-600">Akses mudah ke program bantuan pemerintah melalui platform digital</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Pelatihan dan Edukasi</h4>
                    <p className="text-gray-600">Program pelatihan berkelanjutan untuk adopsi teknologi pertanian modern</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-green-600 to-green-400 rounded-2xl p-8 text-white">
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
      <section className="py-20 bg-gradient-to-r from-green-800 via-green-600 to-green-400 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white bg-opacity-10 rounded-full -translate-x-36 -translate-y-36" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white bg-opacity-10 rounded-full translate-x-48 translate-y-48" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Bergabung dengan Revolusi Pertanian Digital</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Jadilah bagian dari transformasi pertanian Indonesia bersama Taniku dan Dinas Pertanian
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={handleRegister}
              className="group bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-2"
            >
              <span>Daftar Sekarang</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={handleLogin}
              className="group border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-2"
            >
              <span>Login</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontak" className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="w-8 h-8 text-green-400" />
                <span className="text-2xl font-bold">Taniku</span>
              </div>
              <p className="text-gray-400">
                Platform digital pertanian terdepan yang menghubungkan petani dengan teknologi modern dan dukungan pemerintah.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Smart Farming</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Data Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kolaborasi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pelatihan</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Dukungan</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Pusat Bantuan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dokumentasi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontak</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Kemitraan</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Dinas Pertanian</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kementerian Pertanian</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Penyuluh Pertanian</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kelompok Tani</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Taniku. Seluruh hak cipta dilindungi.</p>
            <p className="mt-2">Kolaborasi dengan Dinas Pertanian untuk Pertanian Berkelanjutan Indonesia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;