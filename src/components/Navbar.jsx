import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Settings, HelpCircle } from 'lucide-react';

export default function Navbar() {
  const { signOut, user } = useAuth();

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            <img src="/logo.png" alt="ReadyRep" className="brand-logo" />
            <span className="brand-text">ReadyRep</span>
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
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `btn-icon ${isActive ? 'btn-icon-active' : ''}`
              }
              title="Admin"
            >
              <Settings size={18} />
            </NavLink>
            <span className="user-email">{user?.email}</span>
            <button className="btn-icon" onClick={signOut} title="Sign out">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>
      <div className="navbar-tab-bar">
        <div className="navbar-tab-bar-inner">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-tab ${isActive ? 'nav-tab-active' : ''}`
            }
          >
            Device Catalog
          </NavLink>
          <NavLink
            to="/rep-finder"
            className={({ isActive }) =>
              `nav-tab ${isActive ? 'nav-tab-active' : ''}`
            }
          >
            Device Rep Finder
          </NavLink>
        </div>
      </div>
    </header>
  );
}
