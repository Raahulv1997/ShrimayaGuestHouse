import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-page">
      <div className="page-header-banner">
        <div className="container banner-inner">
          <div className="banner-badge"><ShieldCheck size={14} /> SECURITY & TRUST</div>
          <h2>Privacy Policy</h2>
          <p>We respect your privacy. Learn how Shrimaya Guest House handles, secures, and uses your personal and transaction data.</p>
        </div>
      </div>

      <div className="container section" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.8' }}>
        <h3 className="luxury-font" style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>1. Data Collection</h3>
        <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem' }}>
          When you register on our website or make a reservation, we collect personal details such as your full name, email address, contact number, and stay dates. This information is required to verify booking authenticity and compile legal hotel registry books.
        </p>

        <h3 className="luxury-font" style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>2. Transaction Safety & Razorpay</h3>
        <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem' }}>
          All online checkouts (Cards, UPI, Netbanking) are processed securely through Razorpay's merchant payment gateway infrastructure. Shrimaya Guest House does not store your credit/debit card numbers or CVV values on our local servers. Payments are encrypted via SSL protocols.
        </p>

        <h3 className="luxury-font" style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>3. How We Use Cookies</h3>
        <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem' }}>
          We use lightweight browser cookies to maintain your login session active and store language localization selections (English/Hindi). We do not use third-party tracker cookies for behavioral advertisement mapping.
        </p>

        <h3 className="luxury-font" style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>4. Security Audits</h3>
        <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem' }}>
          Our database uses JSON Web Tokens (JWT) for secure authentication. User passwords are encrypted using bcrypt hashing before storage. We conduct regular system updates to prevent unauthorized database access.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
