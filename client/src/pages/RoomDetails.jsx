import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Star, Wifi, Car, Shield, Clock, Snowflake, Trees, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import API, { getImageUrl } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import BookingForm from '../components/BookingForm';
import './RoomDetails.css';

const RoomDetails = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // New review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchRoomAndReviews = async () => {
      setLoading(true);
      try {
        const roomRes = await API.get(`/rooms/${id}`);
        setRoom(roomRes.data);

        const reviewsRes = await API.get(`/reviews?roomId=${id}`);
        setReviews(reviewsRes.data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to load room details.');
        // Fallback data if backend is offline
        if (id === '1' || id.length < 5) {
          setRoom({
            _id: id,
            name: 'Deluxe Room',
            category: 'Deluxe Room',
            description: 'Spacious Deluxe Room featuring a comfortable queen-size bed, elegant furnishings, and modern hospitality standards. Ideal for budget-conscious business and leisure travelers seeking supreme comfort.',
            pricePerNight: 800,
            maxGuests: 2,
            amenities: ['Free WiFi', 'Parking', 'Room Service', 'CCTV Security', '24x7 Reception'],
            images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80']
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRoomAndReviews();
  }, [id]);

  // Set dynamic Room details SEO Metadata
  useEffect(() => {
    if (room) {
      document.title = `${room.name} (${room.category}) | Shrimaya Guest House`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", `Book our ${room.name} in Malanpur at Rs. ${room.pricePerNight}/night. Accommodates up to ${room.maxGuests} guests. Free WiFi, clean rooms, and 24/7 security. Contact: 8269364180.`);
      }
    }
  }, [room]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const { data } = await API.post('/reviews', {
        roomId: id,
        rating,
        comment,
      });
      setReviewSuccess(data.message || 'Review submitted successfully! Pending approval.');
      setComment('');
      setRating(5);
      setReviewError('');
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
      setReviewSuccess('');
    }
  };

  if (loading) {
    return (
      <div className="room-details-page skeleton-loading-view">
        {/* Skeleton Hero Banner */}
        <div className="room-details-hero skeleton-shimmer" style={{ background: '#0d1b2a' }}>
          <div className="container hero-inner">
            <div className="skeleton-shimmer" style={{ width: '100px', height: '18px', borderRadius: '20px', marginBottom: '0.75rem' }}></div>
            <div className="skeleton-shimmer" style={{ width: '350px', height: '36px', marginBottom: '0.75rem' }}></div>
            <div className="skeleton-shimmer" style={{ width: '180px', height: '22px' }}></div>
          </div>
        </div>

        <div className="container room-details-grid section">
          {/* Left Column: Room Info Skeleton */}
          <main className="room-details-main">
            {/* Gallery Block Skeleton */}
            <div className="room-gallery-block card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="skeleton-shimmer" style={{ width: '100%', height: '400px', borderRadius: '4px' }}></div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="skeleton-shimmer" style={{ width: '80px', height: '60px', borderRadius: '4px' }}></div>
                ))}
              </div>
            </div>

            {/* About Room Skeleton */}
            <div className="details-info-section card" style={{ padding: '1.75rem', marginTop: '1.5rem' }}>
              <div className="skeleton-shimmer skeleton-text heading" style={{ width: '25%' }}></div>
              <div className="skeleton-shimmer skeleton-text" style={{ height: '14px', width: '100%', marginBottom: '0.5rem' }}></div>
              <div className="skeleton-shimmer skeleton-text" style={{ height: '14px', width: '95%', marginBottom: '0.5rem' }}></div>
              <div className="skeleton-shimmer skeleton-text" style={{ height: '14px', width: '80%' }}></div>
            </div>

            {/* Specifications Grid Skeleton */}
            <div className="room-specs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1.5rem', marginBottom: '2rem' }}>
              {[...Array(2)].map((_, idx) => (
                <div key={idx} className="skeleton-shimmer" style={{ height: '70px', borderRadius: '4px' }}></div>
              ))}
            </div>
          </main>

          {/* Right Column: Sticky Booking Widget Skeleton */}
          <aside className="room-details-sidebar">
            <div className="glass-card sidebar-sticky-widget">
              <div className="skeleton-shimmer skeleton-text heading" style={{ width: '60%', marginBottom: '1.5rem' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[...Array(4)].map((_, idx) => (
                  <div key={idx}>
                    <div className="skeleton-shimmer" style={{ width: '40%', height: '12px', marginBottom: '0.5rem' }}></div>
                    <div className="skeleton-shimmer" style={{ width: '100%', height: '40px', borderRadius: '4px' }}></div>
                  </div>
                ))}
              </div>
              <div className="skeleton-shimmer skeleton-button" style={{ marginTop: '1.5rem' }}></div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  if (error && !room) {
    return (
      <div className="container section text-center">
        <h3>Room Not Found</h3>
        <p>{error}</p>
        <RouterLink to="/rooms" className="btn btn-navy" style={{ marginTop: '1rem' }}>
          Back to Rooms
        </RouterLink>
      </div>
    );
  }

  return (
    <div className="room-details-page">
      {/* Hero Banner */}
      <div className="room-details-hero" style={{ backgroundImage: `linear-gradient(rgba(13, 27, 42, 0.5), rgba(13, 27, 42, 0.7)), url(${getImageUrl(room.images[0])})` }}>
        <div className="container hero-inner">
          <span className="room-cat-badge">{room.category}</span>
          <h2>{room.name}</h2>
          <div className="room-price-banner">
            Rs. {room.pricePerNight} <span>/ night (+ GST Extra)</span>
          </div>
        </div>
      </div>

      <div className="container room-details-grid section">
        {/* Main Content Info */}
        <main className="room-details-main">
          {/* Images Gallery */}
          <div className="room-gallery-block card">
            <img src={getImageUrl(room.images[0])} alt={room.name} className="main-display-img" />
            {room.images.length > 1 && (
              <div className="sub-images-grid">
                {room.images.map((img, idx) => (
                  <img key={idx} src={getImageUrl(img)} alt={`${room.name} view ${idx}`} className="thumbnail-img" />
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="details-info-section">
            <h3>About the Room</h3>
            <p className="description-text">{room.description}</p>
          </div>

          {/* Capacity and details */}
          <div className="room-specs-grid">
            <div className="spec-card">
              <Users size={20} className="spec-icon" />
              <div>
                <h5>Capacity</h5>
                <p>Up to {room.maxGuests} Guests</p>
              </div>
            </div>
            <div className="spec-card">
              <ShieldCheck size={20} className="spec-icon" />
              <div>
                <h5>Reservation Mode</h5>
                <p>Instant Confirmation</p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="details-info-section amenities-section">
            <h3>Included Amenities</h3>
            <div className="amenities-grid-detailed">
              {room.amenities.map((amenity, idx) => (
                <div key={idx} className="detailed-amenity-item">
                  <div className="check-bullet">✓</div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="details-info-section reviews-list-block">
            <h3>Guest Reviews & Ratings</h3>
            {reviews.length === 0 ? (
              <p className="no-reviews-note">No reviews have been written for this room yet. Be the first to share your experience!</p>
            ) : (
              <div className="reviews-cards-list">
                {reviews.map((rev) => (
                  <div key={rev._id} className="review-item-card card">
                    <div className="review-item-header">
                      <h5>{rev.user.name}</h5>
                      <div className="stars-row">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < rev.rating ? '#D4AF37' : 'none'}
                            color={i < rev.rating ? '#D4AF37' : '#CCCCCC'}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    <p className="review-comment">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Review Submit Form */}
          <div className="details-info-section review-submit-block card">
            <h3>Write a Review</h3>
            {user ? (
              <form onSubmit={handleReviewSubmit} className="review-form">
                <div className="form-group">
                  <label>Your Rating</label>
                  <div className="rating-select-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="star-select-btn"
                        onClick={() => setRating(star)}
                      >
                        <Star
                          size={24}
                          fill={star <= rating ? '#D4AF37' : 'none'}
                          color={star <= rating ? '#D4AF37' : '#A0AEC0'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="review-comment">Your Comment</label>
                  <textarea
                    id="review-comment"
                    rows="4"
                    className="form-control"
                    placeholder="Tell us about your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                </div>

                {reviewSuccess && <div className="review-alert success">{reviewSuccess}</div>}
                {reviewError && <div className="review-alert error">{reviewError}</div>}

                <button type="submit" className="btn btn-gold">
                  Submit Review
                </button>
              </form>
            ) : (
              <div className="review-login-required">
                <p>You must be logged in to leave a review.</p>
                <RouterLink to="/login" className="btn btn-navy btn-sm">
                  Login Now
                </RouterLink>
              </div>
            )}
          </div>
        </main>

        {/* Sidebar Booking widget */}
        <aside className="room-details-sidebar">
          <div className="glass-card sidebar-sticky-widget">
            <h3>Reserve This Room</h3>
            <div className="price-summary-box">
              <span className="price-heading">Pricing</span>
              <span className="price-tag">Rs. {room.pricePerNight} <small>/ night</small></span>
            </div>
            <BookingForm initialData={{ roomId: room._id }} inline={false} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RoomDetails;
