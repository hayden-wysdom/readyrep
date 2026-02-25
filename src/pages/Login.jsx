import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { linkStyle } from '../lib/colors';

const loginBtnStyle = {
  background: '#3B8EC4',
  backgroundColor: '#3B8EC4',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '8px',
  padding: '10px 20px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  width: '100%',
};

// Force button styles via DOM to beat Kajabi !important overrides
function useForceButtonStyle(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => {
      el.style.setProperty('background', '#3B8EC4', 'important');
      el.style.setProperty('background-color', '#3B8EC4', 'important');
      el.style.setProperty('color', '#FFFFFF', 'important');
      el.style.setProperty('border', 'none', 'important');
      el.style.setProperty('border-radius', '8px', 'important');
      el.style.setProperty('padding', '10px 20px', 'important');
      el.style.setProperty('font-size', '14px', 'important');
      el.style.setProperty('font-weight', '600', 'important');
      el.style.setProperty('width', '100%', 'important');
      el.style.setProperty('opacity', el.disabled ? '0.6' : '1', 'important');
    };
    apply();
    // Re-apply on delays to beat late-loading Kajabi CSS
    const t1 = setTimeout(apply, 50);
    const t2 = setTimeout(apply, 200);
    const t3 = setTimeout(apply, 500);
    const t4 = setTimeout(apply, 1000);
    const t5 = setTimeout(apply, 2000);
    const t6 = setTimeout(apply, 4000);
    // Also run every 500ms for the first 10 seconds as a safety net
    const interval = setInterval(apply, 500);
    const stopInterval = setTimeout(() => clearInterval(interval), 10000);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(t4); clearTimeout(t5); clearTimeout(t6);
      clearInterval(interval); clearTimeout(stopInterval);
    };
  });
}

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming'
];

export default function Login() {
  const { signIn, signUp, resetPassword, updatePassword, verifyNotOldPassword, isRecovery, setIsRecovery } = useAuth();
  const [mode, setMode] = useState('signin');
  const mainBtnRef = useRef(null);
  const recoveryBtnRef = useRef(null);
  useForceButtonStyle(mainBtnRef);
  useForceButtonStyle(recoveryBtnRef);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Signup fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [npi, setNpi] = useState('');
  const [practiceCity, setPracticeCity] = useState('');
  const [practiceState, setPracticeState] = useState('');

  // Reset password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) throw error;
        setMessage('Password reset link sent! Check your email.');
      } else if (mode === 'signup') {
        if (password !== signupConfirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
          specialty,
          npi,
          practice_city: practiceCity,
          practice_state: practiceState,
        });
        if (error) throw error;
        setMessage('Check your email to confirm your account.');
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const { isSame } = await verifyNotOldPassword(newPassword);
      if (isSame) {
        setError('New password cannot be the same as your old password.');
        setLoading(false);
        return;
      }

      const { error } = await updatePassword(newPassword);
      if (error) throw error;
      setMessage('Password updated successfully! Redirecting...');
      setTimeout(() => {
        setIsRecovery(false);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show reset password form when arriving from email link
  if (isRecovery) {
    return (
      <div className="login-page" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
        <div className="login-card">
          <div className="login-header">
            <div className="login-brand">
              <img src="/logo.png" alt="DeviceWyze" className="brand-logo brand-logo-lg" />
              <h1>DeviceWyze (Beta)</h1>
            </div>
            <p className="login-subtitle">Set Your New Password</p>
          </div>

          <form onSubmit={handleResetSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="password-wrapper">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="password-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="form-hint-error">Passwords do not match</p>
            )}

            {error && <p className="form-error">{error}</p>}
            {message && <p className="form-success">{message}</p>}

            <button
              ref={recoveryBtnRef}
              type="submit"
              className="btn-primary btn-full"
              style={loginBtnStyle}
              disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page" style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <div className="login-card">
        <div className="login-header">
          <div className="login-brand">
            <img src="/logo.png" alt="DeviceWyze" className="brand-logo brand-logo-lg" />
            <h1>DeviceWyze (Beta)</h1>
          </div>
          <p className="login-subtitle">Industry Professional Module</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {mode === 'signup' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jane"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Smith"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@hospital.com"
              required
            />
          </div>

          {mode === 'signup' && (
            <>
              <div className="form-group">
                <label htmlFor="specialty">Specialty</label>
                <input
                  id="specialty"
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="e.g. Interventional Radiology"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="npi">National Provider Identifier (NPI)</label>
                <input
                  id="npi"
                  type="text"
                  value={npi}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setNpi(val);
                  }}
                  placeholder="10-digit NPI number"
                  required
                  pattern="\d{10}"
                  title="NPI must be exactly 10 digits"
                  inputMode="numeric"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="practiceCity">City of Practice</label>
                  <input
                    id="practiceCity"
                    type="text"
                    value={practiceCity}
                    onChange={(e) => setPracticeCity(e.target.value)}
                    placeholder="e.g. Houston"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="practiceState">State of Practice</label>
                  <select
                    id="practiceState"
                    className="filter-select"
                    value={practiceState}
                    onChange={(e) => setPracticeState(e.target.value)}
                    required
                  >
                    <option value="">Select State</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {mode !== 'forgot' && (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="signupConfirmPassword">Confirm Password</label>
              <div className="password-wrapper">
                <input
                  id="signupConfirmPassword"
                  type={showSignupConfirm ? 'text' : 'password'}
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowSignupConfirm(!showSignupConfirm)}
                >
                  {showSignupConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password && signupConfirmPassword && password !== signupConfirmPassword && (
                <p className="form-hint-error">Passwords do not match</p>
              )}
            </div>
          )}

          {mode === 'signin' && (
            <div className="forgot-password-row">
              <button
                type="button"
                className="link-button" style={linkStyle}
                onClick={() => switchMode('forgot')}
              >
                Forgot Password?
              </button>
            </div>
          )}

          {error && <p className="form-error">{error}</p>}
          {message && <p className="form-success">{message}</p>}

          <button ref={mainBtnRef} type="submit" className="btn-primary btn-full" style={loginBtnStyle} disabled={loading}>
            {loading
              ? 'Please wait...'
              : mode === 'forgot'
              ? 'Send Reset Link'
              : mode === 'signup'
              ? 'Create Account'
              : 'Sign In'}
          </button>
        </form>

        <p className="login-toggle">
          {mode === 'forgot' ? (
            <>
              Remember your password?{' '}
              <button type="button" className="link-button" style={linkStyle} onClick={() => switchMode('signin')}>
                Back to Sign In
              </button>
            </>
          ) : mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button type="button" className="link-button" style={linkStyle} onClick={() => switchMode('signin')}>
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button type="button" className="link-button" style={linkStyle} onClick={() => switchMode('signup')}>
                Sign Up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
