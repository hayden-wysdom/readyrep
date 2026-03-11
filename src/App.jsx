import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import DeviceCatalog from './pages/DeviceCatalog';
import DeviceRepFinder from './pages/DeviceRepFinder';
import Support from './pages/Support';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import KajabiStyleGuard from './components/KajabiStyleGuard';

export default function App() {
  const { loading } = useAuth();

  useEffect(() => {
    const staticHeader = document.getElementById('rr-static-header');
    if (staticHeader) staticHeader.style.display = 'none';
    document.body.style.backgroundColor = '#FFFFFF';
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <KajabiStyleGuard />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<><Navbar /><DeviceCatalog /></>} />
        <Route path="/rep-finder" element={<><Navbar /><DeviceRepFinder /></>} />
        <Route path="/support" element={<><Navbar /><Support /></>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
