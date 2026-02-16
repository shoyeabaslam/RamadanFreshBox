import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface EmailRequest {
  orderId: number;
  customerName: string;
  customerEmail: string;
  packageName: string;
  quantity: number;
  deliveryDate: string;
  totalAmount: number;
  discountAmount?: number;
  orderType: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequest = await request.json();
    
    const {
      orderId,
      customerName,
      customerEmail,
      packageName,
      quantity,
      deliveryDate,
      totalAmount,
      discountAmount = 0,
      orderType,
    } = body;

    // Format delivery date
    const formattedDate = new Date(deliveryDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Create transporter (using Gmail as example - configure with your email service)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number.parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Customer email HTML
    const customerEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
          .detail-label { font-weight: 600; color: #6b7280; }
          .detail-value { color: #111827; }
          .total-row { background: #f0fdf4; padding: 15px; border-radius: 6px; margin-top: 10px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🌙 Ramadan Fresh Box</h1>
            <p style="margin: 10px 0 0 0;">Order Confirmation</p>
          </div>
          <div class="content">
            <h2>Assalamu Alaikum ${customerName}!</h2>
            <p>Thank you for your order. Your Iftar box has been confirmed and will be delivered before Maghrib.</p>
            
            <div class="order-details">
              <h3 style="margin-top: 0; color: #10b981;">Order Details</h3>
              <div class="detail-row">
                <span class="detail-label">Order ID:</span>
                <span class="detail-value">#${orderId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Package:</span>
                <span class="detail-value">${packageName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Quantity:</span>
                <span class="detail-value">${quantity} ${quantity === 1 ? 'box' : 'boxes'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Order Type:</span>
                <span class="detail-value">${orderType.charAt(0).toUpperCase() + orderType.slice(1)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Delivery Date:</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
              ${discountAmount > 0 ? `
              <div class="detail-row">
                <span class="detail-label">Discount:</span>
                <span class="detail-value" style="color: #10b981;">-₹${discountAmount.toFixed(2)}</span>
              </div>
              ` : ''}
              <div class="total-row">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 700; font-size: 18px;">Total Amount:</span>
                  <span style="font-weight: 700; font-size: 24px; color: #10b981;">₹${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0;"><strong>📞 Important:</strong> Our delivery team will contact you before delivery to confirm the timing.</p>
            </div>

            <p style="margin-top: 20px;">If you have any questions, feel free to reach out to us:</p>
            <p>
              📧 Email: ramadanfreshbox@gmail.com<br>
              📱 Phone: +91 830 964 4110
            </p>

            <p>JazakAllah Khair for choosing Ramadan Fresh Box!</p>
          </div>
          <div class="footer">
            <p>Ramadan Fresh Box | Fresh Fruits for Iftar</p>
            <p>Hyderabad, Telangana, India</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Admin notification email HTML
    const adminEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; }
          .alert { background: #fee2e2; border: 1px solid #fca5a5; padding: 15px; border-radius: 6px; margin: 15px 0; }
          .order-box { background: white; padding: 15px; border-radius: 6px; margin: 10px 0; border: 1px solid #d1d5db; }
          .label { font-weight: 600; color: #6b7280; display: inline-block; width: 150px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">🔔 New Order Received</h2>
          </div>
          <div class="content">
            <div class="alert">
              <strong>⚠️ Action Required:</strong> New order needs processing
            </div>
            
            <div class="order-box">
              <h3 style="margin-top: 0;">Order #${orderId}</h3>
              <p><span class="label">Customer:</span> ${customerName}</p>
              <p><span class="label">Email:</span> ${customerEmail}</p>
              <p><span class="label">Package:</span> ${packageName}</p>
              <p><span class="label">Quantity:</span> ${quantity} ${quantity === 1 ? 'box' : 'boxes'}</p>
              <p><span class="label">Order Type:</span> ${orderType.toUpperCase()}</p>
              <p><span class="label">Delivery Date:</span> ${formattedDate}</p>
              <p><span class="label">Total Amount:</span> ₹${totalAmount.toFixed(2)}</p>
              ${discountAmount > 0 ? `<p><span class="label">Discount Applied:</span> ₹${discountAmount.toFixed(2)}</p>` : ''}
            </div>

            <p style="margin-top: 20px;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/dashboard" 
                 style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View in Dashboard
              </a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to customer
    if (customerEmail) {
      await transporter.sendMail({
        from: `"Ramadan Fresh Box" <${process.env.SMTP_USER}>`,
        to: customerEmail,
        subject: `Order Confirmation #${orderId} - Ramadan Fresh Box`,
        html: customerEmailHTML,
      });
    }

    // Send notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'ramadanfreshbox@gmail.com';
    await transporter.sendMail({
      from: `"Ramadan Fresh Box" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `New Order #${orderId} - ${orderType.toUpperCase()}`,
      html: adminEmailHTML,
    });

    return NextResponse.json({
      success: true,
      message: 'Emails sent successfully',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send email',
      },
      { status: 500 }
    );
  }
}
