import { MapPin, Mail, Phone } from 'lucide-react';
import CompanyBadge from './CompanyBadge';
import { linkStyle, colors } from '../lib/colors';

const SPECIALTY_COLORS = {
  'Embolics': { bg: '#DBEAFE', text: '#1E40AF' },
  'Balloons': { bg: '#FCE7F3', text: '#BE185D' },
  'Stents': { bg: '#D1FAE5', text: '#065F46' },
  'TIPS': { bg: '#FEF3C7', text: '#92400E' },
  'Vascular Access': { bg: '#EDE9FE', text: '#5B21B6' },
  'Occlusion': { bg: '#FFE4E6', text: '#9F1239' },
  'Drainage': { bg: '#CCFBF1', text: '#134E4A' },
  'Septal': { bg: '#FFF7ED', text: '#9A3412' },
};

export default function RepCard({ rep }) {
  const specialties = rep.specialties || [];
  const coverageAreas = rep.coverage_areas || [];

  return (
    <div className="rep-card">
      <div className="rep-card-header">
        <div className="rep-avatar">
          {rep.avatar_url ? (
            <img src={rep.avatar_url} alt={rep.name} />
          ) : (
            <span className="rep-avatar-initials" style={{ color: colors.blue600 }}>
              {rep.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          )}
        </div>
        <div className="rep-info">
          <h3 className="rep-name">{rep.name}</h3>
          <CompanyBadge company={rep.dw_companies?.name || rep.company_name} />
        </div>
      </div>

      <div className="rep-location">
        <MapPin size={14} />
        <span>{rep.city}, {rep.state}</span>
      </div>

      {coverageAreas.length > 0 && (
        <p className="rep-coverage">
          Coverage: {coverageAreas.join(', ')}
        </p>
      )}

      {specialties.length > 0 && (
        <div className="rep-specialties">
          {specialties.map((spec) => {
            const colors = SPECIALTY_COLORS[spec] || { bg: '#F1F5F9', text: '#475569' };
            return (
              <span
                key={spec}
                className="specialty-tag"
                style={{ backgroundColor: colors.bg, color: colors.text }}
              >
                {spec}
              </span>
            );
          })}
        </div>
      )}

      {rep.products_count > 0 && (
        <p className="rep-products-count">
          Covers {rep.products_count} product{rep.products_count > 1 ? 's' : ''}
        </p>
      )}

      <div className="rep-contact">
        {rep.email && (
          <a href={`mailto:${rep.email}`} className="rep-contact-link" style={linkStyle}>
            <Mail size={14} />
            <span>{rep.email}</span>
          </a>
        )}
        {rep.phone && (
          <a href={`tel:${rep.phone}`} className="rep-contact-link" style={linkStyle}>
            <Phone size={14} />
            <span>{rep.phone}</span>
          </a>
        )}
      </div>
    </div>
  );
}
