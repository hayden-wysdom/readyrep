// Hardcoded inline style objects for Kajabi WebView override resistance.
// Kajabi injects its own CSS that can override our classes, so we use
// inline styles on all colored elements to guarantee our colors win.

export const colors = {
  blue600: '#3B8EC4',
  blue700: '#2D7AAF',
  blue50: '#E8F4FD',
  blue100: '#D1E9FA',
  white: '#FFFFFF',
  gray50: '#EEF5FA',
  gray100: '#E1EDF5',
  gray200: '#D0DFEB',
  gray400: '#8AA3B8',
  gray500: '#5E7D94',
  gray600: '#456178',
  gray700: '#334D60',
  gray800: '#1C3347',
  gray900: '#0D1F30',
  red500: '#EF4444',
  green500: '#22C55E',
};

// Common inline style objects
export const btnPrimaryStyle = {
  background: colors.blue600,
  backgroundColor: colors.blue600,
  color: colors.white,
  border: 'none',
};

export const btnPrimaryHoverStyle = {
  background: colors.blue700,
  backgroundColor: colors.blue700,
  color: colors.white,
  border: 'none',
};

export const linkStyle = {
  color: colors.blue600,
};

export const navbarStyle = {
  background: colors.blue600,
  backgroundColor: colors.blue600,
};

export const btnRequestRepStyle = {
  background: colors.blue600,
  backgroundColor: colors.blue600,
  color: colors.white,
};

export const btnRequestRepSmStyle = {
  color: colors.blue600,
  borderColor: colors.blue600,
};
