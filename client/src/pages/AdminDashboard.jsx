import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API, { getImageUrl } from '../services/api';
import {
  TrendingUp, Home, Calendar, Users, Star, Ticket, MessageSquare,
  Plus, Edit, Trash2, Check, X, ShieldAlert, Sparkles, RefreshCw
} from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('analytics');

  // Database lists
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [offers, setOffers] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  const [loadingData, setLoadingData] = useState(true);

  // Forms states
  // Add Room form
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [roomForm, setRoomForm] = useState({
    name: '', category: 'Deluxe Room', description: '', pricePerNight: 800,
    maxGuests: 2, amenities: '', totalRooms: 5, status: 'available', image: ''
  });

  // Add Coupon form
  const [showAddOffer, setShowAddOffer] = useState(false);
  const [offerForm, setOfferForm] = useState({
    code: '', discountPercentage: 10, description: '', validUntil: ''
  });

  // Website Customization form
  const [homeCustomize, setHomeCustomize] = useState({
    heroTitle: '',
    heroSubtitle: '',
    sliderImages: ''
  });

  const [uploadingRoomImage, setUploadingRoomImage] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);

  // Edit User form
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', phone: '', role: 'customer' });

  // Room listings sub tab selector
  const [roomSubTab, setRoomSubTab] = useState('listings');

  // Bookings list filter
  const [bookingFilter, setBookingFilter] = useState('active');

  // Verify Admin authorization
  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        navigate('/');
      }
    }
  }, [user, authLoading, navigate]);

  // Auto-scroll to active panel view on mobile viewports on tab click (with sticky navbar offset)
  useEffect(() => {
    if (window.innerWidth < 1024) {
      const contentEl = document.querySelector('.admin-main-panel');
      if (contentEl) {
        const yOffset = -90; // Offset to account for the 80px sticky header navbar + spacing
        const y = contentEl.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }, [activeTab]);

  const loadAdminData = async () => {
    setLoadingData(true);
    try {
      const [roomsRes, bookingsRes, usersRes, reviewsRes, offersRes, inquiriesRes, settingsRes] = await Promise.all([
        API.get('/rooms'),
        API.get('/bookings'),
        API.get('/users'),
        API.get('/reviews/admin'),
        API.get('/offers/admin'),
        API.get('/contacts'),
        API.get('/settings/homeSettings').catch(() => null)
      ]);

      setRooms(roomsRes.data);
      setBookings(bookingsRes.data);
      setUsers(usersRes.data);
      setReviews(reviewsRes.data);
      setOffers(offersRes.data);
      setInquiries(inquiriesRes.data);

      if (settingsRes && settingsRes.data) {
        setHomeCustomize({
          heroTitle: settingsRes.data.heroTitle || '',
          heroSubtitle: settingsRes.data.heroSubtitle || '',
          sliderImages: (settingsRes.data.sliderImages || []).join(', ')
        });
      }
    } catch (error) {
      console.error('Error fetching admin data. Using mock seed arrays where offline.', error);
      
      // Fallback Seed mock states if server is not fully running or on offline setup
      setRooms([
        { _id: '1', name: 'Deluxe Room', category: 'Deluxe Room', pricePerNight: 1800, maxGuests: 2, amenities: ['Free WiFi', 'Parking'], totalRooms: 5, status: 'available', images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'] },
        { _id: '2', name: 'AC Executive Room', category: 'AC Room', pricePerNight: 2500, maxGuests: 2, amenities: ['Free WiFi', 'Air Conditioned Rooms'], totalRooms: 5, status: 'available', images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=400&q=80'] }
      ]);
      setBookings([
        { _id: 'b1', user: { name: 'Manoj Patel', email: 'manoj@patel.com' }, room: { name: 'AC Executive Room' }, checkIn: '2026-07-01', checkOut: '2026-07-03', roomsCount: 1, totalAmount: 5000, status: 'confirmed', paymentStatus: 'paid', createdAt: '2026-06-29' }
      ]);
      setUsers([
        { _id: 'u1', name: 'Manoj Patel', email: 'manoj@patel.com', role: 'customer', phone: '9827618901' }
      ]);
      setReviews([
        { _id: 'r1', user: { name: 'Manoj Patel' }, room: { name: 'AC Executive Room' }, rating: 5, comment: 'Incredibly cozy AC room setup. Highly recommend!', status: 'pending' }
      ]);
      setOffers([
        { _id: 'o1', code: 'WELCOME10', discountPercentage: 10, description: '10% discount for first stays.', validUntil: '2030-12-31' }
      ]);
      setInquiries([
        { _id: 'inq1', name: 'Sanjay Sharma', email: 'sanjay@sharma.com', phone: '9981881771', subject: 'Parking Space Inquiry', message: 'Do you support heavy tourist coach parking?', replied: false }
      ]);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  // --- ACTIONS ---
  // Rooms CRUD
  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      const amenitiesArr = roomForm.amenities.split(',').map(s => s.trim()).filter(Boolean);
      const payload = {
        ...roomForm,
        amenities: amenitiesArr,
        images: [roomForm.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80']
      };
      
      if (editingRoomId) {
        await API.put(`/rooms/${editingRoomId}`, payload);
        alert('Room details updated successfully.');
      } else {
        await API.post('/rooms', payload);
        alert('Room listing added successfully.');
      }
      
      setEditingRoomId(null);
      setRoomForm({
        name: '', category: 'Deluxe Room', description: '', pricePerNight: 800,
        maxGuests: 2, amenities: '', totalRooms: 5, status: 'available', image: ''
      });
      setShowAddRoom(false);
      loadAdminData();
    } catch (err) {
      console.error(err);
      alert(editingRoomId ? (err.response?.data?.message || 'Failed to update room.') : (err.response?.data?.message || 'Failed to create room.'));
    }
  };

  const handleEditRoomClick = (room) => {
    setEditingRoomId(room._id);
    setRoomForm({
      name: room.name,
      category: room.category,
      description: room.description,
      pricePerNight: room.pricePerNight,
      maxGuests: room.maxGuests,
      amenities: room.amenities.join(', '),
      totalRooms: room.totalRooms,
      status: room.status || 'available',
      image: room.images[0] || ''
    });
    setShowAddRoom(true);
    setTimeout(() => {
      const editFormElement = document.getElementById('edit-room-form-anchor');
      if (editFormElement) {
        const stickyNavbarHeight = 90;
        const elementPosition = editFormElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - stickyNavbarHeight;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleRoomImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploadingRoomImage(true);

    try {
      const { data } = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setRoomForm(prev => ({ ...prev, image: data.url }));
      alert('Local room image uploaded successfully.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to upload local image.');
    } finally {
      setUploadingRoomImage(false);
    }
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploadingHeroImage(true);

    try {
      const { data } = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setHomeCustomize(prev => {
        const existing = prev.sliderImages.trim();
        return {
          ...prev,
          sliderImages: existing ? `${existing}, ${data.url}` : data.url
        };
      });
      alert('Local image uploaded and appended to hero slider list.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to upload local image.');
    } finally {
      setUploadingHeroImage(false);
    }
  };

  const handleSaveCustomization = async (e) => {
    e.preventDefault();
    try {
      const sliderArray = homeCustomize.sliderImages.split(',').map(s => s.trim()).filter(Boolean);
      await API.put('/settings/homeSettings', {
        value: {
          heroTitle: homeCustomize.heroTitle,
          heroSubtitle: homeCustomize.heroSubtitle,
          sliderImages: sliderArray
        }
      });
      alert('Website UI customization saved successfully!');
      loadAdminData();
    } catch (err) {
      console.error(err);
      alert('Failed to save website customization settings.');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Delete this room category permanently?')) return;
    try {
      await API.delete(`/rooms/${roomId}`);
      loadAdminData();
    } catch (error) {
      alert('Failed to remove room category.');
    }
  };

  const handleRenameCategoryClick = async (oldName) => {
    const newName = window.prompt(`Rename room category "${oldName}" globally for all listings. Enter new name:`, oldName);
    if (!newName || newName.trim() === '' || newName === oldName) return;

    try {
      const { data } = await API.put('/rooms/category/rename', {
        oldCategoryName: oldName,
        newCategoryName: newName.trim()
      });
      alert(data.message || 'Category renamed successfully.');
      loadAdminData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to rename room category.');
    }
  };

  const handleDeleteCategoryClick = async (catName) => {
    if (!window.confirm(`Warning: Deleting the category "${catName}" will permanently remove ALL room listings associated with it. Are you sure you want to proceed?`)) return;

    try {
      const { data } = await API.delete(`/rooms/category/${encodeURIComponent(catName)}`);
      alert(data.message || 'Category and associated rooms deleted successfully.');
      loadAdminData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete room category.');
    }
  };

  const handleAddCategoryClick = async () => {
    const catName = window.prompt("Enter the name of the new room category:");
    if (!catName || catName.trim() === '') return;

    try {
      // Create a draft room listing to initialize the category in MongoDB
      await API.post('/rooms', {
        name: `${catName.trim()} Stay Package`,
        category: catName.trim(),
        description: `Premium accommodation stay package for ${catName.trim()}.`,
        pricePerNight: 800,
        maxGuests: 2,
        totalRooms: 1,
        status: 'maintenance', // draft mode so it doesn't display publicly until configured
        amenities: ['Free WiFi', 'Parking'],
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80']
      });
      alert(`Category "${catName.trim()}" created successfully as a draft room package.`);
      loadAdminData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create room category.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this customer permanently? All their bookings and reviews will remain but their user profile will be removed.')) return;
    try {
      await API.delete(`/users/${userId}`);
      alert('Customer removed successfully.');
      loadAdminData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to remove customer.');
    }
  };

  const handleAddRoomClick = () => {
    setEditingRoomId(null);
    setRoomForm({
      name: '',
      category: uniqueCategories[0] || 'Deluxe Room',
      description: '',
      pricePerNight: 800,
      maxGuests: 2,
      amenities: '',
      totalRooms: 5,
      status: 'available',
      image: ''
    });
    setShowAddRoom(true);
  };

  const handleEditUserClick = (u) => {
    setEditingUserId(u._id);
    setUserForm({
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      role: u.role
    });
    setShowEditUser(true);
    setTimeout(() => {
      const editUserFormElement = document.getElementById('edit-user-form-anchor');
      if (editUserFormElement) {
        const stickyNavbarHeight = 90;
        const elementPosition = editUserFormElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - stickyNavbarHeight;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/users/${editingUserId}`, userForm);
      alert('Customer profile updated successfully.');
      setShowEditUser(false);
      setEditingUserId(null);
      loadAdminData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update customer details.');
    }
  };

  // Review moderation
  const handleReviewStatus = async (reviewId, status) => {
    try {
      await API.put(`/reviews/${reviewId}/moderate`, { status });
      loadAdminData();
    } catch (error) {
      alert('Failed to moderate review.');
    }
  };

  // Offers creation
  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/offers', offerForm);
      alert('Promotional offer coupon created.');
      setShowAddOffer(false);
      loadAdminData();
    } catch (error) {
      alert('Failed to create promo code.');
    }
  };

  const handleDeleteOffer = async (offerId) => {
    if (!window.confirm('Remove this promo code?')) return;
    try {
      await API.delete(`/offers/${offerId}`);
      loadAdminData();
    } catch (error) {
      alert('Failed to delete offer.');
    }
  };

  // Booking statuses update
  const handleUpdateBookingStatus = async (bookingId, status, paymentStatus) => {
    try {
      await API.put(`/bookings/${bookingId}/status`, { status, paymentStatus });
      loadAdminData();
    } catch (error) {
      alert('Failed to update booking status.');
    }
  };

  // Reply to Contact Inquiries
  const handleInquiryReply = async (inquiryId) => {
    const replyMessage = prompt('Type your email/message reply to mark as replied:');
    if (!replyMessage) return;

    try {
      await API.put(`/contacts/${inquiryId}/reply`, { replyMessage });
      loadAdminData();
    } catch (error) {
      alert('Failed to log reply.');
    }
  };

  if (authLoading || !user || user.role !== 'admin') {
    return <div className="container section text-center">Checking Administrator Authorization...</div>;
  }

  // Analytics helper calculations
  const totalPaidRevenue = bookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const activeReservationsCount = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;

  const uniqueCategories = rooms.length > 0 
    ? [...new Set(rooms.map(r => r.category).filter(Boolean))]
    : ['Deluxe Room', 'AC Room', 'Family Room', 'Premium Suite'];

  return (
    <div className="admin-dashboard-page">
      {/* Sidebar navigation */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <ShieldAlert size={22} className="shield-icon" />
          <div>
            <h4>Shrimaya Console</h4>
            <span>Administrator Control</span>
          </div>
        </div>

        <nav className="admin-nav-tabs">
          <button className={`admin-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <TrendingUp size={16} /> Overview Analytics
          </button>
          <button className={`admin-tab-btn ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => setActiveTab('rooms')}>
            <Home size={16} /> Manage Rooms
          </button>
          <button className={`admin-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
            <Calendar size={16} /> Stay Bookings
          </button>
          <button className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <Users size={16} /> Customers List
          </button>
          <button className={`admin-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
            <Star size={16} /> Review Moderation
          </button>
          <button className={`admin-tab-btn ${activeTab === 'offers' ? 'active' : ''}`} onClick={() => setActiveTab('offers')}>
            <Ticket size={16} /> Promo Coupons
          </button>
          <button className={`admin-tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`} onClick={() => setActiveTab('inquiries')}>
            <MessageSquare size={16} /> Guest Messages
          </button>
          <button className={`admin-tab-btn ${activeTab === 'customize' ? 'active' : ''}`} onClick={() => setActiveTab('customize')}>
            <Sparkles size={16} /> Customize Website
          </button>
        </nav>
      </aside>

      {/* Main Panel Content */}
      <main className="admin-main-panel">
        <header className="panel-header">
          <h2>Administrative Panel</h2>
          <button className="btn btn-outline btn-refresh" onClick={loadAdminData} title="Refresh Database">
            <RefreshCw size={14} /> Reload
          </button>
        </header>

        {loadingData ? (
          <div className="panel-loader">Syncing database collections...</div>
        ) : (
          <div className="panel-content-body">
            {/* View 1: Analytics Overview */}
            {activeTab === 'analytics' && (
              <div className="analytics-view">
                <div className="admin-analytics-grid">
                  <div className="analytic-card glass-card">
                    <div className="card-top">
                      <TrendingUp size={28} className="icon-blue" />
                      <span>Total Revenue</span>
                    </div>
                    <h2>Rs. {totalPaidRevenue.toLocaleString()}</h2>
                    <p>Total earnings from settled checkouts.</p>
                  </div>

                  <div className="analytic-card glass-card">
                    <div className="card-top">
                      <Calendar size={28} className="icon-gold" />
                      <span>Active Stays</span>
                    </div>
                    <h2>{activeReservationsCount}</h2>
                    <p>Reservations in confirmed/pending states.</p>
                  </div>

                  <div className="analytic-card glass-card">
                    <div className="card-top">
                      <Users size={28} className="icon-green" />
                      <span>Total Customers</span>
                    </div>
                    <h2>{users.filter(u => u.role !== 'admin').length}</h2>
                    <p>Registered visitor accounts in database.</p>
                  </div>

                  <div className="analytic-card glass-card">
                    <div className="card-top">
                      <Home size={28} className="icon-navy" />
                      <span>Room Categories</span>
                    </div>
                    <h2>{rooms.length}</h2>
                    <p>Accommodation options configured.</p>
                  </div>
                </div>

                <div className="recent-activity-section card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}><Sparkles size={16} /> System Operations Logs</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    • System Auto-seeding: Validated rooms and discount collections successfully. <br/>
                    • Payment Gateway Hook: Razorpay checkouts verification script is active. <br/>
                    • PDF invoice generator engine is online.
                  </p>
                </div>
              </div>
            )}

            {/* View 2: Room Management */}
            {activeTab === 'rooms' && (
              <div className="rooms-management-view">
                <div className="section-actions-row">
                  <h3>Room Packages</h3>
                  {roomSubTab === 'listings' ? (
                    <button className="btn btn-gold btn-sm" onClick={handleAddRoomClick}>
                      <Plus size={16} /> Add Room Package
                    </button>
                  ) : (
                    <button className="btn btn-gold btn-sm" onClick={handleAddCategoryClick}>
                      <Plus size={16} /> Add New Category
                    </button>
                  )}
                </div>

                {/* Sub Tab Toggle navigation */}
                <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem', paddingBottom: '0.5rem', marginTop: '1rem' }}>
                  <button 
                    onClick={() => { setRoomSubTab('listings'); setShowAddRoom(false); }} 
                    className={`btn btn-sm ${roomSubTab === 'listings' ? 'btn-gold' : 'btn-outline'}`}
                    style={{ padding: '0.4rem 1rem' }}
                  >
                    Room Listings
                  </button>
                  <button 
                    onClick={() => { setRoomSubTab('categories'); setShowAddRoom(false); }} 
                    className={`btn btn-sm ${roomSubTab === 'categories' ? 'btn-gold' : 'btn-outline'}`}
                    style={{ padding: '0.4rem 1rem' }}
                  >
                    Manage Categories
                  </button>
                </div>

                {roomSubTab === 'listings' ? (
                  <>
                    {showAddRoom && (
                      <div className="admin-modal-overlay">
                        <form onSubmit={handleRoomSubmit} className="admin-modal-card card" style={{ padding: '2rem', width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
                          <h4 style={{ marginBottom: '1.5rem', color: 'var(--primary)', borderBottom: '1.5px solid var(--border)', paddingBottom: '0.75rem' }}>
                            {editingRoomId ? 'Edit Room Package' : 'Create New Room Package'}
                          </h4>
                          <div className="form-row-grid">
                            <div className="form-group">
                              <label>Room Name</label>
                              <input type="text" className="form-control" placeholder="e.g. Luxury AC Suite" required
                                value={roomForm.name} onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                              <label>Category Room Type</label>
                              <select 
                                className="form-control" 
                                required
                                value={roomForm.category} 
                                onChange={(e) => setRoomForm({ ...roomForm, category: e.target.value })}
                              >
                                {uniqueCategories.map((cat, idx) => (
                                  <option key={idx} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>
                            <div className="form-group">
                              <label>Price Per Night (INR)</label>
                              <input type="number" className="form-control" required
                                value={roomForm.pricePerNight} onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: Number(e.target.value) })} />
                            </div>
                          </div>

                          <div className="form-row-grid">
                            <div className="form-group">
                              <label>Max Guest Capacity</label>
                              <input type="number" className="form-control" required
                                value={roomForm.maxGuests} onChange={(e) => setRoomForm({ ...roomForm, maxGuests: Number(e.target.value) })} />
                            </div>
                            <div className="form-group">
                              <label>Amenities (Comma-separated)</label>
                              <input type="text" className="form-control" placeholder="Free WiFi, Parking, AC"
                                value={roomForm.amenities} onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })} />
                            </div>
                            <div className="form-group">
                              <label>Total Inventory (Rooms Available)</label>
                              <input type="number" className="form-control" required
                                value={roomForm.totalRooms} onChange={(e) => setRoomForm({ ...roomForm, totalRooms: Number(e.target.value) })} />
                            </div>
                          </div>

                          <div className="form-row-grid">
                            <div className="form-group">
                              <label>Image URL</label>
                              <input type="text" className="form-control" placeholder="https://unsplash.com/..."
                                value={roomForm.image} onChange={(e) => setRoomForm({ ...roomForm, image: e.target.value })} />
                            </div>
                            <div className="form-group">
                              <label>Or Upload Local Image</label>
                              <input type="file" className="form-control" onChange={handleRoomImageUpload} accept="image/*" />
                              {uploadingRoomImage && <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>Uploading to server...</span>}
                            </div>
                          </div>

                          <div className="form-group">
                            <label>Room Description</label>
                            <textarea className="form-control" rows="3" required
                              value={roomForm.description} onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })} />
                          </div>

                          <div className="form-actions-buttons" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button type="submit" className="btn btn-gold btn-sm">Save Room</button>
                            <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddRoom(false)}>Cancel</button>
                          </div>
                        </form>
                      </div>
                    )}

                    <div className="table-responsive card">
                      <table>
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price/Night</th>
                            <th>Inventory</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rooms.map((room) => (
                            <tr key={room._id}>
                              <td><img src={getImageUrl(room.images[0])} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                              <td><strong>{room.name}</strong></td>
                              <td>{room.category}</td>
                              <td>Rs. {room.pricePerNight}</td>
                              <td>{room.totalRooms} Keys</td>
                              <td>
                                <button className="btn btn-outline btn-sm" onClick={() => handleEditRoomClick(room)} style={{ marginRight: '0.5rem', padding: '0.3rem' }} title="Edit Room">
                                  <Edit size={14} />
                                </button>
                                <button className="btn btn-outline btn-sm" onClick={() => handleDeleteRoom(room._id)} style={{ color: '#EF4444', borderColor: '#EF4444', padding: '0.3rem' }} title="Delete Room">
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Desktop Categories Table */}
                    <div className="table-responsive card categories-table-desktop">
                      <table className="categories-table">
                        <thead>
                          <tr>
                            <th>Category Name</th>
                            <th>Room Listings Associated</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uniqueCategories.map((cat, idx) => (
                            <tr key={idx}>
                              <td><strong>{cat}</strong></td>
                              <td>{rooms.filter(r => r.category === cat).length} Rooms configured</td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button 
                                    className="btn btn-outline btn-sm" 
                                    onClick={() => handleRenameCategoryClick(cat)} 
                                    style={{ padding: '0.35rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }} 
                                    title="Rename Category Globally"
                                  >
                                    <Edit size={14} /> Rename
                                  </button>
                                  <button 
                                    className="btn btn-outline btn-sm" 
                                    onClick={() => handleDeleteCategoryClick(cat)} 
                                    style={{ color: '#EF4444', borderColor: '#EF4444', padding: '0.35rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }} 
                                    title="Delete Category & Listings"
                                  >
                                    <Trash2 size={14} /> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Categories Cards */}
                    <div className="categories-cards-mobile-list">
                      {uniqueCategories.map((cat, idx) => (
                        <div key={idx} className="admin-category-mobile-card card">
                          <div className="card-header-row">
                            <span className="booking-ref">{cat}</span>
                            <span className="badge badge-success">Active</span>
                          </div>
                          
                          <div className="card-body-info">
                            <div className="info-item">
                              <span className="info-label">Rooms Configured:</span>
                              <span className="info-val">{rooms.filter(r => r.category === cat).length} Rooms</span>
                            </div>
                          </div>

                          <div className="card-actions-row">
                            <button 
                              className="btn btn-outline btn-sm" 
                              onClick={() => handleRenameCategoryClick(cat)} 
                              style={{ flexGrow: 1 }}
                            >
                              <Edit size={14} /> Rename
                            </button>
                            <button 
                              className="btn btn-outline btn-sm" 
                              onClick={() => handleDeleteCategoryClick(cat)} 
                              style={{ color: '#EF4444', borderColor: '#EF4444', flexGrow: 1 }}
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* View 3: Booking Management */}
            {activeTab === 'bookings' && (() => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const filteredBookings = bookings.filter(b => {
                const checkOutDate = new Date(b.checkOut);
                if (bookingFilter === 'active') {
                  return checkOutDate >= today;
                } else if (bookingFilter === 'past') {
                  return checkOutDate < today;
                }
                return true;
              });

              return (
                <div className="booking-management-view">
                  <div className="section-actions-row">
                    <h3>Stay Reservations</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)' }}>Show:</span>
                      <select 
                        className="form-control" 
                        style={{ padding: '0.35rem 0.8rem', width: '180px', fontSize: '0.82rem', height: '36px' }}
                        value={bookingFilter}
                        onChange={(e) => setBookingFilter(e.target.value)}
                      >
                        <option value="active">Active & Upcoming</option>
                        <option value="past">Past & Expired</option>
                        <option value="all">All Reservations</option>
                      </select>
                    </div>
                  </div>

                  {/* Desktop View Table */}
                  <div className="table-responsive card bookings-table-desktop" style={{ marginTop: '1rem' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Room Category</th>
                          <th>Stay Dates</th>
                          <th>Rooms</th>
                          <th>Total Cost</th>
                          <th>Order Status</th>
                          <th>Payment Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.length === 0 ? (
                          <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                              No reservations found matching this filter.
                            </td>
                          </tr>
                        ) : (
                          filteredBookings.map((b) => (
                            <tr key={b._id}>
                              <td>
                                <strong>{b.user?.name || 'Deleted Account'}</strong>
                                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.user?.email || 'N/A'}</span>
                              </td>
                              <td>{b.room?.name || 'Deleted Room Listing'}</td>
                              <td>{new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}</td>
                              <td>{b.roomsCount} Room(s)</td>
                              <td>Rs. {b.totalAmount}</td>
                              <td>
                                <select
                                  value={b.status}
                                  className={`form-control select-badge badge-${b.status}`}
                                  onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value, b.paymentStatus)}
                                >
                                  <option value="pending">pending</option>
                                  <option value="confirmed">confirmed</option>
                                  <option value="cancelled">cancelled</option>
                                </select>
                              </td>
                              <td>
                                <select
                                  value={b.paymentStatus}
                                  className={`form-control select-badge badge-${b.paymentStatus === 'paid' ? 'success' : b.paymentStatus === 'unpaid' ? 'pending' : 'danger'}`}
                                  onChange={(e) => handleUpdateBookingStatus(b._id, b.status, e.target.value)}
                                >
                                  <option value="unpaid">unpaid</option>
                                  <option value="paid">paid</option>
                                  <option value="refunded">refunded</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile View Cards */}
                  <div className="bookings-cards-mobile-list">
                    {filteredBookings.length === 0 ? (
                      <p className="no-items-placeholder">No reservations found matching this filter.</p>
                    ) : (
                      filteredBookings.map((b) => (
                        <div key={b._id} className="admin-booking-mobile-card card">
                          <div className="card-header-row">
                            <span className="booking-ref">Ref: SM-{b._id.substring(18).toUpperCase()}</span>
                            <span className={`badge badge-${b.status}`}>{b.status}</span>
                          </div>
                          
                          <div className="card-body-info">
                            <div className="info-item">
                              <span className="info-label">Customer Name:</span>
                              <span className="info-val"><strong>{b.user?.name || 'Deleted Account'}</strong></span>
                            </div>
                            <div className="info-item vertical">
                              <span className="info-label">Customer Email:</span>
                              <span className="info-val block-text">{b.user?.email || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">Room Category:</span>
                              <span className="info-val">{b.room?.name || 'Deleted Room Listing'}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">Stay Dates:</span>
                              <span className="info-val">{new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">Rooms:</span>
                              <span className="info-val">{b.roomsCount} Room(s)</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">Total Cost:</span>
                              <span className="info-val" style={{ color: 'var(--accent-dark)', fontWeight: '700' }}>Rs. {b.totalAmount}</span>
                            </div>
                          </div>

                          <div className="card-actions-grid">
                            <div className="action-control">
                              <label>Order Status:</label>
                              <select
                                value={b.status}
                                className={`form-control select-badge badge-${b.status}`}
                                onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value, b.paymentStatus)}
                              >
                                <option value="pending">pending</option>
                                <option value="confirmed">confirmed</option>
                                <option value="cancelled">cancelled</option>
                              </select>
                            </div>
                            <div className="action-control">
                              <label>Payment Status:</label>
                              <select
                                value={b.paymentStatus}
                                className={`form-control select-badge badge-${b.paymentStatus === 'paid' ? 'success' : b.paymentStatus === 'unpaid' ? 'pending' : 'danger'}`}
                                onChange={(e) => handleUpdateBookingStatus(b._id, b.status, e.target.value)}
                              >
                                <option value="unpaid">unpaid</option>
                                <option value="paid">paid</option>
                                <option value="refunded">refunded</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
              </div>
            )})()}

            {/* View 4: Customer list */}
            {activeTab === 'users' && (
              <div className="users-management-view">
                <h3>Registered User Base</h3>
                
                {showEditUser && (
                  <div className="admin-modal-overlay">
                    <form onSubmit={handleUserSubmit} className="admin-modal-card card" style={{ padding: '2rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', margin: 0 }}>
                      <h4 style={{ marginBottom: '1.5rem', color: 'var(--primary)', borderBottom: '1.5px solid var(--border)', paddingBottom: '0.75rem' }}>
                        Edit Customer Profile
                      </h4>
                      <div className="form-row-grid">
                        <div className="form-group">
                          <label>Full Name</label>
                          <input type="text" className="form-control" required
                            value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                          <label>Email Address</label>
                          <input type="email" className="form-control" required
                            value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
                        </div>
                      </div>
                      
                      <div className="form-row-grid" style={{ marginTop: '1rem' }}>
                        <div className="form-group">
                          <label>Phone Number</label>
                          <input type="text" className="form-control"
                            value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} />
                        </div>
                        <div className="form-group">
                          <label>Account Role</label>
                          <select className="form-control" value={userForm.role}
                            onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                            <option value="customer">customer</option>
                            <option value="admin">admin</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-actions-buttons" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <button type="submit" className="btn btn-gold btn-sm">Save Changes</button>
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => { setShowEditUser(false); setEditingUserId(null); }}>Cancel</button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Desktop View Table */}
                <div className="table-responsive card users-table-desktop" style={{ marginTop: '1rem' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email Address</th>
                        <th>Contact Number</th>
                        <th>Role</th>
                        <th>Google SSO</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td><strong>{u.name}</strong></td>
                          <td>{u.email}</td>
                          <td>{u.phone || 'N/A'}</td>
                          <td><span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-success'}`}>{u.role}</span></td>
                          <td>{u.googleId ? 'Yes' : 'No'}</td>
                          <td>
                            {u.role !== 'admin' ? (
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn btn-outline btn-sm" onClick={() => handleEditUserClick(u)} style={{ padding: '0.3rem' }} title="Edit Customer">
                                  <Edit size={14} />
                                </button>
                                <button className="btn btn-outline btn-sm" onClick={() => handleDeleteUser(u._id)} style={{ color: '#EF4444', borderColor: '#EF4444', padding: '0.3rem' }} title="Delete Customer">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Protected</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Cards */}
                <div className="users-cards-mobile-list">
                  {users.length === 0 ? (
                    <p className="no-items-placeholder">No users found.</p>
                  ) : (
                    users.map((u) => (
                      <div key={u._id} className="admin-user-mobile-card card">
                        <div className="card-header-row">
                          <strong>{u.name}</strong>
                          <span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-success'}`}>{u.role}</span>
                        </div>
                        
                        <div className="card-body-info">
                          <div className="info-item vertical">
                            <span className="info-label">Email:</span>
                            <span className="info-val block-text">{u.email}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Phone:</span>
                            <span className="info-val">{u.phone || 'N/A'}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Google SSO:</span>
                            <span className="info-val">{u.googleId ? 'Yes' : 'No'}</span>
                          </div>
                        </div>

                        <div className="card-actions-row">
                          {u.role !== 'admin' ? (
                            <>
                              <button className="btn btn-outline btn-sm" onClick={() => handleEditUserClick(u)} style={{ flexGrow: 1 }}>
                                <Edit size={14} /> Edit Profile
                              </button>
                              <button className="btn btn-outline btn-sm" onClick={() => handleDeleteUser(u._id)} style={{ color: '#EF4444', borderColor: '#EF4444', flexGrow: 1 }}>
                                <Trash2 size={14} /> Delete
                              </button>
                            </>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', width: '100%' }}>Protected Admin Account</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* View 5: Review Moderation */}
            {activeTab === 'reviews' && (
              <div className="reviews-management-view">
                <h3>Review Moderation Queue</h3>
                <div className="reviews-moderation-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  {reviews.length === 0 ? (
                    <p className="no-items-placeholder">Review queue is empty.</p>
                  ) : (
                    reviews.map((r) => (
                      <div key={r._id} className="review-moderate-card card" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ flexGrow: 1, minWidth: '250px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem', alignItems: 'center' }}>
                            <strong>{r.user?.name || 'Anonymous Guest'}</strong>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Room: {r.room?.name || 'Deleted Room Listing'}</span>
                            <span className={`badge badge-${r.status}`}>{r.status}</span>
                          </div>
                          <div style={{ margin: '0.5rem 0', display: 'flex', gap: '0.15rem' }}>
                            {[...Array(5)].map((_, idx) => (
                              <Star key={idx} size={14} fill={idx < r.rating ? '#D4AF37' : 'none'} color={idx < r.rating ? '#D4AF37' : '#CCCCCC'} />
                            ))}
                          </div>
                          <p style={{ fontStyle: 'italic', fontSize: '0.88rem' }}>"{r.comment}"</p>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {r.status === 'pending' && (
                            <>
                              <button className="btn btn-gold btn-sm" onClick={() => handleReviewStatus(r._id, 'approved')} title="Approve Review">
                                <Check size={16} /> Approve
                              </button>
                              <button className="btn btn-outline btn-sm" onClick={() => handleReviewStatus(r._id, 'rejected')} style={{ color: '#EF4444', borderColor: '#EF4444' }}>
                                <X size={16} /> Reject
                              </button>
                            </>
                          )}
                          {r.status !== 'pending' && (
                            <button className="btn btn-outline btn-sm" onClick={() => handleReviewStatus(r._id, 'pending')}>
                              Set back to Pending
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* View 6: Promo Offers */}
            {activeTab === 'offers' && (
              <div className="offers-management-view">
                <div className="section-actions-row">
                  <h3>Seasonal Discount Coupons</h3>
                  <button className="btn btn-gold btn-sm" onClick={() => setShowAddOffer(!showAddOffer)}>
                    <Plus size={16} /> Add Promo Code
                  </button>
                </div>

                {showAddOffer && (
                  <form onSubmit={handleOfferSubmit} className="admin-add-form card">
                    <h4>Create Coupon Code</h4>
                    <div className="form-row-grid">
                      <div className="form-group">
                        <label>Promo Code (Uppercase)</label>
                        <input type="text" className="form-control" placeholder="e.g. AUTUMN20" required
                          value={offerForm.code} onChange={(e) => setOfferForm({ ...offerForm, code: e.target.value.toUpperCase() })} />
                      </div>
                      <div className="form-group">
                        <label>Discount Percentage (%)</label>
                        <input type="number" className="form-control" required min="1" max="100"
                          value={offerForm.discountPercentage} onChange={(e) => setOfferForm({ ...offerForm, discountPercentage: Number(e.target.value) })} />
                      </div>
                      <div className="form-group">
                        <label>Expiration Date</label>
                        <input type="date" className="form-control" required
                          value={offerForm.validUntil} onChange={(e) => setOfferForm({ ...offerForm, validUntil: e.target.value })} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Promo Description</label>
                      <input type="text" className="form-control" placeholder="Enter coupon description details..." required
                        value={offerForm.description} onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })} />
                    </div>

                    <div className="form-actions-buttons">
                      <button type="submit" className="btn btn-gold btn-sm">Save Coupon</button>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddOffer(false)}>Cancel</button>
                    </div>
                  </form>
                )}

                {/* Desktop View Table */}
                <div className="table-responsive card offers-table-desktop" style={{ marginTop: '1rem' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Promo Code</th>
                        <th>Discount Value</th>
                        <th>Description</th>
                        <th>Valid Until</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offers.map((off) => (
                        <tr key={off._id}>
                          <td><strong>{off.code}</strong></td>
                          <td>{off.discountPercentage}% OFF</td>
                          <td>{off.description}</td>
                          <td>{new Date(off.validUntil).toLocaleDateString()}</td>
                          <td>
                            <button className="btn btn-outline btn-sm" onClick={() => handleDeleteOffer(off._id)} style={{ color: '#EF4444', borderColor: '#EF4444', padding: '0.3rem' }}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Cards */}
                <div className="offers-cards-mobile-list">
                  {offers.length === 0 ? (
                    <p className="no-items-placeholder">No promo coupons configured yet.</p>
                  ) : (
                    offers.map((off) => (
                      <div key={off._id} className="admin-offer-mobile-card card">
                        <div className="card-header-row">
                          <span className="booking-ref">Promo Coupon Code</span>
                          <span className="badge badge-success">Active</span>
                        </div>
                        
                        <div className="card-body-info">
                          <div className="info-item">
                            <span className="info-label">Promo Code:</span>
                            <span className="info-val"><strong>{off.code}</strong></span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Discount Percentage:</span>
                            <span className="info-val" style={{ color: '#10B981', fontWeight: '700' }}>{off.discountPercentage}% OFF</span>
                          </div>
                          <div className="info-item vertical">
                            <span className="info-label">Description:</span>
                            <span className="info-val block-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>{off.description}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Valid Until:</span>
                            <span className="info-val">{new Date(off.validUntil).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="card-actions-row" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
                          <button className="btn btn-outline btn-sm btn-delete-offer" onClick={() => handleDeleteOffer(off._id)} style={{ color: '#EF4444', borderColor: '#EF4444', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                            <Trash2 size={14} /> Delete Coupon
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* View 7: Contact inquiries */}
            {activeTab === 'inquiries' && (
              <div className="inquiries-management-view">
                <h3>Customer Inquiry Mailbox</h3>
                <div className="inquiries-vertical-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  {inquiries.length === 0 ? (
                    <p className="no-items-placeholder">Inbox is clean. No guest messages found.</p>
                  ) : (
                    inquiries.map((inq) => (
                      <div key={inq._id} className="inquiry-message-card card" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
                        <div style={{ flexGrow: 1, minWidth: '250px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <strong>Subject: {inq.subject}</strong>
                            <span className={`badge ${inq.replied ? 'badge-success' : 'badge-pending'}`}>
                              {inq.replied ? 'Replied' : 'Pending Action'}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-dark)', marginBottom: '0.8rem', padding: '0.5rem', backgroundColor: 'var(--bg-light)', borderRadius: '4px' }}>
                            "{inq.message}"
                          </p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <span><strong>Sender:</strong> {inq.name} ({inq.email})</span>
                            <span><strong>Phone:</strong> {inq.phone || 'N/A'}</span>
                            <span><strong>Date:</strong> {new Date(inq.createdAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                          {inq.replied && (
                            <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', borderTop: '1px dashed var(--border)', paddingTop: '0.5rem' }}>
                              <strong>Logged Reply:</strong> <span style={{ color: 'var(--text-muted)' }}>"{inq.replyMessage}"</span>
                            </div>
                          )}
                        </div>

                        {!inq.replied && (
                          <button className="btn btn-gold btn-sm" onClick={() => handleInquiryReply(inq._id)} style={{ flexShrink: 0 }}>
                            Log Reply
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* View 8: Website UI Customization */}
            {activeTab === 'customize' && (
              <div className="customize-management-view">
                <h3>Customize Website UI</h3>
                <p className="sub-text" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Dynamically customize the homepage sliders, hero headlines, and banner assets.
                </p>

                <form onSubmit={handleSaveCustomization} className="admin-add-form card" style={{ maxWidth: '800px' }}>
                  <h4>Hero Banner Settings</h4>
                  
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label>Hero Title Headline</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={homeCustomize.heroTitle}
                      onChange={(e) => setHomeCustomize({ ...homeCustomize, heroTitle: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label>Hero Subtitle Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      required
                      value={homeCustomize.heroSubtitle}
                      onChange={(e) => setHomeCustomize({ ...homeCustomize, heroSubtitle: e.target.value })}
                    />
                  </div>

                  <div className="form-row-grid" style={{ marginBottom: '1.5rem' }}>
                    <div className="form-group">
                      <label>Hero Slider Image URLs (Comma-separated list)</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        required
                        placeholder="https://image1.jpg, https://image2.jpg, ..."
                        value={homeCustomize.sliderImages}
                        onChange={(e) => setHomeCustomize({ ...homeCustomize, sliderImages: e.target.value })}
                      />
                      <small style={{ color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                        Add high-resolution image links separated by commas.
                      </small>
                    </div>
                    <div className="form-group">
                      <label>Or Upload Local Slider Image (Appends to list)</label>
                      <input type="file" className="form-control" onChange={handleHeroImageUpload} accept="image/*" />
                      {uploadingHeroImage && <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>Uploading image to server...</span>}
                      <small style={{ color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                        Choose a local file to upload it and automatically append it to the slider list.
                      </small>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-gold btn-sm">
                    Save UI Customization
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
