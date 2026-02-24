import { useEffect } from 'react';

/**
 * KajabiStyleGuard
 *
 * Runs a permanent interval that checks if Kajabi has overridden
 * our styles and fixes them. Also re-applies on visibilitychange
 * (when user closes and reopens the Kajabi app).
 */
function applyNavbarFix() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const computed = window.getComputedStyle(navbar);
  // Only apply if the background has been overridden
  if (computed.backgroundColor !== 'rgb(59, 142, 196)') {
    navbar.style.setProperty('background', '#3B8EC4', 'important');
    navbar.style.setProperty('background-color', '#3B8EC4', 'important');
  }
}

function applyAllFixes() {
  // Navbar
  document.querySelectorAll('.navbar').forEach(el => {
    el.style.setProperty('background', '#3B8EC4', 'important');
    el.style.setProperty('background-color', '#3B8EC4', 'important');
  });

  // Brand text
  document.querySelectorAll('.brand-text').forEach(el => {
    el.style.setProperty('color', '#FFFFFF', 'important');
  });

  // Primary buttons
  document.querySelectorAll('.btn-primary').forEach(el => {
    el.style.setProperty('background', '#3B8EC4', 'important');
    el.style.setProperty('background-color', '#3B8EC4', 'important');
    el.style.setProperty('color', '#FFFFFF', 'important');
    el.style.setProperty('border', 'none', 'important');
  });

  // Active filter chips
  document.querySelectorAll('.filter-chip-active').forEach(el => {
    el.style.setProperty('background', '#3B8EC4', 'important');
    el.style.setProperty('background-color', '#3B8EC4', 'important');
    el.style.setProperty('border-color', '#3B8EC4', 'important');
    el.style.setProperty('color', '#FFFFFF', 'important');
  });

  // Active nav tabs
  document.querySelectorAll('.nav-tab-active').forEach(el => {
    el.style.setProperty('color', '#3B8EC4', 'important');
    el.style.setProperty('border-bottom-color', '#3B8EC4', 'important');
  });

  // Logout confirm button
  document.querySelectorAll('.logout-confirm-yes').forEach(el => {
    el.style.setProperty('background', '#EF4444', 'important');
    el.style.setProperty('background-color', '#EF4444', 'important');
    el.style.setProperty('color', '#FFFFFF', 'important');
  });
}

export default function KajabiStyleGuard() {
  useEffect(() => {
    // Apply immediately
    applyAllFixes();

    // Permanent check every 500ms — never stops
    const interval = setInterval(applyNavbarFix, 500);

    // Full re-apply when app comes back to foreground
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        applyAllFixes();
        setTimeout(applyAllFixes, 100);
        setTimeout(applyAllFixes, 300);
        setTimeout(applyAllFixes, 600);
        setTimeout(applyAllFixes, 1000);
        setTimeout(applyAllFixes, 2000);
        setTimeout(applyAllFixes, 4000);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Also listen for pageshow (fired when restoring from bfcache)
    const handlePageShow = () => {
      applyAllFixes();
      setTimeout(applyAllFixes, 200);
      setTimeout(applyAllFixes, 1000);
    };
    window.addEventListener('pageshow', handlePageShow);

    // Also listen for focus (some WebViews fire this instead)
    const handleFocus = () => {
      applyAllFixes();
      setTimeout(applyAllFixes, 200);
      setTimeout(applyAllFixes, 1000);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return null;
}
