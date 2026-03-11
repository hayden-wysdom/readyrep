import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { supabase } from '../lib/supabase';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import DeviceCard from '../components/DeviceCard';
import DeviceDetailPanel from '../components/DeviceDetailPanel';
import CompanyBadge from '../components/CompanyBadge';
import RequestDeviceModal from '../components/RequestDeviceModal';
import { PackagePlus } from 'lucide-react';
import { btnRequestRepSmStyle } from '../lib/colors';

export default function DeviceCatalog() {
  const [devices, setDevices] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    fetchCompanies();
    fetchDevices();
  }, []);

  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from('dw_companies')
      .select('*')
      .order('name');
    if (!error && data) setCompanies(data);
  };

  const fetchDevices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('dw_devices')
      .select('*, dw_companies(name)')
      .order('name');
    if (!error && data) setDevices(data);
    setLoading(false);
  };

  const handleDeviceClick = async (device) => {
    // Fetch videos for this device
    const { data: videos } = await supabase
      .from('dw_device_videos')
      .select('*')
      .eq('device_id', device.id)
      .order('created_at');

    setSelectedDevice({
      ...device,
      videos: videos || []
    });
  };

  const categories = useMemo(() => {
    const cats = [...new Set(devices.map(d => d.category).filter(Boolean))];
    return cats.sort();
  }, [devices]);

  // Fuse.js instance for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(devices, {
      keys: [
        { name: 'name', weight: 2 },
        { name: 'description', weight: 1 },
        { name: 'category', weight: 0.5 },
        { name: 'companies.name', weight: 0.5 },
      ],
      threshold: 0.2,
      ignoreLocation: true,
      includeScore: true,
    });
  }, [devices]);

  const filteredDevices = useMemo(() => {
    // Start with fuzzy search or all devices
    let results = searchQuery
      ? fuse.search(searchQuery).map(r => r.item)
      : devices;

    // Apply category and company filters
    return results.filter((device) => {
      const matchesCategory =
        !selectedCategory || device.category === selectedCategory;
      const matchesCompany =
        selectedCompany === null || device.company_id === selectedCompany;
      return matchesCategory && matchesCompany;
    });
  }, [devices, searchQuery, selectedCategory, selectedCompany, fuse]);

  return (
    <main className="page-content" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Partner Companies Section */}
      <section className="partner-section">
        <h2 className="section-title">Partner Companies</h2>
        <div className="partner-scroll">
          {companies.map((company) => (
            <div key={company.id} className="partner-logo-card">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.name} className="partner-logo" />
              ) : (
                <CompanyBadge company={company.name} size="lg" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Search & Filters */}
      <section className="filters-section">
        <div className="search-row">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by device name or description..."
          />
          <select
            className="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <FilterChips
          options={companies}
          selected={selectedCompany}
          onSelect={setSelectedCompany}
          allLabel="All Companies"
        />
      </section>

      {/* Results */}
      <section className="results-section">
        <p className="results-count">
          Showing {filteredDevices.length} device{filteredDevices.length !== 1 ? 's' : ''}
        </p>

        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="empty-state">
            <p>No devices found matching your criteria.</p>
          </div>
        ) : (
          <div className="device-grid">
            {filteredDevices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onClick={() => handleDeviceClick(device)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Request Device - bottom of page */}
      <div className="page-bottom-action">
        <button className="btn-request-rep-sm" style={btnRequestRepSmStyle} onClick={() => setShowRequestForm(true)}>
          <PackagePlus size={14} />
          Request a Device
        </button>
      </div>

      {/* Detail Panel */}
      {selectedDevice && (
        <DeviceDetailPanel
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
        />
      )}

      {/* Request Rep Modal */}
      {showRequestForm && (
        <RequestDeviceModal onClose={() => setShowRequestForm(false)} />
      )}
    </main>
  );
}
