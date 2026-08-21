import React from 'react';
import { Link } from 'react-router-dom';
import { Wifi, Car, Utensils, Shield, Clock, Snowflake, Trees, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getImageUrl } from '../services/api';
import './RoomCard.css';

// Helper to map amenity names to Lucide icons
const getAmenityIcon = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes('wifi') || lower.includes('internet')) return <Wifi size={16} />;
  if (lower.includes('park') || lower.includes('car')) return <Car size={16} />;
  if (lower.includes('service') || lower.includes('dine') || lower.includes('food')) return <Utensils size={16} />;
  if (lower.includes('security') || lower.includes('cctv') || lower.includes('safe')) return <Shield size={16} />;
  if (lower.includes('reception') || lower.includes('24x7') || lower.includes('clock')) return <Clock size={16} />;
  if (lower.includes('air') || lower.includes('ac') || lower.includes('condition')) return <Snowflake size={16} />;
  if (lower.includes('garden') || lower.includes('lawn') || lower.includes('park')) return <Trees size={16} />;
  return <ArrowRight size={16} />;
};

const RoomCard = ({ room }) => {
  const { t } = useLanguage();

  return (
    <div className="room-card card">
      <div className="room-image-container">
        <img src={getImageUrl(room.images[0])} alt={room.name} className="room-card-img" />
        <div className="room-category-tag">{room.category}</div>
        <div className="room-price-badge">
          <span className="price-num">Rs. {room.pricePerNight}</span>
          <span className="price-unit">/{t('pricePerNight')} <small style={{ fontSize: '0.62rem', display: 'block', fontWeight: 'bold', color: '#D4AF37', marginTop: '1px' }}>(+ GST)</small></span>
        </div>
      </div>
      <div className="room-card-content">
        <h3 className="room-title">{room.name}</h3>
        <p className="room-description">{room.description.substring(0, 110)}...</p>
        
        <div className="room-meta">
          <div className="meta-item">
            <Users size={16} className="meta-icon" />
            <span>{room.maxGuests} {t('maxGuests')}</span>
          </div>
        </div>

        <div className="room-amenities">
          {room.amenities.slice(0, 4).map((amenity, idx) => (
            <div key={idx} className="amenity-chip" title={amenity}>
              {getAmenityIcon(amenity)}
              <span>{amenity}</span>
            </div>
          ))}
          {room.amenities.length > 4 && (
            <div className="amenity-chip more">
              <span>+{room.amenities.length - 4} More</span>
            </div>
          )}
        </div>

        <div className="room-card-actions">
          <Link to={`/rooms/${room._id}`} className="btn btn-outline btn-full">
            {t('viewDetails')}
          </Link>
          <Link to={`/booking?roomId=${room._id}`} className="btn btn-gold btn-full">
            {t('bookNow')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
