import { useEffect } from 'react';

/**
 * KajabiStyleGuard
 *
 * Uses a MutationObserver to instantly react when Kajabi modifies
 * styles, plus a fast initial burst to prevent visible flickering.
 */

let applying = false;

function applyFixes() {
  if (applying) return;
  applying = true;

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

  applying = false;
}

export default function KajabiStyleGuard() {
  useEffect(() => {
    applyFixes();

    // Fast burst for the first 3 seconds (every 50ms) to prevent visible flicker
    const fastInterval = setInterval(applyFixes, 50);
    const slowDown = setTimeout(() => {
      clearInterval(fastInterval);
    }, 3000);

    // Then a slower ongoing interval
    const slowInterval = setInterval(applyFixes, 1000);

    // MutationObserver: instantly react when Kajabi modifies any element's style
    const observer = new MutationObserver((mutations) => {
      if (applying) return;
      let needsFix = false;
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'style') {
          needsFix = true;
          break;
        }
        if (m.type === 'childList' && m.addedNodes.length > 0) {
          needsFix = true;
          break;
        }
      }
      if (needsFix) applyFixes();
    });

    // Observe the entire app for style changes and new elements
    const appEl = document.querySelector('.app') || document.getElementById('root');
    if (appEl) {
      observer.observe(appEl, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        childList: true,
        subtree: true,
      });
    }

    // Re-apply when app returns to foreground
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        // Fast burst again on resume
        applyFixes();
        let count = 0;
        const burst = setInterval(() => {
          applyFixes();
          count++;
          if (count >= 60) clearInterval(burst); // 3 seconds of 50ms
        }, 50);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pageshow', applyFixes);
    window.addEventListener('focus', applyFixes);

    return () => {
      clearInterval(fastInterval);
      clearTimeout(slowDown);
      clearInterval(slowInterval);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pageshow', applyFixes);
      window.removeEventListener('focus', applyFixes);
    };
  }, []);

  return null;
}
