import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { Mail, Lock, Sparkles, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Login.css';

const Login = () => {
  const { t } = useLanguage();
  const { login, googleLogin, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    // If already logged in, redirect
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

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

          {errorMsg && <div className="login-error-alert">{errorMsg}</div>}

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
