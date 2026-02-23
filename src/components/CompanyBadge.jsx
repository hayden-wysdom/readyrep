const COMPANY_COLORS = {
  'Boston Scientific': { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  'Gore Medical': { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  'Cook Medical': { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
  'Becton Dickinson': { bg: '#F5F5F5', text: '#525252', border: '#D4D4D4' },
  'Okami Medical': { bg: '#FAF5FF', text: '#7C3AED', border: '#DDD6FE' },
  'Medtronic': { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
};

export default function CompanyBadge({ company, size = 'sm' }) {
  const colors = COMPANY_COLORS[company] || { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' };

  return (
    <span
      className={`company-badge company-badge-${size}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      {company}
    </span>
  );
}

export { COMPANY_COLORS };
