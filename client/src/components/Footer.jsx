import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo">
            <span className="logo-gold">SHRIMAYA</span>
            <span className="logo-sub">GUEST HOUSE</span>
          </Link>
          <p className="footer-desc">
            Nestled in comfort, Shrimaya Guest House offers the perfect blend of traditional Indian hospitality and modern premium lodging. A luxury destination that feels like home.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><Facebook size={18} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><Instagram size={18} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><Twitter size={18} /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><Youtube size={18} /></a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-col links-col">
          <h3>{t('quickLinks')}</h3>
          <div className="footer-links">
            <Link to="/">{t('home')}</Link>
            <Link to="/rooms">{t('rooms')}</Link>
            <Link to="/facilities">{t('facilities')}</Link>
            <Link to="/gallery">{t('gallery')}</Link>
            <Link to="/offers">{t('offers')}</Link>
            <Link to="/about">{t('about')}</Link>
            <Link to="/contact">{t('contact')}</Link>
          </div>
        </div>

        {/* Contact Info Column */}
        <div className="footer-col contact-col">
          <h3>{t('contactInfo')}</h3>
          <ul className="footer-contact-details">
            <li>
              <MapPin size={18} className="contact-icon" />
              <span>Rajeshwari Dham, Manhar Hotel Ke Pass, Bhind Road, Malanpur Distt. Bhind (M.P.)</span>
            </li>
            <li>
              <Phone size={18} className="contact-icon" />
              <span>8269364180, 8269907127, 9926233735</span>
            </li>
            <li>
              <Mail size={18} className="contact-icon" />
              <span>contact@shrimayaguesthouse.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="footer-col newsletter-col">
          <h3>{t('newsletterTitle')}</h3>
          <p className="newsletter-text">{t('newsletterSub')}</p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your email address"
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-gold newsletter-btn">
              {t('subscribeBtn')}
            </button>
          </form>
          {subscribed && (
            <p className="newsletter-success">
              ✓ Thank you! You have subscribed successfully.
            </p>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-container">
          <p>&copy; {new Date().getFullYear()} Shrimaya Guest House. {t('rightsReserved')}</p>
          <div className="bottom-links">
            <Link to="/privacy">{t('privacyPolicy')}</Link>
            <Link to="/terms">{t('termsConditions')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
