import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import DeviceCatalog from './pages/DeviceCatalog';
import DeviceRepFinder from './pages/DeviceRepFinder';
import Support from './pages/Support';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import KajabiStyleGuard from './components/KajabiStyleGuard';

function ProtectedRoute({ children }) {
  const { user, loading, isRecovery } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || isRecovery) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const { user, isRecovery } = useAuth();

  // Hide the static HTML header placeholder and reset body background
  useEffect(() => {
    const staticHeader = document.getElementById('rr-static-header');
    if (staticHeader) staticHeader.style.display = 'none';
    document.body.style.backgroundColor = '#FFFFFF';
  }, []);

  return (
    <div className="app" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <KajabiStyleGuard />
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={
          user && !isRecovery ? <Navigate to="/" replace /> : <Login />
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <Navbar />
            <DeviceCatalog />
          </ProtectedRoute>
        } />
        <Route path="/rep-finder" element={
          <ProtectedRoute>
            <Navbar />
            <DeviceRepFinder />
          </ProtectedRoute>
        } />
<Route path="/support" element={
          <ProtectedRoute>
            <Navbar />
            <Support />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
