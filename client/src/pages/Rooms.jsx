import React, { useState, useEffect } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import API from '../services/api';
import RoomCard from '../components/RoomCard';
import BookingForm from '../components/BookingForm';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Filter } from 'lucide-react';
import './Rooms.css';

const Rooms = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');
  const roomsCount = searchParams.get('roomsCount');

  // Set Rooms Page SEO Metadata
  useEffect(() => {
    document.title = "Our Rooms & Suites | Shrimaya Guest House Malanpur";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Explore rooms at Shrimaya Guest House. We offer Deluxe Non-AC (Rs. 800) and AC Rooms (Rs. 1200) near Bhind Road, Malanpur. Clean rooms, modern bathrooms, free WiFi.");
    }
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (checkIn) queryParams.append('checkIn', checkIn);
        if (checkOut) queryParams.append('checkOut', checkOut);
        if (guests) queryParams.append('guests', guests);

        const { data } = await API.get(`/rooms?${queryParams.toString()}`);
        setRooms(data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to fetch rooms. Displaying local fallback data.');
        
        // Static fallback data
        setRooms([
          {
            _id: '1',
            name: 'Deluxe Room',
            category: 'Deluxe Room',
            description: 'Spacious Deluxe Room featuring a comfortable queen-size bed, elegant furnishings, and modern hospitality standards. Ideal for budget-conscious travelers.',
            pricePerNight: 800,
            maxGuests: 2,
            amenities: ['Free WiFi', 'Parking', 'Room Service', 'CCTV Security', '24x7 Reception'],
            totalRooms: 5,
            availableCount: 5,
            isAvailable: true,
            images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80']
          },
          {
            _id: '2',
            name: 'AC Executive Room',
            category: 'AC Room',
            description: 'Fully Air Conditioned room featuring premium linen, wooden flooring, flat-screen TV, and modern bathroom setups. Experience superior convenience.',
            pricePerNight: 1200,
            maxGuests: 2,
            amenities: ['Free WiFi', 'Parking', 'Room Service', 'CCTV Security', '24x7 Reception', 'Air Conditioned Rooms'],
            totalRooms: 5,
            availableCount: 4,
            isAvailable: true,
            images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80']
          },
          {
            _id: '3',
            name: 'Premium Family Suite',
            category: 'Family Room',
            description: 'A massive suite designed for families. Includes two double beds, comfortable seating area, spacious layout, and garden view access.',
            pricePerNight: 4500,
            maxGuests: 4,
            amenities: ['Free WiFi', 'Parking', 'Room Service', 'CCTV Security', '24x7 Reception', 'Air Conditioned Rooms', 'Garden Area'],
            totalRooms: 3,
            availableCount: 3,
            isAvailable: true,
            images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80']
          },
          {
            _id: '4',
            name: 'Shrimaya Premium Suite',
            category: 'Premium Suite',
            description: 'The epitome of luxury at Shrimaya Guest House. Features a king-size bed, separate living lounge, smart controls, and complimentary mini-bar.',
            pricePerNight: 6500,
            maxGuests: 3,
            amenities: ['Free WiFi', 'Parking', 'Room Service', 'CCTV Security', '24x7 Reception', 'Air Conditioned Rooms', 'Garden Area'],
            totalRooms: 2,
            availableCount: 1,
            isAvailable: true,
            images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [checkIn, checkOut, guests, roomsCount]);

  const categories = ['All', ...new Set(rooms.map(room => room.category).filter(Boolean))];

  const filteredRooms = selectedCategory === 'All'
    ? rooms
    : rooms.filter(room => room.category === selectedCategory);

  return (
    <div className="rooms-page">
      {/* Header Banner */}
      <div className="page-header-banner">
        <div className="container banner-inner">
          <div className="banner-badge"><Sparkles size={14} /> LUXURY SUITES</div>
          <h2>Our Accommodation Options</h2>
          <p>Find the perfect sanctuary tailored for your peace, privacy, and absolute relaxation.</p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="container rooms-layout-grid section">
        {/* Left Side: Booking widget/Filters */}
        <aside className="rooms-sidebar">
          <div className="glass-card sidebar-widget">
            <h3>Modify Search</h3>
            <BookingForm
              initialData={{
                checkIn: checkIn || '',
                checkOut: checkOut || '',
                guests: guests ? Number(guests) : 1,
                roomsCount: roomsCount ? Number(roomsCount) : 1
              }}
              inline={false}
            />
          </div>

          <div className="sidebar-widget filter-box card">
            <h3><Filter size={16} /> Category Filter</h3>
            <div className="category-filter-list">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  className={`filter-btn-item ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Side: Rooms Grid */}
        <main className="rooms-main-content">
          {checkIn && checkOut && (
            <div className="availability-info-alert">
              Showing available rooms for dates: <strong>{new Date(checkIn).toLocaleDateString()}</strong> to <strong>{new Date(checkOut).toLocaleDateString()}</strong>
            </div>
          )}

          {error && <div className="error-alert">{error}</div>}

          {loading ? (
            <div className="rooms-loader">Searching available rooms...</div>
          ) : filteredRooms.length === 0 ? (
            <div className="no-rooms-found card">
              <h4>No Rooms Found</h4>
              <p>We could not find any rooms matching your selected category. Try resetting filters or modifying dates.</p>
            </div>
          ) : (
            <div className="rooms-cards-container">
              {filteredRooms.map((room) => {
                // If availability query was run, check if this room has sufficient availability
                const isRequestedAvailable = checkIn && checkOut && roomsCount
                  ? room.availableCount >= Number(roomsCount)
                  : true;

                return (
                  <div key={room._id} className="room-row-item card">
                    <div className="row-image">
                      <img src={room.images[0]} alt={room.name} />
                      <div className="row-tag">{room.category}</div>
                    </div>
                    <div className="row-details">
                      <div className="row-header">
                        <h3>{room.name}</h3>
                        <div className="row-price">
                          <span className="amt">Rs. {room.pricePerNight}</span>
                          <span className="unit">/night</span>
                        </div>
                      </div>
                      <p className="row-desc">{room.description}</p>
                      
                      <div className="row-amenities-list">
                        {room.amenities.map((am, i) => (
                          <span key={i} className="row-amenity-pill">{am}</span>
                        ))}
                      </div>

                      <div className="row-footer">
                        <div className="availability-status-label">
                          {checkIn && checkOut ? (
                            room.availableCount > 0 ? (
                              <span className="stock-label instock">
                                {room.availableCount} room(s) available
                              </span>
                            ) : (
                              <span className="stock-label outofstock">Sold Out for these dates</span>
                            )
                          ) : (
                            <span className="stock-label info">Standard Availability</span>
                          )}
                        </div>

                        <div className="row-actions">
                          <RouterLink to={`/rooms/${room._id}`} className="btn btn-outline btn-sm">
                            {t('viewDetails')}
                          </RouterLink>
                          <RouterLink
                            to={`/booking?roomId=${room._id}&checkIn=${checkIn || ''}&checkOut=${checkOut || ''}&guests=${guests || 1}&roomsCount=${roomsCount || 1}`}
                            className={`btn btn-gold btn-sm ${checkIn && checkOut && room.availableCount <= 0 ? 'disabled' : ''}`}
                            style={checkIn && checkOut && room.availableCount <= 0 ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                          >
                            {t('bookNow')}
                          </RouterLink>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Rooms;
