import { Outlet } from 'react-router-dom';
import Header from '../../components/petani/Header';
import Sidebar from '../../components/petani/SIdebar';

export default function PetaniLayout() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header Horizontal */}
      <Header />

      {/* Konten Utama dengan Sidebar dan Outlet */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Konten Utama (Outlet untuk halaman dinamis) */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}