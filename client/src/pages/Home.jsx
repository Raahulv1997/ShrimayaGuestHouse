import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Wifi, Car, ShieldAlert, Utensils, Clock, Snowflake, Trees, Smile, MapPin, Phone, Mail, Award, Sparkles, Star } from 'lucide-react';
import API, { getImageUrl } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import BookingForm from '../components/BookingForm';
import RoomCard from '../components/RoomCard';
import './Home.css';

const defaultSliderImages = [
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=80'
];

const Home = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [homeSettings, setHomeSettings] = useState({
    heroTitle: 'Welcome to Shrimaya Guest House',
    heroSubtitle: 'Experience premium luxury, comfort, and unmatched hospitality in the heart of the city.',
    sliderImages: defaultSliderImages
  });

  // Fetch website UI settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await API.get('/settings/homeSettings');
        if (data) {
          setHomeSettings(data);
        }
      } catch (error) {
        console.error('Error fetching home settings:', error);
      }
    };
    fetchSettings();
  }, []);

  // Background Slider loop
  useEffect(() => {
    if (!homeSettings.sliderImages || homeSettings.sliderImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % homeSettings.sliderImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [homeSettings]);

  // Set Home Page SEO Metadata
  useEffect(() => {
    document.title = "Shrimaya Guest House | Best Hotel & Rooms in Malanpur, Bhind";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Welcome to Shrimaya Guest House in Malanpur, Bhind. Premium AC rooms (Rs. 1200) and Non-AC rooms (Rs. 800) near Bhind Road. Secure visitor parking, CCTV, high-speed WiFi.");
    }
  }, []);

  // Fetch featured rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await API.get('/rooms');
        setRooms(data.slice(0, 3)); // show first 3 rooms as featured
      } catch (error) {
        console.error('Error fetching rooms:', error);
        // Fallback static data if backend is not running yet
        setRooms([
          {
            _id: '1',
            name: 'Deluxe Room',
            category: 'Deluxe Room',
            description: 'Spacious Deluxe Room featuring a comfortable queen-size bed, elegant furnishings, and modern hospitality standards.',
            pricePerNight: 800,
            maxGuests: 2,
            amenities: ['Free WiFi', 'Parking', 'Room Service'],
            images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80']
          },
          {
            _id: '2',
            name: 'AC Executive Room',
            category: 'AC Room',
            description: 'Fully Air Conditioned room featuring premium linen, flat-screen TV, and modern bathroom setups.',
            pricePerNight: 1200,
            maxGuests: 2,
            amenities: ['Free WiFi', 'Parking', 'Air Conditioned Rooms'],
            images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80']
          },
          {
            _id: '3',
            name: 'Shrimaya Premium Suite',
            category: 'Premium Suite',
            description: 'The epitome of luxury at Shrimaya Guest House. Features a king-size bed, separate living lounge, and ambient lighting.',
            pricePerNight: 6500,
            maxGuests: 3,
            amenities: ['Free WiFi', 'Parking', 'Air Conditioned Rooms', 'Garden Area'],
            images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80']
          }
        ]);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, []);

  const facilityHighlights = [
    { icon: <Wifi size={24} />, name: 'Free WiFi', desc: 'High-speed internet in all rooms and common areas.' },
    { icon: <Car size={24} />, name: 'Parking', desc: 'Secure, spacious, and complimentary parking spaces.' },
    { icon: <Utensils size={24} />, name: 'Room Service', desc: 'Curated menu options served straight to your bedroom.' },
    { icon: <Clock size={24} />, name: '24×7 Reception', desc: 'Our team is available round the clock to assist you.' },
    { icon: <Snowflake size={24} />, name: 'Air Conditioned Rooms', desc: 'Enjoy customizable climate controls for perfect comfort.' },
    { icon: <Trees size={24} />, name: 'Garden Area', desc: 'Relax in our luxury green landscaped gardens.' },
    { icon: <Smile size={24} />, name: 'Family Friendly', desc: 'A serene and completely safe environment for family stays.' },
    { icon: <Star size={24} />, name: 'CCTV Security', desc: '24/7 security monitoring for your absolute peace of mind.' }
  ];

  const defaultTestimonials = [
    { name: 'Rajesh Kumar', role: 'Business Traveler', comment: 'The Deluxe AC room was exceptionally clean, and the staff went above and beyond to make my stay comfortable. Highly recommended!', rating: 5 },
    { name: 'Anjali Sharma', role: 'Family Vacation', comment: 'Staying in the Family Suite was an absolute delight. The kids loved the garden space, and the room service was incredibly fast and delicious.', rating: 5 },
    { name: 'David Miller', role: 'Leisure Tourist', comment: 'A serene, peaceful haven near the railway station. Premium luxury design at very reasonable prices. 5-star hospitality!', rating: 5 }
  ];

  const [testimonials, setTestimonials] = useState([]);

  // Fetch approved testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await API.get('/reviews');
        if (data && data.length > 0) {
          const mapped = data.map(r => ({
            name: r.user?.name || 'Happy Guest',
            role: r.room?.name || 'Verified Stay',
            comment: r.comment,
            rating: r.rating
          }));
          setTestimonials(mapped);
        } else {
          setTestimonials(defaultTestimonials);
        }
      } catch (err) {
        console.error('Failed to load testimonials:', err);
        setTestimonials(defaultTestimonials);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <header className="hero-section">
        {homeSettings.sliderImages.map((img, idx) => (
          <div
            key={idx}
            className={`hero-slide ${idx === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `linear-gradient(rgba(13, 27, 42, 0.6), rgba(13, 27, 42, 0.6)), url(${getImageUrl(img)})` }}
          />
        ))}
        
        <div className="container hero-content text-center">
          <div className="welcome-tag float-anim">
            <Sparkles size={16} /> <span>LUXURY IN THE CITY</span>
          </div>
          <h1>{homeSettings.heroTitle}</h1>
          <p>{homeSettings.heroSubtitle}</p>
          <div className="hero-ctas">
            <RouterLink to="/rooms" className="btn btn-gold">{t('bookNow')}</RouterLink>
            <RouterLink to="/about" className="btn btn-outline">{t('viewDetails')}</RouterLink>
          </div>
        </div>

        {/* Inline Booking Form container */}
        <div className="hero-booking-container container">
          <div className="booking-widget-wrapper">
            <BookingForm inline={true} />
          </div>
        </div>
      </header>

      {/* Featured Rooms Section */}
      <section className="section featured-rooms-section">
        <div className="container">
          <div className="section-header">
            <h2>{t('featuredRooms')}</h2>
            <p>{t('featuredRoomsSub')}</p>
          </div>

          {loadingRooms ? (
            <div className="text-center">Loading our premium rooms...</div>
          ) : (
            <div className="grid-3">
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          )}

          <div className="text-center rooms-view-all">
            <RouterLink to="/rooms" className="btn btn-navy">
              View All Room Types
            </RouterLink>
          </div>
        </div>
      </section>

      {/* Hospitality highlights banner */}
      <section className="hospitality-banner">
        <div className="container banner-grid">
          <div className="banner-item">
            <Award size={36} className="banner-icon" />
            <h4>Award-Winning Service</h4>
            <p>Voted best hospitality guest house in the region.</p>
          </div>
          <div className="banner-item">
            <Clock size={36} className="banner-icon" />
            <h4>Flexible Check-In</h4>
            <p>Early check-ins and late check-outs subject to occupancy.</p>
          </div>
          <div className="banner-item">
            <Sparkles size={36} className="banner-icon" />
            <h4>Ultra Clean Guarantee</h4>
            <p>Deep-sanitized rooms and fresh linen replacement daily.</p>
          </div>
        </div>
      </section>

      {/* Facilities Highlights Section */}
      <section className="section facilities-section bg-light-section">
        <div className="container">
          <div className="section-header">
            <h2>{t('facilitiesTitle')}</h2>
            <p>{t('facilitiesSub')}</p>
          </div>

          <div className="grid-4">
            {facilityHighlights.map((facility, idx) => (
              <div key={idx} className="facility-card card">
                <div className="facility-icon-wrapper">{facility.icon}</div>
                <h4>{facility.name}</h4>
                <p>{facility.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center facilities-cta">
            <RouterLink to="/facilities" className="btn btn-outline">
              Explore All Facilities
            </RouterLink>
          </div>
        </div>
      </section>

      {/* Photo Gallery Preview */}
      <section className="section gallery-preview-section">
        <div className="container">
          <div className="section-header">
            <h2>{t('galleryTitle')}</h2>
            <p>{t('gallerySub')}</p>
          </div>

          <div className="gallery-preview-grid">
            <div className="gallery-img-wrapper item-1">
              <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80" alt="Deluxe Room" />
              <div className="img-overlay"><h4>Deluxe Bedroom</h4></div>
            </div>
            <div className="gallery-img-wrapper item-2">
              <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80" alt="Lobby" />
              <div className="img-overlay"><h4>Elegant Entrance</h4></div>
            </div>
            <div className="gallery-img-wrapper item-3">
              <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80" alt="Facilities walkway" />
              <div className="img-overlay"><h4>Lush Gardens</h4></div>
            </div>
            <div className="gallery-img-wrapper item-4">
              <img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80" alt="AC Suite" />
              <div className="img-overlay"><h4>AC Executive Room</h4></div>
            </div>
          </div>

          <div className="text-center gallery-cta">
            <RouterLink to="/gallery" className="btn btn-navy">
              View Complete Media Gallery
            </RouterLink>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="section testimonials-section bg-navy-section">
        <div className="container">
          <div className="section-header white">
            <h2 style={{ color: '#FFF' }}>{t('testimonialsTitle')}</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>{t('testimonialsSub')}</p>
          </div>

          <div className="grid-3">
            {testimonials.map((tItem, idx) => (
              <div key={idx} className="testimonial-card glass-card">
                <div className="stars">
                  {[...Array(tItem.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#D4AF37" color="#D4AF37" />
                  ))}
                </div>
                <p className="comment">"{tItem.comment}"</p>
                <div className="divider"></div>
                <h5 className="name">{tItem.name}</h5>
                <span className="role">{tItem.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Map Location Section */}
      <section className="section contact-location-section">
        <div className="container">
          <div className="grid-2">
            {/* Info */}
            <div className="contact-summary-info">
              <h2 className="luxury-font">Find Your Way to Luxury</h2>
              <p className="contact-summary-desc">
                Located near the central transit hubs, Shrimaya Guest House is highly accessible. Reach out to us for quick transfers or direction assistance.
              </p>

              <div className="contact-quick-list">
                <div className="quick-item">
                  <MapPin size={22} className="quick-icon" />
                  <div>
                    <h5>Our Location</h5>
                    <p>Rajeshwari Dham, Manhar Hotel Ke Pass, Bhind Road, Malanpur Distt. Bhind (M.P.)</p>
                  </div>
                </div>
                <div className="quick-item">
                  <Phone size={22} className="quick-icon" />
                  <div>
                    <h5>Call Us</h5>
                    <p>8269364180, 8269907127, 9926233735</p>
                  </div>
                </div>
                <div className="quick-item">
                  <Mail size={22} className="quick-icon" />
                  <div>
                    <h5>Email Inquiry</h5>
                    <p>contact@shrimayaguesthouse.com</p>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <RouterLink to="/contact" className="btn btn-gold">
                  Send Direct Inquiry
                </RouterLink>
              </div>
            </div>

            {/* Map Frame */}
            <div className="map-frame-wrapper">
              <iframe
                title="Shrimaya Location Map"
                src="https://maps.google.com/maps?q=Rajeshwari%20Dham%20Malanpur%20Bhind%20Road&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '8px', minHeight: '350px' }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
