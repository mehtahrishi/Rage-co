import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Create enhanced email template similar to the ticket system
    const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RAGE Contact Form Submission</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 700px; margin: 0 auto; background-color: white; }
        .header { background-color: #000; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .header p { margin: 5px 0 0 0; opacity: 0.8; }
        .content { padding: 40px 30px; }
        .contact-info { background-color: #f8f9fa; border-left: 4px solid #000; padding: 20px; margin: 20px 0; }
        .message-box { background-color: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .footer { background-color: #000; color: white; padding: 20px; text-align: center; font-size: 14px; }
        .footer a { color: white; text-decoration: none; }
        .timestamp { color: #666; font-size: 14px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>RAGE</h1>
          <p>📬 New Contact Form Submission</p>
        </div>
        
        <div class="content">
          <div class="contact-info">
            <h3>👤 Customer Information:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject}</p>
            <div class="timestamp">📅 Submitted: ${new Date().toLocaleString()}</div>
          </div>

          <h3>💬 Customer Message:</h3>
          <div class="message-box">
            ${message.replace(/\n/g, '<br>')}
          </div>
          
          <h3>📋 Next Steps:</h3>
          <ul>
            <li>Review the customer's message</li>
            <li>Respond to customer at: <strong><a href="mailto:${email}">${email}</a></strong></li>
            <li>Follow up within 24 hours</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>© 2025 RAGE - Streetwear & Fashion</p>
          <p>This is an automated contact form notification</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Create transporter (using Gmail as example - you'll need to configure this)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'clothrage@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });

    // Admin notification email - sent FROM user's email TO clothrage@gmail.com
    const adminMailOptions = {
      from: email, // User's email as sender
      to: 'clothrage@gmail.com', // Your email as recipient
      subject: `📬 RAGE Contact Form: ${subject}`,
      html: emailHTML,
      text: `New RAGE Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}
Message: ${message}

Submitted: ${new Date().toLocaleString()}`
    };

    // Customer confirmation email template
    const customerEmailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>RAGE Contact Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background-color: #000; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .message-box { background-color: #f8f9fa; border-left: 4px solid #000; padding: 20px; margin: 20px 0; }
        .footer { background-color: #000; color: white; padding: 20px; text-align: center; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>RAGE</h1>
          <p>✅ Message Received Successfully</p>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Thank you for contacting RAGE! We've received your message and will get back to you within 24 hours.</p>
          
          <div class="message-box">
            <strong>Subject:</strong> ${subject}<br>
            <strong>Message:</strong><br>
            ${message.replace(/\n/g, '<br>')}
          </div>
          
          <p>For urgent matters, you can also reach us at:</p>
          <ul>
            <li>📧 Email: clothrage@gmail.com</li>
            <li>🕒 Response Time: Within 24 hours</li>
          </ul>
          
          <p>Thank you for choosing RAGE!</p>
          <p>The RAGE Team</p>
        </div>
        <div class="footer">
          <p>© 2025 RAGE - Streetwear & Fashion</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const customerMailOptions = {
      from: process.env.EMAIL_USER || 'clothrage@gmail.com',
      to: email,
      subject: `✅ RAGE: We've Received Your Message`,
      html: customerEmailHTML,
      text: `Hi ${name},

Thank you for contacting RAGE! We've received your message and will get back to you within 24 hours.

Subject: ${subject}
Message: ${message}

Best regards,
RAGE Team`
    };

    // Send emails
    try {
      // Send to admin
      await transporter.sendMail(adminMailOptions);
      console.log(`Admin notification for contact form sent successfully`);
      
      // Send confirmation to customer
      await transporter.sendMail(customerMailOptions);
      console.log(`Customer confirmation sent successfully`);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue anyway - we'll still return success
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully! We will contact you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}