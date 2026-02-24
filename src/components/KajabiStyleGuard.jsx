import { useEffect } from 'react';

/**
 * KajabiStyleGuard
 *
 * Forces header and all its children to have transparent backgrounds
 * so the parent's blue background shows through.
 */

function applyFixes() {
  // Force header bar blue
  document.querySelectorAll('.rr-header-bar').forEach(el => {
    el.style.setProperty('background', '#3B8EC4', 'important');
    el.style.setProperty('background-color', '#3B8EC4', 'important');

    // Force ALL children inside the header to be transparent
    el.querySelectorAll('*').forEach(child => {
      const tag = child.tagName;
      // Skip images
      if (tag === 'IMG') return;
      child.style.setProperty('background', 'transparent', 'important');
      child.style.setProperty('background-color', 'transparent', 'important');
    });
  });

  // Brand text white
  document.querySelectorAll('.brand-text').forEach(el => {
    el.style.setProperty('color', '#FFFFFF', 'important');
  });

  // Icon buttons in header
  document.querySelectorAll('.rr-icon-btn').forEach(el => {
    el.style.setProperty('background', 'rgba(255,255,255,0.1)', 'important');
    el.style.setProperty('background-color', 'rgba(255,255,255,0.1)', 'important');
    el.style.setProperty('color', 'rgba(255,255,255,0.8)', 'important');
    el.style.setProperty('border-color', 'rgba(255,255,255,0.25)', 'important');
  });

  // User email in header
  document.querySelectorAll('.rr-user-email').forEach(el => {
    el.style.setProperty('color', 'rgba(255,255,255,0.7)', 'important');
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
}

export default function KajabiStyleGuard() {
  useEffect(() => {
    applyFixes();
    const interval = setInterval(applyFixes, 500);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        applyFixes();
        setTimeout(applyFixes, 100);
        setTimeout(applyFixes, 500);
        setTimeout(applyFixes, 1000);
        setTimeout(applyFixes, 3000);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pageshow', applyFixes);
    window.addEventListener('focus', applyFixes);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pageshow', applyFixes);
      window.removeEventListener('focus', applyFixes);
    };
  }, []);

  return null;
}
