import { NextResponse } from 'next/server';
import { generateOtp, signOtp } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/mail';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const otp = generateOtp();
        // 2 minutes expiry
        const expiry = Date.now() + 2 * 60 * 1000;
        const hash = signOtp(email, otp, expiry);

        // Send email
        await sendOtpEmail(email, otp);

        return NextResponse.json({
            success: true,
            hash,
            expiry,
            message: 'OTP sent successfully'
        });
    } catch (error: any) {
        console.error('Error sending OTP:', error);
        return NextResponse.json({
            error: 'Failed to send OTP',
            details: error.message
        }, { status: 500 });
    }
}
