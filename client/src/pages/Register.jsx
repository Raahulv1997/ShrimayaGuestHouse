import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { User, Mail, Lock, Phone, Sparkles } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Login.css'; // Reuse Login page styling patterns

const Register = () => {
  const { t } = useLanguage();
  const { register, googleLogin, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

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
            text: "signup_with",
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

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const result = await register(name, email, password, phone);
    setLoading(false);

    if (!result.success) {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="login-page section">
      <div className="container login-container">
        <div className="login-card card">
          <div className="login-header">
            <span className="welcome-badge"><Sparkles size={12} /> GET STARTED</span>
            <h2>Create Account</h2>
            <p>Register to manage your stays, download receipts, and unlock guest rewards.</p>
          </div>

          {errorMsg && <div className="login-error-alert">{errorMsg}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="reg-name">Full Name</label>
              <div className="input-with-icon-wrapper">
                <User size={16} className="input-icon" />
                <input
                  id="reg-name"
                  type="text"
                  placeholder="John Doe"
                  className="form-control padded-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email Address</label>
              <div className="input-with-icon-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  id="reg-email"
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
              <label htmlFor="reg-phone">Phone Number (Optional)</label>
              <div className="input-with-icon-wrapper">
                <Phone size={16} className="input-icon" />
                <input
                  id="reg-phone"
                  type="tel"
                  placeholder="9876543210"
                  className="form-control padded-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-pass">Password</label>
              <div className="input-with-icon-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  id="reg-pass"
                  type="password"
                  placeholder="Minimum 6 characters"
                  className="form-control padded-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-confirm-pass">Confirm Password</label>
              <div className="input-with-icon-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  id="reg-confirm-pass"
                  type="password"
                  placeholder="Repeat password"
                  className="form-control padded-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-gold btn-login-submit" disabled={loading}>
              {loading ? 'Registering Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="oauth-divider" style={{ marginTop: '1.5rem' }}>
            <span>or sign up with third party</span>
          </div>

          <div 
            id="google-signin-btn-container" 
            style={{ width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}
          ></div>

          <div className="login-footer-text">
            Already have an account? <RouterLink to={`/login?redirect=${encodeURIComponent(redirect)}`}>Sign In</RouterLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
