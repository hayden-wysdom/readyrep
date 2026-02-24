import { useEffect } from 'react';

/**
 * KajabiStyleGuard - DEBUG MODE
 *
 * Shows a visible debug panel that logs what's happening to the header
 * so we can see what's overriding our styles inside the Kajabi WebView.
 */

function getDebugPanel() {
  let panel = document.getElementById('rr-debug');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'rr-debug';
    panel.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#000;color:#0f0;font-family:monospace;font-size:11px;padding:8px;z-index:99999;max-height:40vh;overflow-y:auto;';
    document.body.appendChild(panel);
  }
  return panel;
}

function log(msg) {
  const panel = getDebugPanel();
  const line = document.createElement('div');
  const time = new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 1 });
  line.textContent = `[${time}] ${msg}`;
  panel.appendChild(line);
  // Keep last 50 lines
  while (panel.children.length > 50) panel.removeChild(panel.firstChild);
  panel.scrollTop = panel.scrollHeight;
}

function inspectHeader() {
  const el = document.querySelector('.rr-header-bar');
  if (!el) {
    log('NO .rr-header-bar element found');
    return;
  }

  const computed = window.getComputedStyle(el);
  const compBg = computed.backgroundColor;
  const compBgFull = computed.background;
  const inlineBg = el.style.background;
  const inlineBgColor = el.style.backgroundColor;

  // Check all stylesheets for rules matching our header
  let matchingRules = [];
  try {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules || []) {
          if (rule.selectorText && el.matches(rule.selectorText)) {
            if (rule.style.background || rule.style.backgroundColor) {
              matchingRules.push({
                selector: rule.selectorText,
                bg: rule.style.background || rule.style.backgroundColor,
                priority: rule.style.getPropertyPriority('background') || rule.style.getPropertyPriority('background-color'),
                source: sheet.href || 'inline-style-tag'
              });
            }
          }
        }
      } catch (e) {
        matchingRules.push({ selector: '(cross-origin sheet)', source: sheet.href || 'unknown', bg: 'BLOCKED' });
      }
    }
  } catch (e) {
    log('Error reading stylesheets: ' + e.message);
  }

  const isBlue = compBg === 'rgb(59, 142, 196)';
  const color = isBlue ? '🔵' : '⚪';
  log(`${color} computed: ${compBg} | inline: bg=${inlineBg} bgColor=${inlineBgColor}`);

  if (matchingRules.length > 0 && !isBlue) {
    matchingRules.forEach(r => {
      log(`  RULE: ${r.selector} → ${r.bg} ${r.priority ? '!important' : ''} [${r.source}]`);
    });
  }

  // Count total stylesheets
  log(`  Stylesheets: ${document.styleSheets.length} | Inline style attr: "${el.getAttribute('style')?.substring(0, 80)}"`);
}

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
    log('KajabiStyleGuard mounted');
    applyFixes();
    inspectHeader();

    // Inspect every 500ms to see what's happening
    const interval = setInterval(() => {
      applyFixes();
      inspectHeader();
    }, 500);

    const handleVisibility = () => {
      log(`visibilitychange: ${document.visibilityState}`);
      if (document.visibilityState === 'visible') {
        applyFixes();
        inspectHeader();
        setTimeout(() => { applyFixes(); inspectHeader(); }, 100);
        setTimeout(() => { applyFixes(); inspectHeader(); }, 500);
        setTimeout(() => { applyFixes(); inspectHeader(); }, 1000);
        setTimeout(() => { applyFixes(); inspectHeader(); }, 3000);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const handlePageShow = () => { log('pageshow fired'); applyFixes(); inspectHeader(); };
    const handleFocus = () => { log('focus fired'); applyFixes(); inspectHeader(); };
    window.addEventListener('pageshow', handlePageShow);
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
