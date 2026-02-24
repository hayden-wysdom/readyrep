import { useEffect } from 'react';

/**
 * KajabiStyleGuard
 *
 * Injects a <style> tag into the document <head> with ultra-high specificity
 * selectors and !important to permanently override Kajabi's injected CSS.
 * Also re-injects if Kajabi removes or overrides it.
 */

const GUARD_ID = 'kajabi-style-guard';

const guardCSS = `
  /* Navbar header - force blue background */
  .navbar,
  div.navbar,
  .app .navbar,
  .navbar-wrapper .navbar,
  .navbar-wrapper > .navbar,
  div.navbar-wrapper div.navbar,
  [class*="navbar"]:not(.navbar-tab-bar):not(.navbar-tab-bar-inner):not(.navbar-wrapper):not(.navbar-inner):not(.navbar-brand):not(.navbar-actions) {
    background: #3B8EC4 !important;
    background-color: #3B8EC4 !important;
  }

  /* Brand text in navbar */
  .brand-text,
  .navbar .brand-text,
  .navbar-brand .brand-text {
    color: #FFFFFF !important;
  }

  /* Login button - force blue */
  .login-form .btn-primary,
  .login-form button.btn-primary,
  .login-form button[type="submit"],
  .login-card .btn-primary,
  .login-page .btn-primary,
  button.btn-primary.btn-full {
    background: #3B8EC4 !important;
    background-color: #3B8EC4 !important;
    color: #FFFFFF !important;
    border: none !important;
  }

  /* All primary buttons */
  .btn-primary,
  button.btn-primary {
    background: #3B8EC4 !important;
    background-color: #3B8EC4 !important;
    color: #FFFFFF !important;
    border: none !important;
  }

  /* Active filter chips */
  .filter-chip-active,
  button.filter-chip-active,
  .filter-chips .filter-chip-active {
    background: #3B8EC4 !important;
    background-color: #3B8EC4 !important;
    border-color: #3B8EC4 !important;
    color: #FFFFFF !important;
  }

  /* Active nav tabs */
  .nav-tab-active,
  a.nav-tab-active,
  .navbar-tab-bar .nav-tab-active {
    color: #3B8EC4 !important;
    border-bottom-color: #3B8EC4 !important;
  }

  /* Links */
  .link-button,
  button.link-button,
  .device-link,
  a.device-link,
  .panel-link,
  a.panel-link,
  .rep-contact-link,
  a.rep-contact-link {
    color: #3B8EC4 !important;
  }

  /* Request rep buttons (outline style) */
  .btn-request-rep-sm,
  button.btn-request-rep-sm {
    color: #3B8EC4 !important;
    border-color: #3B8EC4 !important;
  }

  /* Logout confirm button */
  .logout-confirm-yes,
  button.logout-confirm-yes {
    background: #EF4444 !important;
    background-color: #EF4444 !important;
    color: #FFFFFF !important;
  }
`;

function injectGuard() {
  // Remove existing if present to re-inject at end of head
  const existing = document.getElementById(GUARD_ID);
  if (existing) existing.remove();

  const style = document.createElement('style');
  style.id = GUARD_ID;
  style.textContent = guardCSS;
  // Append to end of head so it loads after everything else
  document.head.appendChild(style);
}

export default function KajabiStyleGuard() {
  useEffect(() => {
    injectGuard();

    // Re-inject periodically for the first 15 seconds to beat late Kajabi CSS
    const interval = setInterval(injectGuard, 1000);
    const stopInterval = setTimeout(() => clearInterval(interval), 15000);

    // Watch for Kajabi injecting new stylesheets into <head>
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.tagName === 'STYLE' || node.tagName === 'LINK') {
            // Kajabi added a new stylesheet — re-inject ours at the end
            if (node.id !== GUARD_ID) {
              injectGuard();
            }
          }
        }
      }
    });
    observer.observe(document.head, { childList: true });

    // Also re-inject when the page becomes visible again (app reopen)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        injectGuard();
        // Re-inject a few more times after becoming visible
        setTimeout(injectGuard, 100);
        setTimeout(injectGuard, 500);
        setTimeout(injectGuard, 1000);
        setTimeout(injectGuard, 3000);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      clearTimeout(stopInterval);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return null;
}
