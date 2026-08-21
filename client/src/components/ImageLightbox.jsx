import React from 'react';
import { X } from 'lucide-react';
import './ImageLightbox.css';

const ImageLightbox = ({ isOpen, src, title, type, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">
        <X size={32} />
      </button>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {type === 'video' ? (
          <video src={src} controls autoPlay className="lightbox-media" />
        ) : (
          <img src={src} alt={title} className="lightbox-media" />
        )}
        {title && <div className="lightbox-caption">{title}</div>}
      </div>
    </div>
  );
};

export default ImageLightbox;
