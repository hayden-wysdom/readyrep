import { useEffect } from 'react';
import { X, MapPin, Mail, Phone, Package } from 'lucide-react';
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

export default function RepDetailPanel({ rep, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!rep) return null;

  const specialties = rep.specialties || [];
  const coverageAreas = rep.coverage_areas || [];
  const devices = rep.devices || [];

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="panel-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Scrollable content */}
        <div className="panel-body">
          {/* Rep avatar & name header */}
          <div className="rep-detail-header">
            <div className="rep-detail-avatar">
              {rep.avatar_url ? (
                <img src={rep.avatar_url} alt={rep.name} />
              ) : (
                <span className="rep-detail-initials" style={{ color: colors.blue600 }}>
                  {rep.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
            <div className="rep-detail-name-section">
              <h2 className="panel-title">{rep.name}</h2>
              <div className="panel-badges">
                <CompanyBadge company={rep.companies?.name || rep.company_name} />
              </div>
            </div>
          </div>

          {/* Territory Coverage */}
          {coverageAreas.length > 0 && (
            <div className="rep-detail-section-box">
              <h3 className="rep-detail-box-title">
                <MapPin size={18} />
                Territory Coverage
              </h3>
              <p className="rep-detail-state-label">{rep.state}</p>
              <div className="rep-detail-coverage-tags">
                {coverageAreas.map((area, i) => (
                  <span key={i} className="rep-detail-coverage-tag" style={{ backgroundColor: colors.blue50, color: colors.blue600 }}>{area}</span>
                ))}
              </div>
            </div>
          )}

          {/* Specialties */}
          {specialties.length > 0 && (
            <div className="rep-detail-section-box">
              <h3 className="rep-detail-box-title">Specialties</h3>
              <div className="rep-detail-specialties">
                {specialties.map((spec) => {
                  const colors = SPECIALTY_COLORS[spec] || { bg: '#F1F5F9', text: '#475569' };
                  return (
                    <span
                      key={spec}
                      className="specialty-tag specialty-tag-lg"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      {spec}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="rep-detail-section-box">
            <h3 className="rep-detail-box-title">Contact Information</h3>
            <div className="rep-detail-contact">
              {rep.email && (
                <a href={`mailto:${rep.email}`} className="rep-detail-contact-item" style={linkStyle}>
                  <Mail size={18} />
                  <span>{rep.email}</span>
                </a>
              )}
              {rep.phone && (
                <a href={`tel:${rep.phone}`} className="rep-detail-contact-item" style={linkStyle}>
                  <Phone size={18} />
                  <span>{rep.phone}</span>
                </a>
              )}
            </div>
          </div>

          {/* Products Covered */}
          {devices.length > 0 && (
            <div className="rep-detail-section-box">
              <h3 className="rep-detail-box-title">
                <Package size={18} />
                Products Covered
              </h3>
              <div className="rep-detail-products">
                {devices.map((device) => (
                  <div key={device.id} className="rep-detail-product-card">
                    <div className="rep-detail-product-image">
                      {device.image_url ? (
                        <img src={device.image_url} alt={device.name} />
                      ) : (
                        <Package size={24} />
                      )}
                    </div>
                    <div className="rep-detail-product-info">
                      <p className="rep-detail-product-name">{device.name}</p>
                      {device.category && (
                        <p className="rep-detail-product-category">{device.category}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {rep.products_count > 0 && devices.length === 0 && (
            <div className="rep-detail-section-box">
              <h3 className="rep-detail-box-title">
                <Package size={18} />
                Products
              </h3>
              <p className="panel-text">
                Covers {rep.products_count} product{rep.products_count > 1 ? 's' : ''} in their territory.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
