const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const sendBookingConfirmation = async (booking, user, car) => {
  try {
    const transporter = createTransporter();
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
        <div style="background:linear-gradient(135deg,#1e3a5f 0%,#0ea5e9 100%);padding:30px 40px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">🚗 DriveEase</h1>
          <p style="color:#e0f2fe;margin:8px 0 0;font-size:14px;">India's Premium Car Rental</p>
        </div>
        <div style="padding:40px;">
          <div style="background:#ecfdf5;border-left:4px solid #10b981;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px;">
            <h2 style="color:#065f46;margin:0;font-size:18px;">✅ Booking Confirmed!</h2>
          </div>
          <p style="color:#374151;font-size:16px;line-height:1.6;">Dear <strong>${user.name}</strong>,</p>
          <p style="color:#6b7280;font-size:15px;line-height:1.6;">Your car booking has been confirmed. Here are the details:</p>
          <div style="background:#f9fafb;border-radius:12px;padding:24px;margin:20px 0;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;color:#6b7280;font-size:14px;border-bottom:1px solid #e5e7eb;">Car</td>
                <td style="padding:10px 0;color:#111827;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #e5e7eb;">${car.brand} ${car.name}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#6b7280;font-size:14px;border-bottom:1px solid #e5e7eb;">City</td>
                <td style="padding:10px 0;color:#111827;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #e5e7eb;">${booking.pickupCity}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#6b7280;font-size:14px;border-bottom:1px solid #e5e7eb;">Pickup Date</td>
                <td style="padding:10px 0;color:#111827;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #e5e7eb;">${formatDate(booking.pickupDate)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#6b7280;font-size:14px;border-bottom:1px solid #e5e7eb;">Drop Date</td>
                <td style="padding:10px 0;color:#111827;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #e5e7eb;">${formatDate(booking.dropDate)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#6b7280;font-size:14px;border-bottom:1px solid #e5e7eb;">Duration</td>
                <td style="padding:10px 0;color:#111827;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #e5e7eb;">${booking.totalDays} day(s)</td>
              </tr>
              <tr>
                <td style="padding:12px 0;color:#6b7280;font-size:14px;">Total Amount</td>
                <td style="padding:12px 0;color:#059669;font-size:18px;font-weight:700;text-align:right;">${formatCurrency(booking.totalAmount)}</td>
              </tr>
            </table>
          </div>
          <p style="color:#6b7280;font-size:13px;line-height:1.6;">Booking ID: <strong>${booking._id}</strong></p>
          <p style="color:#6b7280;font-size:14px;line-height:1.6;margin-top:16px;">Have a safe and enjoyable ride! 🎉</p>
        </div>
        <div style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">DriveEase India Pvt. Ltd. | support@driveease.in</p>
          <p style="color:#9ca3af;font-size:11px;margin:4px 0 0;">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>`;

    await transporter.sendMail({
      from: `"DriveEase India" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: `✅ Booking Confirmed - ${car.brand} ${car.name} | DriveEase`,
      html,
    });

    console.log(`Booking confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error('Email sending failed:', error.message);
  }
};

const sendBookingCancellation = async (booking, user, car) => {
  try {
    const transporter = createTransporter();
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
        <div style="background:linear-gradient(135deg,#1e3a5f 0%,#0ea5e9 100%);padding:30px 40px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">🚗 DriveEase</h1>
          <p style="color:#e0f2fe;margin:8px 0 0;font-size:14px;">India's Premium Car Rental</p>
        </div>
        <div style="padding:40px;">
          <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px;">
            <h2 style="color:#991b1b;margin:0;font-size:18px;">❌ Booking Cancelled</h2>
          </div>
          <p style="color:#374151;font-size:16px;line-height:1.6;">Dear <strong>${user.name}</strong>,</p>
          <p style="color:#6b7280;font-size:15px;line-height:1.6;">Your booking has been cancelled. Here are the details:</p>
          <div style="background:#f9fafb;border-radius:12px;padding:24px;margin:20px 0;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;color:#6b7280;font-size:14px;border-bottom:1px solid #e5e7eb;">Car</td>
                <td style="padding:10px 0;color:#111827;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #e5e7eb;">${car.brand} ${car.name}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#6b7280;font-size:14px;border-bottom:1px solid #e5e7eb;">Pickup Date</td>
                <td style="padding:10px 0;color:#111827;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #e5e7eb;">${formatDate(booking.pickupDate)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#6b7280;font-size:14px;border-bottom:1px solid #e5e7eb;">Drop Date</td>
                <td style="padding:10px 0;color:#111827;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #e5e7eb;">${formatDate(booking.dropDate)}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;color:#6b7280;font-size:14px;">Refund Amount</td>
                <td style="padding:12px 0;color:#ef4444;font-size:18px;font-weight:700;text-align:right;">${formatCurrency(booking.totalAmount)}</td>
              </tr>
            </table>
          </div>
          ${booking.cancellationReason ? `<p style="color:#6b7280;font-size:14px;">Reason: ${booking.cancellationReason}</p>` : ''}
          <p style="color:#6b7280;font-size:13px;line-height:1.6;">Booking ID: <strong>${booking._id}</strong></p>
          <p style="color:#6b7280;font-size:14px;line-height:1.6;margin-top:16px;">If you have any questions, feel free to reach out to our support team.</p>
        </div>
        <div style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">DriveEase India Pvt. Ltd. | support@driveease.in</p>
          <p style="color:#9ca3af;font-size:11px;margin:4px 0 0;">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>`;

    await transporter.sendMail({
      from: `"DriveEase India" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: `❌ Booking Cancelled - ${car.brand} ${car.name} | DriveEase`,
      html,
    });

    console.log(`Cancellation email sent to ${user.email}`);
  } catch (error) {
    console.error('Email sending failed:', error.message);
  }
};

module.exports = { sendBookingConfirmation, sendBookingCancellation };
