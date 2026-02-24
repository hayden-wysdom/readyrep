import { useEffect } from 'react';

/**
 * KajabiStyleGuard
 *
 * Backup protection: continuously monitors the header bar
 * and re-applies styles if anything overrides them.
 */
function applyFixes() {
  document.querySelectorAll('.rr-header-bar').forEach(el => {
    el.style.setProperty('background', '#3B8EC4', 'important');
    el.style.setProperty('background-color', '#3B8EC4', 'important');
  });
  document.querySelectorAll('.brand-text').forEach(el => {
    el.style.setProperty('color', '#FFFFFF', 'important');
  });
  document.querySelectorAll('.btn-primary').forEach(el => {
    el.style.setProperty('background', '#3B8EC4', 'important');
    el.style.setProperty('background-color', '#3B8EC4', 'important');
    el.style.setProperty('color', '#FFFFFF', 'important');
    el.style.setProperty('border', 'none', 'important');
  });
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
