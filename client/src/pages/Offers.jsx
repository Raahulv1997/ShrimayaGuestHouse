import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Ticket, Sparkles, Copy, Check, ShieldCheck } from 'lucide-react';
import './Offers.css';

const Offers = () => {
  const { t } = useLanguage();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const { data } = await API.get('/offers');
        setOffers(data);
      } catch (err) {
        console.error(err);
        // Fallback local static deals
        setOffers([
          { _id: '1', code: 'WELCOME10', discountPercentage: 10, description: 'Get a warm 10% discount on your first booking with Shrimaya Guest House.', validUntil: '2030-12-31' },
          { _id: '2', code: 'SEASON25', discountPercentage: 25, description: 'Enjoy 25% discount on bookings extending to 3 or more nights. Valid for all room suites.', validUntil: '2030-12-31' },
          { _id: '3', code: 'FAMILYDEAL', discountPercentage: 15, description: 'Special family deal! Get 15% off when booking the Premium Family Suite.', validUntil: '2030-12-31' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  return (
    <div className="offers-page">
      {/* Banner */}
      <div className="page-header-banner">
        <div className="container banner-inner">
          <div className="banner-badge"><Sparkles size={14} /> EXCLUSIVE DEALS</div>
          <h2>Special Promotional Offers</h2>
          <p>Unlock seasonal discount coupons, loyalty rewards, and packages designed to give you best value.</p>
        </div>
      </div>

      <div className="container section">
        {loading ? (
          <div className="offers-loader">Syncing promotional deals...</div>
        ) : offers.length === 0 ? (
          <div className="text-center" style={{ padding: '4rem' }}>
            <h4>No Active Coupons</h4>
            <p>Check back later for seasonal holiday discounts!</p>
          </div>
        ) : (
          <div className="offers-list-grid">
            {offers.map((off) => (
              <div key={off._id} className="offer-ticket-card card float-anim">
                <div className="ticket-left">
                  <Ticket size={48} className="ticket-icon" />
                  <div className="discount-heading">{off.discountPercentage}% OFF</div>
                </div>

                <div className="ticket-right">
                  <h3>{off.description}</h3>
                  <p className="validity-label">Valid Until: <strong>{new Date(off.validUntil).toLocaleDateString()}</strong></p>
                  
                  <div className="coupon-code-copy-row">
                    <span className="code-display">{off.code}</span>
                    <button
                      className="btn btn-navy copy-btn"
                      onClick={() => handleCopyCode(off.code)}
                    >
                      {copiedCode === off.code ? (
                        <>
                          <Check size={14} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy Code
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Note */}
        <div className="offers-note-block card">
          <h4>How to Redeem Coupons:</h4>
          <p>
            1. Copy the Coupon Code from this page. <br/>
            2. Go to the Rooms page, select your preferred suite, and enter dates to check availability. <br/>
            3. On the Booking Checkout page, paste the Coupon Code into the discount box and click "Apply". <br/>
            4. The discount percentage will be automatically subtracted from your Grand Total before payment!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Offers;
