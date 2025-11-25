import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { message, timestamp, userEmail, userName, chatHistory } = await request.json();

    // Check if user is authenticated (not a guest)
    if (!userEmail || userEmail === 'guest@rage.com' || !userName || userName === 'Guest User') {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to create a support ticket.' },
        { status: 401 }
      );
    }

    // Generate unique ticket ID
    const ticketId = `Liars-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Format chat history for email
    const formatChatHistory = (history: any[]) => {
      if (!history || history.length === 0) return '<p>No chat history available.</p>';

      return history.map((msg, index) => `
        <div style="margin: 10px 0; padding: 10px; border-radius: 8px; ${msg.role === 'user'
          ? 'background-color: #e3f2fd; border-left: 3px solid #2196f3;'
          : 'background-color: #f3e5f5; border-left: 3px solid #9c27b0;'
        }">
          <strong>${msg.role === 'user' ? '👤 Customer' : '🤖 AI Assistant'}:</strong>
          <p style="margin: 5px 0 0 0;">${msg.text}</p>
        </div>
      `).join('');
    };

    // Create enhanced email template
    const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Liars Support Ticket</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 700px; margin: 0 auto; background-color: white; }
        .header { background-color: #000; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .header p { margin: 5px 0 0 0; opacity: 0.8; }
        .content { padding: 40px 30px; }
        .ticket-info { background-color: #f8f9fa; border-left: 4px solid #000; padding: 20px; margin: 20px 0; }
        .ticket-id { font-size: 20px; font-weight: bold; color: #000; margin-bottom: 10px; }
        .user-info { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .message-box { background-color: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .chat-history { background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 20px 0; max-height: 400px; overflow-y: auto; }
        .footer { background-color: #000; color: white; padding: 20px; text-align: center; font-size: 14px; }
        .footer a { color: white; text-decoration: none; }
        .timestamp { color: #666; font-size: 14px; margin-top: 10px; }
        .priority { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 10px; border-radius: 4px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Liars</h1>
          <p>🎫 New Support Ticket Created</p>
        </div>
        
        <div class="content">
          <div class="ticket-info">
            <div class="ticket-id">Ticket ID: ${ticketId}</div>
            <div class="timestamp">📅 Created: ${new Date(timestamp).toLocaleString()}</div>
          </div>

          <div class="priority">
            <strong>⚡ Action Required:</strong> Customer needs assistance - please respond within 2 hours
          </div>
          
          <div class="user-info">
            <h3>👤 Customer Information:</h3>
            <p><strong>Name:</strong> ${userName || 'Guest User'}</p>
            <p><strong>Email:</strong> ${userEmail || 'guest@rage.com'}</p>
          </div>
          
          <h3>💬 Latest Customer Message:</h3>
          <div class="message-box">
            ${message}
          </div>
          
          <h3>🗨️ Full Chat Conversation:</h3>
          <div class="chat-history">
            ${formatChatHistory(chatHistory)}
          </div>
          
          <h3>📋 Next Steps:</h3>
          <ul>
            <li>Review the customer's issue and chat history</li>
            <li>Respond to customer at: <strong>${userEmail}</strong></li>
            <li>Update ticket status in admin panel</li>
            <li>Follow up within 24 hours if needed</li>
          </ul>
          
          <h3>📞 Contact Information:</h3>
          <p><strong>Customer Support:</strong> clothrage@gmail.com</p>
          <p><strong>Admin Panel:</strong> <a href="http://localhost:9002/admin">Access Admin Dashboard</a></p>
        </div>
        
        <div class="footer">
          <p>© 2025 Liars - Streetwear & Fashion</p>
          <p>This is an automated support ticket notification from the AI chatbot system</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Create transporter (using Gmail as example - you'll need to configure this)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });

    // Admin notification email
    const adminMailOptions = {
      from: process.env.EMAIL_USER || 'clothrage@gmail.com',
      to: 'clothrage@gmail.com',
      subject: `🎫 New Liars Support Ticket: ${ticketId}`,
      html: emailHTML,
      text: `New Liars Support Ticket: ${ticketId}\n\nCustomer: ${userName} (${userEmail})\nMessage: ${message}\n\nTimestamp: ${new Date(timestamp).toLocaleString()}`
    };

    // Customer confirmation email template
    const customerEmailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Liars Support Ticket Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background-color: #000; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .ticket-box { background-color: #f8f9fa; border-left: 4px solid #000; padding: 20px; margin: 20px 0; }
        .footer { background-color: #000; color: white; padding: 20px; text-align: center; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Liars</h1>
          <p>✅ Support Ticket Created Successfully</p>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          <p>Thank you for contacting Liars support! We've received your request and created a support ticket for you.</p>
          
          <div class="ticket-box">
            <strong>Ticket ID:</strong> ${ticketId}<br>
            <strong>Created:</strong> ${new Date(timestamp).toLocaleString()}<br>
            <strong>Status:</strong> Open - Under Review
          </div>
          
          <p><strong>Your Message:</strong></p>
          <p style="background-color: #f8f9fa; padding: 15px; border-radius: 8px;">${message}</p>
          
          <p>Our support team will review your request and get back to you within 24 hours. You can expect a response at this email address.</p>
          
          <p>For urgent matters, you can also reach us at:</p>
          <ul>
            <li>📧 Email: clothrage@gmail.com</li>
            <li>🕒 Response Time: Within 24 hours</li>
          </ul>
          
          <p>Thank you for choosing Liars!</p>
          <p>The Liars Support Team</p>
        </div>
        <div class="footer">
          <p>© 2025 Liars - Streetwear & Fashion</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const customerMailOptions = {
      from: process.env.EMAIL_USER || 'support@rage.com',
      to: userEmail || 'guest@rage.com',
      subject: `✅ Liars Support Ticket Created: ${ticketId}`,
      html: customerEmailHTML,
      text: `Hi ${userName},\n\nYour Liars support ticket has been created successfully!\n\nTicket ID: ${ticketId}\nMessage: ${message}\n\nWe'll get back to you within 24 hours.\n\nBest regards,\nLiars Support Team`
    };

    // Send emails
    try {
      // Send to admin
      await transporter.sendMail(adminMailOptions);
      console.log(`Admin notification for ticket ${ticketId} sent successfully`);

      // Send confirmation to customer (only if not guest)
      if (userEmail && userEmail !== 'guest@rage.com') {
        await transporter.sendMail(customerMailOptions);
        console.log(`Customer confirmation for ticket ${ticketId} sent successfully`);
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue anyway - we'll still return the ticket ID
    }

    return NextResponse.json({
      success: true,
      ticketId,
      message: 'Support ticket created successfully'
    });

  } catch (error) {
    console.error('Ticket creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create support ticket' },
      { status: 500 }
    );
  }
}