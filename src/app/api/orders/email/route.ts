import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/mail';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { order, email } = body;

        if (!order || !email) {
            return NextResponse.json(
                { success: false, error: 'Missing order or email' },
                { status: 400 }
            );
        }

        console.log('Sending order confirmation email to:', email);

        // Send to Customer
        await sendOrderConfirmationEmail(email, order, false);

        // Send to Admin
        await sendOrderConfirmationEmail('clothrage@gmail.com', order, true);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
