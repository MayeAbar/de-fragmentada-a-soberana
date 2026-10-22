import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SovereigntyDashboard from '@/components/SovereigntyDashboard';
import Footer from '@/components/Footer';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#EFECE6] text-[#3D3833] linen-texture">
      <Navbar />
      <SovereigntyDashboard />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
