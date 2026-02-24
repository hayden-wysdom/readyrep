import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, HelpCircle } from 'lucide-react';
import { colors } from '../lib/colors';

// Force navbar background via DOM to beat Kajabi !important overrides
function useForceNavbarStyle(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => {
      el.style.setProperty('background', '#3B8EC4', 'important');
      el.style.setProperty('background-color', '#3B8EC4', 'important');
    };
    apply();
    const t1 = setTimeout(apply, 100);
    const t2 = setTimeout(apply, 500);
    const t3 = setTimeout(apply, 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  });
}

export default function Navbar() {
  const { signOut, user } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navbarRef = useRef(null);
  useForceNavbarStyle(navbarRef);

  return (
    <div className="navbar-wrapper">
      <div ref={navbarRef} className="navbar" style={{ background: '#3B8EC4', backgroundColor: '#3B8EC4' }}>
        <div className="navbar-inner">
          <div className="navbar-brand">
            <img src="/logo.png" alt="ReadyRep" className="brand-logo" />
            <span className="brand-text" style={{ color: '#FFFFFF' }}>ReadyRep</span>
          </div>
          <div className="navbar-actions">
            <NavLink
              to="/support"
              className={({ isActive }) =>
                `btn-icon ${isActive ? 'btn-icon-active' : ''}`
              }
              title="Support"
            >
              <HelpCircle size={18} />
            </NavLink>
            <span className="user-email">{user?.email}</span>
            <button className="btn-icon" onClick={() => setShowLogoutConfirm(true)} title="Sign out">
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
      <div className="navbar-tab-bar">
        <div className="navbar-tab-bar-inner">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-tab ${isActive ? 'nav-tab-active' : ''}`
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
              `nav-tab ${isActive ? 'nav-tab-active' : ''}`
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
