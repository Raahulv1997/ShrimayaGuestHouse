import PDFDocument from 'pdfkit';

export const generateInvoice = (booking, payment, res) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // Pipe to response stream
  doc.pipe(res);

  // --- BRAND HEADER ---
  // Background style
  doc.rect(0, 0, 595.28, 140)
     .fill('#0D1B2A'); // Navy background

  doc.fillColor('#D4AF37') // Gold color
     .fontSize(24)
     .font('Helvetica-Bold')
     .text('SHRIMAYA GUEST HOUSE', 50, 40);

  doc.fillColor('#FFFFFF')
     .fontSize(10)
     .font('Helvetica')
     .text('Rajeshwari Dham, Manhar Hotel Ke Pass, Bhind Road, Malanpur Distt. Bhind (M.P.)', 50, 70)
     .text('Phone: 8269364180, 8269907127, 9926233735 | Email: contact@shrimayaguesthouse.com', 50, 85);

  doc.fillColor('#D4AF37')
     .fontSize(16)
     .font('Helvetica-Bold')
     .text('INVOICE / RECEIPT', 400, 40, { align: 'right' });

  // Reset text color to dark charcoal
  doc.fillColor('#333333');

  // --- INVOICE & CLIENT INFO ---
  doc.fontSize(12).font('Helvetica-Bold').text('Invoice Details:', 50, 160);
  doc.fontSize(10).font('Helvetica');
  doc.text(`Invoice No: SM-${booking._id.toString().substring(18).toUpperCase()}`, 50, 180);
  doc.text(`Date: ${new Date(payment.createdAt || Date.now()).toLocaleDateString()}`, 50, 195);
  doc.text(`Payment ID: ${payment.razorpayPaymentId || 'UPI_MOCK_PAY'}`, 50, 210);

  doc.fontSize(12).font('Helvetica-Bold').text('Guest Information:', 320, 160);
  doc.fontSize(10).font('Helvetica');
  doc.text(`Name: ${booking.user.name}`, 320, 180);
  doc.text(`Email: ${booking.user.email}`, 320, 195);
  doc.text(`Phone: ${booking.user.phone || 'N/A'}`, 320, 210);

  // Divider
  doc.moveTo(50, 240).lineTo(545, 240).stroke('#CCCCCC');

  // --- RESERVATION DETAILS ---
  doc.fontSize(12).font('Helvetica-Bold').text('Reservation Summary:', 50, 260);
  
  const checkInDate = new Date(booking.checkIn).toLocaleDateString();
  const checkOutDate = new Date(booking.checkOut).toLocaleDateString();
  const nights = Math.max(1, Math.round((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24)));

  doc.fontSize(10).font('Helvetica');
  doc.text(`Room Category: ${booking.room.name}`, 50, 285);
  doc.text(`Check-In: ${checkInDate}`, 50, 305);
  doc.text(`Check-Out: ${checkOutDate}`, 50, 325);
  doc.text(`Total Nights: ${nights}`, 320, 285);
  doc.text(`Number of Rooms: ${booking.roomsCount}`, 320, 305);
  doc.text(`Guests Capacity: ${booking.guests}`, 320, 325);

  // Divider
  doc.moveTo(50, 355).lineTo(545, 355).stroke('#CCCCCC');

  // --- BILLING BREAKDOWN ---
  doc.fontSize(12).font('Helvetica-Bold').text('Charges breakdown:', 50, 375);

  // Table Headers
  doc.fontSize(10).font('Helvetica-Bold');
  doc.text('Description', 50, 400);
  doc.text('Quantity', 250, 400, { width: 50, align: 'center' });
  doc.text('Rate', 350, 400, { width: 70, align: 'right' });
  doc.text('Total', 475, 400, { width: 70, align: 'right' });

  // Table Divider
  doc.moveTo(50, 415).lineTo(545, 415).stroke('#CCCCCC');

  // Table Row
  doc.fontSize(10).font('Helvetica');
  doc.text(`${booking.room.name} - Accommodation`, 50, 425);
  doc.text(`${booking.roomsCount} Room(s) x ${nights} Night(s)`, 210, 425, { width: 120, align: 'center' });
  doc.text(`Rs. ${booking.room.pricePerNight.toFixed(2)}`, 350, 425, { width: 70, align: 'right' });
  
  const subtotal = booking.room.pricePerNight * booking.roomsCount * nights;
  doc.text(`Rs. ${subtotal.toFixed(2)}`, 475, 425, { width: 70, align: 'right' });

  // Table Divider
  doc.moveTo(50, 445).lineTo(545, 445).stroke('#EEEEEE');

  // Calculations
  doc.fontSize(10);
  let currentY = 460;
  
  doc.font('Helvetica').text('Subtotal:', 350, currentY, { width: 110, align: 'right' });
  doc.text(`Rs. ${subtotal.toFixed(2)}`, 475, currentY, { width: 70, align: 'right' });
  
  if (booking.discountAmount > 0) {
    currentY += 20;
    doc.font('Helvetica').text(`Discount (${booking.couponApplied || 'Coupon'}):`, 300, currentY, { width: 160, align: 'right' });
    doc.text(`- Rs. ${booking.discountAmount.toFixed(2)}`, 475, currentY, { width: 70, align: 'right' });
  }

  const gst = booking.gstAmount || 0;
  if (gst > 0) {
    const splitGst = gst / 2;
    currentY += 20;
    doc.font('Helvetica').text('CGST (9%):', 350, currentY, { width: 110, align: 'right' });
    doc.text(`Rs. ${splitGst.toFixed(2)}`, 475, currentY, { width: 70, align: 'right' });
    
    currentY += 20;
    doc.font('Helvetica').text('SGST (9%):', 350, currentY, { width: 110, align: 'right' });
    doc.text(`Rs. ${splitGst.toFixed(2)}`, 475, currentY, { width: 70, align: 'right' });
  }

  currentY += 25;
  doc.moveTo(350, currentY - 5).lineTo(545, currentY - 5).stroke('#CCCCCC');

  // Total Paid
  doc.fontSize(12).font('Helvetica-Bold');
  doc.text('Total Amount Paid:', 300, currentY, { width: 160, align: 'right' });
  doc.fillColor('#0D1B2A').text(`Rs. ${booking.totalAmount.toFixed(2)}`, 475, currentY, { width: 70, align: 'right' });

  // --- FOOTER AND POLICIES ---
  doc.fillColor('#777777')
     .fontSize(8)
     .font('Helvetica')
     .text('Thank you for choosing Shrimaya Guest House! We look forward to welcoming you.', 50, 720, { align: 'center' })
     .text('Cancellation Policy: Standard bookings can be cancelled up to 24 hours prior to check-in for a full refund.', 50, 735, { align: 'center' })
     .text('For queries or support, reach out to contact@shrimayaguesthouse.com.', 50, 750, { align: 'center' });

  doc.end();
};
