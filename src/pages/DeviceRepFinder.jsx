import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import RepCard from '../components/RepCard';
import RepDetailPanel from '../components/RepDetailPanel';
import RequestRepModal from '../components/RequestRepModal';
import { UserPlus } from 'lucide-react';
import { btnRequestRepStyle, btnRequestRepSmStyle } from '../lib/colors';

export default function DeviceRepFinder() {
  const { user } = useAuth();
  const [reps, setReps] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRep, setSelectedRep] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);

  // Filters — default to user's registered city/state
  const userMeta = user?.user_metadata || {};
  const [selectedState, setSelectedState] = useState(userMeta.practice_state || '');
  const [citySearch, setCitySearch] = useState(userMeta.practice_city || '');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  useEffect(() => {
    fetchReps();
    fetchCompanies();
    fetchProducts();
  }, []);

  const fetchReps = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('representatives')
      .select('*, companies(name)')
      .order('name');
    if (!error && data) setReps(data);
    setLoading(false);
  };

  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');
    if (!error && data) setCompanies(data);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('devices')
      .select('id, name')
      .order('name');
    if (!error && data) setProducts(data);
  };

  const handleRepClick = async (rep) => {
    const { data: devices } = await supabase
      .from('devices')
      .select('id, name, image_url, category')
      .eq('company_id', rep.company_id)
      .order('name');

    setSelectedRep({
      ...rep,
      devices: devices || []
    });
  };

  const states = useMemo(() => {
    const stateSet = [...new Set(reps.map(r => r.state).filter(Boolean))];
    return stateSet.sort();
  }, [reps]);

  // Fuse.js instance for fuzzy city search
  const cityFuse = useMemo(() => {
    return new Fuse(reps, {
      keys: ['city'],
      threshold: 0.2,
      ignoreLocation: true,
    });
  }, [reps]);

  const filteredReps = useMemo(() => {
    // Start with fuzzy city search or all reps
    let results = citySearch
      ? cityFuse.search(citySearch).map(r => r.item)
      : reps;

    // Apply other filters
    return results.filter((rep) => {
      const matchesState = !selectedState || rep.state === selectedState;
      const matchesCompany =
        !selectedCompany || rep.company_id === selectedCompany;
      const matchesProduct =
        !selectedProduct ||
        rep.specialties?.some(s =>
          s.toLowerCase().includes(selectedProduct.toLowerCase())
        );
      return matchesState && matchesCompany && matchesProduct;
    });
  }, [reps, selectedState, citySearch, selectedCompany, selectedProduct, cityFuse]);

  return (
    <main className="page-content">
      {/* Header */}
      <section className="page-header">
        <h1 className="page-title">Device Rep Finder</h1>
        <p className="page-subtitle">
          Connect with industry representatives in your area to learn more about
          devices and schedule product demonstrations.
        </p>
        <button className="btn-request-rep-sm" style={btnRequestRepSmStyle} onClick={() => setShowRequestForm(true)}>
          <UserPlus size={14} />
          Request a Representative
        </button>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="filter-row">
          <select
            className="filter-select"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">All States</option>
            {states.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>

          <SearchBar
            value={citySearch}
            onChange={setCitySearch}
            placeholder="Search by city..."
          />

          <select
            className="filter-select"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">All Companies</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Results */}
      <section className="results-section">
        <p className="results-count">
          Found {filteredReps.length} representative{filteredReps.length !== 1 ? 's' : ''}
        </p>

        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : filteredReps.length === 0 ? (
          <div className="empty-state">
            <p>No representatives found matching your criteria.</p>
            <button className="btn-request-rep" style={btnRequestRepStyle} onClick={() => setShowRequestForm(true)}>
              <UserPlus size={18} />
              Request a Representative
            </button>
          </div>
        ) : (
          <div className="rep-grid">
            {filteredReps.map((rep) => (
              <div key={rep.id} onClick={() => handleRepClick(rep)} style={{ cursor: 'pointer' }}>
                <RepCard rep={rep} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Rep Detail Panel */}
      {selectedRep && (
        <RepDetailPanel rep={selectedRep} onClose={() => setSelectedRep(null)} />
      )}

      {/* Request Rep Modal */}
      {showRequestForm && (
        <RequestRepModal onClose={() => setShowRequestForm(false)} />
      )}
    </main>
  );
}
