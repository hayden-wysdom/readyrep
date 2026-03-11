import { ExternalLink, Play } from 'lucide-react';
import CompanyBadge from './CompanyBadge';
import { linkStyle } from '../lib/colors';

export default function DeviceCard({ device, onClick }) {
  return (
    <div
      className="device-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(); }}
    >
      <div className="device-image-wrapper">
        {device.image_url ? (
          <img
            src={device.image_url}
            alt={device.name}
            className="device-image"
            loading="lazy"
          />
        ) : (
          <div className="device-image-placeholder">
            <span>No Image</span>
          </div>
        )}
      </div>
      <div className="device-card-body">
        <CompanyBadge company={device.dw_companies?.name || device.company_name} />
        <h3 className="device-name">{device.name}</h3>
        <p className="device-category">{device.category}</p>
        <p className="device-description">{device.description}</p>
        <div className="device-card-links">
          {device.product_demo_url && (
            <span className="device-link" style={linkStyle}>
              <ExternalLink size={14} />
              Product Demo
            </span>
          )}
          {device.video_count > 0 && (
            <span className="device-link device-link-video">
              <Play size={14} />
              {device.video_count} Wysdom Video{device.video_count > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
