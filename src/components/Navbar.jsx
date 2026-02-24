import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, HelpCircle } from 'lucide-react';
import { colors } from '../lib/colors';

export default function Navbar() {
  const { signOut, user } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div className="rr-header-wrap">
      <div className="rr-header-bar" style={{ background: '#3B8EC4', backgroundColor: '#3B8EC4' }}>
        <div className="rr-header-inner">
          <div className="rr-header-brand">
            <img src="/logo.png" alt="ReadyRep" className="brand-logo" />
            <span className="brand-text" style={{ color: '#FFFFFF' }}>ReadyRep (Beta)</span>
          </div>
          <div className="rr-header-actions">
            <NavLink
              to="/support"
              className={({ isActive }) =>
                `rr-icon-btn ${isActive ? 'rr-icon-btn-active' : ''}`
              }
              title="Support"
            >
              <HelpCircle size={18} />
            </NavLink>
            <span className="rr-user-email">{user?.email}</span>
            <button className="rr-icon-btn" onClick={() => setShowLogoutConfirm(true)} title="Sign out">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="logout-confirm-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="logout-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <p className="logout-confirm-text">Are you sure you want to logout?</p>
            <div className="logout-confirm-actions">
              <button className="logout-confirm-cancel" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </button>
              <button className="logout-confirm-yes" style={{ background: colors.red500, backgroundColor: colors.red500, color: colors.white }} onClick={signOut}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="rr-header-tabs">
        <div className="rr-header-tabs-inner">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rr-tab ${isActive ? 'rr-tab-active' : ''}`
            }
            style={({ isActive }) =>
              isActive ? { color: '#3B8EC4', borderBottomColor: '#3B8EC4' } : {}
            }
          >
            Device Catalog
          </NavLink>
          <NavLink
            to="/rep-finder"
            className={({ isActive }) =>
              `rr-tab ${isActive ? 'rr-tab-active' : ''}`
            }
            style={({ isActive }) =>
              isActive ? { color: '#3B8EC4', borderBottomColor: '#3B8EC4' } : {}
            }
          >
            Device Rep Finder
          </NavLink>
        </div>
      </div>
    </div>
  );
}
