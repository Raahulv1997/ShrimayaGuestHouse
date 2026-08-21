import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Mail, Phone, MapPin, Send, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  // Set Contact Page SEO Metadata
  useEffect(() => {
    document.title = "Contact Us | Shrimaya Guest House Malanpur, Bhind";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Get in touch with Shrimaya Guest House in Malanpur (Bhind, M.P.). Phone: 8269364180, 8269907127, 9926233735. Located near Manhar Hotel, Bhind Road.");
    }
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess('');
    setSubmitError('');

    try {
      const { data } = await API.post('/contacts', {
        name,
        email,
        phone,
        subject,
        message,
      });

      setSubmitSuccess(data.message || 'Inquiry submitted successfully!');
      setName('');
      setEmail('');
      setPhone('');
      setSubject('General Inquiry');
      setMessage('');
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit message inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const waNumber = '918269364180';
    const waMsg = 'Hello Shrimaya Guest House! I would like to inquire about booking availability.';
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`, '_blank');
  };

  return (
    <div className="contact-page">
      {/* Banner */}
      <div className="page-header-banner">
        <div className="container banner-inner">
          <div className="banner-badge"><Sparkles size={14} /> GET IN TOUCH</div>
          <h2>Contact Shrimaya Guest House</h2>
          <p>Reach out to our reservations office for inquiries, seasonal packages booking, group bookings, or assistance.</p>
        </div>
      </div>

      <div className="container section">
        <div className="contact-page-grid">
          {/* Left Column: Info Cards & WhatsApp */}
          <aside className="contact-info-panel">
            <div className="contact-details-box card">
              <h3>Contact Details</h3>
              <ul className="info-list">
                <li>
                  <MapPin size={24} className="icon" />
                  <div>
                    <h5>Address</h5>
                    <p>Rajeshwari Dham, Manhar Hotel Ke Pass, Bhind Road, Malanpur Distt. Bhind (M.P.)</p>
                  </div>
                </li>
                <li>
                  <Phone size={24} className="icon" />
                  <div>
                    <h5>Call Us</h5>
                    <p>8269364180, 8269907127, 9926233735</p>
                  </div>
                </li>
                <li>
                  <Mail size={24} className="icon" />
                  <div>
                    <h5>Email Desk</h5>
                    <p>contact@shrimayaguesthouse.com</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* WhatsApp CTA */}
            <div className="whatsapp-cta-widget glass-card text-center float-anim">
              <MessageCircle size={36} className="wa-icon" />
              <h4>Instant WhatsApp Chat</h4>
              <p>Prefer messaging? Skip the email form and chat directly with our front desk receptionist.</p>
              <button className="btn btn-gold" onClick={openWhatsApp} style={{ marginTop: '0.5rem' }}>
                Chat on WhatsApp
              </button>
            </div>
          </aside>

          {/* Right Column: Contact Form */}
          <main className="contact-form-panel card">
            <h3>Send an Inquiry</h3>
            <p className="form-subtext">Fill out this quick form and our support manager will respond within 4 business hours.</p>

            {submitSuccess && (
              <div className="contact-alert success">
                <CheckCircle2 size={16} /> <span>{submitSuccess}</span>
              </div>
            )}
            {submitError && (
              <div className="contact-alert error">
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitInquiry} className="contact-form-main">
              <div className="form-row-grid">
                <div className="form-group">
                  <label htmlFor="inq-name">Your Name</label>
                  <input
                    id="inq-name"
                    type="text"
                    className="form-control"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="inq-email">Email Address</label>
                  <input
                    id="inq-email"
                    type="email"
                    className="form-control"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label htmlFor="inq-phone">Phone Number</label>
                  <input
                    id="inq-phone"
                    type="tel"
                    className="form-control"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="inq-subject">Subject</label>
                  <select
                    id="inq-subject"
                    className="form-control"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Room Booking Details">Room Booking Details</option>
                    <option value="Group Booking Tariff">Group Booking Tariff</option>
                    <option value="Feedback / Complaints">Feedback / Complaints</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="inq-message">Your Message</label>
                <textarea
                  id="inq-message"
                  rows="5"
                  className="form-control"
                  placeholder="How can we assist you with your stay?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-gold btn-send" disabled={isSubmitting}>
                <Send size={16} /> {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </main>
        </div>

        {/* Map Location Iframe */}
        <div className="contact-map-block card" style={{ marginTop: '4rem', padding: '0.5rem', height: '400px' }}>
          <iframe
            title="Shrimaya Google Map coordinates"
            src="https://maps.google.com/maps?q=Shri%20Maya%20Guest%20House%20Malanpur&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '6px' }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
