import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import {
  uploadDeviceImage,
  uploadRepAvatar,
  uploadVideoThumbnail,
  uploadCompanyLogo
} from '../lib/storage';
import { Upload, Check, AlertCircle, Image, Users, Package, Building2 } from 'lucide-react';
import CompanyBadge from '../components/CompanyBadge';

const TABS = [
  { id: 'devices', label: 'Devices', icon: Package },
  { id: 'reps', label: 'Representatives', icon: Users },
  { id: 'videos', label: 'Video Thumbnails', icon: Image },
  { id: 'companies', label: 'Company Logos', icon: Building2 },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('devices');
  const [devices, setDevices] = useState([]);
  const [reps, setReps] = useState([]);
  const [videos, setVideos] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [uploading, setUploading] = useState({});
  const [success, setSuccess] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [devRes, repRes, vidRes, compRes] = await Promise.all([
      supabase.from('dw_devices').select('*, dw_companies(name)').order('name'),
      supabase.from('dw_representatives').select('*, dw_companies(name)').order('name'),
      supabase.from('dw_device_videos').select('*, dw_devices(name)').order('title'),
      supabase.from('dw_companies').select('*').order('name'),
    ]);
    if (devRes.data) setDevices(devRes.data);
    if (repRes.data) setReps(repRes.data);
    if (vidRes.data) setVideos(vidRes.data);
    if (compRes.data) setCompanies(compRes.data);
  };

  const handleUpload = async (type, id, file) => {
    const key = `${type}-${id}`;
    setUploading(prev => ({ ...prev, [key]: true }));
    setErrors(prev => ({ ...prev, [key]: null }));
    setSuccess(prev => ({ ...prev, [key]: false }));

    try {
      let url;
      switch (type) {
        case 'device':
          url = await uploadDeviceImage(id, file);
          setDevices(prev => prev.map(d => d.id === id ? { ...d, image_url: url } : d));
          break;
        case 'rep':
          url = await uploadRepAvatar(id, file);
          setReps(prev => prev.map(r => r.id === id ? { ...r, avatar_url: url } : r));
          break;
        case 'video':
          url = await uploadVideoThumbnail(id, file);
          setVideos(prev => prev.map(v => v.id === id ? { ...v, thumbnail_url: url } : v));
          break;
        case 'company':
          url = await uploadCompanyLogo(id, file);
          setCompanies(prev => prev.map(c => c.id === id ? { ...c, logo_url: url } : c));
          break;
      }
      setSuccess(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setSuccess(prev => ({ ...prev, [key]: false })), 3000);
    } catch (err) {
      setErrors(prev => ({ ...prev, [key]: err.message }));
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <main className="page-content">
      <div className="admin-header">
        <h1 className="page-title">Admin — Image Management</h1>
        <p className="page-subtitle">
          Upload and manage images for devices, representatives, videos, and companies.
          Images are stored in Supabase Storage and won't disappear.
        </p>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? 'admin-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Device Images */}
      {activeTab === 'devices' && (
        <div className="admin-grid">
          {devices.map(device => (
            <ImageUploadCard
              key={device.id}
              id={device.id}
              type="device"
              title={device.name}
              subtitle={device.dw_companies?.name || ''}
              currentImage={device.image_url}
              uploading={uploading[`device-${device.id}`]}
              success={success[`device-${device.id}`]}
              error={errors[`device-${device.id}`]}
              onUpload={(file) => handleUpload('device', device.id, file)}
            />
          ))}
        </div>
      )}

      {/* Rep Avatars */}
      {activeTab === 'reps' && (
        <div className="admin-grid">
          {reps.map(rep => (
            <ImageUploadCard
              key={rep.id}
              id={rep.id}
              type="rep"
              title={rep.name}
              subtitle={rep.dw_companies?.name || ''}
              currentImage={rep.avatar_url}
              isAvatar
              uploading={uploading[`rep-${rep.id}`]}
              success={success[`rep-${rep.id}`]}
              error={errors[`rep-${rep.id}`]}
              onUpload={(file) => handleUpload('rep', rep.id, file)}
            />
          ))}
        </div>
      )}

      {/* Video Thumbnails */}
      {activeTab === 'videos' && (
        <div className="admin-grid">
          {videos.map(video => (
            <ImageUploadCard
              key={video.id}
              id={video.id}
              type="video"
              title={video.title}
              subtitle={video.dw_devices?.name || ''}
              currentImage={video.thumbnail_url}
              uploading={uploading[`video-${video.id}`]}
              success={success[`video-${video.id}`]}
              error={errors[`video-${video.id}`]}
              onUpload={(file) => handleUpload('video', video.id, file)}
            />
          ))}
        </div>
      )}

      {/* Company Logos */}
      {activeTab === 'companies' && (
        <div className="admin-grid">
          {companies.map(company => (
            <ImageUploadCard
              key={company.id}
              id={company.id}
              type="company"
              title={company.name}
              subtitle=""
              currentImage={company.logo_url}
              uploading={uploading[`company-${company.id}`]}
              success={success[`company-${company.id}`]}
              error={errors[`company-${company.id}`]}
              onUpload={(file) => handleUpload('company', company.id, file)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function ImageUploadCard({ id, type, title, subtitle, currentImage, isAvatar, uploading, success, error, onUpload }) {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP, etc.)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }
    onUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const isStoredInSupabase = currentImage?.includes('supabase.co/storage');

  return (
    <div className="upload-card">
      <div className="upload-card-header">
        <div>
          <h3 className="upload-card-title">{title}</h3>
          {subtitle && <p className="upload-card-subtitle">{subtitle}</p>}
        </div>
        {isStoredInSupabase && (
          <span className="upload-badge upload-badge-stored">
            <Check size={12} /> Stored
          </span>
        )}
        {currentImage && !isStoredInSupabase && (
          <span className="upload-badge upload-badge-external">
            <AlertCircle size={12} /> External
          </span>
        )}
      </div>

      {/* Current image preview */}
      <div className={`upload-preview ${isAvatar ? 'upload-preview-avatar' : ''}`}>
        {currentImage ? (
          <img src={currentImage} alt={title} />
        ) : (
          <div className="upload-preview-empty">
            <Image size={24} />
            <span>No image</span>
          </div>
        )}
      </div>

      {/* Drop zone / upload button */}
      <div
        className={`upload-dropzone ${dragOver ? 'upload-dropzone-active' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {uploading ? (
          <div className="upload-status">
            <div className="spinner spinner-sm" />
            <span>Uploading...</span>
          </div>
        ) : success ? (
          <div className="upload-status upload-status-success">
            <Check size={16} />
            <span>Uploaded successfully!</span>
          </div>
        ) : (
          <>
            <Upload size={18} />
            <span>Drop image here or click to upload</span>
            <span className="upload-hint">PNG, JPG, WebP — max 5MB</span>
          </>
        )}
      </div>

      {error && (
        <p className="upload-error">
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
}
