import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Calendar, Users, Home, Ticket, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
import API, { getImageUrl } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Booking.css';

const Booking = () => {
  const { t } = useLanguage();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const roomId = searchParams.get('roomId');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const checkInTime = searchParams.get('checkInTime') || '12:00';
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const checkOutTime = searchParams.get('checkOutTime') || '11:00';
  const [guests, setGuests] = useState(Number(searchParams.get('guests')) || 1);
  const [roomsCount, setRoomsCount] = useState(Number(searchParams.get('roomsCount')) || 1);

  const [room, setRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [bookingError, setBookingError] = useState('');

  // Discount / Pricing States
  const [coupon, setCoupon] = useState('');
  const [couponDetails, setCouponDetails] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Booking Flow States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMockGateway, setShowMockGateway] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState('');
  const [mockOrderId, setMockOrderId] = useState('');
  const [mockAmount, setMockAmount] = useState(0);

  // Fetch Room details
  useEffect(() => {
    if (!roomId) {
      setBookingError('No room selected. Please return to the rooms listing.');
      setLoadingRoom(false);
      return;
    }

    const fetchRoom = async () => {
      try {
        const { data } = await API.get(`/rooms/${roomId}`);
        setRoom(data);
      } catch (err) {
        console.error(err);
        setBookingError('Failed to fetch room details.');
      } finally {
        setLoadingRoom(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  // If dates are missing, fallback to default dates (today to tomorrow)
  useEffect(() => {
    const today = new Date();
    if (!checkIn) {
      setCheckIn(today.toISOString().split('T')[0]);
    }
    if (!checkOut) {
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      setCheckOut(tomorrow.toISOString().split('T')[0]);
    }
  }, [checkIn, checkOut]);

  // Calculations
  const getNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  };

  const nights = getNights();
  const subtotal = room ? room.pricePerNight * roomsCount * nights : 0;
  const discount = couponDetails ? (subtotal * couponDetails.discountPercentage) / 100 : 0;
  const taxableAmount = subtotal - discount;
  const gstAmount = Math.round(taxableAmount * 0.18);
  const totalAmount = taxableAmount + gstAmount;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!coupon.trim()) return;

    try {
      const { data } = await API.get(`/offers/check/${coupon.toUpperCase()}`);
      setCouponDetails(data);
      setCouponSuccess(`Coupon ${data.code} applied! ${data.discountPercentage}% Discount.`);
      setCouponError('');
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid or expired coupon code.');
      setCouponSuccess('');
      setCouponDetails(null);
    }
  };

  // Helper to load Razorpay Checkout Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleWhatsAppBooking = async () => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create booking in pending state on the backend
      const { data: booking } = await API.post('/bookings', {
        roomId,
        checkIn,
        checkOut,
        guests,
        roomsCount,
        couponCode: couponDetails?.code || '',
      });

      // 2. Compile WhatsApp structured message
      const checkInDate = new Date(checkIn).toLocaleDateString();
      const checkOutDate = new Date(checkOut).toLocaleDateString();
      
      const waMsg = `*SHRIMAYA GUEST HOUSE - BOOKING INQUIRY*\n\n` +
                    `*Guest Name:* ${user.name}\n` +
                    `*Guest Email:* ${user.email}\n` +
                    `*Guest Phone:* ${user.phone || 'N/A'}\n` +
                    `*Booking ID:* ${booking._id}\n` +
                    `*Room Type:* ${room.name} (${room.category})\n` +
                    `*Check-In Date:* ${checkInDate} at ${checkInTime}\n` +
                    `*Check-Out Date:* ${checkOutDate} at ${checkOutTime}\n` +
                    `*Stay Duration:* ${nights} Night(s)\n` +
                    `*Rooms Count:* ${roomsCount} Room(s)\n` +
                    `*Guests:* ${guests} Person(s)\n` +
                    `*Total Price:* Rs. ${totalAmount}\n` +
                    `*Discount Code:* ${couponDetails?.code || 'None'}\n\n` +
                    `Please confirm availability and share payment options. Thank you!`;

      // 3. Open WhatsApp link to hotel number 918269364180
      const waNumber = '918269364180';
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`, '_blank');

      // 4. Redirect guest to dashboard showing pending confirmation
      navigate('/dashboard?status=pending');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error creating WhatsApp booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create booking in unpaid state
      const { data: booking } = await API.post('/bookings', {
        roomId,
        checkIn,
        checkOut,
        guests,
        roomsCount,
        couponCode: couponDetails?.code || '',
      });

      // 2. Request payment order details
      const { data: order } = await API.post('/payments/order', {
        bookingId: booking._id,
      });

      setActiveBookingId(booking._id);

      if (order.mock) {
        // Razorpay is dummy or not set. Trigger mock checkout gateway overlay.
        setMockOrderId(order.id);
        setMockAmount(order.amount / 100);
        setShowMockGateway(true);
        setIsSubmitting(false);
      } else {
        // Load real Razorpay SDK
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          alert('Failed to load Razorpay SDK. Please check your network connection.');
          setIsSubmitting(false);
          return;
        }

        const options = {
          key: order.key || 'rzp_test_mock_keys',
          amount: order.amount,
          currency: order.currency,
          name: 'Shrimaya Guest House',
          description: `Booking for ${room.name}`,
          order_id: order.id,
          handler: async (response) => {
            try {
              // Verify on backend
              const verifyRes = await API.post('/payments/verify', {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                bookingId: booking._id,
                isMock: false,
              });
              if (verifyRes.data.success) {
                navigate('/dashboard?status=success');
              }
            } catch (verifyErr) {
              console.error(verifyErr);
              alert('Payment verification failed.');
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone || '9988776655',
          },
          theme: {
            color: '#0D1B2A',
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error occurred during checkout.');
      setIsSubmitting(false);
    }
  };

  const handleMockPaymentSuccess = async () => {
    setIsSubmitting(true);
    setShowMockGateway(false);
    try {
      const verifyRes = await API.post('/payments/verify', {
        razorpayOrderId: mockOrderId,
        razorpayPaymentId: `pay_mock_${Math.random().toString(36).substring(2, 10)}`,
        razorpaySignature: 'mock_signature_approved',
        bookingId: activeBookingId,
        isMock: true,
      });

      if (verifyRes.data.success) {
        navigate('/dashboard?status=success');
      }
    } catch (error) {
      console.error(error);
      alert('Mock payment processing failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingRoom) {
    return (
      <div className="booking-page skeleton-loading-view">
        {/* Skeleton Header Banner */}
        <div className="page-header-banner">
          <div className="container banner-inner">
            <div className="skeleton-shimmer" style={{ width: '120px', height: '18px', borderRadius: '20px', marginBottom: '0.75rem' }}></div>
            <div className="skeleton-shimmer" style={{ width: '320px', height: '32px', marginBottom: '0.75rem' }}></div>
            <div className="skeleton-shimmer" style={{ width: '450px', height: '16px' }}></div>
          </div>
        </div>

        <div className="container booking-grid section">
          {/* Left Side Skeleton */}
          <main className="booking-summary-column">
            <div className="summary-card card">
              <div className="skeleton-shimmer skeleton-text heading"></div>
              <div className="summary-room-header">
                <div className="skeleton-shimmer skeleton-image"></div>
                <div style={{ flex: 1 }}>
                  <div className="skeleton-shimmer skeleton-text" style={{ width: '70%', height: '20px' }}></div>
                  <div className="skeleton-shimmer skeleton-text" style={{ width: '40%', height: '12px', marginTop: '0.25rem' }}></div>
                </div>
              </div>
              <div className="summary-details-list" style={{ marginTop: '1.5rem' }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="detail-row" style={{ marginBottom: '0.5rem' }}>
                    <div className="skeleton-shimmer" style={{ width: '30%', height: '16px' }}></div>
                    <div className="skeleton-shimmer" style={{ width: '40%', height: '16px' }}></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="summary-card card">
              <div className="skeleton-shimmer skeleton-text heading" style={{ width: '30%' }}></div>
              <div className="guest-info-display">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="skeleton-shimmer skeleton-text" style={{ width: '60%', height: '16px', marginBottom: '0.75rem' }}></div>
                ))}
              </div>
            </div>
          </main>

          {/* Right Side Skeleton */}
          <aside className="booking-billing-column">
            <div className="billing-widget card">
              <div className="skeleton-shimmer skeleton-text heading" style={{ width: '50%' }}></div>
              <div className="skeleton-shimmer skeleton-input"></div>
            </div>
            
            <div className="billing-widget card">
              <div className="skeleton-shimmer skeleton-text heading" style={{ width: '40%' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="skeleton-shimmer" style={{ width: '50%', height: '14px' }}></div>
                    <div className="skeleton-shimmer" style={{ width: '20%', height: '14px' }}></div>
                  </div>
                ))}
              </div>
              <div className="skeleton-shimmer skeleton-button"></div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  if (bookingError || !room) {
    return (
      <div className="container section text-center">
        <h3>Booking Checklist Error</h3>
        <p>{bookingError || 'Please select a valid room to book.'}</p>
        <RouterLink to="/rooms" className="btn btn-gold" style={{ marginTop: '1rem' }}>
          Back to Rooms
        </RouterLink>
      </div>
    );
  }

  return (
    <div className="booking-page">
      {/* Header */}
      <div className="page-header-banner">
        <div className="container banner-inner">
          <div className="banner-badge"><ShieldCheck size={14} /> SECURE BOOKING</div>
          <h2>Confirm Your Reservation</h2>
          <p>You are one step away from locking in your premium suite at Shrimaya Guest House.</p>
        </div>
      </div>

      <div className="container booking-grid section">
        {/* Left Side: Summary & Payment */}
        <main className="booking-summary-column">
          {/* Reservation Summary */}
          <div className="summary-card card">
            <h3 className="summary-title">Reservation Summary</h3>
            <div className="summary-room-header">
              <img src={getImageUrl(room.images[0])} alt={room.name} className="summary-room-img" />
              <div>
                <h4>{room.name}</h4>
                <span className="cat">{room.category}</span>
              </div>
            </div>

            <div className="summary-details-list">
              <div className="detail-row">
                <div className="lbl"><Calendar size={16} /> Check-In</div>
                <div className="val">{new Date(checkIn).toLocaleDateString()} at {checkInTime}</div>
              </div>
              <div className="detail-row">
                <div className="lbl"><Calendar size={16} /> Check-Out</div>
                <div className="val">{new Date(checkOut).toLocaleDateString()} at {checkOutTime}</div>
              </div>
              <div className="detail-row">
                <div className="lbl">Nights</div>
                <div className="val">{nights} {nights === 1 ? 'Night' : 'Nights'}</div>
              </div>
              <div className="detail-row">
                <div className="lbl"><Users size={16} /> Guests</div>
                <div className="val">{guests} {guests === 1 ? 'Guest' : 'Guests'}</div>
              </div>
              <div className="detail-row">
                <div className="lbl"><Home size={16} /> Rooms Booked</div>
                <div className="val">{roomsCount} {roomsCount === 1 ? 'Room' : 'Rooms'}</div>
              </div>
            </div>
          </div>

          {/* Guest Form details info */}
          <div className="summary-card card">
            <h3 className="summary-title">Guest Details</h3>
            {user ? (
              <div className="guest-info-display">
                <div className="info-field"><strong>Full Name:</strong> {user.name}</div>
                <div className="info-field"><strong>Email Address:</strong> {user.email}</div>
                <div className="info-field"><strong>Phone:</strong> {user.phone || 'Not Provided (Update in Dashboard)'}</div>
              </div>
            ) : (
              <div className="login-prompt-booking">
                <p>You must login or register to complete the reservation.</p>
                <RouterLink to={`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`} className="btn btn-navy">
                  Login & Continue
                </RouterLink>
              </div>
            )}
          </div>
        </main>

        {/* Right Side: Total Bill & Checkout */}
        <aside className="booking-billing-column">
          {/* Coupon */}
          <div className="billing-widget card">
            <h3><Ticket size={16} /> Discount Coupons</h3>
            <form className="coupon-form" onSubmit={handleApplyCoupon}>
              <input
                type="text"
                placeholder="PROMOCODE (e.g. WELCOME10)"
                className="form-control coupon-input"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button type="submit" className="btn btn-outline coupon-btn">Apply</button>
            </form>
            {couponError && <p className="coupon-msg err">{couponError}</p>}
            {couponSuccess && <p className="coupon-msg succ">{couponSuccess}</p>}
          </div>

          {/* Final Receipt */}
          <div className="billing-widget card final-bill">
            <h3>Billing Breakdown</h3>
            <div className="bill-rows">
              <div className="bill-row-item">
                <span>Room Charges ({roomsCount} room x {nights} nights)</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="bill-row-item discount-row">
                  <span>Promo Code Applied ({couponDetails.code})</span>
                  <span>- Rs. {discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="bill-row-item">
                <span>CGST (9%)</span>
                <span>Rs. {(gstAmount / 2).toFixed(2)}</span>
              </div>
              <div className="bill-row-item">
                <span>SGST (9%)</span>
                <span>Rs. {(gstAmount / 2).toFixed(2)}</span>
              </div>
              
              <div className="divider"></div>
              
              <div className="bill-row-item grand-total">
                <span>Grand Total (INR)</span>
                <span>Rs. {totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleConfirmBooking}
              className="btn btn-gold btn-checkout"
              disabled={isSubmitting || !user}
            >
              <CreditCard size={18} />
              {isSubmitting ? 'Processing Checkout...' : 'Confirm and Pay'}
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>— OR —</span>
              <button
                onClick={handleWhatsAppBooking}
                className="btn btn-outline btn-checkout"
                style={{ borderColor: '#25D366', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                disabled={isSubmitting || !user}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.764.456 3.48 1.332 5.004L2 22l5.124-1.332c1.488.816 3.168 1.344 4.884 1.344C17.52 22 22 17.52 22 12.012 22 6.48 17.52 2 12.012 2zm.012 18.288c-1.572 0-3.12-.42-4.488-1.224l-.324-.192-3.324.864.888-3.24-.216-.348c-.876-1.404-1.344-3.036-1.344-4.716 0-4.86 3.96-8.82 8.82-8.82s8.82 3.96 8.82 8.82-3.96 8.82-8.82 8.82zm4.788-6.108c-.264-.132-1.56-.768-1.788-.864-.24-.084-.408-.132-.576.132-.168.264-.66.828-.804.996-.144.168-.288.192-.552.06-2.58-1.116-3.768-2.616-4.2-3.372-.264-.456.096-.408.432-.984.072-.12.036-.228-.012-.324-.048-.096-.408-.984-.564-1.356-.144-.36-.312-.312-.432-.312-.108-.012-.24-.012-.372-.012-.132 0-.348.048-.528.252-.18.204-.696.684-.696 1.668s.72 1.932.816 2.064c.096.132 1.416 2.16 3.432 3.036.48.204.852.324 1.14.42.48.156.924.132 1.272.084.384-.06.132-.24.756-.912.228-.24.372-.516.48-.756.108-.24.06-.456-.036-.588z" />
                </svg>
                {isSubmitting ? 'Processing...' : 'Book via WhatsApp'}
              </button>
            </div>
            {!user && <p className="checkout-helper-text">Please log in to proceed with booking.</p>}
          </div>
        </aside>
      </div>

      {/* Simulated Gateway Dialog Modal */}
      {showMockGateway && (
        <div className="mock-gateway-overlay">
          <div className="mock-gateway-card card float-anim">
            <div className="mock-gateway-header">
              <Sparkles size={24} className="spark-gold" />
              <h3>Simulated Payment Gateway</h3>
            </div>
            <p className="gateway-desc">
              Razorpay API keys are not configured. We have initiated a **sandbox checkout** simulation so you can review the booking engine's invoice compilation, validation checks, and email confirmation structures.
            </p>

            <div className="gateway-receipt-details">
              <div><strong>Merchant:</strong> Shrimaya Guest House</div>
              <div><strong>Order ID:</strong> {mockOrderId}</div>
              <div><strong>Amount to Pay:</strong> Rs. {mockAmount.toFixed(2)}</div>
            </div>

            <div className="gateway-card-mockup">
              <div className="chip"></div>
              <div className="number">•••• •••• •••• 4242</div>
              <div className="expiry">12/30</div>
              <div className="name">{user?.name?.toUpperCase()}</div>
            </div>

            <div className="gateway-actions">
              <button
                className="btn btn-gold btn-gateway"
                onClick={handleMockPaymentSuccess}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Authorizing Mock payment...' : `Pay Rs. ${mockAmount.toFixed(2)} (Sandbox Success)`}
              </button>
              <button
                className="btn btn-outline btn-gateway"
                onClick={() => { setShowMockGateway(false); setIsSubmitting(false); }}
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
