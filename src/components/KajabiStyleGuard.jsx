import { useEffect } from 'react';

/**
 * KajabiStyleGuard
 *
 * Uses a very fast interval on startup and resume to prevent
 * visible flickering from Kajabi CSS overrides.
 */

function applyFixes() {
  document.querySelectorAll('.rr-header-bar').forEach(el => {
    el.style.setProperty('background', '#3B8EC4', 'important');
    el.style.setProperty('background-color', '#3B8EC4', 'important');
    el.querySelectorAll('*').forEach(child => {
      if (child.tagName === 'IMG') return;
      child.style.setProperty('background', 'transparent', 'important');
      child.style.setProperty('background-color', 'transparent', 'important');
    });
  });

  document.querySelectorAll('.brand-text').forEach(el => {
    el.style.setProperty('color', '#FFFFFF', 'important');
  });

  document.querySelectorAll('.rr-icon-btn').forEach(el => {
    el.style.setProperty('background', 'rgba(255,255,255,0.1)', 'important');
    el.style.setProperty('background-color', 'rgba(255,255,255,0.1)', 'important');
    el.style.setProperty('color', 'rgba(255,255,255,0.8)', 'important');
    el.style.setProperty('border-color', 'rgba(255,255,255,0.25)', 'important');
  });

  document.querySelectorAll('.rr-user-email').forEach(el => {
    el.style.setProperty('color', 'rgba(255,255,255,0.7)', 'important');
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

function startBurst() {
  applyFixes();
  let count = 0;
  const burst = setInterval(() => {
    applyFixes();
    count++;
    if (count >= 100) clearInterval(burst);
  }, 30);
  return burst;
}

export default function KajabiStyleGuard() {
  useEffect(() => {
    // Fast burst: every 30ms for 3 seconds on mount
    const burst = startBurst();

    // Ongoing slower check every 1 second
    const slow = setInterval(applyFixes, 1000);

    // Re-burst when app comes back to foreground
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        startBurst();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const handleResume = () => startBurst();
    window.addEventListener('pageshow', handleResume);
    window.addEventListener('focus', handleResume);

    return () => {
      clearInterval(burst);
      clearInterval(slow);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pageshow', handleResume);
      window.removeEventListener('focus', handleResume);
    };
  }, []);

  return null;
}
