import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { Mail, Lock, Sparkles, ShieldCheck, Phone, KeyRound } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Login.css';

const Login = () => {
  const { t } = useLanguage();
  const { login, googleLogin, user, sendOtpCode, loginWithOtp } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Login methods: 'email' or 'mobile'
  const [loginMethod, setLoginMethod] = useState('email');

  // Email form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Mobile OTP form states
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpTestingCode, setOtpTestingCode] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    // If already logged in, redirect
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  // Mobile OTP resend cooldown timer
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg('');
    
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setErrorMsg(result.message);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone) return;
    if (phone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    
    const result = await sendOtpCode(phone);
    setLoading(false);

    if (result.success) {
      setOtpSent(true);
      setOtpTimer(60); // start 60s resend timer
      if (result.data && result.data.otpForTesting) {
        setOtpTestingCode(result.data.otpForTesting);
      }
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!phone || !otp) return;
    if (otp.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const result = await loginWithOtp(phone, otp);
    setLoading(false);

    if (!result.success) {
      setErrorMsg(result.message);
    }
  };

  const handleGoogleCallback = async (response) => {
    setLoading(true);
    setErrorMsg('');
    
    const result = await googleLogin(response.credential);
    setLoading(false);

    if (!result.success) {
      setErrorMsg(result.message);
    }
  };

  useEffect(() => {
    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1027376969085-m3rZrr4KCi0QTK.apps.googleusercontent.com',
          callback: handleGoogleCallback
        });

        const btnElement = document.getElementById("google-signin-btn-container");
        if (btnElement) {
          window.google.accounts.id.renderButton(btnElement, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signin_with",
          });
        }
      }
    };

    if (window.google) {
      initGoogle();
    } else {
      const checkInterval = setInterval(() => {
        if (window.google) {
          initGoogle();
          clearInterval(checkInterval);
        }
      }, 500);
      return () => clearInterval(checkInterval);
    }
  }, []);

  return (
    <div className="login-page section">
      <div className="container login-container">
        <div className="login-card card">
          <div className="login-header">
            <span className="welcome-badge"><Sparkles size={12} /> WELCOME BACK</span>
            <h2>Sign In to Shrimaya</h2>
            <p>Access your reservations dashboard, receipts, and membership deals.</p>
          </div>

          <div className="login-tabs">
            <button 
              type="button"
              className={`login-tab-btn ${loginMethod === 'email' ? 'active' : ''}`}
              onClick={() => { setLoginMethod('email'); setErrorMsg(''); }}
            >
              Email & Password
            </button>
            <button 
              type="button"
              className={`login-tab-btn ${loginMethod === 'mobile' ? 'active' : ''}`}
              onClick={() => { setLoginMethod('mobile'); setErrorMsg(''); }}
            >
              Mobile & OTP
            </button>
          </div>

          {errorMsg && <div className="login-error-alert">{errorMsg}</div>}

          {loginMethod === 'email' ? (
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <div className="input-with-icon-wrapper">
                  <Mail size={16} className="input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="name@domain.com"
                    className="form-control padded-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="login-pass">Password</label>
                <div className="input-with-icon-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input
                    id="login-pass"
                    type="password"
                    placeholder="••••••••"
                    className="form-control padded-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-gold btn-login-submit" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="login-form">
              {!otpSent ? (
                <>
                  <div className="form-group">
                    <label htmlFor="login-phone">Mobile Number</label>
                    <div className="input-with-icon-wrapper">
                      <Phone size={16} className="input-icon" />
                      <input
                        id="login-phone"
                        type="tel"
                        maxLength="10"
                        placeholder="Enter 10-digit mobile number"
                        className="form-control padded-input"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-gold btn-login-submit" disabled={loading}>
                    {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                  </button>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="login-otp">Enter 6-Digit OTP</label>
                    <div className="input-with-icon-wrapper">
                      <KeyRound size={16} className="input-icon" />
                      <input
                        id="login-otp"
                        type="text"
                        maxLength="6"
                        placeholder="••••••"
                        className="form-control padded-input"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        required
                      />
                    </div>
                    {otpTestingCode && (
                      <div className="otp-testing-helper card" style={{ marginTop: '0.75rem', padding: '0.6rem 0.8rem', backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', color: '#B45309', fontSize: '0.8rem', borderRadius: '4px', fontWeight: '500' }}>
                        <strong>Testing Code:</strong> Your OTP is <code style={{ fontSize: '0.88rem', color: '#92400E', fontWeight: 'bold' }}>{otpTestingCode}</code> (Auto-generated for verification)
                      </div>
                    )}
                  </div>

                  <button type="submit" className="btn btn-gold btn-login-submit" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Sign In'}
                  </button>

                  <div className="resend-otp-container" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <button 
                      type="button" 
                      className="resend-btn" 
                      onClick={handleSendOtp} 
                      disabled={loading || otpTimer > 0} 
                      style={{ background: 'none', border: 'none', color: otpTimer > 0 ? '#A0AEC0' : 'var(--accent-dark)', cursor: otpTimer > 0 ? 'default' : 'pointer', fontWeight: '600' }}
                    >
                      Resend OTP
                    </button>
                    {otpTimer > 0 && <span style={{ color: 'var(--text-muted)' }}>Resend in {otpTimer}s</span>}
                  </div>
                  
                  <button 
                    type="button" 
                    className="btn btn-outline btn-full btn-sm" 
                    style={{ marginTop: '0.75rem', width: '100%' }} 
                    onClick={() => { setOtpSent(false); setOtp(''); }}
                  >
                    Change Mobile Number
                  </button>
                </>
              )}
            </form>
          )}

          <div className="oauth-divider">
            <span>or sign in with third party</span>
          </div>

          <div 
            id="google-signin-btn-container" 
            style={{ width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}
          ></div>

          <div className="login-footer-text">
            Don't have an account? <RouterLink to={`/register?redirect=${encodeURIComponent(redirect)}`}>Create an Account</RouterLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
