import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, User, LogOut, ShieldAlert } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { language, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const toggleLang = () => {
    changeLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          <span className="logo-gold">SHRIMAYA</span>
          <span className="logo-sub">GUEST HOUSE</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links-desktop">
          <Link to="/" className="nav-item">{t('home')}</Link>
          <Link to="/rooms" className="nav-item">{t('rooms')}</Link>
          <Link to="/facilities" className="nav-item">{t('facilities')}</Link>
          <Link to="/gallery" className="nav-item">{t('gallery')}</Link>
          <Link to="/offers" className="nav-item">{t('offers')}</Link>
          <Link to="/about" className="nav-item">{t('about')}</Link>
          <Link to="/contact" className="nav-item">{t('contact')}</Link>
        </div>

        <div className="nav-actions-desktop">
          <button className="lang-toggle-btn" onClick={toggleLang} title="Switch Language / भाषा बदलें">
            <Globe size={18} />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {user ? (
            <div className="user-dropdown-container">
              {user.role === 'admin' ? (
                <Link to="/admin" className="btn btn-gold btn-sm">
                  <ShieldAlert size={16} />
                  <span>{t('adminPanel')}</span>
                </Link>
              ) : (
                <Link to="/dashboard" className="btn btn-outline btn-sm">
                  <User size={16} />
                  <span>{t('dashboard')}</span>
                </Link>
              )}
              <button className="logout-icon-btn" onClick={handleLogout} title={t('logout')}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-gold btn-sm">{t('login')}</Link>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`nav-drawer-mobile ${isOpen ? 'active' : ''}`}>
        <div className="drawer-links">
          <Link to="/" onClick={() => setIsOpen(false)}>{t('home')}</Link>
          <Link to="/rooms" onClick={() => setIsOpen(false)}>{t('rooms')}</Link>
          <Link to="/facilities" onClick={() => setIsOpen(false)}>{t('facilities')}</Link>
          <Link to="/gallery" onClick={() => setIsOpen(false)}>{t('gallery')}</Link>
          <Link to="/offers" onClick={() => setIsOpen(false)}>{t('offers')}</Link>
          <Link to="/about" onClick={() => setIsOpen(false)}>{t('about')}</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)}>{t('contact')}</Link>

          <div className="drawer-divider"></div>

          <button className="lang-toggle-btn-mobile" onClick={() => { toggleLang(); setIsOpen(false); }}>
            <Globe size={18} />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" className="btn btn-gold mobile-btn" onClick={() => setIsOpen(false)}>
                  <ShieldAlert size={18} />
                  <span>{t('adminPanel')}</span>
                </Link>
              ) : (
                <Link to="/dashboard" className="btn btn-outline mobile-btn" onClick={() => setIsOpen(false)}>
                  <User size={18} />
                  <span>{t('dashboard')}</span>
                </Link>
              )}
              <button className="btn btn-navy mobile-btn" onClick={handleLogout}>
                <LogOut size={18} />
                <span>{t('logout')}</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-gold mobile-btn" onClick={() => setIsOpen(false)}>{t('login')}</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
