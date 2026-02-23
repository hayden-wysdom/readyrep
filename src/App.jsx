import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import DeviceCatalog from './pages/DeviceCatalog';
import DeviceRepFinder from './pages/DeviceRepFinder';
import Admin from './pages/Admin';
import Support from './pages/Support';
import Navbar from './components/Navbar';

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

  return (
    <div className="app">
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
        <Route path="/admin" element={
          <ProtectedRoute>
            <Navbar />
            <Admin />
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
