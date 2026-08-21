import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ImageLightbox from '../components/ImageLightbox';
import { useLanguage } from '../context/LanguageContext';
import { Camera, Play, Sparkles } from 'lucide-react';
import './Gallery.css';

const Gallery = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Lightbox control states
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState({ src: '', title: '', type: 'image' });

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const { data } = await API.get('/gallery');
        setItems(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch gallery from server. Loading fallback portfolio.');
        
        // Static local media fallbacks
        setItems([
          { _id: '1', title: 'Deluxe Room Cozy Setup', url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', category: 'Rooms', type: 'image' },
          { _id: '2', title: 'AC Executive Room Decor', url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80', category: 'Rooms', type: 'image' },
          { _id: '3', title: 'Lobby Entrance Walkway', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', category: 'Exterior', type: 'image' },
          { _id: '4', title: 'Green Garden Lawn', url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80', category: 'Facilities', type: 'image' },
          { _id: '5', title: 'Premium Suite Sitting Room', url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', category: 'Interior', type: 'image' },
          { _id: '6', title: 'Restaurant Dining Setup', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', category: 'Facilities', type: 'image' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = ['All', 'Rooms', 'Facilities', 'Exterior', 'Interior'];

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(item => item.category === selectedCategory);

  const openLightbox = (url, title, type) => {
    setLightboxMedia({ src: url, title, type });
    setLightboxOpen(true);
  };

  return (
    <div className="gallery-page">
      {/* Banner */}
      <div className="page-header-banner">
        <div className="container banner-inner">
          <div className="banner-badge"><Sparkles size={14} /> TOUR SHRIMAYA</div>
          <h2>Our Media Gallery</h2>
          <p>Explore high-resolution captures of our suites, common lounge areas, reception, dining, and outdoor gardens.</p>
        </div>
      </div>

      <div className="container section">
        {/* Category Selector Tabs */}
        <div className="gallery-tabs-row">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`gallery-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {error && <div className="gallery-fallback-alert">{error}</div>}

        {loading ? (
          <div className="gallery-loader">Loading gallery showcase...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center" style={{ padding: '3rem' }}>No media items available in this category.</div>
        ) : (
          <div className="gallery-grid-main">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="gallery-item-card card"
                onClick={() => openLightbox(item.url, item.title, item.type)}
              >
                <div className="gallery-img-container">
                  <img src={item.url} alt={item.title} className="gallery-img" />
                  <div className="gallery-overlay-hover">
                    {item.type === 'video' ? (
                      <div className="play-icon-box"><Play size={24} fill="#0D1B2A" /></div>
                    ) : (
                      <div className="play-icon-box"><Camera size={24} /></div>
                    )}
                    <h5 className="media-title">{item.title}</h5>
                    <span className="media-cat">{item.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Preview */}
      <ImageLightbox
        isOpen={lightboxOpen}
        src={lightboxMedia.src}
        title={lightboxMedia.title}
        type={lightboxMedia.type}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};

export default Gallery;
