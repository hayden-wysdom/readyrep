import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ChevronDown, ChevronUp, Send, CheckCircle } from 'lucide-react';
import { btnPrimaryStyle, colors } from '../lib/colors';

const FAQ_ITEMS = [
  {
    question: 'How do I find a device representative in my area?',
    answer: 'Navigate to the "Device Rep Finder" tab and use the filters to search by state, city, company, or product specialty. Click on any representative card to view their full profile, coverage areas, and contact information.'
  },
  {
    question: 'How do I request a product demonstration?',
    answer: 'Find the device you\'re interested in from the Device Catalog, click on it to open the detail view, and use the "View Product Demo & Resources" button. You can also reach out directly to a representative through the Device Rep Finder.'
  },
  {
    question: 'How do I update my account information?',
    answer: 'Contact our support team via email at customer_support@medicalwysdom.ai, and we\'ll help you update your account details including your name, specialty, NPI, and practice location.'
  },
  {
    question: 'I forgot my password. How do I reset it?',
    answer: 'On the login page, click "Forgot Password?" and enter your email address. You\'ll receive a link to set a new password. The new password cannot be the same as your previous password.'
  },
  {
    question: 'How do I report an issue with device information?',
    answer: 'If you notice incorrect or outdated device information, please submit a support ticket using the form on this page. Select "Bug Report" as the subject and provide details about the issue.'
  },
  {
    question: 'Who can I contact for partnership or business inquiries?',
    answer: 'For partnership and business inquiries, please use the support ticket form with the subject "General Inquiry".'
  },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const { data, error } = await supabase.functions.invoke('send-support-ticket', {
        body: formData,
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setSubmitError(err.message || 'Failed to send ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-content">
      <section className="page-header">
        <h1 className="page-title">Customer Support</h1>
        <p className="page-subtitle">
          We're here to help. Reach out to our team or browse frequently asked
          questions below.
        </p>
      </section>

      {/* Submit a Support Ticket */}
      <div className="support-section-box" style={{ marginBottom: '24px' }}>
          <h2 className="support-section-title">Submit a Support Ticket</h2>
          {submitted ? (
            <div className="support-success">
              <CheckCircle size={32} />
              <h3>Ticket Submitted!</h3>
              <p>We've received your request and will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="support-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="supportName">Name</label>
                  <input
                    id="supportName"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="supportEmail">Email</label>
                  <input
                    id="supportEmail"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@hospital.com"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="supportSubject">Subject</label>
                <select
                  id="supportSubject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="support-select"
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="account">Account Issue</option>
                  <option value="device">Device Information</option>
                  <option value="rep">Representative Inquiry</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="supportMessage">Message</label>
                <textarea
                  id="supportMessage"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your issue or question..."
                  required
                  rows={5}
                  className="support-textarea"
                />
              </div>
              {submitError && <p className="form-error">{submitError}</p>}
              <button type="submit" className="btn-primary btn-full" style={btnPrimaryStyle} disabled={submitting}>
                {submitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send size={16} />
                    Submit Ticket
                  </>
                )}
              </button>
            </form>
          )}
      </div>

      {/* FAQ Section */}
      <div className="support-section-box support-faq-section">
        <h2 className="support-section-title">Frequently Asked Questions</h2>
        <div className="support-faq-list">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className={`support-faq-item ${openFaq === index ? 'support-faq-open' : ''}`}
              style={openFaq === index ? { borderColor: colors.blue600 } : {}}
            >
              <button
                className="support-faq-question"
                onClick={() => toggleFaq(index)}
              >
                <span>{item.question}</span>
                {openFaq === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === index && (
                <div className="support-faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
