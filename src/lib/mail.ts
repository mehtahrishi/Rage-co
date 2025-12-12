import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL || 'clothrage@gmail.com',
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendOtpEmail(to: string, otp: string) {
  const mailOptions = {
    from: process.env.SMTP_EMAIL || 'clothrage@gmail.com',
    to,
    subject: 'Your Login OTP - Liars Store',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #000; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Rage Co</h1>
        </div>
        <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Login Verification</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">Hello,</p>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">Please use the following One-Time Password (OTP) to complete your login. This code is valid for 2 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="background-color: #f0f0f0; color: #000; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; border: 1px solid #ccc;">${otp}</span>
        </div>
        <p style="color: #555; font-size: 14px; text-align: center;">If you didn't request this code, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Liars Store. All rights reserved.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendOrderConfirmationEmail(to: string, order: any, isAdmin: boolean = false) {
  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
  const shippingAddress = typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress;

  // Safe payment method check
  const paymentMethod = order.paymentMethod || order.payment_source || 'N/A';

  // Calculate invoice details
  // In checkout: finalTotal = subtotal + (subtotal * 0.05) => finalTotal = subtotal * 1.05
  const subtotal = order.total / 1.05;
  const gstAmount = order.total - subtotal;

  const itemsList = items.map((item: any) => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; color: #333;">${item.productName} <br><span style="font-size: 12px; color: #777;">(${item.size} / ${item.color})</span></td>
            <td style="padding: 10px; color: #333; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; color: #333; text-align: right;">₹${item.price.toFixed(2)}</td>
        </tr>
    `).join('');

  const subject = isAdmin
    ? `Order Received - #${order.$id.substring(0, 8).toUpperCase()}`
    : `Order Confirmation - #${order.$id.substring(0, 8).toUpperCase()}`;

  const heading = isAdmin ? 'New Order Received!' : 'Thank You For Your Order!';
  const introText = isAdmin
    ? `A new order has been placed by <strong>${shippingAddress.firstName} ${shippingAddress.lastName}</strong>.`
    : 'We have received your order and are getting it ready.';

  const mailOptions = {
    from: process.env.SMTP_EMAIL || 'clothrage@gmail.com',
    to,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #000; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Liars Store</h1>
        </div>
        <h2 style="color: #333; text-align: center; margin-bottom: 10px;">${heading}</h2>
        <p style="color: #555; font-size: 16px; text-align: center; margin-bottom: 30px;">
            ${introText}
        </p>

        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Order ID:</strong> #${order.$id.toUpperCase()}</p>
            <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Payment Method:</strong> ${paymentMethod.toUpperCase()}</p>
        </div>

        <div style="margin-bottom: 30px;">
            <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Items</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f0f0f0;">
                        <th style="padding: 10px; text-align: left; color: #555; font-size: 12px; text-transform: uppercase;">Product</th>
                        <th style="padding: 10px; text-align: center; color: #555; font-size: 12px; text-transform: uppercase;">Qty</th>
                        <th style="padding: 10px; text-align: right; color: #555; font-size: 12px; text-transform: uppercase;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsList}
                </tbody>
                <tfoot style="background-color: #fafafa;">
                    <tr>
                        <td colspan="2" style="padding: 10px; text-align: right; color: #555;">Subtotal</td>
                        <td style="padding: 10px; text-align: right; color: #333;">₹${subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding: 10px; text-align: right; color: #555;">GST (5%)</td>
                        <td style="padding: 10px; text-align: right; color: #333;">₹${gstAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding: 10px; text-align: right; color: #555;">Shipping</td>
                        <td style="padding: 10px; text-align: right; color: #2e7d32; font-weight: bold;">Free</td>
                    </tr>
                    <tr style="border-top: 2px solid #ddd;">
                        <td colspan="2" style="padding: 15px 10px; text-align: right; font-weight: bold; color: #000; font-size: 16px;">Total</td>
                        <td style="padding: 15px 10px; text-align: right; font-weight: bold; color: #000; font-size: 18px;">₹${order.total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div style="margin-bottom: 30px;">
            <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Shipping Address</h3>
            <p style="color: #555; line-height: 1.6;">
                ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
                ${shippingAddress.address}<br>
                ${shippingAddress.apartment ? shippingAddress.apartment + '<br>' : ''}
                ${shippingAddress.city}, ${shippingAddress.postalCode}<br>
                ${shippingAddress.country}
            </p>
        </div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
            If you have any questions, reply to this email.<br>
            &copy; ${new Date().getFullYear()} Liars Store.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email (${isAdmin ? 'Admin' : 'User'}) sent to`, to);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
}

export async function sendOrderStatusEmail(to: string, order: any, status: string) {
  const subject = status === 'delivered'
    ? `Order Delivered - #${order.$id.substring(0, 8).toUpperCase()}`
    : `Order Status Update - #${order.$id.substring(0, 8).toUpperCase()}`;

  const message = status === 'delivered'
    ? 'Your order has been delivered! We hope you love your purchase.'
    : `Your order status has been updated to: <strong>${status.toUpperCase()}</strong>`;

  const mailOptions = {
    from: process.env.SMTP_EMAIL || 'clothrage@gmail.com',
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #000; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Liars Store</h1>
        </div>
        <h2 style="color: #333; text-align: center; margin-bottom: 10px;">${status === 'delivered' ? 'Order Delivered' : 'Status Update'}</h2>
        <p style="color: #555; font-size: 16px; text-align: center; margin-bottom: 30px;">
            ${message}
        </p>

        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Order ID:</strong> #${order.$id.toUpperCase()}</p>
        </div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
            &copy; ${new Date().getFullYear()} Liars Store.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order ${status} email sent to`, to);
  } catch (error) {
    console.error(`Error sending order ${status} email:`, error);
  }
}
