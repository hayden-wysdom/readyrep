import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { X, CheckCircle } from 'lucide-react';
import { btnPrimaryStyle } from '../lib/colors';

export default function RequestDeviceModal({ onClose }) {
  const { user } = useAuth();
  const userMeta = user?.user_metadata || {};

  const [companies, setCompanies] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const companyDropdownRef = useRef(null);

  const [form, setForm] = useState({
    fullName: `${userMeta.first_name || ''} ${userMeta.last_name || ''}`.trim(),
    email: user?.email || '',
    city: userMeta.practice_city || '',
    state: userMeta.practice_state || '',
    company: '',
    companySearch: '',
    deviceDescription: '',
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data } = await supabase.from('dw_companies').select('*').order('name');
      if (data) setCompanies(data);
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(e.target)) {
        setShowCompanyDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCompanyOptions = useMemo(() => {
    if (!form.companySearch) return companies;
    return companies.filter(c =>
      c.name.toLowerCase().includes(form.companySearch.toLowerCase())
    );
  }, [companies, form.companySearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('send-device-request', {
        body: {
          fullName: form.fullName,
          email: form.email,
          city: form.city,
          state: form.state,
          company: form.company,
          deviceDescription: form.deviceDescription,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setSubmitted(true);
    } catch (err) {
      console.error('Request error:', err);
      setError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="request-rep-overlay" onClick={onClose}>
      <div className="request-rep-modal" onClick={(e) => e.stopPropagation()}>
        <div className="request-rep-header">
          <h2>Request a Device</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="request-rep-success">
            <CheckCircle size={48} />
            <h3>Request Submitted!</h3>
            <p>We'll look into adding this device to our catalog. You'll receive an email from our team in the next 24-48 hours.</p>
            <button className="btn-primary" style={btnPrimaryStyle} onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="request-rep-form">
            <div className="form-group">
              <label htmlFor="devReqName">Full Name</label>
              <input
                id="devReqName"
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="devReqEmail">Email</label>
              <input
                id="devReqEmail"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="devReqCity">City</label>
                <input
                  id="devReqCity"
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="devReqState">State</label>
                <input
                  id="devReqState"
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group" ref={companyDropdownRef}>
              <label htmlFor="devReqCompany">Company / Manufacturer</label>
              <div className="combobox-wrapper">
                <input
                  id="devReqCompany"
                  type="text"
                  value={form.companySearch || form.company}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      companySearch: e.target.value,
                      company: '',
                    });
                    setShowCompanyDropdown(true);
                  }}
                  onFocus={() => setShowCompanyDropdown(true)}
                  placeholder="Type to search companies..."
                  required
                  autoComplete="off"
                />
                {showCompanyDropdown && filteredCompanyOptions.length > 0 && (
                  <ul className="combobox-dropdown">
                    {filteredCompanyOptions.map((c) => (
                      <li
                        key={c.id}
                        className="combobox-option"
                        onClick={() => {
                          setForm({
                            ...form,
                            company: c.name,
                            companySearch: '',
                          });
                          setShowCompanyDropdown(false);
                        }}
                      >
                        {c.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="devReqDevice">What device are you looking for?</label>
              <textarea
                id="devReqDevice"
                value={form.deviceDescription}
                onChange={(e) => setForm({ ...form, deviceDescription: e.target.value })}
                placeholder="Describe the device, product name, model number, or use case..."
                rows={4}
                required
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <button
              type="submit"
              className="btn-primary btn-full" style={btnPrimaryStyle}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
