import React from 'react';
import { Award, Compass, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Banner */}
      <div className="page-header-banner">
        <div className="container banner-inner">
          <div className="banner-badge"><Sparkles size={14} /> OUR LEGACY</div>
          <h2>About Shrimaya Guest House</h2>
          <p>Learn about our humble beginnings, our core principles, and our unwavering commitment to premium hospitality.</p>
        </div>
      </div>

      <div className="container section">
        {/* Core Narrative Grid */}
        <div className="about-narrative-grid">
          <div className="narrative-text-box">
            <h2 className="luxury-font">A Premium Haven of Peace and Comfort</h2>
            <p>
              Shrimaya Guest House was founded with a singular vision: to offer travelers a lodging experience that bridges the gap between high-end luxury hotels and the warm comfort of a home. Over the years, we have welcomed business travelers, vacationing families, and globetrotting tourists seeking a serene resting place in the heart of the city.
            </p>
            <p>
              Located just minutes away from major transit stations, Shrimaya stands out as an oasis of quiet. Our rooms are acoustically isolated, our gardens are carefully manicured, and our services are designed to give you absolute peace of mind.
            </p>
            <p>
              We believe that luxury should not be prohibitively expensive. By optimizing our services, we offer top-tier facilities (like Air Conditioning, free high-speed WiFi, secure parking, and round-the-clock room service) at tariff rates that represent unbeatable value.
            </p>
          </div>

          <div className="narrative-image-box">
            <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80" alt="Lobby entrance" className="narrative-img" />
          </div>
        </div>

        {/* Brand Values */}
        <div className="about-values-section" style={{ marginTop: '5rem' }}>
          <div className="section-header">
            <h2>Our Core Principles</h2>
            <p>The values that guide every action we take and every service we provide.</p>
          </div>

          <div className="grid-3">
            <div className="value-card card text-center">
              <div className="value-icon-box"><Heart size={28} /></div>
              <h4>Guests First Hospitality</h4>
              <p>We treat every guest with equal warmth and attention, striving to anticipate your needs and exceed your expectations.</p>
            </div>
            
            <div className="value-card card text-center">
              <div className="value-icon-box"><ShieldCheck size={28} /></div>
              <h4>Uncompromising Cleanliness</h4>
              <p>We maintain rigorous sanitation standards, replacing sheets, linens, and cleaning rooms daily to guarantee health and safety.</p>
            </div>

            <div className="value-card card text-center">
              <div className="value-icon-box"><Award size={28} /></div>
              <h4>Premium Value Tariff</h4>
              <p>We believe in honest pricing. Enjoy deluxe amenities, secure premises, and AC executive setups at competitive budget rates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
