import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './BookingForm.css';

const BookingForm = ({ initialData = {}, inline = false }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Default dates: checkIn = today, checkOut = tomorrow
  const getTodayStr = (offset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  };

  const [checkIn, setCheckIn] = useState(initialData.checkIn || getTodayStr(0));
  const [checkInTime, setCheckInTime] = useState(initialData.checkInTime || '12:00');
  const [checkOut, setCheckOut] = useState(initialData.checkOut || getTodayStr(1));
  const [checkOutTime, setCheckOutTime] = useState(initialData.checkOutTime || '11:00');
  const [guests, setGuests] = useState(initialData.guests || 1);
  const [roomsCount, setRoomsCount] = useState(initialData.roomsCount || 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      checkIn,
      checkInTime,
      checkOut,
      checkOutTime,
      guests,
      roomsCount,
    });
    if (initialData.roomId) {
      params.append('roomId', initialData.roomId);
      navigate(`/booking?${params.toString()}`);
    } else {
      navigate(`/rooms?${params.toString()}`);
    }
  };

  return (
    <form className={`booking-form-widget ${inline ? 'inline' : 'stacked'}`} onSubmit={handleSubmit}>
      <div className="form-item">
        <label><Calendar size={14} /> {t('checkIn')}</label>
        <input
          type="date"
          className="form-control booking-input"
          value={checkIn}
          min={getTodayStr(0)}
          onChange={(e) => {
            setCheckIn(e.target.value);
            if (new Date(e.target.value) >= new Date(checkOut)) {
              const nextDay = new Date(e.target.value);
              nextDay.setDate(nextDay.getDate() + 1);
              setCheckOut(nextDay.toISOString().split('T')[0]);
            }
          }}
          required
        />
      </div>

      <div className="form-item">
        <label><Calendar size={14} /> Check-In Time</label>
        <input
          type="time"
          className="form-control booking-input"
          value={checkInTime}
          onChange={(e) => setCheckInTime(e.target.value)}
          required
        />
      </div>

      <div className="form-item">
        <label><Calendar size={14} /> {t('checkOut')}</label>
        <input
          type="date"
          className="form-control booking-input"
          value={checkOut}
          min={checkIn ? getTodayStr(1) : getTodayStr(1)}
          onChange={(e) => setCheckOut(e.target.value)}
          required
        />
      </div>

      <div className="form-item">
        <label><Calendar size={14} /> Checkout Time</label>
        <input
          type="time"
          className="form-control booking-input"
          value={checkOutTime}
          onChange={(e) => setCheckOutTime(e.target.value)}
          required
        />
      </div>

      <div className="form-item">
        <label><Users size={14} /> {t('guests')}</label>
        <select
          className="form-control booking-input"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
          ))}
        </select>
      </div>

      <div className="form-item">
        <label><Home size={14} /> {t('roomsCount')}</label>
        <select
          className="form-control booking-input"
          value={roomsCount}
          onChange={(e) => setRoomsCount(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map(n => (
            <option key={n} value={n}>{n} {n === 1 ? 'Room' : 'Rooms'}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-gold booking-submit-btn">
        {initialData.roomId ? t('bookNow') : t('checkAvailability')}
      </button>
    </form>
  );
};

export default BookingForm;
