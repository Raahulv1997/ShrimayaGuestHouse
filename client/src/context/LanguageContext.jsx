import React, { createContext, useState, useEffect, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navbar
    home: 'Home',
    about: 'About Us',
    rooms: 'Rooms',
    facilities: 'Facilities',
    gallery: 'Gallery',
    offers: 'Offers',
    contact: 'Contact Us',
    dashboard: 'Dashboard',
    adminPanel: 'Admin Panel',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',

    // Hero / Booking Widget
    welcomeTitle: 'Welcome to Shrimaya Guest House',
    heroSubtitle: 'Experience premium luxury, comfort, and unmatched hospitality in the heart of the city.',
    bookNow: 'Book Now',
    checkAvailability: 'Check Availability',
    checkIn: 'Check-In Date',
    checkOut: 'Check-Out Date',
    guests: 'Guests',
    roomsCount: 'Rooms',
    searchRooms: 'Search Available Rooms',
    adults: 'Guests Count',

    // Home Sections
    featuredRooms: 'Our Premium Rooms',
    featuredRoomsSub: 'Handcrafted spaces designed with elegance to deliver the finest sleeping experience.',
    facilitiesTitle: 'World Class Facilities',
    facilitiesSub: 'Enjoy a range of curated services designed for your peace of mind and satisfaction.',
    testimonialsTitle: 'What Our Guests Say',
    testimonialsSub: 'Real experiences shared by travelers who stayed at Shrimaya Guest House.',
    galleryTitle: 'Visual Tour of Shrimaya',
    gallerySub: 'Explore photographs of our rooms, suites, lush garden, and premium amenities.',

    // Common Buttons / Details
    viewDetails: 'View Details',
    pricePerNight: 'price per night',
    amenities: 'Amenities',
    status: 'Status',
    available: 'Available',
    maintenance: 'Maintenance',
    maxGuests: 'Max Guests',
    applyCoupon: 'Apply Coupon',
    subtotal: 'Subtotal',
    discount: 'Discount',
    totalAmount: 'Total Amount',
    payNow: 'Pay and Confirm Booking',
    floatingWhatsAppText: 'Chat on WhatsApp',

    // Dashboard
    myBookings: 'My Reservations',
    bookingId: 'Booking ID',
    statusText: 'Status',
    paymentStatusText: 'Payment',
    actionText: 'Actions',
    downloadInvoiceBtn: 'Download Invoice',
    cancelBookingBtn: 'Cancel Reservation',
    noBookingsText: 'You have no bookings yet.',
    activeBookings: 'Active Bookings',
    pastBookings: 'History',
    profileDetails: 'Profile Settings',
    updateProfileBtn: 'Update Profile',

    // Footer
    quickLinks: 'Quick Links',
    contactInfo: 'Contact Information',
    newsletterTitle: 'Subscribe to Newsletter',
    newsletterSub: 'Receive latest updates and seasonal promotional codes directly in your inbox.',
    subscribeBtn: 'Subscribe',
    rightsReserved: 'All Rights Reserved.',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
  },
  hi: {
    // Navbar
    home: 'होम',
    about: 'हमारे बारे में',
    rooms: 'कमरे',
    facilities: 'सुविधाएं',
    gallery: 'गैलरी',
    offers: 'ऑफ़र',
    contact: 'संपर्क करें',
    dashboard: 'डैशबोर्ड',
    adminPanel: 'एडमिन पैनल',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    register: 'रजिस्टर',

    // Hero / Booking Widget
    welcomeTitle: 'श्रीमाया गेस्ट हाउस में आपका स्वागत है',
    heroSubtitle: 'शहर के केंद्र में प्रीमियम विलासिता, आराम और बेजोड़ आतिथ्य का अनुभव करें।',
    bookNow: 'अभी बुक करें',
    checkAvailability: 'उपलब्धता जांचें',
    checkIn: 'चेक-इन तारीख',
    checkOut: 'चेक-आउट तारीख',
    guests: 'अतिथि',
    roomsCount: 'कमरे',
    searchRooms: 'उपलब्ध कमरे खोजें',
    adults: 'अतिथियों की संख्या',

    // Home Sections
    featuredRooms: 'हमारे प्रीमियम कमरे',
    featuredRoomsSub: 'बेहतरीन नींद का अनुभव प्रदान करने के लिए सुरुचिपूर्ण ढंग से तैयार किए गए कमरे।',
    facilitiesTitle: 'विश्व स्तरीय सुविधाएं',
    facilitiesSub: 'आपकी मन की शांति और संतुष्टि के लिए तैयार की गई विभिन्न सेवाओं का आनंद लें।',
    testimonialsTitle: 'हमारे मेहमान क्या कहते हैं',
    testimonialsSub: 'श्रीमाया गेस्ट हाउस में रुकने वाले यात्रियों द्वारा साझा किए गए वास्तविक अनुभव।',
    galleryTitle: 'श्रीमाया का दृश्य दौरा',
    gallerySub: 'हमारे कमरों, सुइट्स, हरे-भरे बगीचे और प्रीमियम सुविधाओं की तस्वीरें देखें।',

    // Common Buttons / Details
    viewDetails: 'विवरण देखें',
    pricePerNight: 'प्रति रात शुल्क',
    amenities: 'सुविधाएं',
    status: 'स्थिति',
    available: 'उपलब्ध',
    maintenance: 'रखरखाव',
    maxGuests: 'अधिकतम मेहमान',
    applyCoupon: 'कूपन लागू करें',
    subtotal: 'उप-योग',
    discount: 'छूट',
    totalAmount: 'कुल राशि',
    payNow: 'भुगतान करें और बुकिंग की पुष्टि करें',
    floatingWhatsAppText: 'व्हाट्सएप पर बात करें',

    // Dashboard
    myBookings: 'मेरी बुकिंग्स',
    bookingId: 'बुकिंग आईडी',
    statusText: 'स्थिति',
    paymentStatusText: 'भुगतान',
    actionText: 'कार्रवाई',
    downloadInvoiceBtn: 'इनवॉइस डाउनलोड करें',
    cancelBookingBtn: 'बुकिंग रद्द करें',
    noBookingsText: 'आपकी अभी तक कोई बुकिंग नहीं है।',
    activeBookings: 'सक्रिय बुकिंग्स',
    pastBookings: 'इतिहास',
    profileDetails: 'प्रोफ़ाइल सेटिंग्स',
    updateProfileBtn: 'प्रोफ़ाइल अपडेट करें',

    // Footer
    quickLinks: 'त्वरित लिंक',
    contactInfo: 'संपर्क जानकारी',
    newsletterTitle: 'न्यूज़लेटर की सदस्यता लें',
    newsletterSub: 'सीधे अपने इनबॉक्स में नवीनतम अपडेट और मौसमी कूपन कोड प्राप्त करें।',
    subscribeBtn: 'सदस्यता लें',
    rightsReserved: 'सर्वाधिकार सुरक्षित।',
    privacyPolicy: 'गोपनीयता नीति',
    termsConditions: 'नियम और शर्तें',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('shrimaya_language');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('shrimaya_language', lang);
  };

  const t = (key) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
