import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { User, Calendar, CreditCard, Download, Trash2, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useLanguage();
  const { user, loading: authLoading, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Profile Edit states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const showSuccessBanner = searchParams.get('status') === 'success';

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
    }
  }, [user, authLoading, navigate]);

  const fetchMyBookings = async () => {
    setLoadingBookings(true);
    try {
      const { data } = await API.get('/bookings/my');
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyBookings();
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    const payload = { name, email, phone };
    if (password) {
      if (password.length < 6) {
        setProfileError('Password must be at least 6 characters.');
        return;
      }
      payload.password = password;
    }

    const result = await updateProfile(payload);
    if (result.success) {
      setProfileSuccess('Profile updated successfully!');
      setPassword('');
    } else {
      setProfileError(result.message);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation? If paid, a refund will be processed.')) {
      return;
    }

    try {
      await API.put(`/bookings/${bookingId}/cancel`);
      alert('Booking cancelled successfully.');
      fetchMyBookings(); // reload
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  const handleDownloadInvoice = async (bookingId, orderCode) => {
    try {
      const response = await API.get(`/payments/invoice/${bookingId}`, {
        responseType: 'blob', // Important
      });
      // Create element link to trigger download
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', `Invoice_SM-${orderCode.toUpperCase()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      alert('Failed to download invoice PDF. Make sure payment has been captured.');
    }
  };

  if (authLoading) {
    return <div className="container section text-center">Loading User Profile...</div>;
  }

  const activeBookings = bookings.filter(b => b.status !== 'cancelled');
  const pastBookings = bookings.filter(b => b.status === 'cancelled');

  return (
    <div className="dashboard-page section">
      <div className="container">
        {showSuccessBanner && (
          <div className="booking-success-banner card float-anim">
            <CheckCircle2 size={48} className="success-icon" />
            <div>
              <h3>Booking Successful!</h3>
              <p>Thank you for choosing Shrimaya Guest House. Your payment has been processed and your stay is now secured. You can view details and download your PDF invoice below.</p>
            </div>
            <button className="close-banner-btn" onClick={() => setSearchParams({})}>×</button>
          </div>
        )}

        <div className="dashboard-layout-grid">
          {/* Left Column: Reservations */}
          <main className="dashboard-main-content">
            <div className="dashboard-header-title">
              <span className="lbl"><Sparkles size={14} /> CUSTOMER PORTAL</span>
              <h2>{t('myBookings')}</h2>
            </div>

            {loadingBookings ? (
              <div className="bookings-loader">Fetching your stay history...</div>
            ) : bookings.length === 0 ? (
              <div className="no-bookings-widget card">
                <h4>No Reservations Found</h4>
                <p>{t('noBookingsText')}</p>
                <button className="btn btn-gold" onClick={() => navigate('/rooms')}>
                  Find a Room
                </button>
              </div>
            ) : (
              <div className="bookings-list-wrapper">
                {/* Active Bookings */}
                {activeBookings.length > 0 && (
                  <div className="booking-section-group">
                    <h3>Active & Confirmed Stays</h3>
                    <div className="bookings-cards-grid">
                      {activeBookings.map((b) => (
                        <div key={b._id} className="booking-status-card card">
                          <div className="card-top">
                            <div>
                              <h4>{b.room?.name || 'Deleted Room Listing'}</h4>
                              <span className="booking-id-sub">Ref: SM-{b._id.toString().substring(18).toUpperCase()}</span>
                            </div>
                            <span className={`badge badge-${b.status}`}>
                              {b.status}
                            </span>
                          </div>
                          
                          <div className="card-details-grid">
                            <div>
                              <strong>Dates:</strong> {new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}
                            </div>
                            <div>
                              <strong>Guests:</strong> {b.guests} Guests
                            </div>
                            <div>
                              <strong>Rooms:</strong> {b.roomsCount} Room(s)
                            </div>
                            <div>
                              <strong>Total Amount:</strong> Rs. {b.totalAmount} ({b.paymentStatus})
                            </div>
                          </div>

                          <div className="card-actions-row">
                            {b.paymentStatus === 'paid' && (
                              <button
                                className="btn btn-navy btn-sm"
                                onClick={() => handleDownloadInvoice(b._id, b._id.toString().substring(18))}
                              >
                                <Download size={14} /> Invoice PDF
                              </button>
                            )}
                            {b.status !== 'cancelled' && (
                              <button
                                className="btn btn-outline btn-sm btn-danger-style"
                                onClick={() => handleCancelBooking(b._id)}
                              >
                                <Trash2 size={14} /> Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cancellation History */}
                {pastBookings.length > 0 && (
                  <div className="booking-section-group">
                    <h3>Cancelled Reservations</h3>
                    <div className="table-responsive card">
                      <table>
                        <thead>
                          <tr>
                            <th>Room Type</th>
                            <th>Dates</th>
                            <th>Amount</th>
                            <th>Payment Status</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pastBookings.map((b) => (
                            <tr key={b._id}>
                              <td><strong>{b.room?.name || 'Deleted Room Listing'}</strong></td>
                              <td>{new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}</td>
                              <td>Rs. {b.totalAmount}</td>
                              <td>{b.paymentStatus}</td>
                              <td><span className="badge badge-danger">Cancelled</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>

          {/* Right Column: Settings */}
          <aside className="dashboard-settings-sidebar">
            <div className="card sidebar-settings-card">
              <h3><User size={18} /> {t('profileDetails')}</h3>
              
              {profileSuccess && <div className="profile-alert success">{profileSuccess}</div>}
              {profileError && <div className="profile-alert error">{profileError}</div>}

              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-group">
                  <label htmlFor="prof-name">Full Name</label>
                  <input
                    id="prof-name"
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prof-email">Email Address</label>
                  <input
                    id="prof-email"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={user.googleId !== null} // Disable email change if logged in with Google
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prof-phone">Phone Number</label>
                  <input
                    id="prof-phone"
                    type="tel"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {user.googleId === null && (
                  <div className="form-group">
                    <label htmlFor="prof-pass">New Password (Leave blank to keep current)</label>
                    <input
                      id="prof-pass"
                      type="password"
                      className="form-control"
                      value={password}
                      placeholder="••••••••"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                )}

                <button type="submit" className="btn btn-gold btn-full">
                  {t('updateProfileBtn')}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
