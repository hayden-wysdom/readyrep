import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HelpCircle } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <div className="rr-header-wrap">
      <div className="rr-header-bar" style={{ background: '#3B8EC4', backgroundColor: '#3B8EC4' }}>
        <div className="rr-header-inner">
          <div className="rr-header-brand">
            <img src="/logo.png" alt="DeviceWyze" className="brand-logo" />
            <span className="brand-text" style={{ color: '#FFFFFF' }}>DeviceWyze (Beta)</span>
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
          </div>
        </div>
      </div>

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
