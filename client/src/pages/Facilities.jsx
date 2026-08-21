import React from 'react';
import { Wifi, Car, Shield, Clock, Snowflake, Trees, Smile, Heart, Coffee, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './Facilities.css';

const Facilities = () => {
  const { t } = useLanguage();

  const facilitiesList = [
    {
      icon: <Wifi size={32} />,
      title: 'Free High-Speed WiFi',
      desc: 'Seamless wireless internet connection is available throughout our guest house premises, including all guest rooms, lobby areas, and lush gardens. Perfect for business travelers and digital nomads.'
    },
    {
      icon: <Car size={32} />,
      title: 'Spacious Secure Parking',
      desc: 'No more parking worries. Shrimaya provides an expansive, secure on-site parking zone free of charge for our registered guests. Suitable for cars, bikes, and transit travelers.'
    },
    {
      icon: <Coffee size={32} />,
      title: 'Warm Room Service',
      desc: 'Relish delicious hot food, local snacks, and beverages served straight to your room. Our room service operates daily from early morning till late night.'
    },
    {
      icon: <Shield size={32} />,
      title: '24×7 CCTV Security',
      desc: 'Your safety is our topmost priority. We have round-the-clock CCTV cameras monitoring all entry, exit, corridor, and parking zones, coupled with security guards.'
    },
    {
      icon: <Clock size={32} />,
      title: '24×7 Reception Desk',
      desc: 'Need extra towels, local directions, or planning an early check-out? Our friendly reception team is available 24 hours a day, 7 days a week to make your stay effortless.'
    },
    {
      icon: <Trees size={32} />,
      title: 'Lush Green Garden Area',
      desc: 'Relax and unwind in our beautifully landscaped outdoor gardens. A quiet, refreshing green sanctuary to read, drink your morning tea, or take peaceful walks.'
    },
    {
      icon: <Smile size={32} />,
      title: 'Family Friendly Atmosphere',
      desc: 'We pride ourselves on providing a quiet, safe, and completely family-friendly environment. Strict policy against loud noises ensure a peaceful sleeping experience.'
    },
    {
      icon: <Snowflake size={32} />,
      title: 'Air Conditioned Rooms',
      desc: 'Beat the weather with our fully Air Conditioned rooms. Customize temperature levels to your exact liking for a deeply relaxing, premium sleeping experience.'
    }
  ];

  return (
    <div className="facilities-page">
      {/* Banner */}
      <div className="page-header-banner">
        <div className="container banner-inner">
          <div className="banner-badge"><ShieldCheck size={14} /> PREMIUM AMENITIES</div>
          <h2>Guest House Facilities</h2>
          <p>We provide a wide array of top-tier facilities to make your business or leisure trip comfortable, secure, and memorable.</p>
        </div>
      </div>

      <div className="container section">
        <div className="facilities-detailed-grid">
          {facilitiesList.map((f, idx) => (
            <div key={idx} className="facility-detailed-card card">
              <div className="icon-box">{f.icon}</div>
              <div className="info-box">
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Banner */}
        <div className="facilities-quote-banner glass-card float-anim text-center">
          <Heart size={36} className="heart-icon" />
          <h3>"Exceptional Hospitality is not a checklist, it is our culture."</h3>
          <p>Whether you stay for one night or several weeks, our staff is dedicated to serving you with warmth and attention to detail.</p>
        </div>
      </div>
    </div>
  );
};

export default Facilities;
