import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Settings, HelpCircle } from 'lucide-react';

export default function Navbar() {
  const { signOut, user } = useAuth();
  const navRef = useRef(null);

  // Protect navbar from external style overrides (e.g. Kajabi)
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const enforceStyles = () => {
      nav.style.setProperty('background', '#3B8EC4', 'important');
      nav.style.setProperty('background-color', '#3B8EC4', 'important');
    };

    enforceStyles();

    // Watch for external style mutations
    const observer = new MutationObserver(enforceStyles);
    observer.observe(nav, { attributes: true, attributeFilter: ['style', 'class'] });

    // Also watch for injected stylesheets
    const headObserver = new MutationObserver(enforceStyles);
    headObserver.observe(document.head, { childList: true, subtree: true });

    // Re-apply periodically for the first few seconds
    const intervals = [100, 250, 500, 1000, 2000, 3000, 5000];
    const timers = intervals.map(ms => setTimeout(enforceStyles, ms));

    return () => {
      observer.disconnect();
      headObserver.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <header className="navbar-wrapper">
      <nav ref={navRef} className="navbar" style={{ background: '#3B8EC4', backgroundColor: '#3B8EC4' }}>
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
