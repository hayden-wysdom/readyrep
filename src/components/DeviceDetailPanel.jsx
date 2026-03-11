import { useEffect } from 'react';
import { X, ExternalLink, Play } from 'lucide-react';
import CompanyBadge from './CompanyBadge';
import { btnPrimaryStyle, linkStyle, colors } from '../lib/colors';

export default function DeviceDetailPanel({ device, onClose }) {
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

  if (!device) return null;

  const specifications = device.specifications || [];
  const videos = device.videos || [];

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="panel-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Scrollable content */}
        <div className="panel-body">
          {/* Device name & badges */}
          <h2 className="panel-title">{device.name}</h2>
          <div className="panel-badges">
            <CompanyBadge company={device.dw_companies?.name || device.company_name} />
            {device.category && (
              <span className="panel-category-tag">{device.category}</span>
            )}
          </div>

          {/* Device image */}
          <div className="panel-image-wrapper">
            {device.image_url ? (
              <img
                src={device.image_url}
                alt={device.name}
                className="panel-image"
              />
            ) : (
              <div className="panel-image-placeholder">
                <span>Device Image</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="panel-section">
            <h3 className="panel-section-title">Description</h3>
            <p className="panel-text">{device.description}</p>
          </div>

          {/* Specifications */}
          {specifications.length > 0 && (
            <div className="panel-section">
              <h3 className="panel-section-title">Specifications</h3>
              <ul className="panel-specs-list">
                {specifications.map((spec, i) => (
                  <li key={i} className="panel-spec-item">{spec}</li>
                ))}
              </ul>
              {device.specs_url && (
                <a
                  href={device.specs_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="panel-link"
                  style={linkStyle}
                >
                  View Full Specifications
                </a>
              )}
            </div>
          )}

          {/* Product Demo Button */}
          {device.product_demo_url && (
            <a
              href={device.product_demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-full panel-demo-btn"
              style={btnPrimaryStyle}
            >
              <ExternalLink size={16} />
              View Product Demo & Resources
            </a>
          )}

          {/* Related Wysdom Videos */}
          {videos.length > 0 && (
            <div className="panel-section">
              <h3 className="panel-section-title">Related Wysdom Videos</h3>
              <div className="panel-videos">
                {videos.map((video) => (
                  <a
                    key={video.id}
                    href={video.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-card"
                  >
                    <div className="video-thumbnail">
                      {video.thumbnail_url ? (
                        <img src={video.thumbnail_url} alt={video.title} />
                      ) : (
                        <div className="video-thumbnail-placeholder">
                          <Play size={28} />
                        </div>
                      )}
                    </div>
                    <div className="video-info">
                      <p className="video-title">{video.title}</p>
                      {video.author && (
                        <p className="video-author">{video.author}</p>
                      )}
                      {video.author_title && (
                        <p className="video-author-title">{video.author_title}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
              <p className="panel-disclaimer">
                These videos are clinical posts shared by practicing clinicians on the
                Wysdom platform. They provide real-world insights beyond what's in the
                product manual.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
