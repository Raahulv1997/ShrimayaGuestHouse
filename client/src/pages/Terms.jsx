import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

const Terms = () => {
  return (
    <div className="terms-page">
      <div className="page-header-banner">
        <div className="container banner-inner">
          <div className="banner-badge"><ShieldCheck size={14} /> GUEST POLICIES</div>
          <h2>Terms & Conditions</h2>
          <p>Read through our guidelines regarding room check-in times, cancellations, key handovers, and guest conduct.</p>
        </div>
      </div>

      <div className="container section" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.8' }}>
        <h3 className="luxury-font" style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>1. Check-In & Check-Out Times</h3>
        <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem' }}>
          Standard check-in starts at <strong>12:00 PM</strong>, and standard check-out must be completed by <strong>11:00 AM</strong>. Early check-in or late check-out requests are subject to room occupancy levels and may attract nominal hourly charges.
        </p>

        <h3 className="luxury-font" style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>2. Cancellation & Refund Policy</h3>
        <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem' }}>
          Standard reservations can be cancelled up to <strong>24 hours prior</strong> to the scheduled check-in time for a full 100% refund. Cancellations made inside the 24-hour window will forfeit the first night's tariff charge. Refunds are processed back to the original UPI/Card payment method.
        </p>

        <h3 className="luxury-font" style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>3. Identity Verification</h3>
        <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem' }}>
          Every adult guest checking in is legally required to produce a valid Government-approved photo identity proof (Aadhaar Card, Passport, Voter ID, or Driving License). PAN Card is not accepted as address validation proof.
        </p>

        <h3 className="luxury-font" style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>4. Guest Conduct & Quiet Hours</h3>
        <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem' }}>
          To maintain a serene, family-friendly environment, quiet hours are observed from <strong>10:00 PM to 7:00 AM</strong>. Loud music, parties, or disturbances in the garden area are strictly prohibited. The management reserves the right to evict disruptive guests without a refund.
        </p>
      </div>
    </div>
  );
};

export default Terms;
