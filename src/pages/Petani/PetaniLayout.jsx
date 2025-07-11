import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/petani/SIdebar'; // Pastikan path ini benar

export default function PetaniLayout() {
  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      {/* Sidebar akan selalu tampil untuk semua halaman petani */}
      <Sidebar />
      
      {/* <Outlet /> adalah tempat konten halaman (Dashboard, Lahan, dll.) akan muncul */}
      <main className="flex-grow p-8">
        <Outlet />
      </main>
    </div>
  );
}